
//GEOG 572 Lab 4
// Mackenzie Karnstein

//Note: ChatGTP was used to guide code development/editing [including for explaining javascript and Leaflet logistics, editing, and troubleshooting.]
//Load the data
function jsAjax(){
    //use Fetch to retrieve data
    
    fetch('watershed_c.geojson')
        .then(conversion) //convert data to usable form
        .then(callback) //send retrieved data to a callback function
    };

function add_ecoregion_layer(){
    fetch('ecoregions.geojson')
        .then(conversion1)
        .then(callback1)    
    };

//declare global map variables
var map;
var geojson;
var geojson_eco;

function style(feature) {
    return {
        fillColor: '#102c18',
        fillOpacity: 0,
        weight: 2,
        opacity: 1,
        color: '#606260',
        dashArray: '3'
    };
}

function style_eco(feature) {
    return {
        fillColor: '#2c1026',
        fillOpacity: 0,
        weight: 4,
        opacity: 1,
        color: 'black'
    };
}

//define conversion function
function conversion(response){
  //convert data to usable form
  return response.json();
}

//define popup function
    function wsc_popupfunction(feature,layer){
        var wscproperties = feature.properties;
        var popupContent = " ";

        if (wscproperties.altName){
            popupContent += "<p style= 'color: #098a58; font-weight: bold'>" + wscproperties.altName +"</p>";
        }
        if (wscproperties.WC_ID){
            popupContent += "<p style= 'color: #098a58'>Watershed Council ID: " + wscproperties.WC_ID +"</p>";
        }
        if (wscproperties.Acres){
            popupContent += "<p style= 'color: #098a58'>Area in Acres: " + wscproperties.Acres +"</p>";
        }
        layer.bindPopup(popupContent);
        };
//define callback function
function callback(response2){

    console.log(response2);
    //create map element
    map = L.map('map').setView([44.0, -120.5], 7);
    //add tile layer
    var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/karnstem/cmlx4vfhv000d01rjaxx380lj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FybnN0ZW0iLCJhIjoiY21seGZrYmNiMDA0czNlcHZrcjQ1dzg1ZCJ9.JUCwNbPY--UoMdP55vyNuw', {
        maxZoom: 19, 
        attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>, <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://apps.mapbox.com/feedback/#/44.0/-120.5/6.1">Mapbox</a>'
    }).addTo(map);

    //create geojson variable
    var geojson;

    //highlight and unhighlight features
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#ff00b3',
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
        });
    }

    //Add watershed council features to map
    geojson = L.geoJson(response2, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    //start function for loading ecoregions layer
    add_ecoregion_layer();
}

//define conversion1 function
function conversion1(response_eco){
  //convert data to usable form
  return response_eco.json();
}

//define callback1 function
function callback1(response_eco2){
    console.log(response_eco2);

    //Add ecoregion features to map
     geojson_eco = L.geoJson(response_eco2, {
        style: style_eco,
        interactive: false,
        onEachFeature: function(feature, layer){
            let textColor;
            switch(feature.properties.LEVEL3_NAM){
                case "Blue Mountains":
                    textColor = "Blue-Mountains";
                    break;
                case "Willamette Valley":
                    textColor = "Willamette-Valley";
                    break;
                case "Eastern Cascades Slopes and Foothills":
                    textColor = "Eastern-Cascades-Slopes-and-Foothills";
                    break;
                case "Northern Basin and Range":
                    textColor = "Northern-Basin-and-Range";
                    break;
                case "Klamath Mountains":
                    textColor = "Klamath-Mountains";
                    break;
                case "Coast Range":
                    textColor = "Coast-Range";
                    break;
                case "Cascades":
                    textColor = "Cascades";
                    break;
                case "Snake River Plain":
                    textColor = "Snake-River-Plain";
                    break;
                case "Columbia Plateau":
                    textColor = "Columbia-Plateau";
                    break;
                default:
                    textColor = "default-color"

            }
            let label = feature.properties.LEVEL3_NAM

            if (label === "Eastern Cascades Slopes and Foothills"){
                label = "Eastern Cascades<br><span class ='indent'>Slopes and Foothills</span>";
            }
            layer.bindTooltip(label, {permanent: true, direction: "center", className: textColor});
        }
    }).addTo(map);
//Restrict which zoom extent the labels are visible
    map.fire("zoomend");
    map.on("zoomend", function(){
        if (map.getZoom() > 6){
            map.addLayer(geojson_eco);
        } 
        else{
            map.removeLayer(geojson_eco);
        }
});
}
window.onload = jsAjax;

