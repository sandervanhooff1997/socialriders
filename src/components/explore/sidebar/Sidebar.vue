<template>
    <v-flex xs12 sm4 md3>
        <v-container fluid>
            <selected
                    ref="explore"
                    v-if="selectedExplore"
                    :selectedExplore="selectedExplore"
            ></selected>
            <filters
                    ref="filters"
                    v-else
                    :explores="explores"
            ></filters>
        </v-container>
    </v-flex>
</template>

<script>
    import Selected from './Selected'
    import Filters from './Filters'

    export default {
        props: ['selectedExplore', 'explores'],
        components: {
            Selected, Filters
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
    }
</script>