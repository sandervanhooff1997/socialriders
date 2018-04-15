<template>
    <div>
        <div id="map"></div>
    </div>
</template>

<script>
    import mapboxgl from 'mapbox-gl';

    export default {
        data () {
            return {
                map: null
            }
        },
        mounted () {
            mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZoMTk5NyIsImEiOiJjamZ4bmF0azQweWF1MnprZG02ZTB6dWFsIn0.-058LEniBsf5Tcoy12SVhQ';
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v9',
                center: {lat: 	52.379189, lng: 4.899431},
                zoom: 8,
            });
        }
    }
</script>

<style>
    #map{
        width: 100%;
        height: 500px;
    }
</style>