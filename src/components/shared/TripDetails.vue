<template>
    <div>
        <v-card-media height="100px" v-if="!isOverview">
            <v-layout wrap align-center>
                <v-flex class="text-xs-center">
                    <v-avatar>
                        <router-link :to="{ name: 'Profile', params: { uid: explore.owner.uid, profile: explore.owner }}">
                            <img  :src="explore.owner.photoUrl" :alt="explore.owner.name">
                        </router-link>
                    </v-avatar>
                    <div class="subheading white--text">{{explore.owner.name}}</div>
                </v-flex>
            </v-layout>
        </v-card-media>
        <v-divider v-if="!isOverview"></v-divider>

        <v-tooltip right>
            <v-card-title primary-title slot="activator">
                <div class="title">{{explore.title}}</div>
            </v-card-title>
            <span>{{explore.title}}</span>
        </v-tooltip>

        <v-list style="background: none!important;">
            <v-list-tile class="list-tile-explore">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                        <span>
                            <v-icon>date_range</v-icon> {{explore.date | datetime}}
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
                            <v-icon>location_on</v-icon> {{explore.startPoint.address}}
                        </span>
                        </v-list-tile-action>
                        <span>Starting Location</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore" v-if="!isOverview">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                        <span>
                            <v-icon>trending_flat</v-icon> {{explore.distance | distance}}
                        </span>
                        </v-list-tile-action>
                        <span>Total Distance</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore" v-if="!isOverview">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                        <span>
                            <v-icon>motorcycle</v-icon> {{explore.vehicle | capitalize}}
                        </span>
                        </v-list-tile-action>
                        <span>Vehicle</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore" v-if="!isOverview && explore.riders.length">
                <v-list-tile-content>
                    <v-tooltip right>
                        <v-list-tile-action slot="activator">
                        <span>
                            <v-icon>people</v-icon> {{explore.riders.length | riders }}
                        </span>
                        </v-list-tile-action>
                        <span>Riders</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-card-text v-if="!isOverview">
            <p class="discription text-xs-left">{{explore.description}}</p>
        </v-card-text>
        <v-divider v-if="!isOverview"></v-divider>
        <br>

        <v-card-actions>
            <v-btn round :loading="loading" color="primary" v-if="isExplore && exploreJoinable" @click="joinExplore()">Join</v-btn>
            <v-btn round :loading="loading" color="warning" v-if="isExplore && exploreLeavable" @click="leaveExplore()">Leave</v-btn>
            <v-btn round :loading="loading" color="primary" v-if="isExplore && isOverview" :to="{name: 'Explores', params: {selectedExplore: explore}}">View</v-btn>
            <v-btn round flat @click="hideRoute()" v-if="isExplore && !isOverview">Close</v-btn>

            <v-btn round :loading="loading" color="primary" v-if="!isExplore" :to="{name: 'Experience', params: {id: explore.id}}">View</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
    export default {
        props: ['explore', 'isExplore', 'isOverview'],
        computed: {
            user () {
                return this.$store.getters.user
            },
            exploreJoinable () {
                if (this.explore) {
                    // if the rider is not the owner
                    if (this.explore.owner.uid !== this.user.uid) {
                        for (let i = 0; i < this.explore.riders.length; i++) {
                            // if the rider already exists in the route
                            if (this.explore.riders[i].uid === this.user.uid) {
                                return false;
                            }
                        }

                        // owner or already joined
                        return true
                    }
                }

                return false
            },
            exploreLeavable() {
                if (this.explore) {
                    // if the rider is not the owner
                    if (this.explore.owner.uid !== this.user.uid) {
                        for (let i = 0; i < this.explore.riders.length; i++) {
                            // if the riders already in the route
                            if (this.explore.riders[i].uid === this.user.uid) {
                                return true;
                            }
                        }
                    }
                }

                // owner or not joined route
                return false
            },
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
            hideRoute() {
                this.$emit('hideRoute')
            },
            joinExplore() {
                if (this.exploreJoinable) {
                    let payload = {
                        id: this.explore.id,
                        user: {
                            uid: this.user.uid,
                            email: this.user.email,
                            name: this.user.name,
                            photoUrl: this.user.photoUrl
                        }
                    }

                    this.$store.dispatch('joinExplore', payload).then(message => {
                        this.$store.dispatch('successMessage', message)
                        // make the changes locally to update the view
                        this.explore.riders.push(payload.user)
                    }, error => {
                        this.$store.dispatch('errorMessage', error)
                    })
                } else {
                    this.$store.dispatch('errorMessage', 'Error joining this route')
                }
            },
            leaveExplore() {
                if (this.exploreLeavable) {
                    let payload = {
                        id: this.explore.id,
                        uid: this.user.uid
                    }

                    this.$store.dispatch('leaveExplore', payload).then(message => {
                        this.$store.dispatch('successMessage', message)
                        // make the changes locally to update the view
                        this.explore.riders = this.explore.riders.filter(rider => {
                            return rider.uid !== payload.uid
                        })
                    }, error => {
                        this.$store.dispatch('errorMessage', error)
                    })
                } else {
                    this.$store.dispatch('errorMessage', 'Error leaving this route')
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
</style>