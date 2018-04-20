<template>
    <v-flex xs12 sm8 md9>
        <div class="map" :id="id">Maps</div>

        <div id="map-actions">
            <div v-for="(item, index) in actions.items" :key="index" class="map-action">
                <v-btn
                        class="scale"
                        style="margin-left: 25px;"
                        round
                        dark
                        small
                        color="primary"
                >
                    {{item}}
                </v-btn>
            </div>
        </div>
    </v-flex>
</template>

<script>
    import * as mapFunctions from '@/assets/maps/map-functions'
    import mapStyles from '@/assets/maps/map-styles'

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
                directionsService: mapFunctions.directionsService,
                directionsRenderer: mapFunctions.directionsRenderer,
                actions: {
                    on: false,
                    items: ['popular', 'recent', 'nearby']
                }
            }
        },
        methods: {
            initMap () {
                this.map = mapFunctions.init(document.getElementById(this.id), this.options)
                this.myPosition = mapFunctions.getMyPosition(this.map)
                this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("map-actions"))
                mapFunctions.initSearchInput(this.map, document.getElementById('search-input'))

                // Render explores
                this.$parent.filterExplores()
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
                    self.addClickToShowRoute(marker, explore)
                })
            },
            addMarker (pos) {
                const marker = mapFunctions.addMarker(this.map, pos)
                this.markers.push(marker)
                return marker
            },
            addClickToShowRoute (marker, explore) {
                const self = this
                marker.addListener('click', function() {
                    self.showRoute(explore)
                });
            },
            showRoute(explore) {
                this.$parent.setSelectedExplore(explore)
                mapFunctions.calculateAndDisplayRoute(this.map, explore)
            },
            hideRoute(){
                this.$parent.clearSelectedExplore()
                mapFunctions.clearRoute()
                this.map.setZoom(7)
            },

        },
        computed: {
            selectedExplore() {
                return this.$parent.selectedExplore
            }
        },
        mounted () {
            this.initMap()
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
    #map-actions {
        margin-top: 15px;
    }
</style>