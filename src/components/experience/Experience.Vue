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
                <v-tab v-if="iJoinedThisExplore">
                    Upload
                </v-tab>
                <v-tab>
                    Media
                </v-tab>
                <v-tab>
                    Riders
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="height: 100%;">
                <v-tab-item v-if="iJoinedThisExplore">
                    <v-card flat style="height: 100%;" class="noBackground">
                        <v-container>
                            <span class="headline mt-3">Share your media of this Trip!</span>
                            <media-upload :experience="experience"></media-upload>
                        </v-container>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat style="height: 100%;" class="noBackground">
                        <v-container>
                            <span class="headline mt-3">Media of all riders</span>
                            <media-wall class="mt-3" :media="experience.mediaUploads"></media-wall>
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
    import ProfileChip from '@/components/shared/ProfileChip'
    import MediaUpload from './MediaUpload'
    import MediaWall from './MediaWall'

    export default {
        components: {
            ProfileChip, MediaUpload, MediaWall
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
            iJoinedThisExplore () {
                if (this.experience.riders.filter(rider => {
                    return rider.uid === this.user.uid
                }).length > 0) {
                    return true
                }

                return false
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