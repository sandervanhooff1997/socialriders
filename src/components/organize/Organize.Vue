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
                    <v-card class="mb-3 stepperContent" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step1}}</p>
                                    <v-icon dark>forward</v-icon>
                                </v-btn>
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
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-card class="mb-3 stepperContent" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step2}}</p>
                                    <v-icon dark>forward</v-icon>
                                </v-btn>
                                <div></div>
                            </div>
                        </v-card-text>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="step == 2">
                                <v-flex xs12 sm4>
                                    <v-list>
                                        <v-list-tile-sub-title>
                                            Configure
                                            <span v-if="distance && duration"> ({{distance | distance}} - {{duration | duration}}) </span>
                                        </v-list-tile-sub-title>
                                    </v-list>
                                    <v-expansion-panel>
                                        <v-expansion-panel-content value="true">
                                            <div slot="header">Route</div>
                                            <v-card>
                                                <v-card-text>
                                                    <!--startpoint-->
                                                    <v-text-field
                                                            :id="startPoint.id"
                                                            :placeholder="startPoint.placeholder"
                                                            prepend-icon="nature_people"
                                                            :value="startPoint.address"
                                                            class="noPadding"
                                                            clearable
                                                            autofocus
                                                    ></v-text-field>

                                                    <!--wayPoints-->
                                                    <div v v-for="(wayPoint, index) in wayPoints" :key="index" style="position: relative;">
                                                        <v-text-field
                                                                :id="wayPoint.id"
                                                                :placeholder="wayPoint.placeholder"
                                                                prepend-icon="explore"
                                                                :value="wayPoint.address"
                                                                clearable
                                                                autofocus
                                                        ></v-text-field>
                                                        <v-btn
                                                                style="z-index: 1"
                                                                v-if="index !== (wayPoints.length -1)"
                                                                @click="swapWayPoints(index)"
                                                                absolute
                                                                dark
                                                                fab
                                                                bottom
                                                                small
                                                                left
                                                                color="warning"
                                                        >
                                                            <v-icon>swap_vert</v-icon>
                                                        </v-btn>
                                                    </div>

                                                    <v-btn @click="addWayPoint(getWayPointId(), 'waypoint ' + (wayPoints.length + 1))"
                                                           fab
                                                           dark
                                                           color="warning"
                                                           class="noMargin">
                                                        <v-icon dark>add</v-icon>
                                                    </v-btn>

                                                    <!--endpoint-->
                                                    <v-text-field
                                                            :id="endPoint.id"
                                                            :placeholder="endPoint.placeholder"
                                                            prepend-icon="flag"
                                                            :value="endPoint.address"
                                                            class="noPadding"
                                                            clearable
                                                    ></v-text-field>
                                                </v-card-text>
                                            </v-card>
                                            </v-expansion-panel-content>
                                        <v-expansion-panel-content v-if="vehicle != 'bicycle'">
                                            <div slot="header">Options</div>
                                            <v-card>
                                                <v-card-text>
                                                    <v-checkbox
                                                            label="Avoid Highways"
                                                            v-model="options.avoidHighways"
                                                    ></v-checkbox>
                                                    <v-checkbox
                                                            label="Avoid Ferries"
                                                            v-model="options.avoidFerries"
                                                    ></v-checkbox>
                                                    <v-checkbox
                                                            label="Avoid Tolls"
                                                            v-model="options.avoidTolls"
                                                    ></v-checkbox>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-flex>

                                <v-flex xs12 sm8>
                                    <v-container fluid>
                                        <!--Google Maps element-->
                                        <div class="google-map" id="map">Google Maps</div>
                                    </v-container>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                    <div class="bottomMargin"></div>
                </v-stepper-content>
                <v-stepper-content  step="3">
                    <v-card class="mb-3 stepperContent" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step3}}</p>
                                    <v-icon dark>forward</v-icon>
                                </v-btn>
                                <div>{{subtitles.step3}}</div>
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
                                    ></v-date-picker>
                                </v-flex>
                                <!--Time Picker-->
                                <v-flex xs10 offset-xs1 sm4 offset-sm2 class="mb-3">
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
                </v-stepper-content>
                <v-stepper-content  step="4">
                    <v-card class="mb-3 stepperContent" flat>
                        <v-card-text class="text-xs-center stepTitleWrapper">
                            <div>
                                <p class="display-1 stepTitle">{{titles.step4}}</p>
                                    <v-icon dark>send</v-icon>
                                </v-btn>
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
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-toolbar fixed flat class="bottomToolbar">
            <v-toolbar-items style="width: 100%;" >
                <v-fab-transition>
                    <v-btn
                    color="accent"
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
                    color="accent"
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
                            color="success"
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
    import mapStyles from './../shared/maps/map-styles'

    export default {
        data () {
            return {
                step: 1,
                initialized: false,
                titles: {
                    step1: 'Vehicle',
                    step2: 'Route',
                    step3: 'When',
                    step4: 'Additionals'
                },
                subtitles: {
                    step1: 'Please choose the type of vehicle',
                    step2: '',
                    step3: 'Choose when you plan on taking this trip',
                    step4: 'Enter any additional information about the trip'
                },
                /** Step 1 */
                vehicle: null,
                /** Step 2 */
                startPoint: {id: 'startPoint', placeholder: 'Starting location', location: null, address: null},
                endPoint: {id: 'endPoint', placeholder: 'Target destination', location: null, address: null},
                wayPoints: [],
                displayedWayPoints: [],
                distance: null,
                duration: null,
                showInfoText: false,
                map: null,
                mapId: "map",
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
                markers: [],
                directionsService: new google.maps.DirectionsService,
                directionsDisplay: new google.maps.DirectionsRenderer,
                options: {
                    avoidFerries: false,
                    avoidHighways: false,
                    avoidTolls: false,
                },
                /** Step 3 */
                date: null,
                time: null,
                /** Step 4 */
                title: null,
                description: null,
            }
        },
        watch: {
            'options.avoidHighways': 'calculateAndDisplayRoute',
            'options.avoidTolls': 'calculateAndDisplayRoute',
            'options.avoidFerries': 'calculateAndDisplayRoute',
            step (value) {
                if (value === 2) {
                    this.initMap()
                }
            }
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
                const self = this;

                // Google maps
                $(document).ready(() => {
                    this.map = new google.maps.Map(document.getElementById(this.mapId), this.mapOptions);
                    this.addSearchBox(this.startPoint.id, this.startPoint.placeholder)
                    this.addSearchBox(this.endPoint.id, this.endPoint.placeholder)
                })
            },
            getWayPointId () {
               return 'waypoint' + this.wayPoints.length;
            },
            addWayPoint (id, placeholder) {
                this.wayPoints.push({location: null, address: null, id: id, placeholder: placeholder})
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
                                self.wayPointPlaceFound(input, place)
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
            wayPointPlaceFound(input, place) {
                let wayPoint = this.wayPoints.find((current) => {
                    return current.id === input.id
                })

                if (wayPoint !== undefined) {
                    wayPoint.address = place.formatted_address
                    wayPoint.location = place.geometry.location
                    this.calculateAndDisplayRoute();
                }
            },
            calculateAndDisplayRoute() {
                if (this.startPoint.location !== null
                    && this.endPoint.location !== null)
                {
                    const self = this;

                    this.directionsDisplay.setMap(null)
                    this.directionsDisplay.setMap(this.map);
                    this.distance = null

                    // wayPoints
                    self.displayedWayPoints = []
                    for (let i = 0; i < this.wayPoints.length; i++) {
                        if (this.wayPoints[i].location) {
                            self.displayedWayPoints.push({
                                location: this.wayPoints[i].location,
                                stopover: true
                            });
                        }
                    }

                    // determine the travelmode bases on the selected vehicle
                    let travelMode = this.vehicle === 'bicycle' ? 'BICYCLING' : 'DRIVING'

                    this.directionsService.route({
                        origin: self.startPoint.location,
                        destination: self.endPoint.location,
                        waypoints: self.displayedWayPoints,
                        optimizeWaypoints: false,
                        travelMode: travelMode,
                        provideRouteAlternatives: false,
                        avoidFerries: self.options.avoidFerries,
                        avoidHighways: self.options.avoidHighways,
                        avoidTolls: self.options.avoidTolls,
                    }, function(response, status) {
                        if (status === 'OK') {
                            self.directionsDisplay.setDirections(response)

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
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
                }
            },
            swapWayPoints(index) {
                if ((this.wayPoints.length - 1) > index) {
                    // swap 2 waypoints
                    var topWayPoint = this.wayPoints[index];
                    this.wayPoints[index] = this.wayPoints[(index + 1)];
                    this.wayPoints[(index + 1)] = topWayPoint;

                    // workaround for Vue to call updated()
                    this.wayPoints.push({})
                    this.wayPoints.splice(-1, 1)

                    console.log(this.wayPoints)
                    this.calculateAndDisplayRoute()
                }
            },
            /** Step 3 */

            /** Step 4 */
            saveExplore () {
                // transform waypoints to the right db format
                let wayPoints = []
                for (let i = 0;i < this.wayPoints.length; i++) {
                    wayPoints.push({
                        location: {
                            lat: this.wayPoints[i].location.lat(),
                            lng: this.wayPoints[i].location.lng()
                        },
                        address: this.wayPoints[i].address
                    })
                }

                // create the db model
                const explore = {
                    vehicle: this.vehicle,
                    startPoint: {
                        location: {
                            lat: this.startPoint.location.lat(),
                            lng: this.startPoint.location.lng()
                        },
                        address: this.startPoint.address
                    },
                    endPoint: {
                        location: {
                            lat: this.endPoint.location.lat(),
                            lng: this.endPoint.location.lng()
                        },
                        address: this.endPoint.address
                    },
                    options: this.options,
                    wayPoints: wayPoints,
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
                    this.$router.push({name: 'Explores'})
                    this.$store.dispatch('successMessage', 'Explore Organized!')
                }, error => {
                    this.$store.dispatch('errorMessage', error.message)
                })
            },
        },
        computed: {
            stepCompleted () {
                return this.step === 1 && this.step1Completed ||
                        this.step === 2 && this.step1Completed && this.step2Completed ||
                        this.step === 3 && this.step1Completed && this.step2Completed && this.step3Completed

            },
            step1Completed () {
                return this.vehicle !== null
                    && this.vehicle !== undefined
                    && this.vehicle !== ''
            },
            step2Completed () {
                return this.startPoint.location !== null
                    && this.startPoint.location !== undefined
                    && this.startPoint.location !== ''
                    && this.startPoint.address !== null
                    && this.startPoint.address !== undefined
                    && this.startPoint.address !== ''
                    && this.endPoint.location !== null
                    && this.endPoint.location !== undefined
                    && this.endPoint.location !== ''
                    && this.endPoint.address !== null
                    && this.endPoint.address !== undefined
                    && this.endPoint.address !== ''
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
            if (this.step === 2) {
                this.initMap()
            }
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
        height: 400px;
        margin: 0 auto;
        background: gray;
    }
    .noMargin {
        margin: 0!important;
    }
    .noPadding {
        padding: 0!important;
    }
    .bottomToolbar {
        text-align: center;
        top: auto;
        bottom: 0;
        background: #fff;
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
</style>