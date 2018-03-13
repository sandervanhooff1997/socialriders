<template>
    <div id="wrapper">
        <v-layout row v-if="error">
            <v-flex xs12 offset-sm3 sm6>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <!--<img id="logo" src="@/assets/logo512x512.png" alt="">-->
        <!--<v-jumbotron>-->
            <!--<v-container fill-height>-->
                <!--<v-layout align-center>-->
                    <!--<v-flex>-->
                        <!--<h3 class="display-3">Welcome to SocialRiders!</h3>-->
                        <!--<span class="subheading">The social media where riders ride together.</span>-->
                        <!--<v-divider class="my-3"></v-divider>-->

                        <div id="btnWrapper">
                            <v-btn  @click="signin('google')"
                                    class="signinBtn grey--text text--darken-2"
                                    large
                                    :disabled="loading"
                                    :loading="loading">
                                <div style="width:24px;height:24px;" class="signinIcon" ><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 48 48" class="abcRioButtonSvg"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg></div>
                                Continue with Google
                            </v-btn>
                            <v-btn  @click="signin('facebook')"
                                    class="signinBtn facebook darken-2 white--text"
                                    large
                                    :disabled="loading"
                                    :loading="loading">
                                <img class="btn--icon signinIcon" src="./../../assets/facebook-logo.png" />
                                Continue with Facebook
                            </v-btn>
                        </div>

                        <!--&lt;!&ndash;<div class="g-signin2" data-onsuccess="onSignIn"></div>&ndash;&gt;-->

                    <!--</v-flex>-->
                <!--</v-layout>-->
            <!--</v-container>-->
        <!--</v-jumbotron>-->
    </div>
</template>

<script>
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

<style>
    #wrapper {
        position: relative;
        background-image: url("./../../assets/background.jpg");
        -webkit-background-size: cover;
        background-size: cover;
        background-position: center;
    }
    #btnWrapper {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
    #logo {
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-256px, -256px);
        -moz-transform: translate(-256px, -256px);
        -ms-transform: translate(-256px, -256px);
        -o-transform: translate(-256px, -256px);
        transform: translate(-256px, -256px);
    }
    .signinBtn.facebook {
        background-color: #4968AD!important;
    }
</style>