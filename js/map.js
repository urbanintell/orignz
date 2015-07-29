var map, service, infowindow,
  // Create an array of styles.
  styles = [{
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
      "visibility": "on"
    }, {
      "color": "#aee2e0"
    }]
  }, {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#abce83"
    }]
  }, {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#769E72"
    }]
  }, {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#7B8758"
    }]
  }, {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#EBF4A4"
    }]
  }, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
      "visibility": "simplified"
    }, {
      "color": "#8dab68"
    }]
  }, {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{
      "visibility": "simplified"
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#5B5B3F"
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#ABCE83"
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{
      "color": "#A4C67D"
    }]
  }, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
      "color": "#9BBF72"
    }]
  }, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
      "color": "#EBF4A4"
    }]
  }, {
    "featureType": "transit",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{
      "visibility": "on"
    }, {
      "color": "#87ae79"
    }]
  }, {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#7f2200"
    }, {
      "visibility": "off"
    }]
  }, {
    "featureType": "administrative",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#ffffff"
    }, {
      "visibility": "on"
    }, {
      "weight": 4.1
    }]
  }, {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#495421"
    }]
  }, {
    "featureType": "administrative.neighborhood",
    "elementType": "labels",
    "stylers": [{
      "visibility": "off"
    }]
  }];
var geocoder = new google.maps.Geocoder();

// Where the magic happens
function initialize() {

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles, {
    name: "Styled Map"
  });

// Detailing map
  var mapOptions = {
    zoom: 5,
    center: {
      lat: 29.5424,
      lng: -95.0203
    },
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    panControl: true,
    zoomControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {

      mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'map_style'],
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_CENTER
    },
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.HYBRID,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },

    scaleControl: true
  }


  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);

      // INITIAL GEOCODE
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      geocoder.geocode({
        'location': latlng
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {

            spotifyArtistLocation(results[1].formatted_address);


          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
      // GEOCODE END



      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }



  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  // Google maps marker
  var marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: "Drag me!"
  });


// Returns a list of artist to a table on dragend event
  google.maps.event.addListener(marker, 'dragend', function(event) {

    getCurrentLocation(marker);


  });


  // Info Window 
  infowindow = new google.maps.InfoWindow({
    content:"<b>Find artist from all over, by dragging this marker to any region</b> ",
    position:  new google.maps.LatLng(29.5424,-95.0203),
    maxWidth: 200,
    maxHeight:200
  });
  infowindow.open(map,marker);
  // google.maps.event.addListener(marker,'click',function(event){
  //     infowindow.open(map,marker);
  // });

}
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", function() {
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
});



// Returns error if user location cannot be found
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  map.setCenter(options.position);
}

// This method gets all artist from marker location
function spotifyArtistLocation(place) {

  // returns all artist location data
  var location = place.split(",");

  // removes zip code and only returns region
  var region = location[1].replace(/[0-9]/g, '');
  var musicians = [];
  // calls to echno nest api to get artist info
  var url = "http://developer.echonest.com/api/v4/artist/search?api_key=OVWM6RQZJFUWG1AMW&format=json&artist_location=" + region + "&bucket=artist_location&results=40";
  console.log("WE ARE HERE: ", location[1].replace(/[0-9]/g, ''));
  $.getJSON(url, function(artistLocationResponse) {
    for (var response in artistLocationResponse.response.artists) {
      musicians.push(artistLocationResponse.response.artists[response]);

    }
    drawTable(musicians);
    // console.log(musicians);

  });
}

google.load("visualization", "1.1", {
  packages: ["table"]
});
google.setOnLoadCallback(drawTable);


// This method creates the google maps table and populates it with artist names
function drawTable(musicians) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Musician');
  data.addColumn('string', 'Origin');
  // data.addColumn('string', 'Video');


  for (var name in musicians) {

    // var artist_id = musicians[name]['id'];

    // var url = "http://developer.echonest.com/api/v4/artist/video?api_key=OVWM6RQZJFUWG1AMW&id=" + artist_id + "&format=json&results=1&start=0";
    // var videos = [];

    // $.getJSON(url, function(artistVideo) {
    //   for (var video in artistVideo.response.video) {
    //     console.log(artistVideo.response.video[video]['url']);
    //     videos.push(artistVideo.response.video[video]['url']);

    //   }
    // });
    // var videoLink = "Link";
    // , videoLink.link(videos[name]) 
    data.addRow([musicians[name]['name'], musicians[name]['artist_location']['location'] ]);


  }

 


  var table = new google.visualization.Table(document.getElementById('table_div'));

  table.draw(data, {
    width: '100%',
    height: '100%',
    allowHTML: true
  });

}



function getCurrentLocation(marker) {
  var latlng = new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
  geocoder.geocode({
    'location': latlng
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {

        spotifyArtistLocation(results[1].formatted_address);


      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('No Artist where found in this location');
    }
  });
}