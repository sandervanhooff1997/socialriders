<template>
    <div>
        <v-card-media height="100px" v-if="!isOverview">
            <v-layout wrap align-center>
                <v-flex class="text-xs-center">
                    <v-list subheader>
                        <v-subheader>Hosted by</v-subheader>
                        <v-list-tile  avatar :to="{name: 'Profile' , params:{ uid: explore.owner.uid, profile: explore.owner }}">
                            <v-list-tile-avatar>
                                <img :src="explore.owner.photoUrl">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="explore.owner.name"></v-list-tile-title>
                                <!--<v-list-tile-sub-title>{{ item.date | datetime }}</v-list-tile-sub-title>-->
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-card-media>

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
                            <v-icon>location_on</v-icon> {{explore.origin.address}}
                        </span>
                        </v-list-tile-action>
                        <span>Origin</span>
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
                            <v-icon>access_time</v-icon> {{explore.duration | duration}}
                        </span>
                        </v-list-tile-action>
                        <span>Total Duration</span>
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
                            <v-icon>people</v-icon>
                            <v-menu open-on-hover bottom offset-y>
                                <span slot="activator">{{explore.riders.length | riders }}</span>
                                <v-list class="riderList"
                                        subheader
                                        style="max-height: 200px; overflow: hidden; overflow-y: scroll;">
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
                                            <v-list-tile-title v-html="item.name"></v-list-tile-title>
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