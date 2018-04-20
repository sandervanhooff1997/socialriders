<template>
    <div>
        <div v-if="user">
            <v-jumbotron dark style="height: 200px;">
                <v-container fill-height>
                    <v-layout align-center>
                        <v-flex text-xs-center>
                            <v-avatar size="120" class="grey lighten-4">
                                <img :src="user.photoUrl" :alt="user.name">
                            </v-avatar>
                            <h3 class="display-3 thinText">{{user.name}}</h3>
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
            <v-tabs-items v-model="tab" class="fillHeight">
                <v-tab-item class="fillHeight">
                    <v-card flat class="fillHeight noBackground">
                        <v-container fill-height grid-list-md text-xs-center>
                            <v-layout>
                                <loader v-if="!experiences"></loader>
                                <v-flex xs12 sm6 md4 lg3
                                        v-else
                                        v-for="(experience, index) in experiences"
                                        :key="index">
                                    <experience-card :experience="experience"></experience-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-tab-item>
                <v-tab-item class="fillHeight">
                    <v-card flat class="fillHeight noBackground">
                        <v-container fill-height grid-list-md text-xs-center>
                            <v-layout>
                                <loader v-if="!explores"></loader>
                                <v-flex xs12 sm6 md4 lg3
                                         v-else
                                         v-for="(explore, index) in explores"
                                         :key="index">
                                    <explore-card :explore="explore"></explore-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-tab-item>
                <v-tab-item class="fillHeight">
                    <v-card flat class="fillHeight noBackground">
                        <v-container fill-height>
                            <v-layout>
                                <v-flex>
                                    <v-card-text>3</v-card-text>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </div>
        <loader v-else></loader>
    </div>
</template>

<script>
    import ExperienceCard from '@/components/shared/experience/Card'
    import ExploreCard from '@/components/shared/explore/Card'
    import Loader from '@/components/shared/Loader'

    export default {
        components: {
            ExperienceCard,
            ExploreCard,
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
                    'experiences', 'explores', 'social media'
                ],
            }
        },
        computed: {
            getUser () {
                return this.$store.getters.user
            },
            itsMe () {
                return this.getUser.uid === this.uid
            },
        },
        mounted () {
            let profile = this.$route.params.profile;

            if (!this.uid || !profile) {
                this.$store.dispatch('errorMessage', 'Error loading profile')
                this.$router.push('/')
                return
            }

            if (this.itsMe) {
                // user from vuex
                this.user = this.getUser
            } else {
                // user from route params
                this.user = profile
            }

            this.$store.dispatch('getExploresByUser', this.uid).then(explores => {
                this.explores = explores
            }, error => {
                this.$store.dispatch('errorMessage', error)
            })

            this.$store.dispatch('getExperiencesByUser', this.uid).then(experiences => {
                this.experiences = experiences
            }, error => {
                this.$store.dispatch('errorMessage', error)
            })
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
</style>