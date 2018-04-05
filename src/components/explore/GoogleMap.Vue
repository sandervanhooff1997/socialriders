<template>
    <div style="width: 100%; height: 100%;">
        <v-layout row wrap fill-height class="banner">
            <v-flex xs12 sm3>
                <v-container fluid>
                    <!--ROUTE DETAILS-->
                    <v-card v-if="selectedExplore" flat dark style="background: none!important;">
                        <v-card-media height="130px">
                            <v-layout wrap align-center>
                                <v-flex class="text-xs-center">
                                    <v-avatar>
                                        <router-link :to="{ name: 'profile', params: { uid: selectedExplore.user.uid }}">
                                            <img  :src="selectedExplore.user.photoUrl" :alt="selectedExplore.user.name">
                                        </router-link>
                                    </v-avatar>
                                    <div class="title white--text">{{selectedExplore.user.name}}</div>
                                </v-flex>
                            </v-layout>
                        </v-card-media>
                        <v-divider></v-divider>

                        <v-tooltip left>
                            <v-card-title primary-title slot="activator">
                                <div class="headline">{{selectedExplore.title}}</div>
                            </v-card-title>
                            <span>{{selectedExplore.title}}</span>
                        </v-tooltip>

                        <v-list style="background: none!important;">
                            <v-list-tile>
                                <v-tooltip left>
                                    <v-list-tile-action slot="activator">
                                        <v-icon>date_range</v-icon>
                                    </v-list-tile-action>
                                    <span>When</span>
                                </v-tooltip>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{selectedExplore.date | date}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-tooltip left>
                                    <v-list-tile-action slot="activator">
                                        <v-icon>flight_takeoff</v-icon>
                                    </v-list-tile-action>
                                    <span>Starting Location</span>
                                </v-tooltip>
                                <v-tooltip left>
                                    <v-list-tile-content  slot="activator">
                                        <v-list-tile-title>{{selectedExplore.startPoint.address}}</v-list-tile-title>
                                    </v-list-tile-content>
                                    <span>{{selectedExplore.startPoint.address}}</span>
                                </v-tooltip>
                            </v-list-tile>
                            <v-list-tile>
                                <v-tooltip left>
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
                                <v-tooltip left>
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
            <v-flex xs12 sm9 >
                <div class="google-map" :id="mapId">Google Maps</div>

                <v-speed-dial
                        id="map-actions"
                        v-model="mapActions"
                        direction="bottom"
                        left
                        open-on-hover
                        transition="slide-y-reverse-transition"
                >
                    <v-btn
                            class="action-margin"
                            style="margin-top: 25px;"
                            slot="activator"
                            color="yellow"
                            dark
                            fab
                            hover
                            v-model="mapActions"
                    >
                        <v-icon>info</v-icon>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-btn
                            class="action-margin"
                            round
                            dark
                            small
                            color="accent"
                    >
                        Popular
                    </v-btn>
                    <v-btn
                            class="action-margin"
                            round
                            dark
                            small
                            color="accent"
                    >
                        Recent
                    </v-btn>
                    <v-btn
                            class="action-margin"
                            round
                            dark
                            small
                            color="accent"
                    >
                        Nearby
                    </v-btn>
                </v-speed-dial>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import Vue from 'vue'
    import DateDiff from 'date-diff'
    import mapStyles from '../shared/maps/map-styles'

    export default {
        props: ['explores'],
        data () {
            return {
                map: null,
                mapId: "map",
                mapOptions: {
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    center: {lat: 	52.379189, lng: 4.899431},
                    zoom: 7,
                    styles: mapStyles.retro
                },
                myPosition: null,
                markers: [], // all map markers
                selectedExplore: null,
                route: false,
                directionsService: new google.maps.DirectionsService,
                directionsDisplay: new google.maps.DirectionsRenderer,
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
                var self = this;

                // Google maps
                this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions);

                self.setMyPosition()

                // selecting element by ID must be in $(document).ready()
                $(document).ready(function(){
                    // Create the search box
                    let input = document.getElementById('search-input');
                    let searchBox = new google.maps.places.SearchBox(input);

                    self.map.addListener('bounds_changed', function() {
                        searchBox.setBounds(self.map.getBounds());
                    });

                    self.map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('map-actions'));

                    var markers = [];
                    // Listen for the event fired when the user selects a prediction and retrieve
                    // more details for that place.
                    searchBox.addListener('places_changed', function() {
                        var places = searchBox.getPlaces();

                        if (places.length === 0) {
                            return;
                        }

                        // Clear out the old markers.
                        markers.forEach(function(marker) {
                            marker.setMap(null);
                        });
                        markers = [];

                        // For each place, get the icon, name and location.
                        let bounds = new google.maps.LatLngBounds();
                        places.forEach(function(place) {
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }
                            const icon = {
                                url: place.icon,
                                size: new google.maps.Size(71, 71),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(17, 34),
                                scaledSize: new google.maps.Size(25, 25)
                            };

                            // Create a marker for each place.
                            markers.push(new google.maps.Marker({
                                map: self.map,
                                icon: icon,
                                title: place.name,
                                position: place.geometry.location
                            }));

                            if (place.geometry.viewport) {
                                // Only geocodes have viewport.
                                bounds.union(place.geometry.viewport);
                            } else {
                                bounds.extend(place.geometry.location);
                            }
                        });
                        self.map.fitBounds(bounds);
                    });

                    // Render explores
                    self.filterExplores()
                })
            },
            renderExplores (explores) {
                const self = this

                if (this.markers.length > 0) {
                    this.markers.forEach(marker => {
                        marker.setMap(null)
                    })
                    this.markers = []
                }

                explores.forEach(explore => {
                    const marker = self.addMarker(explore.startPoint.location)
                    self.addInfoWindowClickListener(marker, explore)
                })
            },
            /**
             * filters all explores with the given filters
             */
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
            /**
             *  Returns a promise containing the users position
             */
            setMyPosition () {
                let self = this

                if (localStorage.getItem("lat") && localStorage.getItem("lng")) {
                    self.myPosition = {
                        lat: parseFloat(localStorage.getItem("lat")),
                        lng: parseFloat(localStorage.getItem("lng"))
                    }

                    self.map.setCenter(self.myPosition)
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(position => {
                            self.myPosition = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }

                            localStorage.setItem("lat", self.myPosition.lat)
                            localStorage.setItem("lng", self.myPosition.lng)

                            self.map.setCenter(self.myPosition)
                        });
                    } else {
                        console.log("Geolocation is not supported by your browser.")
                    }
                }
            },
            /**
             * Generates a Google Maps Marker on the given position with the given Custom Marker Icon
             */
            addMarker (pos) {
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.lat, pos.lng),
                    map: this.map,
                    animation: google.maps.Animation.DROP
                })
                this.markers.push(marker)
                return marker
            },
            /**
             * Generates an Google Maps InfoWindow with the given explore data
             * Adds a click listener to the InfoWindow
             */
            addInfoWindowClickListener (marker, explore) {
                const self = this;
                marker.addListener('click', function() {
                    self.showRoute(explore)
                });
            },
            showRoute(explore) {
                this.selectedExplore = explore
                this.calculateAndDisplayRoute()
            },
            hideRoute(){
                this.selectedExplore = null
                this.map.setZoom(7)
                this.directionsDisplay.setMap(null)
            },
            calculateAndDisplayRoute() {
                if (this.selectedExplore !== null) {
                    const self = this;

                    this.directionsDisplay.setMap(this.map);

                    // wayPoints
                    var wayPoints = []
                    for (let i = 0; i < this.selectedExplore.wayPoints.length; i++) {
                        if (this.selectedExplore.wayPoints[i].location) {
                            wayPoints.push({
                                location: this.selectedExplore.wayPoints[i].location,
                                stopover: true
                            });
                        }
                    }

                    // determine the travelmode bases on the selected vehicle
                    let travelMode = this.selectedExplore.vehicle === 'bicycle' ? 'BICYCLING' : 'DRIVING'

                    this.directionsService.route({
                        origin: self.selectedExplore.startPoint.location,
                        destination: self.selectedExplore.endPoint.location,
                        waypoints: wayPoints,
                        optimizeWaypoints: false,
                        travelMode: travelMode,
                    }, function(response, status) {
                        if (status === 'OK') {
                            self.directionsDisplay.setDirections(response)
                        }
                        else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
                }
            },
        },
        mounted () {
            this.initMap()
            this.filters.date.value = this.today
        },
    }
</script>

<style scoped>
    .google-map {
        width: 100%;
        height: 100%;
        min-height: 400px;
        margin: 0 auto;
        background: gray;
    }
    .filter-header {
        height: auto;
    }
    .action-margin {
        margin-left: 25px;
    }
</style>