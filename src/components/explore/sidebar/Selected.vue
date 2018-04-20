<template>
    <!--ROUTE DETAILS-->
    <v-card flat dark style="background: none!important;">
        <explore-details
                :explore="selectedExplore"
                :showTitle="true"
                :showOwner="true"
                :showMeta="true"
                :showDescription="true"
                :showHideRoute="true"
                v-on:hideRoute="hideRoute">
        </explore-details>
    </v-card>
</template>

<script>
    import ExploreDetails from '@/components/shared/explore/Details'

    export default {
        props: ['selectedExplore'],
        components: {
            ExploreDetails
        },
        computed: {

        },
        methods: {
            hideRoute() {
                this.$parent.hideRoute()
            }
        }
    }
</script>

<style scoped>
    .discription {
        font-style: italic;
    }
</style>