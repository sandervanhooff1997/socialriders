<template>
    <div style="width: 100%;">

        <v-jumbotron>
            <v-container fill-height>
                <v-layout align-center>
                    <v-flex>
                        <h3 class="display-3">Welcome to SocialRiders!</h3>
                        <span class="subheading">The social media where riders ride together.</span>
                        <v-divider class="my-3"></v-divider>
                        <v-btn @click="googleSignin" large class="red darken-1" dark >Continue with Google</v-btn> or
                        <v-btn @click="facebookSignin" large class="primary darken-2">Continue with Facebook</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-jumbotron>

    </div>
</template>

<script>
    import firebase from 'firebase'

    export default {
        name: 'signin',
        methods: {
            googleSignin: function () {
                this.$store.dispatch('signIn', { provider:'google' })
            },
            facebookSignin: function () {
                this.$store.dispatch('signIn', { provider:'facebook' })
            }
        },
        computed: {
            user () {
                return this.$store.getters.user
            },
            userIsAuthenticated () {
                return this.$store.getters.userIsAuthenticated
            }
        },
        watch: {
            user (value) {
                if (this.userIsAuthenticated) {
                    this.$router.push('/')
                }
            }
        },
        created () {
            if (this.userIsAuthenticated) {
                this.$router.push('/')
            }
        }
    }
</script>