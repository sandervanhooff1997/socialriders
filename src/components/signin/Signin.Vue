<template>
    <div class="wrapper text-xs-center">
        <!--<v-toolbar-->
                <!--class="signinToolbar"-->
                <!--dense-->
                <!--dark-->
                <!--flat-->
        <!--&gt;-->
            <!--<v-spacer></v-spacer>-->
            <!--<v-toolbar-items style="margin: 0;">-->
                <!--<v-menu-->
                        <!--v-for="item in info"-->
                        <!--:key="item.title"-->
                        <!--:close-on-content-click="false"-->
                        <!--max-width="300"-->
                        <!--min-width="300"-->
                        <!--absolute-->
                <!--&gt;-->
                    <!--<v-btn flat slot="activator">-->
                        <!--{{item.title}}-->
                    <!--</v-btn>-->

                    <!--<v-card>-->
                        <!--<v-card-text v-html="item.text"></v-card-text>-->
                    <!--</v-card>-->
                <!--</v-menu>-->
            <!--</v-toolbar-items>-->
        <!--</v-toolbar>-->

        <div class="content-wrapper">
            <v-container fluid fill-height>
                <v-layout justify-center align-center>
                    <v-flex xs12 >
                        <img width="400" height="400" src="@/assets/images/logo.png" class="logo" align="Logo">
                    </v-flex>
                    <v-flex xs12 >
                        <h3 class="display-3 signin-title">Welcome!</h3>
                        <v-btn  @click="signin('google')"
                                class="signinBtn grey--text text--darken-2"
                                large
                                :loading="loading">
                            <div style="width:24px;height:24px;" class="signinIcon" >
                                <svg version="1.1"
                                     xmlns="http://www.w3.org/2000/svg"
                                     width="24px"
                                     height="24px"
                                     viewBox="0 0 48 48"
                                     class="abcRioButtonSvg">
                                    <g>
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </g>
                                </svg>
                            </div>
                            Continue with Google
                        </v-btn>

                        <v-btn  @click="signin('facebook')"
                                class="signinBtn facebook darken-2 white--text"
                                large
                                :loading="loading">
                            <img class="btn--icon signinIcon" src="@/assets/images/facebook-logo.png" />
                            Continue with Facebook
                        </v-btn>

                        <p class="text-muted" @click="about.signinProvider = !about.signinProvider">Why Google/Facebook?</p>
                        <p class="about-signin-text" v-if="about.signinProvider">
                            Signing in with <b>Google</b> or <b>Facebook</b> makes sure your profile information is <b>secured</b> by their powerful authentication systems.<br>
                            This also <b>prevents</b> you from having to <b>register</b> your account at <b>SocialRiders</b>.
                        </p>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <!--<div class="text-xs-center">-->
            <!--<v-avatar :size="400" class="mt-4">-->
                <!--<img src="@/assets/images/logo512x512-white.png" align="Logo">-->
            <!--</v-avatar>-->
            <!--<br>-->

            <!--<v-btn  @click="signin('google')"-->
                    <!--class="signinBtn grey&#45;&#45;text text&#45;&#45;darken-2"-->
                    <!--large-->
                    <!--:loading="loading">-->
                <!--<div style="width:24px;height:24px;" class="signinIcon" >-->
                    <!--<svg version="1.1"-->
                         <!--xmlns="http://www.w3.org/2000/svg"-->
                         <!--width="24px"-->
                         <!--height="24px"-->
                         <!--viewBox="0 0 48 48"-->
                         <!--class="abcRioButtonSvg">-->
                        <!--<g>-->
                            <!--<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>-->
                            <!--<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>-->
                            <!--<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>-->
                            <!--<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>-->
                            <!--<path fill="none" d="M0 0h48v48H0z"></path>-->
                        <!--</g>-->
                    <!--</svg>-->
                <!--</div>-->
                <!--Continue with Google-->
            <!--</v-btn>-->

            <!--<v-btn  @click="signin('facebook')"-->
                    <!--class="signinBtn facebook darken-2 white&#45;&#45;text"-->
                    <!--large-->
                    <!--:loading="loading">-->
                <!--<img class="btn&#45;&#45;icon signinIcon" src="@/assets/images/facebook-logo.png" />-->
                <!--Continue with Facebook-->
            <!--</v-btn>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        data () {
            return {
                menu: false,
                about: {
                    signinProvider: false
                },
                info: [
                    {
                        title: 'Google & Facebook signin',
                        text: ''
                    },
                    {
                        title: 'Privacy',
                        text: 'We only use the following <b>public</b> profile information:<br>' +
                        'Email<br>' +
                        'Name<br>' +
                        'Profile Picture</b>'
                    },
                    {
                        title: 'About',
                        text: '<b>SocialRiders</b> is an online <b>social media</b> where riders of all kinds can ride <b>together</b>.<br><br>' +
                        'You can <b>organize</b> your own trips, <b>explore</b> trips and share <b>experiences</b> with others.<br><br>' +
                        'Our main goal is to offer you a tool to support the social aspect of this principle.'
                    }
                ]
            }
        },
        methods: {
            signin (provider) {
                this.$store.dispatch('signIn', provider)
            },
        },
        computed: {
            user () {
                return this.$store.getters.user
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
    .signinBtn {
        width: 280px;
        margin-bottom: 20px;
        background-color: #f3f3f3!important;
    }
    .signinBtn > div{
        padding-left: 24px !important;
        text-transform: none !important;
    }
    .signinIcon {
        margin-right: 20px !important;
    }
    .signinBtn.facebook {
        background-color: #4968AD!important;
    }
    .signinToolbar {
        background: none!important;
    }
    .signin-title {
        margin-bottom: 50px;
        font-weight: lighter!important;
    }
    .wrapper {
        width: 84%;
        height: 94% !important;
        margin-left: 8%;
        padding-top: 4%;
    }
    .content-wrapper {
        background: #fff;
        width: 100%;
        height: 100%;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        -webkit-box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.4);
        -moz-box-shadow:    0px 3px 15px 0px rgba(0, 0, 0, 0.4);
        box-shadow:         0px 3px 15px 0px rgba(0, 0, 0, 0.4);
    }
    .text-muted {
        color: gray;
        font-style: italic;
        cursor: pointer;
    }
    .about-signin-text {
        padding: 0 20px;
        line-height:1;
        color: gray;
    }
</style>