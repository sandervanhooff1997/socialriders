<template>
    <!--ROUTE DETAILS-->
    <v-card flat dark style="background: none!important;">
        <v-card-media height="100px">
            <v-layout wrap align-center>
                <v-flex class="text-xs-center">
                    <v-avatar>
                        <router-link :to="{ name: 'Profile', params: { uid: selectedExplore.owner.uid, profile: selectedExplore.owner }}">
                            <img  :src="selectedExplore.owner.photoUrl" :alt="selectedExplore.owner.name">
                        </router-link>
                    </v-avatar>
                    <div class="subheading white--text">{{selectedExplore.owner.name}}</div>
                </v-flex>
            </v-layout>
        </v-card-media>
        <v-divider></v-divider>

        <v-tooltip right>
            <v-card-title primary-title slot="activator">
                <div class="title">{{selectedExplore.title}}</div>
            </v-card-title>
            <span>{{selectedExplore.title}}</span>
        </v-tooltip>

        <v-list style="background: none!important;">
            <v-list-tile class="list-tile-explore">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                            <span>
                                <v-icon>date_range</v-icon> {{selectedExplore.date | datetime}}
                            </span>
                        </v-list-tile-action>
                        <span>When</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                            <span>
                                <v-icon>flight_takeoff</v-icon> {{selectedExplore.startPoint.address}}
                            </span>
                        </v-list-tile-action>
                        <span>Starting Location</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                            <span>
                                <v-icon>trending_flat</v-icon> {{selectedExplore.distance | distance}}
                            </span>
                        </v-list-tile-action>
                        <span>Total Distance</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                            <span>
                                <v-icon>motorcycle</v-icon> {{selectedExplore.vehicle | capitalize}}
                            </span>
                        </v-list-tile-action>
                        <span>Vehicle</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-card-text>
            <p class="discription text-xs-left">{{selectedExplore.description}}</p>
        </v-card-text>
        <v-divider></v-divider>
        <br>

        <v-card-actions>
            <v-btn round color="primary" v-if="routeJoinable" @click="joinRoute()">Join</v-btn>
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

<style scoped>
    .list__tile__content {
        font-size: 14px;
    }
    i.icon {
        font-size: 16px;
    }
    .card__title {
        padding-top: 20px;
        padding-bottom: 10px;
    }
    .discription {
        font-style: italic;
    }
</style>