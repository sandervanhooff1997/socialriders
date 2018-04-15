<template>
    <!--ROUTE DETAILS-->
    <v-card flat dark style="background: none!important;">
        <v-card-media height="130px">
            <v-layout wrap align-center>
                <v-flex class="text-xs-center">
                    <v-avatar>
                        <router-link :to="{ name: 'Profile', params: { uid: selectedExplore.owner.uid, profile: selectedExplore.owner }}">
                            <img  :src="selectedExplore.owner.photoUrl" :alt="selectedExplore.owner.name">
                        </router-link>
                    </v-avatar>
                    <div class="title white--text">{{selectedExplore.owner.name}}</div>
                </v-flex>
            </v-layout>
        </v-card-media>
        <v-divider></v-divider>

        <v-tooltip right>
            <v-card-title primary-title slot="activator">
                <div class="headline">{{selectedExplore.title}}</div>
            </v-card-title>
            <span>{{selectedExplore.title}}</span>
        </v-tooltip>

        <v-list style="background: none!important;">
            <v-list-tile>
                <v-tooltip right>
                    <v-list-tile-action slot="activator">
                        <v-icon>date_range</v-icon>
                    </v-list-tile-action>
                    <span>When</span>
                </v-tooltip>
                <v-list-tile-content>
                    <v-list-tile-title>{{selectedExplore.date | datetime}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                <v-tooltip right>
                    <v-list-tile-action slot="activator">
                        <v-icon>flight_takeoff</v-icon>
                    </v-list-tile-action>
                    <span>Starting Location</span>
                </v-tooltip>
                <v-tooltip right>
                    <v-list-tile-content  slot="activator">
                        <v-list-tile-title>{{selectedExplore.startPoint.address}}</v-list-tile-title>
                    </v-list-tile-content>
                    <span>{{selectedExplore.startPoint.address}}</span>
                </v-tooltip>
            </v-list-tile>
            <v-list-tile>
                <v-tooltip right>
                    <v-list-tile-action slot="activator">
                        <v-icon>trending_flat</v-icon>
                    </v-list-tile-action>
                    <span>Total Distance</span>
                </v-tooltip>
                <v-list-tile-content>
                    <v-list-tile-title>{{selectedExplore.distance | distance}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                <v-tooltip right>
                    <v-list-tile-action slot="activator">
                        <v-icon>motorcycle</v-icon>
                    </v-list-tile-action>
                    <span>Vehicle</span>
                </v-tooltip>
                <v-list-tile-content>
                    <v-list-tile-title>{{selectedExplore.vehicle | capitalize}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-card-text>
            <p class="text-xs-left">{{selectedExplore.description}}</p>
        </v-card-text>
        <v-card-actions>
            <v-btn round color="accent" v-if="routeJoinable" @click="joinRoute()">Join</v-btn>
            <v-btn round flat @click="hideRoute()">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ['selectedExplore'],
        methods: {
            hideRoute() {
                this.$parent.hideRoute()
            },
            joinRoute() {
                if (this.selectedExplore.owner.uid !== this.$store.getters.user.uid)  {

                }  else {

                }
            },
            routeJoinable () {
                if (this.selectedExplore) {
                    return this.selectedExplore.owner.uid !== this.$store.getters.user.uid
                }
            }
        }
    }
</script>