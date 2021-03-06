<template>
    <div class="text-xs-center">
        <div class="fillHeight" style="position: relative;">
            <v-layout fill-height row wrap>
                <div id="sidebar" class="sidebar-overlay-inverse" :class="{hidden: !menu}">
                    <sidebar
                            class="sidebar-content"
                            style="background: none;"
                            ref="sidebar"
                            :explores="explores"
                            :selectedExplore="selectedExplore"
                            @onHideRoute="hideRoute"
                            @onShowRoute="showRoute"
                            @onRenderExplores="renderExplores">
                    </sidebar>
                    <v-btn
                            color="primary"
                            @click="menu = !menu"
                            class="menu-toggler"
                            dark
                            absolute
                            bottom
                            right
                            fab
                    >
                        <v-icon v-if="menu">keyboard_arrow_left</v-icon>
                        <v-icon v-else>keyboard_arrow_right</v-icon>
                    </v-btn>
                </div>

                <div id="google-map" :class="{hidden: !menu}">
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
                selectedExplore: null,
                menu: true,
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
            getMaxDistanceFromStore() {
                let self = this
                // select the highest distance of all explores to be the max slider value
                if (!this.maxDistance){
                    this.$store.dispatch('getMaxDistance').then(distance => {
                        self.$refs.sidebar.setMaxDistance(distance)
                    }).catch(error => {
                        console.log(error.message)
                    })
                } else {
                    self.$refs.sidebar.setMaxDistance(this.maxDistance)
                }
            },
            getMaxDurationFromStore() {
                let self = this
                // select the highest duration of all explores to be the max slider value
                if (!this.maxDuration){
                    this.$store.dispatch('getMaxDuration').then(duration => {
                        self.$refs.sidebar.setMaxDuration(duration)
                    }).catch(error => {
                        console.log(error.message)
                    })
                } else {
                    self.$refs.sidebar.setMaxDuration(this.maxDuration)
                }
            }
        },
        computed: {
            explores () {
                return this.$store.getters.explores
            },
            exploresLength () {
                return this.explores ? this.explores.length : 0
            },
            maxDistance () {
                return this.$store.getters.maxDistance
            },
            maxDuration () {
                return this.$store.getters.maxDuration
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
        },
        watch: {
            exploresLength () {
                this.hideRoute()
                this.renderExplores(this.explores)
            }
        },
        mounted () {
            if (!this.explores) {
                this.$store.dispatch('getExplores').then(explores => {}, error => { })
            }

            if (this.$route.params.selectedExplore) {
                this.setSelectedExplore(this.$route.params.selectedExplore)
                this.showRoute(this.$route.params.selectedExplore)
            }

            this.getMaxDistanceFromStore()
            this.getMaxDurationFromStore()
        },
    }
</script>

<style scoped>
    .fillHeight {
        height: 100%;
    }

    #google-map.hidden {
        width: 100%;
    }

    #sidebar, #google-map {
        position: relative;
        float: left;
    }

    #sidebar.hidden {
        width: 0px;
    }

    #sidebar.hidden .sidebar-content {
        display: none;
    }

    #sidebar.hidden .menu-toggler {
        left: 10px;
    }

    .menu-toggler {
        bottom: 10px;
        right: -28px;
    }


    @media screen and (min-width: 960px) {
        #google-map{
            width: 70%;
        }
        #sidebar {
            width: 30%;
            z-index: 1;
        }
    }

    @media screen and (max-width: 960px) and (min-width: 600px) {
        #google-map{
            width: 60%;
        }
        #sidebar {
            width: 40%;
        }
    }

    @media screen and (max-width: 600px) {
        #google-map{
            width: 20%;
        }
        #sidebar {
            width: 80%;
            z-index: 1;
        }
    }
</style>