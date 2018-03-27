<template>
    <div style="width: 100%; height: 100%;">
        <!--InfoWindow-->
        <v-navigation-drawer app dark right mobile-break-point="100000" v-model="selectedExplore" v-if="selectedExplore && selected" class="purple-to-orange">
            <v-card flat style="background: none!important">
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

                <v-list>
                    <v-list-tile>
                        <v-tooltip left>
                            <v-list-tile-action slot="activator">
                                <v-icon>date_range</v-icon>
                            </v-list-tile-action>
                            <span>When</span>
                        </v-tooltip>
                        <v-list-tile-content>
                            <v-list-tile-title>{{selectedExplore.date | date}} - {{selectedExplore.time | time}}</v-list-tile-title>
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
                    <v-btn color="accent">Join</v-btn>
                    <v-btn flat @click="selected = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-navigation-drawer>

        <v-btn color="secondary" id="hide-route" v-show="route" @click="hideRoute()">Hide Route</v-btn>
        <div class="google-map" :id="mapId">Google Maps</div>

        <div id="legend">
            <h3>Legend</h3>
            <v-divider class="legendDevider"></v-divider>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import DateDiff from 'date-diff'
    import mapStyles from '../shared/maps/map-styles'

    // Custom Marker Icons
    import greenMarker from './../../assets/markers/green-marker.png'
    import yellowMarker from './../../assets/markers/yellow-marker.png'
    import redMarker from './../../assets/markers/red-marker.png'
    import homeMarker from './../../assets/markers/home-marker.png'

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
                markers: [], // all map markers
                selected: false,
                selectedExplore: null,
                route: false,
                directionsService: new google.maps.DirectionsService,
                directionsDisplay: new google.maps.DirectionsRenderer,
                icons: {
                    green: {
                        name: 'Less than 30 days',
                        icon: greenMarker
                    },
                    yellow: {
                        name: 'Between 30 and 60 days',
                        icon: yellowMarker
                    },
                    red: {
                        name: 'More than 60 days',
                        icon: redMarker
                    }
                },
            }
        },
        methods: {
            initMap () {
                var self = this;

                // Google maps
                this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions);

                // selecting element by ID must be in $(document).ready()
                $(document).ready(function(){
                    // Create the search box
                    var input = document.getElementById('search-input');
                    var button = document.getElementById('hide-route');
                    var searchBox = new google.maps.places.SearchBox(input);

                    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(button);
                    self.map.addListener('bounds_changed', function() {
                        searchBox.setBounds(self.map.getBounds());
                    });

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
                        var bounds = new google.maps.LatLngBounds();
                        places.forEach(function(place) {
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }
                            var icon = {
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

                    // Generate a legend
                    var legend = document.getElementById('legend');
                    for (var key in self.icons) {
                        const type = self.icons[key];
                        const name = type.name;
                        const icon = type.icon;
                        const div = document.createElement('div');

                        div.innerHTML = '<img style="vertical-align: middle" src="' + icon + '"> ' + name;
                        legend.appendChild(div);
                    }
                    self.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

                    // Render explores
                    self.explores.forEach(explore => {
                        const icon = self.getMarkerIcon(explore.date)
                        const marker = self.addMarker(explore.startPoint.location, icon)
                        self.addInfoWindowClickListener(marker, explore)
                    })

                    // Async load current position and create marker on success
                    var options = {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    };

                    self.getPosition(options)
                        .then((position) => {
                            self.mapOptions.center.lat = position.coords.latitude
                            self.mapOptions.center.lng = position.coords.longitude
                            self.addMarker({lat: position.coords.latitude, lng: position.coords.longitude}, homeMarker)
                        })
                        .catch((err) => {
                            console.error("Error fetching current position: " + err.message);
                        });
                })
            },
            /**
             *  Returns a promise containing the users position
             */
            getPosition (options) {
                return new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject, options);
                });
            },
            /**
             * Generates a Google Maps Marker on the given position with the given Custom Marker Icon
             */
            addMarker (pos, icon) {
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.lat, pos.lng),
                    map: this.map,
                    icon: icon
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
                    self.showInfoWindow(explore)
                });
            },
            /**
             * Returns the difference in days between the given date and today
             */
            getMarkerIcon (date) {
                const today = new Date()
                const exploreDate = new Date(date)
                const diffInDays = new DateDiff(exploreDate, today).days()

                if (diffInDays < 30) {
                    return greenMarker
                } else if (diffInDays >= 30 && diffInDays <= 60) {
                    return yellowMarker
                } else {
                    return redMarker
                }
            },
            showInfoWindow (explore) {
                this.selectedExplore = explore
                this.selected = true;
                this.showRoute()
            },
            hideInfoWindow() {
                this.selectedExplore = null
            },
            showRoute() {
                this.calculateAndDisplayRoute()
                this.route = true
            },
            hideRoute(){
                this.directionsDisplay.setMap(null)
                this.route = false
            },
            calculateAndDisplayRoute() {
                if (this.selectedExplore !== null) {
                    const self = this;

                    this.hideRoute()
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
        },
    }
</script>

<style scoped>
    .google-map {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: gray;
    }
    #legend {
        font-weight:bold;
        background: rgba(255,255,255,0.9);
        padding: 10px;
        margin: 10px;
        text-align: left;
    }
    #legend .legendDevider {
        margin: 5px 0;
    }
</style>