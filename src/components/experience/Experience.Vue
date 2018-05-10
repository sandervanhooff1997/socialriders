<template>
    <div>
        <div v-if="experience">
            <div class="map-wrapper">
                <div id="map"></div>
                <div class="map-overlay">
                    <v-container fill-height>
                        <v-layout align-center>
                            <v-flex text-xs-center>
                                <div class="white--text">
                                    <h3 class="map-title display-2">{{experience.title}}</h3>
                                    <span class="subheading" style="font-weight: bold;">{{experience.date | date}}</span>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <div id="owner">
                        <span class="title white--text">Creator</span><br>
                        <profile-chip :user="experience.owner"></profile-chip>
                    </div>
                </div>
            </div>
            <v-tabs
                    slot="extension"
                    v-model="tab"
                    grow
            >
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab>
                    Media
                </v-tab>
                <v-tab>
                    Riders
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="height: 100%;">
                <v-tab-item>
                    <v-card flat style="height: 100%;" class="noBackground">
                        <v-container>
                            <span>Share your photos of this trip with fellow SocialRiders!</span>
                            <form onsubmit="return false">
                                <v-btn
                                        raised
                                        class="primary"
                                        round
                                        v-if="!uploading"
                                        @click="onPickMedia"
                                >
                                    Upload Media
                                </v-btn>
                                <input
                                        type="file"
                                        style="display: none;"
                                        ref="fileInput"
                                        accept="image/*"
                                        @change="onMediaPicked"
                                        multiple>
                            </form>
                            <p v-if="uploading">Uploading... <v-progress-circular indeterminate size="30" color="white"></v-progress-circular></p>
                            <ul>
                                <li>The trip owner can upload up to <b>10</b> images</li>
                                <li>Each rider can upload up to <b>5</b> images</li>
                                <li>Uploading <b>new</b> images will <b>delete all previously uploaded images</b></li>
                            </ul>
                            <!--<img v-for="(URL, index) in imageURLs"-->
                                 <!--:key="index"-->
                                 <!--v-if="imageURLs.length > 0"-->
                                 <!--:src="URL"-->
                                 <!--style="max-width: 150px; max-height: 150px;">-->
                        </v-container>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat style="height: 100%;" class="noBackground">
                        <v-container>
                            <div v-if="experience.riders.length > 0">
                                <p>Connect with all SocialRiders that experienced this amazing trip!</p>
                                <profile-chip
                                        v-for="(item, index) in experience.riders"
                                        :key="index"
                                        :user="item">
                                </profile-chip>
                            </div>
                            <p v-else>It was a lonely ride...</p>
                        </v-container>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    import * as mapFunctions from '@/assets/maps/map-functions'
    import mapStyles from '@/assets/maps/map-styles'
    import Isotope from 'isotope-layout'
    import ProfileChip from '@/components/shared/ProfileChip'

    export default {
        components: {
            ProfileChip
        },
        data () {
            return {
                experience: null,
                map: null,
                id: "map",
                options: {
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: true,
                    center: {lat: 	52.379189, lng: 4.899431},
                    zoom: 7,
                    styles: mapStyles.retro,
                },
                imageURLs: [],
                images: [],
                uploading: false,
                tab: 0,
            }
        },
        computed: {
            orderedRiders () {
                return this.experience.riders.sort(function(a, b){
                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                    return 0;
                })
            },
            loading () {
                return this.$store.getters.loading
            },
            user () {
                return this.$store.getters.user
            }
        },
        methods: {
            initMap () {
                $(() => {
                    this.map = mapFunctions.init(document.getElementById(this.id), this.options)
                })
            },
            onPickMedia () {
                this.$refs.fileInput.click()
            },
            onMediaPicked (event) {
                const files = event.target.files

                if (files.length > 5) {
                    this.clearUploadData()
                    this.$store.dispatch('errorMessage', 'You can upload up to 5 images.')
                    return
                }

                this.$store.commit('setLoading', true)

                for (let i = 0;i < files.length; i++) {
                    let filename = files[i].name

                    // check for a file extension
                    if (filename.lastIndexOf('.') <= 0) {
                        this.$store.dispatch('errorMessage', 'A file without extension was found.')
                        this.clearUploadData()
                        return
                    }

                    this.uploading = true
                    const fileReader = new FileReader()
                    fileReader.addEventListener('load', () => {
                        this.imageURLs.push(fileReader.result)
                    })
                    fileReader.readAsDataURL(files[i])
                    this.images.push(files[i])
                }

                let payload = {
                    id: this.$route.params.id,
                    images: this.images,
                    previousMediaURLs: []
                }


                // find previous media uploads by this user
                if (this.experience.mediaUploads) {
                    let mediaUpload = this.experience.mediaUploads.filter(mediaUpload => {
                        return mediaUpload.user.uid === this.user.uid
                    })[0]

                    // if the user has uploaded media to this experience before
                    if (mediaUpload) {
                        payload.previousMediaURLs = mediaUpload.mediaURLs
                    }
                }

                this.$store.dispatch('uploadMedia', payload).then(mediaUploads => {
                    this.experience.mediaUploads = mediaUploads
                    this.$store.dispatch('successMessage', 'Media Uploaded!')
                    this.clearUploadData()
                    this.$store.commit('setLoading', false)
                    this.uploading = false
                }, error => {
                    this.$store.dispatch('errorMessage', error.message)
                    this.$store.commit('setLoading', false)
                    this.uploading = false
                })
            },
            clearUploadData () {
                this.imageURLs = []
                this.images = []
            }
        },
        mounted () {
            let self = this

            this.$store.dispatch('getExperience', this.$route.params.id).then(response => {
                self.experience = response

                self.initMap()

                $(() => {
                    mapFunctions.calculateAndDisplayRoute(self.map, self.experience)
                })
            }, error => {
                this.$store.dispatch('errorMessage', error.message)
            })
        },
    }
</script>

<style scoped>
    .map-wrapper{
        width: 100%;
        height: 300px;
        position: relative;
    }
    .map-overlay {
        text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
        width: 100%;
        height: 100%;
        position: absolute;
        text-align: center;
        background: #8e24aa!important;
        background: -webkit-linear-gradient(100deg, rgba(142,36,170,0.5) 0%, rgba(255,110,64,0.5) 100%)!important;
        background: linear-gradient(100deg, rgba(142,36,170,0.5) 0%, rgba(255,110,64,0.5) 100%)!important;
    }
    #map {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    a {
        text-decoration: none;
    }
    #owner {
        position: absolute;
        left: 20px;
        bottom: 20px;
    }

    /* ---- grid ---- */

    #grid {
        background: #DDD;
    }

    /* clear fix */
    #grid:after {
        content: '';
        display: block;
        clear: both;
    }

    /* ---- .element-item ---- */

    /* 5 columns, percentage width */
    .grid-item,
    .grid-sizer {
        width: 20%;
    }

    .grid-item {
        float: left;
        height: 100px;
        background: #0D8;
        border: 2px solid #333;
        border-color: hsla(0, 0%, 0%, 0.7);
    }

    .grid-item--width2 { width: 40%; }
    .grid-item--height2 { height: 200px; }

</style>