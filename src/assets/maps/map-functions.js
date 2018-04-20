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
    if (localStorage.getItem("lat") && localStorage.getItem("lng")) {
        let myPosition = {
            lat: parseFloat(localStorage.getItem("lat")),
            lng: parseFloat(localStorage.getItem("lng"))
        }

        map.setCenter(myPosition)

        return myPosition
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let myPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }

                localStorage.setItem("lat", myPosition.lat)
                localStorage.setItem("lng", myPosition.lng)

                map.setCenter(myPosition)

                return myPosition
            });
        } else {
            console.log("Geolocation is not supported by your browser.")
        }
    }
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

export function addMarker (map, pos) {
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(pos.lat, pos.lng),
        map: map,
        animation: google.maps.Animation.DROP
    })
    return marker
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
                    stopover: true
                });
            }
        }

        // travelmode bases on selected vehicle
        const travelMode = explore.vehicle === 'bicycle' ? 'BICYCLING' : 'DRIVING'

        // calculate and display route
        directionsService.route({
            origin: explore.startPoint.location,
            destination: explore.endPoint.location,
            waypoints: wayPoints,
            optimizeWaypoints: false,
            travelMode: travelMode,
            avoidFerries: explore.options.avoidFerries,
            avoidHighways: explore.options.avoidHighways,
            avoidTolls: explore.options.avoidTolls,
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