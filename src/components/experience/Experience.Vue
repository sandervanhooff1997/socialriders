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
                                    <h3 class="map-title display-3">{{experience.title}}</h3>
                                    <span class="subheading" style="font-weight: bold;">{{experience.date | date}}</span>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <div id="owner">
                        <span class="title white--text">Creator</span><br>
                        <router-link :to="{name: 'Profile', params: { uid: experience.owner.uid }}">
                            <v-chip text-color="white" color="accent">
                                <v-avatar>
                                    <img :src="experience.owner.photoUrl" alt="experience.owner.name">
                                </v-avatar>
                                <strong>{{experience.owner.name}}</strong>
                            </v-chip>
                        </router-link>
                    </div>
                </div>
            </div>
            <v-tabs
                    slot="extension"
                    v-model="tab"
                    grow
            >
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab v-for="item in tabItems" :key="item">
                    {{ item }}
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="height: 100%;">
                <v-tab-item v-for="(item, index) in tabItems" :key="index" style="height: 100%;">
                    <v-card flat style="height: 100%;">
                        <v-container fill-height>
                            <v-layout fill-height>
                                <div v-if="tab == 0">

                                </div>

                                <div v-if="tab == 1">
                                    <router-link v-for="i in 40" :key="i" :to="{name: 'Profile', params: { uid: experience.owner.uid }}">
                                        <v-chip text-color="white" color="secondary">
                                            <v-avatar>
                                                <img :src="experience.owner.photoUrl" alt="experience.owner.name">
                                            </v-avatar>
                                            <strong>{{experience.owner.name}}</strong>
                                        </v-chip>
                                    </router-link>
                                </div>
                            </v-layout>
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

    export default {
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
                tab: null,
                tabItems: [
                    'Media', 'Riders',
                ]
            }
        },
        computed: {
            orderedRiders () {
                return this.experience.riders.sort(function(a, b){
                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                    return 0;
                })
            }
        },
        methods: {
            initMap () {
                $(() => {
                    this.map = new google.maps.Map(document.getElementById(this.id), this.options);
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
    .chip:hover{
        cursor: pointer;
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        -ms-transform: scale(1.1);
        -o-transform: scale(1.1);
        transform: scale(1.1);
    }

</style>