<template>
    <div class="text-xs-center">
        <div v-if="loaded" class="fillHeight">
            <v-layout fill-height row wrap>
                <v-flex xs12 sm4 md3>
                    <sidebar
                            ref="sidebar"
                            :explores="boundsExplores"
                            :selectedExplore="selectedExplore"
                            @onHideRoute="hideRoute"
                            @onRenderExplores="renderExplores">
                    </sidebar>
                </v-flex>

                <v-flex xs12 sm8 md9>
                    <google-map
                            ref="map"
                            :explores="explores"
                            :selectedExplore="selectedExplore"
                            @removeAllFilters="removeAllFilters"
                            @onSetSelectedExplore="setSelectedExplore"
                            @onClearSelectedExplore="clearSelectedExplore"
                            @onSetBoundsExplores="setBoundsExplores">
                        <loader></loader>
                    </google-map>
                </v-flex>
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
                boundsExplores: []
            }
        },
        methods: {
            hideRoute() {
                this.$refs.map.hideRoute()
            },
            renderExplores (explores) {
                this.$refs.map.renderExplores(explores)
            },
            setBoundsExplores (explores) {
                this.boundsExplores = explores
                this.$refs.sidebar.setBoundsExplores(explores)
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
            }
        },
        computed: {
            explores () {
                return this.$store.getters.explores
            },
        },
        mounted () {
            if (this.explores) {
                this.load()
            } else {
                this.$store.dispatch('getExplores').then(explores => {
                    this.load()
                }, error => { })
            }
        },
    }
</script>

<style scoped>
    .fillHeight {
        height: 100%;
    }
</style>