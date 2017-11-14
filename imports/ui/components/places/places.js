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
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    Session.set('place', place);
    $('#placeName').val(place.name);
    $('#formatted_address').val(place.formatted_address);
    $('#phone').val(place.formatted_phone_number);
    $('#url').val(place.website);
    $('#lat').val(place.geometry.location.lat());
    $('#lng').val(place.geometry.location.lng());
    // Session.set('place_photo', place.photos[0].getUrl({maxWidth: 640}))
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17
    });
    map.setCenter(place.geometry.location);
    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
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
  },
  hasPhoneNumber() {
    let place = Session.get('place');
    if ( place.formatted_phone_number ) {
      return true;
    }
  },
  hasWebsite() {
    let place = Session.get('place');
    if ( place.website ) {
      return true;
    }
  }
})
