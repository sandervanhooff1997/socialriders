<template>
    <v-card v-if="selectedExplore" flat class="noBackground">
        <trip-details
                :explore="selectedExplore"
                :isExplore="true"
                :isOverview="false"
                @onHideRoute="hideRoute">
        </trip-details>
    </v-card>

    <v-card v-else flat class="noBackground">
        <v-container fluid class="pb-0 pt-0">
            <v-text-field
                    clearable
                    prepend-icon="explore"
                    id="search-input"
                    placeholder="Search explores"
            ></v-text-field>
        </v-container>

        <v-expansion-panel>
            <v-expansion-panel-content>
                <div slot="header">Filters</div>
                <v-container fluid class="pt-1 pb-0">
                    <span class="medium">Max Distance - {{filters.distance.value}} km</span>
                    <v-slider class="pa-0"
                              :min="filters.distance.min"
                              :max="filters.distance.max"
                              hide-details
                              v-model="filters.distance.value"
                              @mouseup="filterExplores()"
                              @keyup="filterExplores()"
                    ></v-slider>

                    <span class="medium">Max Duration - {{filters.duration.value}} hr</span>
                    <v-slider class="pa-0"
                              :min="filters.duration.min"
                              :max="filters.duration.max"
                              hide-details
                              v-model="filters.duration.value"
                              @mouseup="filterExplores()"
                              @keyup="filterExplores()"
                    ></v-slider>

                    <v-layout row wrap>
                        <v-flex xs5 sm12>
                            <span class="medium">Part of the day</span>
                            <v-radio-group v-model="filters.daypart.value" style="padding: 0;">
                                <v-checkbox
                                        v-for="item in filters.dayparts"
                                        :key="item.value"
                                        :label="item.text"
                                        v-model="item.on"
                                        color="primary"
                                        hide-details
                                ></v-checkbox>
                            </v-radio-group>
                        </v-flex>
                        <v-flex xs7 sm12>
                            <v-switch color="primary" hide-details v-model="filters.date.on"></v-switch>

                            <v-menu
                                    lazy
                                    :close-on-content-click="true"
                                    transition="scale-transition"
                                    :disabled="!filters.date.on"
                            >
                                <v-text-field
                                        :disabled="!filters.date.on"
                                        slot="activator"
                                        label="Specific date"
                                        v-model="filters.date.value"
                                        prepend-icon="event"
                                        readonly
                                ></v-text-field>
                                <v-date-picker
                                        :disabled="!filters.date.on"
                                        class="explorePicker"
                                        color="primary"
                                        v-model="filters.date.value"
                                        no-title
                                        scrollable
                                >
                                </v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
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
                    daypart: {
                        on: true
                    },
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
                    ]
                },
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
            filterDistanceOn () {
                return this.filters.distance.on
            },
            filterDurationOn() {
                return this.filters.duration.on
            },
            filterDateOn() {
                return this.filters.date.on
            },
            filterDateValue() {
                return this.filters.date.value
            },
            filterDaypartOn() {
                return this.filters.daypart.on
            },
            filterDaypartsMorningOn() {
                return this.filters.dayparts[0].on
            },
            filterDaypartsNoonOn() {
                return this.filters.dayparts[1].on
            },
            filterDaypartsEveningOn() {
                return this.filters.dayparts[2].on
            },
            filterDaypartNightOn() {
                return this.filters.dayparts[3].on
            },
        },
        watch: {
            filterDistanceOn: 'filterExplores',
            filterDurationOn: 'filterExplores',
            filterDateOn: 'filterExplores',
            filterDateValue: 'filterExplores',
            filterDaypartOn: 'filterExplores',
            filterDaypartValue: 'filterExplores',
            filterDaypartsMorningOn: 'filterExplores',
            filterDaypartsNoonOn: 'filterExplores',
            filterDaypartsEveningOn: 'filterExplores',
            filterDaypartsNightOn: 'filterExplores',
        },
        methods: {
            hideRoute() {
                this.$emit('onHideRoute')
            },
            renderExplores(explores) {
                this.$emit('onRenderExplores', explores)
            },
            setBoundsExplores (explores) {
                this.boundsExplores = explores
                this.filterExplores()
            },
            filterExplores() {
                const self = this

                let explores = self.explores

                if (self.filters.distance.on) {
                    explores = explores.filter(explore => {
                        return explore.distance <= (self.filters.distance.value * 1000)
                    })
                }

                if (self.filters.duration.on) {
                    explores = explores.filter(explore => {
                        return explore.duration <= (self.filters.duration.value * 3600)
                    })
                }

                if (self.filters.date.on) {
                    explores = explores.filter(explore => {
                        let exploreDate = new Date(explore.date)
                        let filterDate = new Date(self.filters.date.value)

                        exploreDate.setHours(0,0,0,0)
                        filterDate.setHours(0,0,0,0)

                        return exploreDate.getTime() === filterDate.getTime()
                    })
                }

                if (self.filters.daypart.on) {
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
                }

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
            }
        },
        mounted () {
            this.filters.date.value = this.today
        }
    }
</script>