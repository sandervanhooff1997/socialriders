<template>
    <div style="width: 100%;">
        <gmap-map
                :center="{lat:center.lat, lng:center.lng}"
                :zoom="zoom"
                style="width: 100%; height: 100%;"
        >
            <gmap-marker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :draggable="true"
                    @click="center=m.position"
            ></gmap-marker>
        </gmap-map>
    </div>
</template>

<script>
    import Vue from 'vue'
    import * as VueGoogleMaps from 'vue2-google-maps'

    Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyAC9MaB6QrqhIRNdXwtE7noNUFtq0BxcH4',
            libraries: 'places', // This is required if you use the Autocomplete plugin
            // OR: libraries: 'places,drawing'
            // OR: libraries: 'places,drawing,visualization'
            // (as you require)
        }
    })

    export default {
        name: 'Explore',
        data () {
            return {
                center: {lat: 52.38, lng: 4.90}, // default location is Amsterdam
                zoom: 8,
                markers: [{
                    position: {lat: 48.51, lng: 6.73}
                }, {
                    position: {lat: 49.58, lng: 5.42}
                }]
            }
        },
        computed: {
          user () {
              return this.$store.getters.user
          }
        },
        methods: {
            getLocation: function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.changeLocation, this.error);
                } else {
                    return false;
                }
            },
            changeLocation: function (position) {
                this.center.lat = position.coords.latitude;
                this.center.lng = position.coords.longitude;
            }
        },
        created: function() {
            this.getLocation();
            console.log(this.user)
        }
    }


</script>