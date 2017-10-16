import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
// import google from 'googleapis';
// var googleMapsClient = require('@google/maps').createClient({
//   key: API_KEY
// });

import './places.html';

Template.places.onRendered( function() {
  let input = document.getElementById('place');
  autocomplete = new google.maps.places.Autocomplete(input);
  console.log(autocomplete);
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    Session.set('place', place);
    Session.set('place_photo', place.photos[0].getUrl({maxWidth: 640}))
    console.log(place.photos[0].getUrl({maxWidth: 640}));
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17
    });
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': place.formatted_address}, function( results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status)
      }
    })
  })
});

Template.places.helpers({
  getPlace() {
    let place = Session.get('place');
    if ( place ) {
      return place;
    } else {
      return;
    }
  },
  getPlacePhoto() {
    let photo = Session.get('place_photo');
    if ( photo ) {
      return photo;
    } else {
      return;
    }
  }
})
