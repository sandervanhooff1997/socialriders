/**
 * Used to calculate a Google route
 * @type {google.maps.DirectionsService}
 */
export let directionsService = null
/**
 * Used to render a Google route
 * @type {google.maps.DirectionsRenderer}
 */
export let directionsRenderer = null

/**
 * Create's a Google Map
 * @param id
 * @param options
 * @returns {GoogleMap}
 */
export function init (el, options) {
    initDirections()
    return new google.maps.Map(el, options);
}

export function initDirections() {
    directionsService = new google.maps.DirectionsService
    directionsRenderer = new google.maps.DirectionsRenderer
}

/**
 * Get's the users position based on HTML5 Geolocation
 * @param map
 * @returns {{lat: Number, lng: Number}}
 */
export function getMyPosition (map) {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem("lat") && localStorage.getItem("lng")) {
            let myPosition = {
                lat: parseFloat(localStorage.getItem("lat")),
                lng: parseFloat(localStorage.getItem("lng"))
            }

            map.panTo(myPosition)
            resolve(myPosition)
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    let myPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }

                    localStorage.setItem("lat", myPosition.lat)
                    localStorage.setItem("lng", myPosition.lng)

                    map.panTo(myPosition)
                    resolve(myPosition)
                }, error => {
                    console.log('User dismissed location popup')
                    reject()
                });
            } else {
                console.log("Geolocation is not supported by your browser.")
                reject()
            }
        }
    })
}

/**
 * Creates a Google Maps places searchbox on the given map
 * @param map
 * @param input
 */
export function initSearchInput (map, input) {
    // selecting element by ID must be in $(document).ready()
    $(document).ready(function(){
        let searchBox = new google.maps.places.SearchBox(input);

        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        let markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            let places = searchBox.getPlaces();

            if (places.length === 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            let bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                let icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }

                return place
            });
            map.fitBounds(bounds);
        });
    })
}

import markerURL from '@/assets/maps/marker.png'
export function getMarker (map, pos) {
    return new google.maps.Marker({
        position: new google.maps.LatLng(pos.lat, pos.lng),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: {
            url: markerURL,
            scaledSize: new google.maps.Size(40, 40)
        }
    })
}

/**
 * Calculates and Displays route on the given map
 * @param map
 * @param explore
 * @returns {boolean}
 */
export function calculateAndDisplayRoute (map, explore) {
    if (explore !== null) {

        clearRoute()

        // wayPoints
        let wayPoints = []
        for (let i = 0; i < explore.wayPoints.length; i++) {
            if (explore.wayPoints[i].location) {
                wayPoints.push({
                    location: explore.wayPoints[i].location,
                    stopover: explore.wayPoints[i].stopover
                });
            }
        }

        // travelmode bases on selected vehicle
        const travelMode = explore.vehicle === 'bicycle' ? 'BICYCLING' : 'DRIVING'

        // calculate and display route
        directionsService.route({
            origin: explore.origin.location,
            destination: explore.destination.location,
            waypoints: wayPoints,
            optimizeWaypoints: false,
            travelMode: travelMode,
            avoidFerries: explore.routeOptions.avoidFerries,
            avoidHighways: explore.routeOptions.avoidHighways,
            avoidTolls: explore.routeOptions.avoidTolls,
        }, function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(response)

                const route = response.routes[0];
                let data = {
                    distance: 0,
                    duration: 0
                };

                //For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                    data.distance += route.legs[i].distance.value
                    data.duration += route.legs[i].duration.value
                }

                return data
            }
        });
    }
}

export function clearRoute () {
    directionsRenderer.setMap(null);
}