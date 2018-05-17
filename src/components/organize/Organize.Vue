<template>
    <div>
        <v-stepper v-model="step" style="height: 100%;">
            <v-stepper-header>
                <v-stepper-step step="1" :complete="step > 1">{{titles.step1}}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="step > 2">{{titles.step2}}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3" :complete="step > 3">{{titles.step3}}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4" :complete="step > 4">{{titles.step4}}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-card class="mb-3 stepperContent noBackground" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step1}}</p>
                                <div v-html="subtitles.step1"></div>
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
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-card class="mb-3 stepperContent noBackground" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step2}}</p>
                                <div v-html="subtitles.step2"></div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="step == 2">
                                <v-flex xs12 sm4>
                                    <v-container fluid>
                                        <v-list>
                                            <v-list-tile-sub-title>
                                                Configure
                                                <span v-if="distance && duration"> ({{distance | distance}} - {{duration | duration}}) </span>
                                            </v-list-tile-sub-title>
                                        </v-list>
                                        <v-expansion-panel>
                                            <v-expansion-panel-content value="true" class="transparent-background">
                                                <div slot="header">Route</div>
                                                <v-card>
                                                    <v-card-text>
                                                        <!--origin-->
                                                        <v-text-field
                                                                :id="origin.id"
                                                                placeholder="Origin"
                                                                :value="origin.address"
                                                                prepend-icon="location_on"
                                                                class="pt-0 mb-2"
                                                                clearable
                                                                autofocus
                                                                hide-details
                                                                :prefix="letters[0]"
                                                        ></v-text-field>

                                                        <!--wayPoints-->
                                                        <div v-for="(wayPoint, index) in wayPoints"
                                                             :key="index"
                                                             v-if="wayPoint.stopover"
                                                             style="position: relative;">
                                                            <div class="waypoint-left-container">
                                                                <v-btn class="mt-3"
                                                                       flat
                                                                       icon
                                                                       color="white"
                                                                       @click="removeWayPoint(index)">
                                                                    <v-icon>clear</v-icon>
                                                                </v-btn>
                                                            </div>
                                                            <div class="waypoint-right-container">
                                                                <v-text-field
                                                                        :id="wayPoint.id"
                                                                        :placeholder="wayPoint.address || 'Enter destination'"
                                                                        :value="wayPoint.address"
                                                                        class="pb-4 pt-3"
                                                                        autofocus
                                                                        hide-details
                                                                        :prefix="letters[index+1]"
                                                                ></v-text-field>
                                                                <v-btn
                                                                        style="z-index: 1"
                                                                        v-if="wayPoint.canSwap"
                                                                        @click="swapWayPoints(index)"
                                                                        absolute
                                                                        dark
                                                                        fab
                                                                        bottom
                                                                        left
                                                                        small
                                                                        color="primary"
                                                                >
                                                                    <v-icon>swap_vert</v-icon>
                                                                </v-btn>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>

                                                        <v-fab-transition>
                                                            <v-btn @click="addWayPoint"
                                                                   v-if="canAddWayPoint"
                                                                   fab
                                                                   dark
                                                                   small
                                                                   color="primary"
                                                                   class="mt-0 mb-0 ml-3">
                                                                <v-icon dark>add</v-icon>
                                                            </v-btn>
                                                        </v-fab-transition>

                                                        <!--destination-->
                                                        <v-text-field
                                                                :id="destination.id"
                                                                placeholder="Destination"
                                                                :value="destination.address"
                                                                prepend-icon="flag"
                                                                class="pt-0"
                                                                clearable
                                                                hide-details
                                                                :prefix="letters[wayPoints.length+1]"
                                                        ></v-text-field>
                                                    </v-card-text>
                                                </v-card>
                                                </v-expansion-panel-content>
                                            <v-expansion-panel-content v-if="vehicle != 'bicycle'" class="transparent-background">
                                                <div slot="header">Route Options</div>
                                                <v-card>
                                                    <v-card-text>
                                                        <v-checkbox
                                                                color="primary"
                                                                label="Avoid Highways"
                                                                v-model="routeOptions.avoidHighways"
                                                                hide-details
                                                        ></v-checkbox>
                                                        <v-checkbox
                                                                color="primary"
                                                                label="Avoid Ferries"
                                                                v-model="routeOptions.avoidFerries"
                                                                hide-details
                                                        ></v-checkbox>
                                                        <v-checkbox
                                                                color="primary"
                                                                label="Avoid Tolls"
                                                                v-model="routeOptions.avoidTolls"
                                                                hide-details
                                                        ></v-checkbox>
                                                    </v-card-text>
                                                </v-card>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-container>
                                </v-flex>

                                <v-flex xs12 sm8>
                                    <v-container fluid>
                                        <div class="google-map" :id="id">
                                            <loader></loader>
                                        </div>
                                    </v-container>
                                </v-flex>

                            </v-layout>
                        </v-container>
                    </v-card>
                    <div class="bottomMargin"></div>
                </v-stepper-content>
                <v-stepper-content  step="3">
                    <v-card class="mb-3 stepperContent noBackground" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step3}}</p>
                                <div v-html="subtitles.step3"></div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="step == 3">
                                <!--Date Picker-->
                                <v-flex xs10 offset-xs1 sm4 offset-sm1>
                                    <p class="title mt-0 pt-0">Pick a Date</p>
                                    <v-date-picker
                                            full-width
                                            class="mt-3"
                                            v-model="date"
                                            :min="today"
                                            color="primary"
                                    ></v-date-picker>
                                </v-flex>
                                <!--Time Picker-->
                                <v-flex xs10 offset-xs1 sm4 offset-sm2 class="mb-3">
                                    <p class="title">Pick a Time</p>
                                    <v-time-picker
                                            v-model="time"
                                            format="24hr"
                                            full-width
                                            color="primary"
                                    ></v-time-picker>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-stepper-content>
                <v-stepper-content  step="4">
                    <v-card class="mb-3 stepperContent noBackground" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step4}}</p>
                                <div v-html="subtitles.step4"></div>
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
                                            label="Extra information"
                                            multi-line
                                            v-model="description"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-toolbar fixed flat class="bottomToolbar">
            <v-toolbar-items style="width: 100%;" >
                <v-fab-transition>
                    <v-btn
                    color="primary"
                    fab
                    dark
                    absolute
                    top
                    left
                    @click="back()"
                    class="backBtn"
                    v-if="step !== 1"
                    >
                    <v-icon>keyboard_arrow_left</v-icon>
                    </v-btn>
                </v-fab-transition>

                <v-fab-transition>
                    <v-btn
                    color="primary"
                    fab
                    dark
                    absolute
                    top
                    right
                    @click="forward()"
                    class="backBtn"
                    v-show="stepCompleted"
                    >
                    <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                </v-fab-transition>

                <v-fab-transition>
                    <v-btn
                            color="primary"
                            fab
                            dark
                            absolute
                            top
                            right
                            @click="saveExplore()"
                            class="backBtn"
                            v-show="allStepsCompleted"
                    >
                        <v-icon>send</v-icon>
                    </v-btn>
                </v-fab-transition>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
    import * as mapFunctions from '@/assets/maps/map-functions'
    import mapStyles from '@/assets/maps/map-styles'

    export default {
        data () {
            return {
                step: 4,
                initialized: false,
                titles: {
                    step1: 'Vehicle',
                    step2: 'Route',
                    step3: 'When',
                    step4: 'Additionals'
                },
                subtitles: {
                    step1: 'With SocialRiders you can organize trips for different types of vehicles.<br>' +
                            'Choose your desired vehicle below!',
                    step2: 'Here you can create your route with Google Maps.<br>' +
                            'On the left you can select an origin and destination with the desired way points.<br>' +
                            'You can also further customize your route under the Route Options section.',
                    step3: 'Choose when you plan on taking this trip.',
                    step4: 'Finally you can give your trip a meaningful title<br> and write down some extra information.'
                },
                /** Step 1 */
                vehicle: null,
                /** Step 2 */
                map: null,
                id: "map",
                mapOptions: {
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    center: {lat: 52.379189, lng: 4.899431},
                    zoom: 7,
                    styles: mapStyles.retro
                },
                routeOptions: {
                    avoidFerries: false,
                    avoidHighways: false,
                    avoidTolls: false,
                },
                origin: {
                    id: 'origin'
                },
                destination: {
                    id: 'destination'
                },
                wayPoints: [],
                maxWayPoints: 23,
                markers: [],
                distance: null,
                duration: null,
                directionsService: new google.maps.DirectionsService,
                directionsRenderer: new google.maps.DirectionsRenderer({draggable:true}),
                letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                /** Step 3 */
                date: null,
                time: null,
                /** Step 4 */
                title: null,
                description: null,
            }
        },
        watch: {
            'routeOptions.avoidHighways': 'calculateAndDisplayRoute',
            'routeOptions.avoidTolls': 'calculateAndDisplayRoute',
            'routeOptions.avoidFerries': 'calculateAndDisplayRoute',
            step (value) {
                if (value === 2) {
                    this.initMap()
                }
            },
        },
        methods: {
            back () {
                if (this.step > 1) {
                    this.step--
                }
            },
            forward () {
                if (this.step < 4) {
                    if (this.step === 1 && this.step1Completed ||
                        this.step === 2 && this.step1Completed && this.step2Completed ||
                        this.step === 3 && this.step1Completed && this.step2Completed && this.step3Completed ||
                        this.step === 4 && this.allStepsCompleted)
                    {
                        this.step++
                    }
                }
            },
            /** Step 1 */
            setVehicle(vehicle) {
                this.vehicle = vehicle
                this.step = 2
            },
            isVehicle(vehicle) {
                return this.vehicle === vehicle
            },

            /** Step 2 */
            initMap () {
                $(() => {
                    // init a Google Maps map
                    this.map = mapFunctions.init(document.getElementById(this.id), this.mapOptions)

                    // add Places Search Boxes for origin & destination
                    this.addSearchBox(this.origin.id)
                    this.addSearchBox(this.destination.id)

                    // update route points on directions_changed event
                    google.maps.event.addListener(this.directionsRenderer, "directions_changed", () => {
                        this.wayPoints = this.getWayPoints()
                    })
                    this.calculateAndDisplayRoute()
                })
            },
            addWayPoint () {
                // if there is a route rendered, fetch all wayPoints
                if (this.canAddWayPoint) {
                    this.wayPoints.push({location: null, address: null, stopover: true, id: 'wayPoint' + (this.wayPoints.length+1)})
                    this.addSearchBox('wayPoint' + this.wayPoints.length)
                }
            },
            originPlaceFound(place) {
                this.origin.address = place.formatted_address
                this.origin.location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                }
                this.calculateAndDisplayRoute()
            },
            destinationPlaceFound(place) {
                this.destination.address = place.formatted_address
                this.destination.location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                }
                this.calculateAndDisplayRoute()
            },
            wayPointPlaceFound(place, input) {
                let oldWayPoint = this.wayPoints.filter(wayPoint => { return wayPoint.id === input.id })
                let wayPoint = {
                    id: input.id,
                    address: place.formatted_address,
                    location: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    },
                    stopover: true,
                    canSwap: false
                }

                if (oldWayPoint.length > 0) {
                    // replace the old one
                    this.wayPoints[this.wayPoints.indexOf(oldWayPoint[0])] = wayPoint
                } else {
                    // add a new one
                    this.wayPoints.push(wayPoint)
                }

                this.calculateAndDisplayRoute()
            },
            clearMarkers () {
                this.markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                this.markers = [];
            },
            swapWayPoints(index) {
                let firstItem = this.wayPoints[index]
                let nextItem = this.wayPoints.filter(wayPoint => {
                    return wayPoint.stopover === true && this.wayPoints.indexOf(wayPoint) > index
                })[0]

                if (nextItem) {
                    let nextIndex = this.wayPoints.indexOf(nextItem)
                    this.wayPoints[index] = nextItem
                    this.wayPoints[nextIndex] = firstItem
                }

                this.calculateAndDisplayRoute()
            },
            removeWayPoint(index) {
                if (this.wayPoints.length > 0 && this.wayPoints.length >= (index + 1)) {
                    this.wayPoints.splice(index, 1)
                    this.calculateAndDisplayRoute()
                }
            },
            // calculates origin, wayPoints and destination
            getWayPoints() {
                // can only work if there is a direction set
                if (this.directionsRenderer.directions) {
                    let wayPoints = []
                    let legs = this.directionsRenderer.directions.routes[0].legs
                    let lastLegIndex = this.directionsRenderer.directions.routes[0].legs.length-1

                    // create all database ready route data
                    let index = 0
                    legs.forEach(leg => {
                        // dragged wayPoints
                        // this MUST happen BEFORE the actual stopover is added
                        leg.via_waypoints.forEach(waypoint => {
                            let tmp = {
                                address: null,
                                location: {
                                    lat: waypoint.lat(),
                                    lng: waypoint.lng(),
                                },
                                stopover: false
                            }
                            wayPoints.push(tmp)
                        })

                        // stopover wayPoint
                        if (legs.length > 1 && index !== lastLegIndex) {
                            // this wayPoint can be swapped with the next if it is not the last wayPoint on the map
                            let canSwap = true
                            if (index === (lastLegIndex - 1)) {
                                canSwap = false
                            }

                            wayPoints.push({
                                address: leg.end_address,
                                location: {
                                    lat: leg.end_location.lat(),
                                    lng: leg.end_location.lng(),
                                },
                                stopover: true,
                                canSwap: canSwap
                            })
                        }

                        index++
                    })

                    for (let i = 0;i < wayPoints.length; i++) {
                        wayPoints[i].id = 'wayPoint' + (i + 1)
                    }
                    return wayPoints
                }

                return null
            },
            canSwap (index) {
                // if there is an wayPoint with stopover:true with a higher index
                this.wayPoints.forEach(wayPoint => {
                    if (wayPoint.stopover && this.wayPoints.indexOf(wayPoint) > index) {
                        return true
                    }
                })

                return false
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
                        self.clearMarkers()

                        // For each place, get the icon, name and location.
                        let bounds = new google.maps.LatLngBounds();
                        places.forEach(function(place) {
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }

                            // marker icon properties
                            const icon = {
                                url: place.icon,
                                size: new google.maps.Size(71, 71),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(17, 34),
                                scaledSize: new google.maps.Size(25, 25)
                            };

                            // Create a marker for each place.
                            let marker = new google.maps.Marker({
                                map: self.map,
                                icon: icon,
                                title: place.name,
                                position: place.geometry.location
                            })
                            self.markers.push(marker);

                            if (input.id === self.origin.id) {
                                self.originPlaceFound(place)
                            } else if (input.id === self.destination.id) {
                                self.destinationPlaceFound(place)
                            } else {
                                self.wayPointPlaceFound(place, input)
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
            calculateAndDisplayRoute() {
                if (this.origin.location && this.destination.location) {
                    const self = this;
                    this.directionsRenderer.setMap(null)
                    this.directionsRenderer.setMap(this.map);

                    this.distance = null
                    this.duration = null

                    let displayedWayPoints = []
                    for (let i = 0; i < this.wayPoints.length; i++) {
                        if (this.wayPoints[i].location) {
                            displayedWayPoints.push({
                                location: this.wayPoints[i].location,
                                stopover: this.wayPoints[i].stopover
                            });
                        }
                    }

                    // determine the travelmode bases on the selected vehicle
                    let travelMode = this.vehicle === 'bicycle' ? 'BICYCLING' : 'DRIVING'
                    this.directionsService.route({
                        origin: self.origin.location,
                        destination: self.destination.location,
                        waypoints: displayedWayPoints,
                        optimizeWaypoints: false,
                        travelMode: travelMode,
                        provideRouteAlternatives: false,
                        avoidFerries: self.routeOptions.avoidFerries,
                        avoidHighways: self.routeOptions.avoidHighways,
                        avoidTolls: self.routeOptions.avoidTolls,
                    }, function(response, status) {
                        if (status === 'OK') {
                            self.clearMarkers()
                            self.directionsRenderer.setDirections(response)
                            const route = response.routes[0];
                            let distance = 0;
                            let duration = 0;
                            //For each route, display summary information.
                            for (var i = 0; i < route.legs.length; i++) {
                                distance += route.legs[i].distance.value
                                duration += route.legs[i].duration.value
                            }
                            self.distance = distance
                            self.duration = duration
                        }
                        else {
                            self.$store.dispatch('errorMessage', 'Google Maps error: ' + status);
                        }
                    });
                }
            },
            /** Step 4 */
            saveExplore () {
                if (this.allStepsCompleted) {
                    // create the db model
                    const explore = {
                        vehicle: this.vehicle,
                        origin: this.origin,
                        destination: this.destination,
                        wayPoints: this.wayPoints,
                        routeOptions: this.routeOptions,
                        distance: this.distance,
                        duration: this.duration,
                        date: new Date(this.date + ' ' + this.time),
                        title: this.title,
                        description: this.description,
                        owner: this.$store.getters.user,
                        riders: []
                    }

                    // add to db
                    this.$store.dispatch('organizeExplore', explore).then(response => {
                        this.$store.dispatch('successMessage', 'Explore Organized!')
                        this.$router.push({name: 'Explores'})
                    }, error => {
                        this.$store.dispatch('errorMessage', error.message)
                    })
                }
            },
        },
        computed: {
            stepCompleted () {
                return  this.step === 1 && this.step1Completed ||
                        this.step === 2 && this.step1Completed && this.step2Completed ||
                        this.step === 3 && this.step1Completed && this.step2Completed && this.step3Completed

            },
            step1Completed () {
                return this.vehicle !== null
            },
            step2Completed () {
                return this.routeValid
            },
            step3Completed () {
                return this.date !== null
                    && this.time !== null
            },
            step4Completed () {
                return this.title !== null
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
            },
            routeValid () {
                return this.distance !== null && this.duration !== null
            },
            canAddWayPoint () {
                // if every added waypoint has a place found
                if (this.wayPoints.every(wayPoint => { return wayPoint.location })
                    && this.origin.location && this.origin.address
                    && this.destination.location && this.destination.address) {
                    if (this.wayPoints.length < this.maxWayPoints) {
                        return true
                    }
                }

                return false
            },
        },
        mounted () {
            if (this.step === 2) {
                this.initMap()
            }
        }
    }
</script>

<style scoped>
    .faIcon {
        font-size: 100px!important;
        color: rgba(255,255,255,0.5);
        cursor: pointer;
    }
    .faIcon:hover, .iconWrapper.active .faIcon {
        color: #1de9b6;
    }
    .stepTitle {
        margin-bottom: 8px;
    }
    .stepTitleWrapper {
        padding: 0;
    }
    .google-map {
        width: 100%;
        height: 400px;
        margin: 0 auto;
        background: gray;
    }
    .noPadding {
        padding: 0!important;
    }
    .bottomToolbar {
        text-align: center;
        top: auto;
        bottom: 0;
    }
    .backBtn {
        width: 56px;
        height: 56px;
    }
    .bottomMargin {
        height: 64px;
    }
    .stepperContent {
        margin-bottom: 30px!important;
    }
    .stepper, .card, .list {
        background: none!important;
    }
    .expansion-panel li {
        background: rgba(255,255,255,0.2) !important;
    }

    .waypoint-left-container {
        float: left;
        width: 36px;
    }
    .waypoint-right-container {
        float: left;
        width: 80%;
        width: calc(100% - 46px);
        margin-left: 10px;
    }
    .clearfix {
        clear: both;
    }

</style>