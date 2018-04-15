<template>
    <div>
        <v-jumbotron dark class="banner">
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
            <v-tab-item v-for="item in items" :key="item" class="fillHeight">
                <v-card flat class="fillHeight">
                    <v-container fill-height>
                        <v-layout>
                            <v-flex>
                                <v-card-text>{{ text }}</v-card-text>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                user: {
                    name: '',
                    email: '',
                    photoUrl: ''
                },
                tab: null,
                items: [
                    'experiences', 'explores', 'social media'
                ],
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            }
        },
        computed: {
            getUser () {
                return this.$store.getters.user
            }
        },
        mounted () {
            let uid = this.$route.params.uid;
            let profile = this.$route.params.profile;

            if (!uid || !profile) {
                this.$router.push('/')
                this.$store.dispatch('errorMessage', 'Error loading profile')
            }

            if (this.getUser.uid === uid) {
                // user from vuex
                this.user = self.getUser
            } else {
                // user from route params
                this.user = profile
            }
        }
    }
</script>

<style scoped>
    .avatar {
        -webkit-box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
        -moz-box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
        box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
    }
    .banner {
        height: 300px!important;
    }
    .fillHeight {
        height: 100%;
    }
</style>