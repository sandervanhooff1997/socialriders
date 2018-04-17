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
                        <v-card>
                            <v-card-title primary-title>
                                <div>
                                    <h3 class="headline mb-0">{{experience.title}}</h3>
                                    <v-list two-line>
                                        <v-list-tile avatar>
                                            <v-list-tile-avatar>
                                                <v-icon>date_range</v-icon>
                                            </v-list-tile-avatar>
                                            <v-list-tile-content>
                                                <v-list-tile-title>{{experience.startPoint.address}}</v-list-tile-title>
                                                <v-list-tile-sub-title>{{experience.date | date}}</v-list-tile-sub-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </div>
                            </v-card-title>
                            <v-card-actions>
                                <v-btn round color="primary" :to="{name: 'Experience', params: {id: experience.id}}">View</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    export default {
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