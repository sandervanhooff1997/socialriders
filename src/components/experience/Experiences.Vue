<template>
    <div>
        <div v-if="experiences">
            <v-jumbotron dark style="height: 200px;">
                <v-container fill-height>
                    <v-layout align-center>
                        <v-flex text-xs-center>
                            <h3 class="display-3 thinText">Experience</h3>
                            <span class="subheading thinText">Share your experiences with other drivers</span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-jumbotron>

            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs12 sm6 md4 lg3 v-for="(experience, index) in experiences" :key="experience.title">
                        <card :experience="experience"></card>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    import Card from '../shared/experience/Card.vue'

    export default {
        components: {
            Card
        },
        computed: {
            experiences () {
                return this.$store.getters.experiences
            }
        },
        mounted () {
            if (this.experiences === null) {
                this.$store.dispatch('getExperiences')
            }
        },
    }
</script>