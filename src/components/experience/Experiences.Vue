<template>
    <div>
        <div v-if="experiences">
            <v-jumbotron dark style="height: 220px;">
                <v-container fill-height>
                    <v-layout align-center>
                        <v-flex text-xs-center>
                            <h3 class="display-3 thinText">Experience</h3>
                            <span class="subheading thinText">Share your experiences with other drivers</span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-jumbotron>

            <v-container grid-list-xl>
                <v-layout row wrap class="mb-3">
                    <p v-if="experiences.length === 0">
                        We couldn't find any Experiences, be the first to
                        <router-link :to="{name: 'Organize'}">organize a trip.</router-link>
                    </p>
                    <v-flex xs12 sm6 md4
                            v-for="(experience, index) in experiences"
                            v-else
                            :key="experience.title + index">
                        <v-card class="light-card">
                            <trip-details :explore="experience" :isExplore="false" :isOverview="true"></trip-details>
                        </v-card>
                    </v-flex>
                    <mugen-scroll v-if="!allLoaded" :handler="fetchData" :should-handle="!loading">
                        <loader></loader>
                    </mugen-scroll>
                </v-layout>
            </v-container>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    import TripDetails from '../shared/TripDetails.vue'
    import MugenScroll from 'vue-mugen-scroll'

    export default {
        components: {
            TripDetails,
            MugenScroll
        },
        data() {
            // do not run handler when it's loading
            return {
                loading: false,
                loaded: 0,
                loadCount: 4,
                experiences: null,
            }
        },
        computed: {
            allLoaded () {
                if (this.experiences) {
                    return this.loaded > (this.getAllExplores.length - this.loadCount)
                }
                return false
            },
            getAllExplores () {
                return this.$store.getters.experiences
            }
        },
        methods: {
            fetchData() {
                // lazy load experiences
                this.loading = true
                let self = this

                this.$store.dispatch('getExperiencesLimited', (this.loaded += this.loadCount)).then(experiences => {
                    self.experiences = experiences
                }, () => { })

                this.loading = false
            }
        },
        mounted () {
            this.$store.dispatch('getExperiences').then(() => {
                this.fetchData()
            }, () => {})
        },
    }
</script>