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
    import * as mapFunctions from '../../shared/maps/map-functions'
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

                this.map = mapFunctions.init(this.id, this.options)

                this.myPosition = mapFunctions.getMyPosition(this.map)

                mapFunctions.initSearchInput(this.map, document.getElementById('search-input'))

                this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('map-actions'))

                // Render explores
                self.$parent.filterExplores()
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
                this.directionsDisplay.setMap(null)
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