//Load the data
function jsAjax(){
    //use Fetch to retrieve data
    fetch('watershed_c.geojson')
        .then(conversion) //convert data to usable form
        .then(callback) //send retrieved data to a callback function
};

//declare global map variables
var map;

function style(feature) {
    return {
        fillColor: '#102c18',
        fillOpacity: 0,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3'
    };
}
//define conversion callback function
function conversion(response){
  //convert data to usable form
  return response.json();
}

//define popup function
    function wsc_popupfunction(feature,layer){
        var wscproperties = feature.properties;
        var popupContent = " ";

        if (wscproperties.altName){
            popupContent += "<p>Watershed Council Name: " + wscproperties.altName +"</p>";
        }
        if (wscproperties.WC_ID){
            popupContent += "<p>Watershed Council ID: " + wscproperties.WC_ID +"</p>";
        }
        if (wscproperties.Acres){
            popupContent += "<p>Area in Acres: " + wscproperties.Acres +"</p>";
        }
        layer.bindPopup(popupContent);
        };

function callback(response2){
    alert("Leaflet loaded");
    //tasks using the data go here
    console.log(response2);
    //create map element
    map = L.map('map').setView([44.0, -120.5], 6.1);
    //add tile layer
    var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/karnstem/cmlx4vfhv000d01rjaxx380lj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FybnN0ZW0iLCJhIjoiY21seGZrYmNiMDA0czNlcHZrcjQ1dzg1ZCJ9.JUCwNbPY--UoMdP55vyNuw', {
        maxZoom: 19, 
        attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>, <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://apps.mapbox.com/feedback/#/44.0/-120.5/6.1">Mapbox</a>'
    }).addTo(map);
    //'https://api.mapbox.com/styles/v1/karnstem/cmlx4vfhv000d01rjaxx380lj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FybnN0ZW0iLCJhIjoiY21seGZrYmNiMDA0czNlcHZrcjQ1dzg1ZCJ9.JUCwNbPY--UoMdP55vyNuw'
    //create geojson variable
    var geojson;
//L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //  maxZoom: 19,
   // attribution:'&copy; OpenStreetMap'
//}).addTo(map);
    //ASSIGN CHOROPLETH MAP CHARACTERISTICS
    //create info display variable
    var info = L.control();
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#d4ff00',
            dashArray: '',
            fillOpacity: 0.7
        });

        layer.bringToFront();
    }
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        wsc_popupfunction(feature,layer)
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    //ADD GEOJSON FEATURES TO MAP
    geojson = L.geoJson(response2, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
}
    
window.onload = jsAjax;

