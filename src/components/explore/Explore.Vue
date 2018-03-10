<template>
    <div style="width: 100%;">
        <gmap-map
                :center="{lat: center.lat, lng: center.lng}"
                :zoom="zoom"
                :options="{styles: styles}"
                class="map">
            <gmap-marker
                    v-if="explores"
                    :key="index"
                    v-for="(explore, index) in explores"
                    :position="explore.location"
                    :clickable="true"
                    @click="center=explore.location"
            ></gmap-marker>
            <gmap-marker
                    v-if="currentLocationFetched"
                    :position="center"
                    :clickable="true"
                    @click="center=center"
            ></gmap-marker>
        </gmap-map>
    </div>
</template>

<script>
    import Vue from 'vue'
    import * as VueGoogleMaps from 'vue2-google-maps'

    Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyAC9MaB6QrqhIRNdXwtE7noNUFtq0BxcH4',
            libraries: 'places', // This is required if you use the Autocomplete plugin
            // OR: libraries: 'places,drawing'
            // OR: libraries: 'places,drawing,visualization'
            // (as you require)
        },

    })

    export default {
        data () {
            return {
                center: {lat: 52.38, lng: 4.90}, // default location is Amsterdam
                zoom: 8,
                currentLocationFetched: false,
                styles: [
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.business",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    }
                ]
            }
        },
        computed: {
            explores () {
                return this.$store.getters.explores
            }
        },
        methods: {
            getLocation: function() {
                if (navigator.geolocation) {
                    var options = {
                        enableHighAccuracy: true,
                        timeout: 5000
                    };
                    navigator.geolocation.getCurrentPosition(this.changeLocation, this.error, options)
                } else {
                    return false
                }
            },
            changeLocation: function (pos) {
                this.center.lat = pos.coords.latitude;
                this.center.lng = pos.coords.longitude;
                this.currentLocationFetched = true;
            }
        },
        created: function() {
            this.getLocation()
            this.$store.dispatch('fetchExplores')
        }
    }
</script>

<style scoped>
    .map {
        width: 100%;
        height: 100%;
    }
</style>