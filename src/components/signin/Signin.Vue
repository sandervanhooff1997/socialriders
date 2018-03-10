<template>
    <div style="width: 100%;">
        <v-layout row v-if="error">
            <v-flex xs12 offset-sm3 sm6>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <v-jumbotron>
            <v-container fill-height>
                <v-layout align-center>
                    <v-flex>
                        <h3 class="display-3">Welcome to SocialRiders!</h3>
                        <span class="subheading">The social media where riders ride together.</span>
                        <v-divider class="my-3"></v-divider>

                        <!--<v-progress-circular v-if="loading" indeterminate :size="50" color="primary"></v-progress-circular>-->
                        <v-btn
                                @click="signin('google')"
                                class="red darken-1 white--text"
                                large
                                :disabled="loading"
                                :loading="loading">
                            Continue with Google
                        </v-btn>
                        or
                        <v-btn
                                @click="signin('facebook')"
                                class="primary darken-2"
                                large
                                :disabled="loading"
                                :loading="loading">
                            Continue with Facebook</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-jumbotron>
    </div>
</template>

<script>
    import firebase from 'firebase'

    export default {
        methods: {
            signin (provider) {
                this.$store.dispatch('signIn', provider)
            },
            onDismissed () {
                this.$store.dispatch('clearError')
            }
        },
        computed: {
            user () {
                return this.$store.getters.user
            },
            error () {
                return this.$store.getters.error
            },
            loading () {
                return this.$store.getters.loading
            }
        },
        watch: {
            user (value) {
                if (value !== null && value !== undefined) {
                    this.$router.push('/')
                }
            }
        }
    }
</script>