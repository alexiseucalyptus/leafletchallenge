// Initialize Leaflet map
var map = L.map('map', {
    center: [40, -100], // Center map
    zoom: 5 // Zoom level
});
// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://www.openstreetmap.org/fixthemap"><b>Improve this map</b></a>'
}).addTo(map);
// URL for earthquake GeoJSON data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}
// Function to determine marker color based on depth
function chooseColor(depth) {
    if (depth > 90) {
        return "red";
    } else if (depth > 70) {
        return "darkorange";
    } else if (depth > 50) {
        return "orange";
    } else if (depth > 30) {
        return "yellow";
    } else if (depth > 10) {
        return "yellowgreen";
    } else {
        return "green";
    }
}
// Function to create popup content for each earthquake marker
function createPopupContent(feature) {
    var popupContent = `<h3>${feature.properties.place}</h3>`; // Place or location of the earthquake
    popupContent += `<hr><p><b>Magnitude:</b> ${feature.properties.mag}<br>`; // Magnitude of the earthquake
    popupContent += `<b>Depth:</b> ${feature.geometry.coordinates[2]} km</p>`; // Depth of the earthquake
    // Date and time of the earthquake
    var timestamp = new Date(feature.properties.time);
    popupContent += `<p><b>Time:</b> ${timestamp.toLocaleString()}</p>`;
    return popupContent;
}
// Fetch earthquake data and add to map
d3.json(url).then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(createPopupContent(feature));
        }
    }).addTo(map);
});
// Create legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var depths = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += '<h3>Depth (km)</h3>';
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);