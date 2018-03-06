var map ;
var myPosition ;
var geocoder ;
var myAddress ;
var markers= [];

// to locate the user
function showMyPosition () {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
          myPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
    
          map.setCenter(myPosition);
          map.setZoom(11);
          var marker = new google.maps.Marker({
              position: myPosition,
              map: map   
          }); 
          coordToCity (myPosition)
          addInfoWindow (marker,"You're Here");
          
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }    
}

// to show restaurants on the map
function addRestaurantsOnMap (restaurants) {
    removeMarkerOnMap();
    var location;

    for(var i=0; i<restaurants.length; i++) {
        var name = restaurants[i].properties.name;
        var price = restaurants[i].properties.prix;
        var address = restaurants[i].properties.adress;
        var lat = restaurants[i].properties.latitude;
        var lng = restaurants[i].properties.longitude;
        location  = new google.maps.LatLng(lat,lng)

        var marker = new google.maps.Marker ({
              position: location,
              map: map
            }); 
        map.setZoom(11);
        addInfoWindow (marker, name);
        showListOfRestaurants (name, price, address);
        markers.push(marker);
    }

}

// to remove restaurants that have been on the map
function removeMarkerOnMap (){
    if(markers.length>0){
        for(var i=0; i<markers.length; i++){
          markers[i].setMap(null);
        }
        markers = [];
    }
}

// to show the list of the restaurants on the page
function showListOfRestaurants (name, price, address){
    var ul = document.getElementById("list");
    var li = document.createElement("li");
    var h4 = document.createElement("h4");
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");

    h4.appendChild(document.createTextNode(name));
    p1.appendChild(document.createTextNode("price: "+price));
    p2.appendChild(document.createTextNode("address: "+address));
    li.appendChild(h4);
    li.appendChild(p1);
    li.appendChild(p2);

    li.setAttribute("class", "list-group-item");
    ul.appendChild(li);
}

// to initialize the map
function initMap (){
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: new google.maps.LatLng(46.227638 , 2.213749),
    styles: [{"featureType":"water","stylers":[{"saturation":40},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]

  });
  geocoder = new google.maps.Geocoder;
}

// to return the city of the user using his geographic coordinates
function coordToCity (location) {
    geocoder.geocode({
        'location': location
    }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                myAddress = results[0].formatted_address;
                var myCity = results[0].address_components[2].long_name;
                document.getElementById('city').value = myCity;
            } else {
                window.alert('No results found');
              }
          }else {
              alert("Geocode was not successful for the following reason: " + status);
        }
      
    });
}

// to remove the list of restaurants on the page
function removeListOfRestaurants(){
    var node = document.getElementById('list');
        while (node.firstChild) {
        node.removeChild(node.firstChild);
        }

}

// to make the research done by the user
function research(){
    removeListOfRestaurants();
    var city = document.getElementById("city").value;
    search = document.getElementById("search").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var response = this.responseText ;
          if (response != 'erreur'){
            var myJson = JSON.parse(JSON.parse(JSON.stringify(response)));
            addRestaurantsOnMap(myJson,map)
          }
          else alert('Erreur');
       }
       
      };
        if (search != '') {
          xhttp.open("GET", "http://localhost:8181/data/"+city+"/"+search, true);
          xhttp.send();
           }
        else 
        {
          xhttp.open("GET", "http://localhost:8181/data/"+city, true);
          xhttp.send();
        }
}

// to add infos on a narker 
function addInfoWindow(marker, message) {

  var infoWindow = new google.maps.InfoWindow({
      content: message
  });
  infoWindow.open(map, marker);
}
