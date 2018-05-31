<template>
    <div style="height: 100%; width: 100%;">
        <div class="map" :id="id">
            <loader></loader>
        </div>

        <input type="text" id="search-input" class="" placeholder="Search Google Maps">

        <!--<div id="map-actions">-->
            <!--<div v-for="(item, index) in actions.items" :key="index" class="map-action">-->
                <!--<v-btn-->
                        <!--class="scale"-->
                        <!--style="margin-left: 15px;"-->
                        <!--round-->
                        <!--dark-->
                        <!--small-->
                        <!--color="secondary"-->
                        <!--@click="item.action"-->
                        <!--v-show="item.showOnMyPosition && myPosition || !item.showOnMyPosition"-->
                <!--&gt;-->
                    <!--{{item.name}}-->
                <!--</v-btn>-->
            <!--</div>-->
        <!--</div>-->

        <v-speed-dial
                v-model="fab"
                id="fab-menu"
                direction="bottom"
                transition="slide-y-reverse-transition"
        >
            <v-btn
                    slot="activator"
                    v-model="fab"
                    color="primary"
                    style="margin: 0;"
                    fab
            >
                <v-icon>menu</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-tooltip right>
                <v-btn
                        slot="activator"
                        id="location-btn"
                        v-show="myPosition"
                        color="primary"
                        small
                        fab
                        @click="center"
                >
                    <v-icon>gps_fixed</v-icon>
                </v-btn>
                <span>Move to my location</span>
            </v-tooltip>
        </v-speed-dial>
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
                    styles: mapStyles.default,
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
                fab: false
            }
        },
        methods: {
            initMap () {
                let self = this
                this.map = mapFunctions.init(document.getElementById(this.id), this.options)

                this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("map-actions"))
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById("fab-menu"))
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById("search-input"))

                mapFunctions.initSearchInput(this.map, document.getElementById('search-input'))

                mapFunctions.getMyPosition(this.map).then(position => {
                    self.myPosition = position
                }, () => {})

                this.renderExplores(this.explores)
                if (this.selectedExplore) {
                    this.showRoute(this.selectedExplore)
                }
            },
            renderExplores (explores) {
                const self = this

                this.clearMarkers()
                explores.forEach(explore => {
                    const marker = self.addMarker(explore.origin.location)
                    self.addClickToShowRoute(marker, explore)
                })
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
                this.resetZoom()
            },
            resetZoom() {
                this.map.setZoom(this.options.zoom)
            },
            center () {
                this.resetZoom()
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

            },
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
    #fab-menu {
        margin: 10px 0 0 10px;
    }

    #search-input {
        margin-top: 20px;
        margin-left: 10px;
        background: #fff;
        padding: 10px;
        border: 0;
        color: #888888;
        font-family: 'Poppins', sans-serif!important;
        width: 300px;
        max-width: 300px;
        font-size: 15px;
        text-overflow: ellipsis;
        outline: none;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        -ms-transition: all .35s ease-in-out;
        -o-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    #search-input::placeholder {
        color: #888888;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        -ms-transition: all .35s ease-in-out;
        -o-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    #search-input:focus, #search-input:focus::placeholder {
        color: #000;
    }

    @media screen and (max-width: 960px) {
        #search-input {
            width: 80%;
            width: calc(100% - 152px);
        }
    }

    /*@media screen and (max-width: 600px) {*/
        /*#search-input {*/
            /*display: none;*/
        /*}*/
    /*}*/
</style>