<template>
    <div>
        <v-stepper v-model="step" style="height: 100%;">
            <v-stepper-header>
                <v-stepper-step step="1" color="info" :complete="step > 1">Vehicle</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="step > 2">Starting location</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3" :complete="step > 3">When</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4" :complete="completed">Additional Info</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-card class="mb-3">
                        <v-card-text class="text-xs-center">
                            <div>
                                <p class="display-1">Vehicle</p>
                                <div>Please choose the type of vehicle</div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap>
                                <!--Motorcycle-->
                                <v-flex xs12 sm4>
                                    <div @click="setVehicle('motorcycle')" :class="{active: isVehicle('motorcycle')}" class="iconWrapper">
                                        <v-tooltip bottom>
                                            <i class="faIcon fas fa-motorcycle" slot="activator"></i>
                                            <span>Motorcycle</span>
                                        </v-tooltip>
                                    </div>
                                </v-flex>
                                <!--Car-->
                                <v-flex xs12 sm4>
                                    <div @click="setVehicle('car')" :class="{active: isVehicle('car')}" class="iconWrapper">
                                        <v-tooltip bottom>
                                            <i class="faIcon fas fa-car" slot="activator"
                                               @click="setVehicle('car')"
                                               :class="{active: isVehicle('car')}"></i>
                                            <span>Car</span>
                                        </v-tooltip>
                                    </div>
                                </v-flex>
                                <!--Bicycle-->
                                <v-flex xs12 sm4>
                                    <div @click="setVehicle('bicycle')" :class="{active: isVehicle('bicycle')}" class="iconWrapper">
                                        <v-tooltip bottom>
                                            <i class="faIcon fas fa-bicycle" slot="activator"
                                               @click="setVehicle('bycicle')"
                                               :class="{active: isVehicle('bycicle')}"></i>
                                            <span>Bicycle</span>
                                        </v-tooltip>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                    <v-btn color="info" @click="step = 2" v-if="vehicle">Continue</v-btn>
                </v-stepper-content>
                <v-stepper-content step="2" >
                    <v-card class="mb-3">
                        <!--Content Title-->
                        <v-card-text class="text-xs-center">
                            <p class="display-1">
                                Starting location
                                <v-tooltip bottom>
                                    <v-icon slot="activator" color="info">info</v-icon>
                                    <span>Use above's search input to search for places</span>
                                </v-tooltip>
                            </p>
                            <p>Click on the map below to set the starting location of your trip!</p>
                        </v-card-text>

                        <!--Selected starting location-->
                        <span class="subtitle" v-if="startingAddress">Selected address: <b>{{startingAddress}}</b></span>

                        <!--Google Maps element-->
                        <div class="google-map mb-3" :id="mapId">Google Maps</div>
                    </v-card>
                    <v-btn class="info" @click="step = 3" v-if="startingLocation && startingAddress">Continue</v-btn>
                    <v-btn flat @click="step = 1">Back</v-btn>
                </v-stepper-content>
                <v-stepper-content step="3">
                    <v-card class="mb-3" >
                        <!--Content Title-->
                        <v-card-text class="text-xs-center">
                            <p class="display-1">When</p>
                            <p>Choose when the trip is planned</p>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap>

                                <!--Date Picker-->
                                <v-flex xs12 sm4 offset-sm1>
                                    <p class="title mt-0 pt-0">Pick a Date</p>
                                    <v-date-picker
                                            full-width
                                            class="mt-3"
                                            v-model="date"
                                            :min="today"
                                    ></v-date-picker>
                                </v-flex>
                                <!--Time Picker-->
                                <v-flex xs12 sm4 offset-sm2>
                                    <p class="title">Pick a Time</p>
                                    <v-time-picker
                                            v-model="time"
                                            format="24hr"
                                            full-width
                                    ></v-time-picker>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                    <v-btn class="info" v-if="date && time" @click="step = 4">Continue</v-btn>
                    <v-btn flat @click="step = 2">Back</v-btn>
                </v-stepper-content>
            <v-stepper-content step="4">
                    <v-card class="mb-3" >
                        <!--Content Title-->
                        <v-card-text class="text-xs-center">
                            <p class="display-1">Additional Info</p>
                            <p>Enter any additional information about the trip</p>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap>
                                <v-flex xs12 offset-sm3 sm6>
                                    <v-text-field
                                            label="Title"
                                            required
                                            single-line
                                            v-model="title"
                                    ></v-text-field>
                                    <v-text-field
                                            label="Description"
                                            multi-line
                                            v-model="description"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                    <v-btn class="success" v-if="completed">Save</v-btn>
                    <v-btn flat @click="step = 3">Back</v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
    import mapStyles from './../shared/map-styles'

    export default {
        data () {
            return {
                step: 1,
                /** Step1 */
                vehicle: null,
                /** Step2 */
                showInfoText: false,
                map: null,
                mapId: "map",
                mapOptions: {
                    ApiKey: 'AIzaSyC9dPxG1hJa9ddxDEMcpLLZNK34xz6Ac8M',
                    center: {lat: 	52.379189, lng: 4.899431},
                    zoom: 7,
                    styles: mapStyles.retro
                },
                markers: [],
                startingLocation: null,
                startingAddress: null,
                /** Step3 */
                date: this.today,
                time: null,
                /** Step4 */
                title: null,
                description: null
            }
        },
        computed: {
            today () {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();

                if(dd<10) dd = '0'+dd

                if(mm<10)  mm = '0'+mm

                return yyyy + '-' + mm + '-' + dd;
            },
            completed () {
                // a set of rules to make sure all data is set
                return  this.vehicle !== undefined &&
                        this.startingAddress !== undefined &&
                        this.date !== undefined &&
                        this.time !== undefined &&
                        this.title !== undefined &&
                        this.title !== null &&
                        this.title !== ''
            }
        },
        methods: {
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
            addMarker (pos, home) {
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.lat, pos.lng),
                    map: this.map
                })
                if (home === undefined) {
                    this.markers.push(marker)
                }
                return marker
            },
            setVehicle(vehicle) {
                this.vehicle = vehicle
            },
            isVehicle(vehicle) {
                return this.vehicle == vehicle
            },
            clearMarkers () {
                // Clear out the old markers.
                this.markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                this.markers = []
            },
            writeAddressName (latLng) {
                var self = this;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    "location": latLng,
                },
                function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var result = results.filter(function( result ) {
                            return result.types.indexOf('street_address') >= 0;
                        })[0];

                        if (result) {
                            self.startingAddress = result.formatted_address
                        }
                    }
                    else{
                        console.log("No address found")
                    }
                });
            },
        },
        mounted () {
            var self = this;

            // Google maps
            this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions);

            // Create the search box
            var input = document.getElementById('search-input');
            var searchBox = new google.maps.places.SearchBox(input);

            this.map.addListener('bounds_changed', function() {
                searchBox.setBounds(self.map.getBounds());
            });

            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                self.clearMarkers()

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

            // Async load current position and create marker on success
            var options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };
            this.getPosition(options)
                .then((position) => {
                    this.mapOptions.center.lat = position.coords.latitude
                    this.mapOptions.center.lng = position.coords.longitude
                    this.addMarker({lat: position.coords.latitude, lng: position.coords.longitude}, true)
                })
                .catch((err) => {
                    console.error("Error fetching current position: " + err.message);
                });

            this.map.addListener('click', (data) => {
                self.clearMarkers()
                self.addMarker({
                    lat: data.latLng.lat(),
                    lng: data.latLng.lng()
                })
                this.startingLocation = {
                    lat: data.latLng.lat(),
                    lng: data.latLng.lng()
                }
//                this.checkGeoLocation(this.startingLocation);
                this.writeAddressName(this.startingLocation);
            });
        }
    }
</script>

<style scoped>
    .google-map {
        width: 100%;
        height: 300px;
        margin: 0 auto;
        background: gray;
    }
    .faIcon {
        font-size: 100px!important;
        color: lightgray;
        cursor: pointer;
    }
    .faIcon:hover, .iconWrapper.active .faIcon {
        color: #2196F3;
    }
</style>