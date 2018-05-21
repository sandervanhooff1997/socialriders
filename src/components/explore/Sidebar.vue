<template>
    <v-card v-if="selectedExplore" flat class="menu-item ">
        <trip-details
                :explore="selectedExplore"
                :isExplore="true"
                :isOverview="false"
                @onHideRoute="hideRoute">
        </trip-details>
    </v-card>

    <v-card v-else flat class="menu-item">
        <v-container fluid class="pb-0 pt-0">
            <v-text-field
                prepend-icon="explore"
                id="explores-input"
                placeholder="Search explores"
                @keyup="searchExplores"
        ></v-text-field>
            <v-list
                    subheader
                    two-line
                    v-if="searchedExplores.length > 0 && searchedExplores.length !== explores.length"
                    style="max-height: 200px; overflow: hidden; overflow-y: scroll;">
                <v-subheader>Explores found</v-subheader>
                <v-list-tile v-for="(item, index) in searchedExplores" :key="index" avatar @click="showRoute(item)">
                    <v-list-tile-avatar>
                        <img :src="item.owner.photoUrl">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="item.title"></v-list-tile-title>
                        <v-list-tile-sub-title>{{ item.date | datetime }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-container>

        <v-expansion-panel style="box-shadow: none;">
            <v-expansion-panel-content value="true" style="background: none;">
                <div slot="header" class="subheading">Filters</div>
                <v-container fluid class="pt-1 pb-0">
                    <span class="subheading">Max Distance - {{filters.distance.value}} km</span>
                    <v-slider class="pa-0"
                              :min="filters.distance.min"
                              :max="filters.distance.max"
                              hide-details
                              v-model="filters.distance.value"
                              @mouseup="filterExplores()"
                              @keyup="filterExplores()"
                    ></v-slider>

                    <span class="subheading">Max Duration - {{filters.duration.value}} hr</span>
                    <v-slider class="pa-0"
                              :min="filters.duration.min"
                              :max="filters.duration.max"
                              hide-details
                              v-model="filters.duration.value"
                              @mouseup="filterExplores()"
                              @keyup="filterExplores()"
                    ></v-slider>

                    <v-layout row wrap>
                        <v-flex xs6 sm12 class="mt-1">
                            <span class="subheading">Part of the day</span>
                            <v-radio-group v-model="filters.selectedDayparts" hide-details class="pt-0">
                                <v-checkbox
                                        v-for="item in filters.dayparts"
                                        :key="item.value"
                                        :label="item.text"
                                        v-model="item.on"
                                        color="primary"
                                ></v-checkbox>
                            </v-radio-group>
                        </v-flex>
                        <v-flex xs6 sm12 class="mt-1">
                            <span class="subheading">Vehicles</span>
                            <v-radio-group v-model="filters.selectedVehicles" hide-details class="pt-0">
                                <v-checkbox
                                        v-for="item in filters.vehicles"
                                        :key="item.value"
                                        :label="item.text"
                                        v-model="item.on"
                                        color="primary"
                                ></v-checkbox>
                            </v-radio-group>
                        </v-flex>
                        <v-switch color="primary"
                                  label="Specific date"
                                  hide-details
                                  v-model="filters.date.on"
                                  class="mt-2 explore-switch">
                        </v-switch>
                    </v-layout>
                    <v-menu
                            lazy
                            :close-on-content-click="true"
                            transition="scale-transition"
                            :disabled="!filters.date.on"
                    >
                        <v-text-field
                                :disabled="!filters.date.on"
                                slot="activator"
                                label="Select date"
                                v-model="filters.date.value"
                                prepend-icon="event"
                                readonly
                        ></v-text-field>
                        <v-date-picker
                                :disabled="!filters.date.on"
                                :min="today"
                                class="explorePicker"
                                color="primary"
                                v-model="filters.date.value"
                                no-title
                                scrollable
                        >
                        </v-date-picker>
                    </v-menu>
                </v-container>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-card>
</template>

<script>
    import TripDetails from '@/components/shared/TripDetails'

    export default {
        props: ['selectedExplore', 'explores'],
        components: {
            TripDetails
        },
        data () {
            return {
                filters: {
                    distance: {
                        value: 2500,
                        min: 1,
                        max: 2500,
                        on: true
                    },
                    duration: {
                        value: 24,
                        min: 1,
                        max: 24,
                        on: true
                    },
                    date: {
                        value: null,
                        on: false
                    },
                    selectedDayparts: null,
                    dayparts: [
                        {
                            text: 'Morning',
                            value: 'morning',
                            on: true,
                            min: 6,
                            max: 12,
                        },
                        {
                            text: 'Afternoon',
                            value: 'afternoon',
                            on: true,
                            min: 12,
                            max: 18,
                        },
                        {
                            text: 'Evening',
                            value: 'evening',
                            on: true,
                            min: 18,
                            max: 22,
                        },
                        {
                            text: 'Midnight',
                            value: 'midnight',
                            on: true,
                            min: 22,
                            max: 6,
                        },
                    ],
                    selectedVehicles: null,
                    vehicles: [
                            {
                                text: 'Motorcycle',
                                value: 'motorcycle',
                                on: true,
                            },
                            {
                                text: 'Car',
                                value: 'car',
                                on: true,
                            },
                            {
                                text: 'Bike',
                                value: 'bike',
                                on: true,
                            },
                        ],
                },
                searchedExplores: [],
                searchDelayTimer: null
            }
        },
        computed: {
            today () {
                let now = new Date();
                let dd = now.getDate();
                let mm = now.getMonth()+1; //January is 0!
                let yyyy = now.getFullYear();

                if(dd<10) dd = '0'+dd

                if(mm<10)  mm = '0'+mm

                return yyyy + '-' + mm + '-' + dd;
            },
            filterDateOn() {
                return this.filters.date.on
            },
            filterDateValue() {
                return this.filters.date.value
            },
            filterDayPartsValue () {
                let dayparts = []
                this.filters.dayparts.forEach(daypart => {
                    if (daypart.on) {
                        dayparts.push(daypart)
                    }
                })
                return dayparts
            },
            filterVehiclesValue () {
                let vehicles = []
                this.filters.vehicles.forEach(vehicle => {
                    if (vehicle.on) {
                        vehicles.push(vehicle)
                    }
                })
                return vehicles
            },
        },
        watch: {
            filterDateOn: 'filterExplores',
            filterDateValue: 'filterExplores',
            filterDayPartsValue: 'filterExplores',
            filterVehiclesValue: 'filterExplores'
        },
        methods: {
            hideRoute() {
                this.$emit('onHideRoute')
            },
            renderExplores(explores) {
                this.$emit('onRenderExplores', explores)
            },
            filterExplores() {
                const self = this

                let explores = self.explores

                explores = explores.filter(explore => {
                    return explore.distance <= (self.filters.distance.value * 1000)
                })

                explores = explores.filter(explore => {
                    return explore.duration <= (self.filters.duration.value * 3600)
                })

                if (self.filters.date.on) {
                    explores = explores.filter(explore => {
                        let exploreDate = new Date(explore.date)
                        let filterDate = new Date(self.filters.date.value)

                        exploreDate.setHours(0,0,0,0)
                        filterDate.setHours(0,0,0,0)

                        return exploreDate.getTime() === filterDate.getTime()
                    })
                }

                let tempExplores = []
                self.filters.dayparts.forEach(daypart => {
                    if (daypart.on) {
                        explores.forEach(explore => {
                            let hours = new Date(explore.date).getHours()

                            // Midnight daypart requires some extra checks
                            if (daypart.value === 'midnight') {
                                if (hours >= daypart.min && hours <= 23 || hours <= daypart.max && hours >= 0) {
                                    tempExplores.push(explore)
                                }
                            } else if (hours >= daypart.min && hours < daypart.max) {
                                tempExplores.push(explore)
                            }
                        })
                    }
                })
                explores = tempExplores

                this.filters.vehicles.forEach(vehicleFilter => {
                    if (!vehicleFilter.on) {
                        explores = explores.filter(explore => {
                            return explore.vehicle !== vehicleFilter.value
                        })
                    }
                })

                if (explores.length === 0
                    && !self.filters.distance.on
                    && !self.filters.duration.on
                    && !self.filters.date.on
                    && !self.filters.daypart.on) {
                    explores = self.explores
                }

                self.$emit('onRenderExplores', explores)
            },
            removeAllFilters () {
                this.filters.distance.on = false
                this.filters.duration.on = false
                this.filters.date.on = false
                this.filters.daypart.on = false
            },
            searchExplores (event) {
                let text = event.target.value
                let self = this

                clearTimeout(this.searchDelayTimer)
                this.searchDelayTimer = setTimeout(function() {
                    self.searchedExplores = self.explores.filter(explore => {
                        return explore.title.toLowerCase().includes(text.toLowerCase())
                    })
                }, 500);
            },
            setMaxDistance(distance) {
                this.filters.distance.max = distance
                this.filters.distance.value = distance
            },
            setMaxDuration(duration) {
                this.filters.duration.max = duration
                this.filters.duration.value = duration
            },
            showRoute(explore) {
                this.clearSearchedExplores()
                this.$emit('onShowRoute', explore)
            },
            clearSearchedExplores () {
                this.searchedExplores = []
            }
        },
        mounted () {
            this.filters.date.value = this.today
        }
    }
</script>

<style scoped>
    .menu-item {
        width: 100%;
        height: 100%;
    }
</style>