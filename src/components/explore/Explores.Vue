<template>
    <div class="text-xs-center">
        <div v-if="loaded" class="fillHeight">
            <v-layout fill-height>
                <sidebar
                        ref="sidebar"
                        :explores="explores"
                        :selectedExplore="selectedExplore">
                </sidebar>

                <google-map
                        ref="map"
                        :explores="explores"
                        :selectedExplore="selectedExplore">
                    Error loading Google Maps
                </google-map>
            </v-layout>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    import GoogleMap from './googlemap/GoogleMap.vue'
    import Sidebar from './sidebar/Sidebar.vue'

    export default {
        components: {
            GoogleMap,
            Sidebar,
        },
        data() {
            return {
                loaded: false,
                selectedExplore: null,
            }
        },
        methods: {
            hideRoute() {
                this.$refs.map.hideRoute()
            },
            filterExplores () {
                this.$refs.sidebar.filterExplores()
            },
            renderExplores (explores) {
                this.$refs.map.renderExplores(explores)
            },
            setSelectedExplore (explore) {
                this.selectedExplore = explore
            },
            clearSelectedExplore () {
                this.selectedExplore = null
            }
        },
        watch: {
            explores (value) {
                if (value) {
                    this.loaded = true
                }
            }
        },
        computed: {
            explores () {
                return this.$store.getters.explores
            },
        },
        mounted () {
            this.$store.dispatch('getExplores')
        },
    }
</script>

<style scoped>
    .fillHeight {
        height: 100%;
    }
</style>