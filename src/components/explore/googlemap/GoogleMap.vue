<template>
    <v-flex xs12 sm8 md9>
        <div class="map" :id="id">Maps</div>

        <v-speed-dial
                id="map-actions"
                v-model="actions.on"
                direction="bottom"
                left
                open-on-hover
                transition="slide-y-reverse-transition"
        >
            <v-btn
                    style="margin: 25px 0 0 25px;"
                    slot="activator"
                    color="yellow"
                    dark
                    fab
                    hover
                    v-model="actions.on"
            >
                <v-icon>info</v-icon>
                <v-icon>close</v-icon>
            </v-btn>

            <v-btn
                    v-for="(item, index) in actions.items"
                    :key="index"
                    style="margin-left: 25px;"
                    round
                    dark
                    small
                    color="accent"
            >
                {{item}}
            </v-btn>
        </v-speed-dial>
    </v-flex>
</template>

<script>
    import mapStyles from '../../shared/maps/map-styles'

    export default {
        name: 'google-map',
        props: ['explores'],
        data () {
            return {
                map: null,
                id: "map",
                options: {
                    center: {lat: 	52.379189, lng: 4.899431},
                    zoom: 7,
                    styles: mapStyles.retro,
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                },
                myPosition: null,
                markers: [],
                directionsService: new google.maps.DirectionsService,
                directionsDisplay: new google.maps.DirectionsRenderer,
                actions: {
                    on: false,
                    items: ['popular', 'recent', 'nearby']
                }
            }
        },
        methods: {
            initMap () {
                var self = this;

                // Google maps
                this.map = new google.maps.Map(document.getElementById(this.id), this.options);

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
                    self.$parent.filterExplores()
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
            addMarker (pos) {
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.lat, pos.lng),
                    map: this.map,
                    animation: google.maps.Animation.DROP
                })
                this.markers.push(marker)
                return marker
            },
            addInfoWindowClickListener (marker, explore) {
                const self = this;
                marker.addListener('click', function() {
                    self.showRoute(explore)
                });
            },
            showRoute(explore) {
                this.$parent.setSelectedExplore(explore)
                this.calculateAndDisplayRoute()
            },
            hideRoute(){
                this.$parent.clearSelectedExplore()
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
                        avoidFerries: self.selectedExplore.options.avoidFerries,
                        avoidHighways: self.selectedExplore.options.avoidHighways,
                        avoidTolls: self.selectedExplore.options.avoidTolls,
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
        computed: {
            selectedExplore() {
                return this.$parent.selectedExplore
            }
        },
        mounted () {
            this.initMap()
            if (this.selectedExplore) {
                this.showRoute(this.selectedExplore)
            }
        },
    }
</script>

<style scoped>
    .map {
        width: 100%;
        height: 100%;
        min-height: 400px;
        margin: 0 auto;
        background: gray;
    }
    .action-margin {
        margin-top: 25px;
        margin-left: 25px;
    }
</style>