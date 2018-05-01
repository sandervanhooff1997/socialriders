<template>
    <div style="height: 100%;">
        <div class="map" :id="id">
            <loader></loader>
        </div>

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
                        v-show="item.showOnMyPosition && myPosition || !item.showOnMyPosition"
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
    </div>
</template>

<script>
    import * as mapFunctions from '@/assets/maps/map-functions'
    import mapStyles from '@/assets/maps/map-styles'

    export default {
        name: 'google-map',
        props: ['explores', 'selectedExplore'],
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
                        { name: 'All', action : this.getAllExplores, showOnMyPosition: false },
                        { name: 'Popular', action : this.getPopularExplores, showOnMyPosition: false },
                        { name: 'Nearby', action : this.getNearbyExplores, showOnMyPosition: true },
                    ]
                },
                boundsExplores: [],
                boundsChangedTimeout: null,
                boundsChangedInterval: 1000
            }
        },
        watch: {
            boundsExplores () {
                this.$emit('onSetBoundsExplores', this.boundsExplores)
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

                if (this.selectedExplore) {
                    this.showRoute(this.selectedExplore)
                }

                this.map.addListener('bounds_changed', () => {
                    this.onBoundsChanged()
                })
            },
            onBoundsChanged() {
                if (this.map.getZoom() >= this.options.zoom) {
                    let self = this
                    let bounds = this.map.getBounds()
                    let NE = bounds.getNorthEast()
                    let SW = bounds.getSouthWest()

                    // clear previous timer
                    if (this.boundsChangedTimeout) {
                        clearTimeout(this.boundsChangedTimeout)
                    }

                    // filter all explores within map bounds
                    this.boundsChangedTimeout = setTimeout(function() {
                        self.boundsExplores = self.explores.filter(explore => {
                            return explore.startPoint.location.lat >= SW.lat()
                                && explore.startPoint.location.lat <= NE.lat()
                                && explore.startPoint.location.lng >= SW.lng()
                                && explore.startPoint.location.lng <= NE.lng()
                        })

                        self.renderExplores(self.boundsExplores)
                    }, this.boundsChangedInterval)
                }
            },
            renderExplores (explores) {
                const self = this

                this.clearMarkers()
                setTimeout(() => {
                    explores.forEach(explore => {
                        const marker = self.addMarker(explore.startPoint.location)
                        self.addClickToShowRoute(marker, explore)
                    })
                }, 100)
            },
            clearMarkers () {
                if (this.markers.length > 0) {
                    this.markers.forEach(marker => {
                        marker.setMap(null)
                    })
                    this.markers = []
                }
            },
            addMarker (pos) {
                const marker = mapFunctions.getMarker(this.map, pos)
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
                this.$emit('onSetSelectedExplore', explore)
                mapFunctions.calculateAndDisplayRoute(this.map, explore)
            },
            hideRoute(){
                this.$emit('onClearSelectedExplore')
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
            getAllExplores () {
                this.$emit('onRemoveAllFilters')
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
            getNearbyExplores () {

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
        min-height: 500px;
    }
    #map-actions {
        margin-top: 10px;
    }
    #location-btn {
        margin: 10px;
    }
</style>