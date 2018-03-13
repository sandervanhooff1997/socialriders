<template>
    <div style="width: 100%;">
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
                    <v-btn
                            v-for="(socialNetwork, index) in socialNetworks"
                            v-if="socialNetwork != ''"
                            :key="index"
                            icon
                            dark
                            class="mx-3"
                    >
                        <v-icon size="24px" color="white">lock_open</v-icon>
                    </v-btn>
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
                socialNetworks: null
            }
        },
        computed: {
            user () {
                return this.$store.getters.user
            }
        },
        created () {
            var self = this;
            firebase.firestore()
                .collection("social-networks")
                .where("UID", "==", this.user.uid)
                .get()
                .then(function(querySnapshot) {
                    if (querySnapshot.docs[0] !== undefined) {
                        var data = querySnapshot.docs[0].data()
                        self.socialNetworks = [];
                        self.socialNetworks.push(data.facebook, data.google, data.twitter, data.instagram, data.linkedin)
                    }
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });


        }
    }
</script>