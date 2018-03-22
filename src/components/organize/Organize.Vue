<template>
    <div>
        <v-stepper v-model="step" style="height: 100%;">
            <v-stepper-header>
                <v-stepper-step step="1" :complete="step > 1">{{headers.step1}}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="step > 2">{{headers.step2}}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3" :complete="step > 3">{{headers.step3}}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4" :complete="step > 4">{{headers.step4}}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items style="height: 100%;">
                <v-stepper-content step="1">
                    <v-card class="mb-3">
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step1}}</p>
                                <div>{{subtitles.step1}}</div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="step == 1">
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
                    <v-btn v-if="step1Completed" class="info" @click="step = 2">Continue</v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-card class="mb-3">
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step2}}</p>
                                <div>{{subtitles.step2}}</div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="step == 2">
                                <v-flex xs12 sm10 offset-sm1>
                                    <!--startpoint-->
                                    <v-text-field
                                            :id="startPoint.id"
                                            :placeholder="startPoint.placeholder"
                                            prepend-icon="flight_takeoff"
                                            :value="startPoint.address"
                                            clearable
                                    ></v-text-field>

                                    <!--waypoints-->
                                    <v-text-field
                                            v-for="(waypoint, index) in waypoints"
                                            :key="index"
                                            :id="waypoint.id"
                                            :placeholder="waypoint.placeholder"
                                            prepend-icon="explore"
                                            :value="waypoint.address"
                                            clearable
                                    ></v-text-field>

                                    <v-btn @click="addWaypoint(getWaypointId(), 'Waypoint ' + (waypoints.length + 1))" fab dark color="accent">
                                        <v-icon dark>add</v-icon>
                                    </v-btn>

                                    <!--endpoint-->
                                    <v-text-field
                                            :id="endPoint.id"
                                            :placeholder="endPoint.placeholder"
                                            prepend-icon="flight_land"
                                            :value="endPoint.address"
                                            clearable
                                    ></v-text-field>

                                    <!--Selected starting location-->
                                    <span class="subtitle" v-if="startingAddress">Selected address: <b>{{startingAddress}}</b></span>

                                    <!--Google Maps element-->
                                    <div class="google-map" id="map">Google Maps</div>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                    <v-btn v-if="step1Completed && step2Completed" class="info" @click="step = 3">Continue</v-btn>
                    <v-btn @click="step = 1" flat>Back</v-btn>
                </v-stepper-content>
                <v-stepper-content  step="3">
                    <v-card class="mb-3">
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step3}}</p>
                                <div>{{subtitles.step3}}</div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="step == 3">
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
                                <v-flex xs12 sm4 offset-sm2 class="mb-3">
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
                    <v-btn v-if="step1Completed && step2Completed && step3Completed" class="info" @click="step = 4">Continue</v-btn>
                    <v-btn @click="step = 2" flat>Back</v-btn>
                </v-stepper-content>
                <v-stepper-content  step="4">
                    <v-card class="mb-3">
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step4}}</p>
                                <div>{{subtitles.step4}}</div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="step == 4">
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
                    <v-btn v-if="allStepsCompleted" class="success" :loading="loading" @click="saveExplore()">Save</v-btn>
                    <v-btn @click="step = 3" flat>Back</v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
    import mapStyles from './../shared/maps/map-styles'

    export default {
        data () {
            return {
                step: 2,
                headers: {
                    step1:  'Vehicle',
                    step2:  'Location',
                    step3:  'When',
                    step4:  'Additionals'
                },
                titles: {
                    step1: 'Vehicle',
                    step2: 'Location',
                    step3: 'When',
                    step4: 'Additionals'
                },
                subtitles: {
                    step1: 'Please choose the type of vehicle',
                    step2: 'Click on the map below to set the starting location of your trip',
                    step3: 'Choose when you plan on taking this trip',
                    step4: 'Enter any additional information about the trip'
                },
                /** Step 1 */
                vehicle: null,
                /** Step 2 */
                startPoint: {id: 'startPoint', placeholder: 'Starting location'},
                endPoint: {id: 'endPoint', placeholder: 'Target destination'},
                waypoints: [],
                displayedWaypoints: [],
                showInfoText: false,
                map: null,
                mapId: "map",
                mapOptions: {
                    center: {lat: 52.379189, lng: 4.899431},
                    zoom: 7,
                    styles: mapStyles.retro
                },
                markers: [],
                startingLocation: null,
                startingAddress: null,
                /** Step 3 */
                date: null,
                time: null,
                /** Step 4 */
                title: null,
                description: null,
            }
        },
        methods: {
            /** Step 1 */
            setVehicle(vehicle) {
                this.vehicle = vehicle
            },
            isVehicle(vehicle) {
                return this.vehicle === vehicle
            },

            /** Step 2 */
            initMap () {
                const self = this;

                // Google maps
                this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions);
                this.addSearchBox(this.startPoint.id, 'Starting location')
                this.addSearchBox(this.endPoint.id, 'Target destination')
            },
            getWaypointId () {
               return 'waypoint' + this.waypoints.length;
            },
            addWaypoint (id, placeholder) {
                this.waypoints.push({location: null, address: null, id: id, placeholder: placeholder})
                this.addSearchBox(id)
            },
            addSearchBox (inputId) {
                const self = this;

                // selecting element by ID must be in $(document).ready()
                $(document).ready(function(){
                    // Create the search box and link it to the UI element.
                    const input = document.getElementById(inputId);

                    const searchBox = new google.maps.places.SearchBox(input);

                    // Bias the SearchBox results towards current map's viewport.
                    self.map.addListener('bounds_changed', function() {
                        searchBox.setBounds(self.map.getBounds());
                    });

                    let markers = [];
                    // Listen for the event fired when the user selects a prediction and retrieve
                    // more details for that place.
                    searchBox.addListener('places_changed', function() {
                        let places = searchBox.getPlaces();

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

                            if (input.id === self.startPoint.id) {
                                self.startPlaceFound(place)
                            } else if (input.id === self.endPoint.id) {
                                self.endPlaceFound(place)
                            } else {
                                self.waypointPlaceFound(input, place)
                            }

                            if (place.geometry.viewport) {
                                // Only geocodes have viewport.
                                bounds.union(place.geometry.viewport);
                            } else {
                                bounds.extend(place.geometry.location);
                            }
                        });
                        self.map.fitBounds(bounds);
                    });
                })
            },
            startPlaceFound(place) {
                this.startPoint.address = place.formatted_address
                this.startPoint.location = place.geometry.location
                this.calculateAndDisplayRoute();
            },
            endPlaceFound(place) {
                this.endPoint.address = place.formatted_address
                this.endPoint.location = place.geometry.location
                this.calculateAndDisplayRoute();
            },
            waypointPlaceFound(input, place) {
                let waypoint = this.waypoints.find((current) => {
                    return current.id === input.id
                })

                if (waypoint !== undefined) {
                    waypoint.address = place.formatted_address
                    waypoint.location = place.geometry.location
                    this.calculateAndDisplayRoute();
                }
            },
            calculateAndDisplayRoute() {
                if (this.startPoint.address !== undefined
                    && this.endPoint.address !== undefined
                    && this.startPoint.location !== undefined
                    && this.endPoint.location !== undefined)
                {
                    const self = this;
                    const directionsService = new google.maps.DirectionsService;
                    const directionsDisplay = new google.maps.DirectionsRenderer;

                    directionsDisplay.setMap(this.map);

                    // start point as first point
                    this.displayedWaypoints.push({
                        location: this.startPoint.location,
                        stopover: true
                    })

                    // waypoints inbetween
                    this.displayedWaypoints = []
                    for (let i = 0; i < this.waypoints.length; i++) {
                        this.displayedWaypoints.push({
                            location: this.waypoints[i].location,
                            stopover: true
                        });
                    }

                    // end point as last point
                    this.displayedWaypoints.push({
                        location: this.endPoint.location,
                        stopover: true
                    })

                    directionsService.route({
                        origin: self.startPoint.location,
                        destination: self.endPoint.location,
                        waypoints: self.displayedWaypoints,
                        optimizeWaypoints: true,
                        travelMode: 'DRIVING' //todo: multiple driving modes support
                    }, function(response, status) {
                        if (status === 'OK') {
                            directionsDisplay.setDirections(response);
                            var route = response.routes[0];
//                        var summaryPanel = document.getElementById('directions-panel');
//                        summaryPanel.innerHTML = '';
                            // For each route, display summary information.
//                        for (var i = 0; i < route.legs.length; i++) {
//                            var routeSegment = i + 1;
//                            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
//                                '</b><br>';
//                            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
//                            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
//                            summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
//                        }
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
                } else {
                    console.log('invalid start/end points')
                }
            },
            /** Step 3 */

            /** Step 4 */
            saveExplore () {
                const explore = {
                    vehicle: this.vehicle,
                    location: this.startingLocation,
                    address: this.startingAddress,
                    date: this.date,
                    time: this.time,
                    title: this.title,
                    description: this.description,
                    user: this.$store.getters.user
                }
                if (this.$store.dispatch('organizeExplore', explore)){
                    this.$router.push('/')
                }
            },
        },
        computed: {
            step1Completed () {
                return this.vehicle !== null
                    && this.vehicle !== undefined
                    && this.vehicle !== ''
            },
            step2Completed () {
                return this.startingLocation !== null
                    && this.startingLocation !== undefined
                    && this.startingLocation !== ''
                    && this.startingAddress !== null
                    && this.startingAddress !== undefined
                    && this.startingAddress !== ''
            },
            step3Completed () {
                return this.date !== null
                    && this.date !== undefined
                    && this.date !== ''
                    && this.time !== null
                    && this.time !== undefined
                    && this.time !== ''
            },
            step4Completed () {
                return this.title !== null
                    && this.title !== undefined
                    && this.title !== ''
            },
            allStepsCompleted () {
                return this.step1Completed
                    && this.step2Completed
                    && this.step3Completed
                    && this.step4Completed
            },
            today () {
                var now = new Date();
                var dd = now.getDate();
                var mm = now.getMonth()+1; //January is 0!
                var yyyy = now.getFullYear();

                if(dd<10) dd = '0'+dd

                if(mm<10)  mm = '0'+mm

                return yyyy + '-' + mm + '-' + dd;
            },
            loading () {
                return this.$store.getters.loading
            }
        },
        mounted () {
            this.initMap()
        }
    }
</script>

<style scoped>
    .faIcon {
        font-size: 100px!important;
        color: lightgray;
        cursor: pointer;
    }
    .faIcon:hover, .iconWrapper.active .faIcon {
        color: #2196F3;
    }
    .stepTitle {
        margin-bottom: 8px;
    }
    .stepTitleWrapper {
        padding: 0;
    }
    .google-map {
        width: 100%;
        height: 300px;
        margin: 0 auto;
        background: gray;
    }
</style>