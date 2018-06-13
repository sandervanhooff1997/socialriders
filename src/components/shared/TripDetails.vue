<template>
    <div>
        <v-card-media height="56px" v-if="!isOverview">
            <v-layout wrap align-center>
                <v-flex class="text-xs-center">
                    <v-list>
                        <v-list-tile  avatar :to="{name: 'Profile' , params:{ uid: explore.owner.uid, profile: explore.owner }}">
                            <v-list-tile-avatar>
                                <img :src="explore.owner.photoUrl">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="explore.owner.name"></v-list-tile-title>
                                <v-list-tile-sub-title>Host</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-card-media>

        <v-divider></v-divider>

        <v-list style="background: none!important;">

            <v-list-tile class="list-tile-explore">
                <div v-if="isOverview" class="title black--text text-xs-left">{{explore.title}}</div>
                <div v-if="!isOverview" class="title text-xs-left">{{explore.title}}</div>
            </v-list-tile>
            <v-list-tile class="list-tile-explore">
                <v-list-tile-content>
                    <v-tooltip bottom>
                        <v-list-tile-action slot="activator">
                        <span class="thinText">
                            <v-icon>date_range</v-icon> {{explore.date | datetime}}
                        </span>
                        </v-list-tile-action>
                        <span>When</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore">
                <v-list-tile-content>
                    <v-tooltip bottom>
                        <v-list-tile-action slot="activator">
                        <span class="thinText">
                            <v-icon>location_on</v-icon> {{explore.origin.address}}
                        </span>
                        </v-list-tile-action>
                        <span>Origin</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore" v-if="!isOverview">
                <v-list-tile-content>
                    <v-tooltip bottom>
                        <v-list-tile-action slot="activator">
                        <span class="thinText">
                            <v-icon>trending_flat</v-icon> {{explore.distance | distance}}
                        </span>
                        </v-list-tile-action>
                        <span>Total Distance</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore" v-if="!isOverview">
                <v-list-tile-content>
                    <v-tooltip bottom>
                        <v-list-tile-action slot="activator">
                        <span class="thinText">
                            <v-icon>access_time</v-icon> {{explore.duration | duration}}
                        </span>
                        </v-list-tile-action>
                        <span>Total Duration</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore" v-if="!isOverview">
                <v-list-tile-content>
                    <v-tooltip bottom>
                        <v-list-tile-action slot="activator">
                        <span class="thinText">
                            <v-icon>motorcycle</v-icon> {{explore.vehicle | capitalize}}
                        </span>
                        </v-list-tile-action>
                        <span>Vehicle</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="list-tile-explore" v-if="!isOverview && explore.riders.length">
                <v-list-tile-content>
                    <v-tooltip bottom>
                        <v-list-tile-action slot="activator">
                        <span class="thinText">
                            <v-icon>people</v-icon>
                            <v-menu open-on-hover bottom offset-y>
                                <span slot="activator">{{explore.riders.length | riders }}</span>
                                <v-list class="riderList"
                                        subheader
                                        style="max-height: 216px; overflow: hidden; overflow-y: scroll;">
                                    <v-subheader>Riders</v-subheader>
                                    <v-list-tile
                                            v-for="(item, index) in explore.riders"
                                            :key="index"
                                            avatar
                                            :to="{name: 'Profile' , params:{ uid: item.uid, profile: item }}">
                                        <v-list-tile-avatar>
                                            <img :src="item.photoUrl">
                                        </v-list-tile-avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title class="thinText" v-html="item.name"></v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </span>
                        </v-list-tile-action>
                        <span>Riders</span>
                    </v-tooltip>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-card-text v-if="!isOverview && explore.description">
            <div class="text-xs-left">Description</div>
            <p class="discription thinText text-xs-left">{{explore.description}}</p>
        </v-card-text>
        <v-divider v-if="!isOverview"></v-divider>

        <v-card-actions>

            <v-speed-dial
                    v-if="myExplore"
                    v-model="fab"
                    direction="top"
                    transition="slide-y-reverse-transition"
            >
                <v-btn
                        slot="activator"
                        v-model="fab"
                        color="primary"
                        fab
                >
                    <v-icon>build</v-icon>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-tooltip right>
                    <v-btn
                            style="margin: 10px;"
                            :loading="loading"
                            slot="activator"
                            color="warning"
                            small
                            fab
                            @click="deleteExplore()"
                    >
                        <v-icon>delete</v-icon>
                    </v-btn>
                    <span>Delete</span>
                </v-tooltip>
                <v-tooltip right>
                    <v-btn
                            :loading="loading"
                            slot="activator"
                            color="accent"
                            small
                            fab
                            @click="editExplore()"
                    >
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <span>Edit</span>
                </v-tooltip>
            </v-speed-dial>

            <v-spacer></v-spacer>

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
        data () {
            return {
                fab: false
            }
        },
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
            myExplore() {
                return this.explore.owner.uid === this.user.uid
            },
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
            hideRoute() {
                this.$emit('onHideRoute')
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
                    this.$store.dispatch('errorMessage', 'Error joining this trip')
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
                    this.$store.dispatch('errorMessage', 'Error leaving this trip')
                }
            },
            deleteExplore () {
                if (this.myExplore) {
                    this.$store.dispatch('deleteExplore', this.explore).then(() => {
                        this.$store.dispatch('successMessage', 'Trip deleted!')
                    }, error => {
                        this.$store.dispatch('errorMessage', error)
                    })
                }
            },
            editExplore () {
                if (this.myExplore) {
                    this.$router.push({
                        name: 'Organize',
                        params: {
                            explore: this.explore
                        }
                    })
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