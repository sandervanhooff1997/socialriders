<template>
    <div>
        <v-card>
            <explore-details
                    :explore="explore"
                    :showTitle="true"
                    :showOwner="false"
                    :showMeta="true"
                    :showDescription="false"
                    :showHideRoute="false">
            </explore-details>
        </v-card>
    </div>
</template>

<script>
    import ExploreDetails from '@/components/shared/explore/Details'

    export default {
        props: ['explore'],
        components: {
            ExploreDetails
        }
    }
</script>