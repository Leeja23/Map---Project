mapboxgl.accessToken = "pk.eyJ1Ijoic2hpZmEzMyIsImEiOiJjbTFjMDJzMmoyNWRvMnZzOGZzcXo3cHQ1In0.CLdUXxSpEVQV7OR2dhz6qw";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-122.4194, 37.7749], // Default center point (San Francisco)
    zoom: 10,
});

// Search for a location
document.getElementById("searchButton").addEventListener("click", function () {
    const location = document.getElementById("search").value;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates;
                map.flyTo({ center: coordinates, zoom: 14 });
            } else {
                alert("Location not found!");
            }
        })
        .catch((error) => console.error("Error fetching location:", error));
});

// Find nearby places
document.getElementById("findNearby").addEventListener("click", function () {
    const location = document.getElementById("search").value;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates;
                const resultsDiv = document.getElementById("results");
                resultsDiv.innerHTML = ""; // Clear previous results

                // Fetch nearby places using the coordinates
                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`)
                    .then((response) => response.json())
                    .then((data) => {
                        data.features.forEach((feature) => {
                            const resultItem = document.createElement("div");
                            resultItem.textContent = feature.place_name;
                            resultsDiv.appendChild(resultItem);
                        });
                    })
                    .catch((error) => console.error("Error fetching nearby places:", error));
            } else {
                alert("Location not found!");
            }
        })
        .catch((error) => console.error("Error fetching location:", error));
});

// Calculate distance between two locations
document.getElementById("calculateTwoLocations").addEventListener("click", function () {
    const firstLocation = document.getElementById("search").value;
    const secondLocation = document.getElementById("secondLocation").value;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(firstLocation)}.json?access_token=${mapboxgl.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.features.length > 0) {
                const firstCoords = data.features[0].geometry.coordinates;

                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(secondLocation)}.json?access_token=${mapboxgl.accessToken}`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.features.length > 0) {
                            const secondCoords = data.features[0].geometry.coordinates;

                            fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${firstCoords[0]},${firstCoords[1]};${secondCoords[0]},${secondCoords[1]}?access_token=${mapboxgl.accessToken}`)
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.routes.length > 0) {
                                        const distance = data.routes[0].distance;
                                        const distanceText = `Distance between ${firstLocation} and ${secondLocation} is ${Math.round(distance / 1000)} km.`;
                                        const resultsDiv = document.getElementById("results");
                                        resultsDiv.innerHTML = distanceText;
                                    } else {
                                        alert("No route found!");
                                    }
                                })
                                .catch((error) => console.error("Error fetching distance:", error));
                        } else {
                            alert("Second location not found!");
                        }
                    })
                    .catch((error) => console.error("Error fetching second location:", error));
            } else {
                alert("First location not found!");
            }
        })
        .catch((error) => console.error("Error fetching first location:", error));
});

// Get route between two locations
document.getElementById("getRoute").addEventListener("click", function () {
    const firstLocation = document.getElementById("search").value;
    const secondLocation = document.getElementById("secondLocation").value;
    const travelMode = document.getElementById("filterCategory").value;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(firstLocation)}.json?access_token=${mapboxgl.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.features.length > 0) {
                const firstCoords = data.features[0].geometry.coordinates;

                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(secondLocation)}.json?access_token=${mapboxgl.accessToken}`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.features.length > 0) {
                            const secondCoords = data.features[0].geometry.coordinates;

                            fetch(`https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${firstCoords[0]},${firstCoords[1]};${secondCoords[0]},${secondCoords[1]}?access_token=${mapboxgl.accessToken}`)
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.routes.length > 0) {
                                        const duration = data.routes[0].duration;
                                        const hours = Math.floor(duration / 3600);
                                        const minutes = Math.floor((duration % 3600) / 60);
                                        const travelTimeText = `Estimated travel time between ${firstLocation} and ${secondLocation} is ${hours} hours and ${minutes} minutes.`;
                                        const resultsDiv = document.getElementById("results");
                                        resultsDiv.innerHTML = travelTimeText;
                                    } else {
                                        alert("No route found!");
                                    }
                                })
                                .catch((error) => console.error("Error fetching travel time:", error));
                        } else {
                            alert("Second location not found!");
                        }
                    })
                    .catch((error) => console.error("Error fetching second location:", error));
            } else {
                alert("First location not found!");
            }
        })
        .catch((error) => console.error("Error fetching first location:", error));
});
