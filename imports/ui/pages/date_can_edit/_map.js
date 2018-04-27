import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Dates } from '../../../api/dates/dates.js';

import './_map.html';

Template.map.onRendered(function() {
  $('#editModal').on('shown.bs.modal', () => {
    let center = GoogleMaps.maps.editableMap.instance.getCenter();
    google.maps.event.trigger(GoogleMaps.maps.editableMap.instance, "resize");
    GoogleMaps.maps.editableMap.instance.setCenter(center);
  });
})

Template.map.onCreated(function() {
  
  GoogleMaps.ready('editableMap', function(map) {
    let marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      draggable: true
    });
  });
});

Template.map.helpers({
  editableMapOptions() {
    if ( GoogleMaps.loaded() ) {
      let dates = Dates.findOne(FlowRouter.getParam('id'));
      if ( dates ) {
        return {
          center: new google.maps.LatLng(dates.lat, dates.lng),
          zoom: 15
        };
      }
    };
  },
});

Template.map.events({
  'click #edit-btn'(event) {
    let center = GoogleMaps.maps.editableMap.instance.getCenter();
    console.log(center);
    console.log(GoogleMaps.maps.editableMap.instance);
    google.maps.event.trigger(GoogleMaps.maps.editableMap.instance, "resize");
    GoogleMaps.maps.editableMap.instance.setCenter(center);
  }
})