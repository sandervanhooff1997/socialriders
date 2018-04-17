<template>
    <!--FILTERS-->
    <v-card flat dark style="background: none!important;">
        <v-text-field
                clearable
                solo-inverted
                prepend-icon="explore"
                id="search-input"
                placeholder="Search explores"
        ></v-text-field>

        <br>

        <v-subheader class="filter-header">
            <v-switch label="Max Distance" color="primary" hide-details v-model="filters.distance.on"></v-switch>
        </v-subheader>
        <v-slider class="pa-0"
                  :min="filters.distance.min"
                  :max="filters.distance.max"
                  :label="filters.distance.value + ' km'"
                  :disabled="!filters.distance.on"
                  hide-details
                  v-model="filters.distance.value"
                  @mouseup="filterExplores()"
                  @keyup="filterExplores()"
        ></v-slider>

        <br>

        <v-subheader class="filter-header">
            <v-switch label="Max Duration"  color="primary" hide-details v-model="filters.duration.on"></v-switch>
        </v-subheader>
        <v-slider class="pa-0"
                  :min="filters.duration.min"
                  :max="filters.duration.max"
                  :label="filters.duration.value + ' hr'"
                  :disabled="!filters.duration.on"
                  hide-details
                  v-model="filters.duration.value"
                  @mouseup="filterExplores()"
                  @keyup="filterExplores()"
        ></v-slider>

        <br>

        <v-subheader class="filter-header">
            <v-switch label="Date" color="primary" hide-details v-model="filters.date.on"></v-switch>
        </v-subheader>
        <v-menu
                lazy
                transition="scale-transition"
                :nudge-right="40"
                min-width="290px"
                :disabled="!filters.date.on"
        >
            <v-text-field
                    slot="activator"
                    prepend-icon="event"
                    readonly
                    label="Choose a date"
                    v-model="filters.date.value"
                    :disabled="!filters.date.on"
            ></v-text-field>
            <v-date-picker
                    no-title
                    scrollable
                    v-model="filters.date.value"
                    :disabled="!filters.date.on"
                    :min="today"></v-date-picker>
        </v-menu>

        <v-subheader class="filter-header">
            <v-switch label="Part of the day" color="primary" hide-details v-model="filters.daypart.on"></v-switch>
        </v-subheader>
        <v-radio-group v-model="filters.daypart.value" style="padding: 0;">
            <v-checkbox
                    v-for="item in filters.dayparts"
                    :key="item.value"
                    :label="item.text"
                    :disabled="!filters.daypart.on"
                    v-model="item.on"
                    color="primary"
                    hide-details
            ></v-checkbox>
        </v-radio-group>
    </v-card>
</template>

<script>
    export default {
        props: ['explores'],
        data () {
            return {
                filters: {
                    distance: {
                        value: 1000,
                        min: 1,
                        max: 1000,
                        on: false
                    },
                    duration: {
                        value: 12,
                        min: 1,
                        max: 12,
                        on: false
                    },
                    date: {
                        value: null,
                        on: false
                    },
                    daypart: {
                        on: false
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
                            text: 'Noon',
                            value: 'noon',
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
                var now = new Date();
                var dd = now.getDate();
                var mm = now.getMonth()+1; //January is 0!
                var yyyy = now.getFullYear();

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

                                if (hours >= daypart.min && hours < daypart.max) {
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

                self.$parent.renderExplores(explores)
            },
        },
        mounted () {
            this.filters.date.value = this.today
        }
    }
</script>

<style>
    .filter-header {
        height: auto;
    }
</style>