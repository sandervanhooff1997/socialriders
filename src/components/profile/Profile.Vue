<template>
    <div>
        <v-jumbotron color="primary" dark>
            <v-container fill-height>
                <v-layout align-center>
                    <v-flex text-xs-center>
                        <h3 class="display-3">{{user.name}}</h3>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-jumbotron>
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
                }
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