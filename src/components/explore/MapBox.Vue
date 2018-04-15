<template>
    <div style="width: 100%; height: 100%; text-align: left!important;">
        <v-layout row wrap fill-height class="banner">
            <v-flex xs12 sm3>
                <v-container fluid>
                    <!--ROUTE DETAILS-->
                    <v-card v-if="selectedExplore" flat dark style="background: none!important;">
                        <v-card-media height="130px">
                            <v-layout wrap align-center>
                                <v-flex class="text-xs-center">
                                    <v-avatar>
                                        <router-link :to="{ name: 'Profile', params: { uid: selectedExplore.owner.uid }}">
                                            <img  :src="selectedExplore.owner.photoUrl" :alt="selectedExplore.owner.name">
                                        </router-link>
                                    </v-avatar>
                                    <div class="title white--text">{{selectedExplore.owner.name}}</div>
                                </v-flex>
                            </v-layout>
                        </v-card-media>
                        <v-divider></v-divider>

                        <v-tooltip right>
                            <v-card-title primary-title slot="activator">
                                <div class="headline">{{selectedExplore.title}}</div>
                            </v-card-title>
                            <span>{{selectedExplore.title}}</span>
                        </v-tooltip>

                        <v-list style="background: none!important;">
                            <v-list-tile>
                                <v-tooltip right>
                                    <v-list-tile-action slot="activator">
                                        <v-icon>date_range</v-icon>
                                    </v-list-tile-action>
                                    <span>When</span>
                                </v-tooltip>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{selectedExplore.date | datetime}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-tooltip right>
                                    <v-list-tile-action slot="activator">
                                        <v-icon>flight_takeoff</v-icon>
                                    </v-list-tile-action>
                                    <span>Starting Location</span>
                                </v-tooltip>
                                <v-tooltip right>
                                    <v-list-tile-content  slot="activator">
                                        <v-list-tile-title>{{selectedExplore.startPoint.address}}</v-list-tile-title>
                                    </v-list-tile-content>
                                    <span>{{selectedExplore.startPoint.address}}</span>
                                </v-tooltip>
                            </v-list-tile>
                            <v-list-tile>
                                <v-tooltip right>
                                    <v-list-tile-action slot="activator">
                                        <v-icon>trending_flat</v-icon>
                                    </v-list-tile-action>
                                    <span>Total Distance</span>
                                </v-tooltip>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{selectedExplore.distance | distance}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-tooltip right>
                                    <v-list-tile-action slot="activator">
                                        <v-icon>motorcycle</v-icon>
                                    </v-list-tile-action>
                                    <span>Vehicle</span>
                                </v-tooltip>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{selectedExplore.vehicle | capitalize}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>

                        <v-card-text>
                            <p class="text-xs-left">{{selectedExplore.description}}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn round color="accent">Join</v-btn>
                            <v-btn round flat @click="hideRoute()">Close</v-btn>
                        </v-card-actions>
                    </v-card>

                    <!--FILTERS-->
                    <v-card v-if="!selectedExplore" flat dark style="background: none!important;">
                        <v-text-field
                                clearable
                                solo-inverted
                                prepend-icon="explore"
                                id="search-input"
                                placeholder="Search explores"
                        ></v-text-field>

                        <br>

                        <v-subheader class="filter-header">
                            <v-switch label="Max Distance" hide-details v-model="filters.distance.on"></v-switch>
                        </v-subheader>
                        <v-slider class="pa-0"
                                  color="accent"
                                  :min="filters.distance.min"
                                  :max="filters.distance.max"
                                  :label="filters.distance.value + ' km'"
                                  :disabled="!filters.distance.on"
                                  hide-details
                                  v-model="filters.distance.value"
                                  @mouseup="filterExplores()"
                                  @keyup="filterExplores()"
                        ></v-slider>

                        <br>

                        <v-subheader class="filter-header">
                            <v-switch label="Max Duration" hide-details v-model="filters.duration.on"></v-switch>
                        </v-subheader>
                        <v-slider class="pa-0"
                                  color="accent"
                                  :min="filters.duration.min"
                                  :max="filters.duration.max"
                                  :label="filters.duration.value + ' hr'"
                                  :disabled="!filters.duration.on"
                                  hide-details
                                  v-model="filters.duration.value"
                                  @mouseup="filterExplores()"
                                  @keyup="filterExplores()"
                        ></v-slider>

                        <br>

                        <v-subheader class="filter-header">
                            <v-switch label="Date" hide-details v-model="filters.date.on"></v-switch>
                        </v-subheader>
                        <v-menu
                                lazy
                                transition="scale-transition"
                                :nudge-right="40"
                                min-width="290px"
                                :disabled="!filters.date.on"
                        >
                            <v-text-field
                                    slot="activator"
                                    prepend-icon="event"
                                    readonly
                                    label="Choose a date"
                                    color="accent"
                                    v-model="filters.date.value"
                                    :disabled="!filters.date.on"
                            ></v-text-field>
                            <v-date-picker
                                    no-title
                                    scrollable
                                    v-model="filters.date.value"
                                    :disabled="!filters.date.on"
                                    :min="today"></v-date-picker>
                        </v-menu>

                        <v-subheader class="filter-header">
                            <v-switch label="Part of the day" hide-details v-model="filters.daypart.on"></v-switch>
                        </v-subheader>
                        <v-radio-group v-model="filters.daypart.value" style="padding: 0;">
                            <v-checkbox
                                    v-for="item in filters.dayparts"
                                    :key="item.value"
                                    :label="item.text"
                                    :disabled="!filters.daypart.on"
                                    v-model="item.on"
                                    hide-details
                            ></v-checkbox>
                        </v-radio-group>
                    </v-card>
                </v-container>
            </v-flex>
            <v-flex xs12 sm9>
                <div id="map"></div>

                <!--<v-speed-dial-->
                        <!--id="map-actions"-->
                        <!--v-model="mapActions"-->
                        <!--direction="bottom"-->
                        <!--left-->
                        <!--open-on-hover-->
                        <!--transition="slide-y-reverse-transition"-->
                <!--&gt;-->
                    <!--<v-btn-->
                            <!--class="action-margin"-->
                            <!--style="margin-top: 25px;"-->
                            <!--slot="activator"-->
                            <!--color="yellow"-->
                            <!--dark-->
                            <!--fab-->
                            <!--hover-->
                            <!--v-model="mapActions"-->
                    <!--&gt;-->
                        <!--<v-icon>info</v-icon>-->
                        <!--<v-icon>close</v-icon>-->
                    <!--</v-btn>-->
                    <!--<v-btn-->
                            <!--class="action-margin"-->
                            <!--round-->
                            <!--dark-->
                            <!--small-->
                            <!--color="accent"-->
                    <!--&gt;-->
                        <!--Popular-->
                    <!--</v-btn>-->
                    <!--<v-btn-->
                            <!--class="action-margin"-->
                            <!--round-->
                            <!--dark-->
                            <!--small-->
                            <!--color="accent"-->
                    <!--&gt;-->
                        <!--Recent-->
                    <!--</v-btn>-->
                    <!--<v-btn-->
                            <!--class="action-margin"-->
                            <!--round-->
                            <!--dark-->
                            <!--small-->
                            <!--color="accent"-->
                    <!--&gt;-->
                        <!--Nearby-->
                    <!--</v-btn>-->
                <!--</v-speed-dial>-->
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import * as mapFunctions from '@/components/shared/maps/functions.js'
    import DateDiff from 'date-diff'
    import mapboxgl from 'mapbox-gl';
    import MotorMarker from '@/assets/markers/motorbike.png'
    import CarMarker from '@/assets/markers/car.png'
    import BikeMarker from '@/assets/markers/bike.png'

    export default {
        props: ['explores'],
        data () {
            return {
                map: null,
                myPosition: null,
                markers: [],
                selectedExplore: null,
                switchDate: false,
                filters: {
                    distance: {
                        value: 1000,
                        min: 1,
                        max: 1000,
                        on: false
                    },
                    duration: {
                        value: 12,
                        min: 1,
                        max: 12,
                        on: false
                    },
                    date: {
                        value: null,
                        on: false
                    },
                    daypart: {
                        on: false
                    },
                    dayparts: [
                        {
                            text: 'Morning',
                            value: 'morning',
                            on: true,
                            min: 6,
                            max: 12,
                        },
                        {
                            text: 'Noon',
                            value: 'noon',
                            on: true,
                            min: 12,
                            max: 18,
                        },
                        {
                            text: 'Evening',
                            value: 'evening',
                            on: true,
                            min: 18,
                            max: 22,
                        },
                        {
                            text: 'Midnight',
                            value: 'midnight',
                            on: true,
                            min: 22,
                            max: 6,
                        },
                    ]
                },
                mapActions: false
            }
        },
        computed: {
            today () {
                var now = new Date();
                var dd = now.getDate();
                var mm = now.getMonth()+1; //January is 0!
                var yyyy = now.getFullYear();

                if(dd<10) dd = '0'+dd

                if(mm<10)  mm = '0'+mm

                return yyyy + '-' + mm + '-' + dd;
            },
            filterDistanceOn() {
                return this.filters.distance.on
            },
            filterDurationOn() {
                return this.filters.duration.on
            },
            filterDateOn() {
                return this.filters.date.on
            },
            filterDateValue() {
                return this.filters.date.value
            },
            filterDaypartOn() {
                return this.filters.daypart.on
            },
            filterDaypartsMorningOn() {
                return this.filters.dayparts[0].on
            },
            filterDaypartsNoonOn() {
                return this.filters.dayparts[1].on
            },
            filterDaypartsEveningOn() {
                return this.filters.dayparts[2].on
            },
            filterDaypartNightOn() {
                return this.filters.dayparts[3].on
            },
        },
        watch: {
            filterDistanceOn: 'filterExplores',
            filterDurationOn: 'filterExplores',
            filterDateOn: 'filterExplores',
            filterDateValue: 'filterExplores',
            filterDaypartOn: 'filterExplores',
            filterDaypartValue: 'filterExplores',
            filterDaypartsMorningOn: 'filterExplores',
            filterDaypartsNoonOn: 'filterExplores',
            filterDaypartsEveningOn: 'filterExplores',
            filterDaypartsNightOn: 'filterExplores',
        },
        methods: {
            initMap () {
                this.map = mapFunctions.init({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: {lat: 	52.379189, lng: 4.899431},
                    zoom: 7,
                })

                mapFunctions.setMyPosition(this.map)

                this.map.addControl(new MapboxDirections({
                    accessToken: mapboxgl.accessToken,
                    unit: 'metric'
                }), 'top-left');

                this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

                this.map.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: false
                    },
                    fitBoundOptions: {
                        maxZoom: 10
                    },
                    trackUserLocation: true
                }))
//                var client = new MapboxClient('pk.eyJ1Ijoic3ZoMTk5NyIsImEiOiJjamZ4bmF0azQweWF1MnprZG02ZTB6dWFsIn0.-058LEniBsf5Tcoy12SVhQ');


                this.filterExplores()
            },

            renderExplores (explores) {
                const self = this

                if (this.markers.length > 0) {
                    this.markers.forEach(marker => {
                        marker.remove()
                    })
                    this.markers = []
                }

                explores.forEach(explore => {
                    let icon = MotorMarker

                    if (explore.vehicle === 'car') {
                        icon = CarMarker
                    } else {
                        icon = BikeMarker
                    }

                    let marker = mapFunctions.addMarker(self.map, icon, explore.startPoint.location)
                    mapFunctions.addMarkerClickListener(marker, () => {
                        self.selectedExplore = explore
                    })
                    self.markers.push(marker)

//                    self.addInfoWindowClickListener(marker, explore)
                })
            },
            filterExplores() {
                const self = this

                let explores = self.explores

                if (self.filters.distance.on) {
                    explores = explores.filter(explore => {
                        return explore.distance <= (self.filters.distance.value * 1000)
                    })
                }

                if (self.filters.duration.on) {
                    explores = explores.filter(explore => {
                        return explore.duration <= (self.filters.duration.value * 3600)
                    })
                }

                if (self.filters.date.on) {
                    explores = explores.filter(explore => {
                        let exploreDate = new Date(explore.date)
                        let filterDate = new Date(self.filters.date.value)

                        exploreDate.setHours(0,0,0,0)
                        filterDate.setHours(0,0,0,0)

                        return exploreDate.getTime() === filterDate.getTime()
                    })
                }

                if (self.filters.daypart.on) {
                    let tempExplores = []

                    self.filters.dayparts.forEach(daypart => {
                        if (daypart.on) {
                            explores.forEach(explore => {
                                let hours = new Date(explore.date).getHours()

                                if (hours >= daypart.min && hours < daypart.max) {
                                    tempExplores.push(explore)
                                }
                            })
                        }
                    })

                    explores = tempExplores
                }

                if (explores.length === 0
                    && !self.filters.distance.on
                    && !self.filters.duration.on
                    && !self.filters.date.on
                    && !self.filters.daypart.on) {
                    explores = self.explores
                }

                this.renderExplores(explores)
            },

        },
        mounted () {
            this.initMap()
            this.filters.date.value = this.today
        },
    }
</script>

<style scoped>
    #map {
        width: 100%;
        height: 100%;
    }
    .filter-header {
        height: auto;
    }
    .action-margin {
        margin-left: 25px;
    }
    .marker {
        width: 50px;
        height: 50px;
        background-color: red;
    }
</style>