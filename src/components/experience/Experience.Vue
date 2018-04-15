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
                                    <router-link v-for="i in 40" :to="{name: 'Profile', params: { uid: experience.owner.uid }}">
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

        <v-container v-else fill-height>
            <v-layout justify-center align-center>
                <v-progress-circular indeterminate :size="120" color="primary">Loading Experience</v-progress-circular>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import mapStyles from '../shared/maps/map-styles'
    import Isotope from 'isotope-layout'

    export default {
        data () {
            return {
                experience: null,
                map: null,
                mapId: "map",
                mapOptions: {
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
                directionsService: new google.maps.DirectionsService,
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
                    $(document).ready(() => {
                        this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions);
                    })
                },
                calculateAndDisplayRoute() {
                    if (this.experience !== null) {
                        const self = this;

                        // wayPoints
                        var wayPoints = []
                        for (let i = 0; i < self.experience.wayPoints.length; i++) {
                            if (this.experience.wayPoints[i].location) {
                                wayPoints.push({
                                    location: this.experience.wayPoints[i].location,
                                    stopover: true
                                });
                            }
                        }

                        // determine the travelmode bases on the selected vehicle
                        let travelMode = self.experience.vehicle === 'bicycle' ? 'BICYCLING' : 'DRIVING'

                        self.directionsService.route({
                            origin: self.experience.startPoint.location,
                            destination: self.experience.endPoint.location,
                            waypoints: wayPoints,
                            optimizeWaypoints: false,
                            travelMode: travelMode,
                            avoidFerries: self.experience.options.avoidFerries,
                            avoidHighways: self.experience.options.avoidHighways,
                            avoidTolls: self.experience.options.avoidTolls,
                        }, function(response, status) {
                            if (status === 'OK') {
                                let g =  new google.maps.DirectionsRenderer()

                                g.setMap(self.map)
                                g.setDirections(response)
                            }
                            else {
                                window.alert('Directions request failed due to ' + status);
                            }
                        });
                    }
                },
        },
        mounted () {
            let self = this

            this.$store.dispatch('getExperience', this.$route.params.id).then(response => {
                self.experience = response

                self.initMap()
                self.calculateAndDisplayRoute()
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