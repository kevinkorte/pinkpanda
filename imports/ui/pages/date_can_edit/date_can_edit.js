import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Dates } from '../../../api/dates/dates.js';

import './date_can_edit.html';

Template.date_can_edit.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('dates.single', FlowRouter.getParam('id') );
    GoogleMaps.ready('locationMap', function(map) {
      let marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
    });
  });
  // let map = new google.maps.Map(document.getElementById('map'), {
  //   zoom: 17
  // });
  // map.setCenter({ lat: 46.2267042, lng:-119.24917970000001 });
  // let marker = new google.maps.Marker({
  //   map: map,
  //   position: { lat: 46.2267042, lng:-119.24917970000001 }
  // })
});

Template.date_can_edit.onRendered(function() {
  let self = this;
  self.autorun(function() {
    let date = Dates.findOne();
    if ( date ) {
      Session.set('lat', date.lat);
      Session.set('lng', date.lng);
    }
  });
});

Template.date_can_edit.onDestroyed(function() {
  Session.set('lat', null);
  Session.set('lng', null);
})

Template.date_can_edit.helpers({
  date() {
    return Dates.findOne();
  },
  locationMapOptions() {
    if ( GoogleMaps.loaded() ) {
      let dates = Dates.findOne(FlowRouter.getParam('id'));
      console.log(dates);
      if ( dates ) {
        return {
          center: new google.maps.LatLng(dates.lat, dates.lng),
          zoom: 17
        };
      }
    };
  }
})
