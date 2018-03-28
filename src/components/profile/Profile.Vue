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
        <v-tabs-items v-model="tab" style="height: 100%;">
            <v-tab-item v-for="item in items" :key="item" style="height: 100%;">
                <v-card flat style="height: 100%;">
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

        <v-footer height="auto" v-if="socialNetworks">
            <v-card flat tile width="100%" >
                <v-card-title class="teal white--text">
                    <strong class="subheading">Get connected with {{user.name}} on social networks!</strong>
                    <v-spacer></v-spacer>
                    <!--<v-btn-->
                            <!--v-for="(socialNetwork, index) in socialNetworks"-->
                            <!--v-if="socialNetwork != ''"-->
                            <!--:key="index"-->
                            <!--icon-->
                            <!--dark-->
                            <!--class="mx-3"-->
                    <!--&gt;-->
                        <!--<v-icon size="24px" color="white">lock_open</v-icon>-->
                    <!--</v-btn>-->
                </v-card-title>
            </v-card>
        </v-footer>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import firestore from 'firebase/firestore'

    export default {
        data () {
            return {
                socialNetworks: null,
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
            const self = this;
            let uid = this.$route.params.uid;

            if (uid === undefined) {
                uid = this.getUser.uid
            }

            // if the currently signed in user's id does not matches the fetched user's id this is another user's profile
            if (this.getUser.uid !== uid) {
                firebase.firestore()
                    .collection("users")
                    .where("uid", "==", uid)
                    .get()
                    .then(function(querySnapshot) {
                        if (!querySnapshot.empty) {
                            self.user = querySnapshot.docs[0].data()
                        }
                    })
                    .catch(function(error) {
                        self.$store.commit('setMessage', {text: error.message, type: 'error'})
                    });
//                firebase.firestore()
//                    .collection("social-networks")
//                    .where("uid", "==", self.uid)
//                    .get()
//                    .then(function(querySnapshot) {
//                        if (querySnapshot.docs[0] !== undefined) {
//                            var data = querySnapshot.docs[0].data()
//                            self.socialNetworks = [];
//                            self.socialNetworks.push(data.facebook, data.google, data.twitter, data.instagram, data.linkedin)
//                        }
//                    })
//                    .catch(function(error) {
//                        console.log("Error getting documents: ", error);
//                    });
            } else {
                this.user = this.getUser
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
</style>