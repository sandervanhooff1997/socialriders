<template>
    <v-flex xs12 sm4 md3>
        <v-container fluid>
            <explore
                    ref="explore"
                    v-if="selectedExplore"
                    :selectedExplore="selectedExplore"
            ></explore>
            <filters
                    ref="filters"
                    v-else
                    :explores="explores"
            ></filters>
        </v-container>
    </v-flex>
</template>

<script>
    import Explore from './Explore'
    import Filters from './Filters'

    export default {
        components: {
            Explore, Filters
        },
        methods: {
            hideRoute() {
                this.$parent.hideRoute()
            },
            filterExplores () {
                this.$refs.filters.filterExplores()
            },
            renderExplores(explores) {
                this.$parent.renderExplores(explores)
            }
        },
        props: ['selectedExplore', 'explores'],
    }
</script>