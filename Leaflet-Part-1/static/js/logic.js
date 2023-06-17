// Define the URL for the GeoJSON data
let dataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Create the Leaflet map
let map = L.map('map').setView([0, 0], 2);

// Add the OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// Load and visualize the earthquake data
d3.json(dataUrl).then(function (data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      // Get the magnitude and depth of the earthquake
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];

      // Define the marker options
      let markerOptions = {
        radius: magnitude * 4, // Adjust the scale factor as needed
        fillColor: getColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      // Create a circle marker and add it to the map
      let circleMarker = L.circleMarker(latlng, markerOptions);

      // Bind a popup to the circle marker
      circleMarker.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth}<br>Location: ${feature.properties.place}`);

      return circleMarker;
    }
  }).addTo(map);
});

// Create a legend control
let legend = L.control({ position: 'bottomright' });

// Define the legend content
legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'legend');
  let depthRanges = ['-10 - 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '90+'];
  let colors = ['#00ff00', '#7fff00', '#ffff00', '#ffaa00', '#ff7f00', '#ff0000'];
  div.style.padding = '10px';
  div.style.backgroundColor = '#fff';

  // Create the legend HTML
  let labels = '';
  for (let i = 0; i < depthRanges.length; i++) {
    let color = colors[i];
    let label = depthRanges[i];
    labels += `<div style="display: flex; align-items: center; margin-right: 10px;">
      <div style="width: 20px; height: 20px; background-color: ${color};"></div>
      <div style="margin-left: 5px;">${label}</div>
    </div>`;
  }
  div.innerHTML = labels;

  return div;
};

// Add the legend control to the map
legend.addTo(map);

// Function to determine the marker color based on depth
function getColor(depth) {
  // Define a color scale based on depth 
  let colorScale = ['#7FFF00', '#FFFF00', '#FFD700', '#FFA500', '#FF4500', '#FF0000'];

  // Assign colors based on depth ranges 
  if (depth >= -10 && depth < 10) {
    return colorScale[0];
  } else if (depth >= 10 && depth < 30) {
    return colorScale[1];
  } else if (depth >= 30 && depth < 50) {
    return colorScale[2];
  } else if (depth >= 50 && depth < 70) {
    return colorScale[3];
  } else if (depth >= 70 && depth < 90) {
    return colorScale[4];
  } else if (depth >= 90) {
    return colorScale[5];
  }
}