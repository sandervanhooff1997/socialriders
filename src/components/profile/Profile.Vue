<template>
    <div>
        <div v-if="user">
            <v-jumbotron dark style="height: 160px; padding-top: 20px;">
                <v-container fill-height>
                    <v-layout align-center>
                        <v-flex text-xs-center>
                            <v-avatar size="90" class="grey lighten-4">
                                <img :src="user.photoUrl" :alt="user.name">
                            </v-avatar>
                            <h3 class="thinText" style="font-size: 2em;">{{user.name}}</h3>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-jumbotron>

            <v-tabs
                    slot="extension"
                    v-model="tab"
                    grow
            >
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab v-for="item in items" :key="item">
                    {{ item }}
                </v-tab>
            </v-tabs>
            <div class="topSpacing"></div>
            <v-tabs-items v-model="tab" class="fillHeight bottomSpacing">
                <v-tab-item class="fillHeight">
                    <v-container grid-list-xl>
                        <v-layout row wrap>
                            <v-flex
                                    xs12 sm6 md4
                                    v-if="explores"
                                    v-for="(explore, index) in explores"
                                    :key="index">
                                <v-card class="light-card">
                                    <trip-details :explore="explore" :isExplore="true" :isOverview="true"></trip-details>
                                </v-card>
                            </v-flex>
                            <loader v-else></loader>
                            <p v-if="explores && explores.length === 0">{{user.name}} has not planned any trips.</p>
                        </v-layout>
                    </v-container>
                </v-tab-item>
                <v-tab-item class="fillHeight">
                    <v-container grid-list-xl>
                        <v-layout row wrap>
                            <v-flex
                                    xs12 sm6 md4
                                    v-if="experiences"
                                    v-for="(experience, index) in experiences"
                                    :key="index">
                                <v-card class="light-card">
                                    <trip-details :explore="experience" :isExplore="false" :isOverview="true"></trip-details>
                                </v-card>
                            </v-flex>
                            <loader v-else></loader>
                            <p v-if="experiences && experiences.length === 0">{{user.name}} has not participated any trips.</p>
                        </v-layout>
                    </v-container>
                </v-tab-item>
            </v-tabs-items>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    import TripDetails from '@/components/shared/TripDetails'
    import Loader from '@/components/shared/Loader'

    export default {
        components: {
            TripDetails,
            Loader
        },
        data () {
            return {
                uid: this.$route.params.uid,
                user: null,
                experiences: null,
                explores: null,
                tab: null,
                items: [
                    'explores', 'experiences'
                ],
            }
        },
        watch: {
            exploresFromStore () {
                this.getMyExplores()
                this.getMyExperiences()
            }
        },
        computed: {
            getUser () {
                return this.$store.getters.user
            },
            itsMe () {
                return this.getUser.uid === this.uid
            },
            loadError () {
                this.$store.dispatch('errorMessage', 'Error loading profile')
                this.$router.push('/')
            },
            exploresFromStore () {
                return this.$store.getters.explores
            }
        },
        methods: {
            getMyExplores () {
                this.$store.dispatch('getExploresByUser', this.uid).then(explores => {
                    this.explores = explores
                }, error => {
                    this.$store.dispatch('errorMessage', error)
                })

            },
            getMyExperiences () {
                this.$store.dispatch('getExperiencesByUser', this.uid).then(experiences => {
                    this.experiences = experiences
                }, error => {
                    this.$store.dispatch('errorMessage', error)
                })
            }
        },
        mounted () {
            let profile = this.$route.params.profile;

            if (!this.uid) {
                this.loadError()
                return
            }

            if (this.itsMe) {
                // user from vuex
                this.user = this.getUser
            } else {
                // user from route params
                if (!profile) {
                    this.loadError()
                    return
                }

                this.user = profile
            }

            this.getMyExplores()
            this.getMyExperiences()
        }
    }
</script>

<style scoped>
    .avatar {
        -webkit-box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
        -moz-box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
        box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
    }
    .fillHeight {
        height: 100%;
    }
    .topSpacing {
        padding-top: 10px;
    }
    .bottomSpacing {
        padding-bottom: 50px;
    }
</style>