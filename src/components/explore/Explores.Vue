<template>
    <div class="text-xs-center">
        <div v-if="loaded" class="fillHeight" style="position: relative;">
            <v-layout fill-height row wrap>
                <div id="sidebar" class="sidebar-overlay-inverse" v-resize="onResize" :class="{active: !menu, mobile: mobile}">
                    <sidebar
                            ref="sidebar"
                            :explores="explores"
                            :selectedExplore="selectedExplore"
                            @onHideRoute="hideRoute"
                            @onShowRoute="showRoute"
                            @onRenderExplores="renderExplores">
                    </sidebar>
                    <v-btn
                            color="warning"
                            @click="menu = !menu"
                            class="fab-menu hidden-xs-only"
                            dark
                            absolute
                            bottom
                            right
                            fab
                    >
                        <v-icon v-if="menu">keyboard_arrow_left</v-icon>
                        <v-icon v-else>keyboard_arrow_right</v-icon>
                    </v-btn>

                    <v-btn
                            color="warning"
                            @click="menu = !menu"
                            class="fab-menu mobile hidden-sm-and-up"
                            dark
                            absolute
                            bottom
                            right
                            fab
                    >
                        <v-icon v-if="menu">keyboard_arrow_up</v-icon>
                        <v-icon v-else>keyboard_arrow_down</v-icon>
                    </v-btn>
                </div>

                <div id="google-map" :class="{active: !menu, mobile: mobile}">
                    <google-map
                            ref="map"
                            :explores="explores"
                            :selectedExplore="selectedExplore"
                            @removeAllFilters="removeAllFilters"
                            @onSetSelectedExplore="setSelectedExplore"
                            @onClearSelectedExplore="clearSelectedExplore">
                        <loader></loader>
                    </google-map>
                </div>
            </v-layout>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    import GoogleMap from './GoogleMap.vue'
    import Sidebar from './Sidebar.vue'

    export default {
        components: {
            GoogleMap,
            Sidebar,
        },
        data() {
            return {
                loaded: false,
                selectedExplore: null,
                menu: true,
                mobile: false
            }
        },
        methods: {
            showRoute(explore) {
                this.$refs.map.showRoute(explore)
            },
            hideRoute() {
                this.$refs.map.hideRoute()
            },
            renderExplores (explores) {
                this.$refs.map.renderExplores(explores)
            },
            removeAllFilters () {
                this.$refs.sidebar.removeAllFilters()
            },
            clearSelectedExplore() {
                this.selectedExplore = null
            },
            setSelectedExplore(explore) {
                this.selectedExplore = explore
            },
            load () {
                // important to first set loaded!
                this.loaded = true

                if (this.$route.params.selectedExplore) {
                    this.setSelectedExplore(this.$route.params.selectedExplore)
                }
            },
            onResize () {
                this.mobile = window.innerWidth < 600
            },
        },
        computed: {
            explores () {
                return this.$store.getters.explores
            },
            maxDistance () {
                return this.$store.getters.maxDistance
            },
            maxDuration () {
                return this.$store.getters.maxDuration
            }
        },
        mounted () {
            let self = this

            if (this.explores) {
                this.load()
            } else {
                this.$store.dispatch('getExplores').then(explores => {
                    this.load()
                }, error => { })
            }

            // select the highest distance of all explores to be the max slider value
            if (!this.maxDistance){
                this.$store.dispatch('getMaxDistance').then(distance => {
                    self.$refs.sidebar.setMaxDistance(distance)
                }).catch(error => {
                    this.$store.dispatch('errorMessage', error.message)
                })
            }

            // select the highest duration of all explores to be the max slider value
            if (!this.maxDuration){
                this.$store.dispatch('getMaxDuration').then(duration => {
                    self.$refs.sidebar.setMaxDuration(duration)
                }).catch(error => {
                    this.$store.dispatch('errorMessage', error.message)
                })
            }
        },
    }
</script>

<style scoped>
    .fillHeight {
        height: 100%;
    }

    #sidebar, #google-map {
        position: relative;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        -ms-transition: all .35s ease-in-out;
        -o-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }

    #google-map.mobile{
        width: 100%;
        height: 100%;
    }
    #sidebar.mobile {
        height: auto;
        width: 100%;
    }

    #sidebar.active {
        width: 0px!important;
    }
    #sidebar.active.mobile {
        width: 100%!important;
        height: 0px;
    }

    #sidebar.active * {
        opacity: 0;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        -ms-transition: all .35s ease-in-out;
        -o-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    #sidebar.active.mobile * {
        -webkit-transition: none;
        -moz-transition: none;
        -ms-transition: none;
        -o-transition: none;
        transition: none;
    }


    #sidebar.active .fab-menu {
        right: -71px;
    }
    #sidebar.active .fab-menu, #sidebar.active .fab-menu * {
        opacity: 1 !important;
    }

    #sidebar.active.mobile .fab-menu {
        top: 10px;
        right: 10px;
    }
    #sidebar.active.mobile .fab-menu, #sidebar.active.mobile .fab-menu * {
        opacity: 1 !important;
    }

    #google-map.active {
        width: 100% !important;
    }

    .fab-menu {
        bottom: 10px;
        right: -28px;
    }
    .fab-menu.mobile {
        bottom: -28px;
        right: 15px;
    }

    @media screen and (min-width: 960px) {
        #google-map{
            float: left;
            width: calc(100% - 400px);
            height: 100%;
        }
        #sidebar {
            float: left;
            height: 100%;
            width: 400px;
            z-index: 1;
        }
    }

    @media screen and (max-width: 960px) and (min-width: 600px) {
        #google-map{
            float: left;
            width: calc(100% - 300px);
            height: 100%;
        }
        #sidebar {
            float: left;
            height: 100%;
            width: 300px;
            z-index: 1;
        }
    }

    @media screen and (max-width: 600px) {
        #google-map{
            float: left;
            width: 100%;
            height: 100%;
        }
        #sidebar {
            float: left;
            height: auto;
            width: 100%;
            z-index: 1;
        }
    }
</style>