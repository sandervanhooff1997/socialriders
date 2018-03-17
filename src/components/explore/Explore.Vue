<template>
        <div class="text-xs-center">
            <v-layout row v-if="error">
                <v-flex xs12 offset-sm3 sm6>
                    <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
                </v-flex>
            </v-layout>
            <!--Only show Google Maps component if all assets are loaded (async)-->
            <google-map v-if="explores" :explores="explores"></google-map>
            <v-container v-else >
                <v-progress-circular style="text-align: center;" indeterminate :size="120" color="info">Loading Google Maps</v-progress-circular>
            </v-container>
        </div>
</template>

<script>
    import GoogleMap from './GoogleMap'

    export default {
        components: {
          GoogleMap
        },
        methods: {
            onDismissed () {
                this.$store.dispatch('clearError')
            }
        },
        computed: {
            error () {
                return this.$store.getters.error
            },
            explores () {
                return this.$store.getters.explores
            }
        },
        mounted () {
            this.$store.dispatch('fetchExplores')
        }
    }
</script>