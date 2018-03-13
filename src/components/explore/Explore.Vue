<template>
    <div>
        <!--Only show Google Maps component if all assets are loaded (async)-->
        <google-map v-if="explores" :explores="explores"></google-map>
        <v-container v-else justify-center >
            <v-progress-circular style="text-align: center;" indeterminate :size="120" color="success">Loading Google Maps</v-progress-circular>
        </v-container>
    </div>
</template>

<script>
    import GoogleMap from './GoogleMap'

    export default {
        components: {
          GoogleMap
        },
        computed: {
            explores () {
                return this.$store.getters.explores
            }
        },
        mounted () {
            this.$store.dispatch('fetchExplores')
        }
    }
</script>