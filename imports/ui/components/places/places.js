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
    console.log('event listener');
    let place = autocomplete.getPlace();
    Session.set('place', place);
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
  }
})
