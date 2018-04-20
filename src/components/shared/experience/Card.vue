<template>
    <div>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <h3 class="title mb-0">{{experience.title}}</h3>
                    <v-list two-line>
                        <v-list-tile avatar>
                            <v-list-tile-avatar>
                                <v-icon>date_range</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>{{experience.startPoint.address}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{experience.date | date}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </div>
            </v-card-title>
            <v-card-actions>
                <v-btn round color="primary" :to="{name: 'Experience', params: {id: experience.id}}">View</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: ['experience'],
    }
</script>