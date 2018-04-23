<template>
    <v-flex xs12 sm8 md9>
        <div class="map" :id="id">Maps</div>

        <div id="map-actions">
            <div v-for="(item, index) in actions.items" :key="index" class="map-action">
                <v-btn
                        class="scale"
                        style="margin-left: 15px;"
                        round
                        dark
                        small
                        color="secondary"
                        @click="item.action"
                >
                    {{item.name}}
                </v-btn>
            </div>
        </div>

        <v-btn
                id="location-btn"
                v-show="myPosition"
                color="secondary"
                dark
                fab
                absolute
                @click="center"
                slot="activator"
        >
            <v-icon>location_on</v-icon>
        </v-btn>

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
                    items: [
                        { name: 'popular', action : this.getPopularExplores },
                        { name: 'recent', action : this.getRecentExplores },
                        { name: 'nearby', action : this.getNearbyExplores },
                    ]
                }
            }
        },
        methods: {
            initMap () {
                let self = this
                this.map = mapFunctions.init(document.getElementById(this.id), this.options)
                this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("map-actions"))
                this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById("location-btn"))

                mapFunctions.getMyPosition(this.map).then(position => {
                    self.myPosition = position
                }, () => {})

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
                this.center()
            },
            center () {
                this.map.setZoom(7)

                if (this.myPosition) {
                    this.map.panTo(this.myPosition)
                } else {
                    this.map.panTo(this.options.center)
                }
            },
            getPopularExplores () {
                let explores = this.explores
                let sorted = explores.sort((a,b) => {
                        // sort explores based on joined riders count
                        return (a.riders.length > b.riders.length) ? 1 : ((b.riders.length > a.riders.length) ? -1 : 0)
                    })
                let populars = sorted.slice(sorted.length - 5)

                this.renderExplores(populars)
            },
            getRecentExplores () {

            },
            getNearbyExplores () {

            }
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
        margin-top: 10px;
    }
    #location-btn {
        margin: 10px;
    }
</style>