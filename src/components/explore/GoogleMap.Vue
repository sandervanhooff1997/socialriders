<template>
    <div style="width: 100%; height: 100%;">
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
    import mapStyles from './map-styles'

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
                    center: {lat: 	52.379189, lng: 4.899431},
                    zoom: 7,
                    styles: mapStyles.default
                },
                markers: [], // all map markers
                infoWindows: [],
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
                }
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
            addInfoWindow (marker, explore) {
                const content =
                    "<h1>" + explore.title + "</h1>" +
                    "<p>" + explore.description + "</p>";
                const infowindow = new google.maps.InfoWindow({
                    content: content
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            },
            /**
             * Returns the difference in days between the given date and today
             */
            getMarkerIcon (date) {
                const today = new Date()
                const exploreDate = new Date(date)
                const diffInDays = new DateDiff(today, exploreDate).days()

                if (diffInDays < 30) {
                    return greenMarker
                } else if (diffInDays >= 30 && diffInDays <= 60) {
                    return yellowMarker
                } else {
                    return redMarker
                }
            }
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
            for (var key in this.icons) {
                const type = this.icons[key];
                const name = type.name;
                const icon = type.icon;
                const div = document.createElement('div');

                div.innerHTML = '<img style="vertical-align: middle" src="' + icon + '"> ' + name;
                legend.appendChild(div);
            }
            this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

            // Render explores
            this.explores.forEach((explore) => {
                const icon = this.getMarkerIcon(explore.date)
                const marker = this.addMarker(explore.location, icon)
                this.addInfoWindow(marker, explore)
            })

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
                    this.addMarker({lat: position.coords.latitude, lng: position.coords.longitude}, homeMarker)
                })
                .catch((err) => {
                    console.error("Error fetching current position: " + err.message);
                });
        }
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
    }
    #legend .legendDevider {
        margin: 5px 0;
    }
</style>