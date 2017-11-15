import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Dates } from '../../../api/dates/dates.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import './date_can_edit.html';
import '../../components/notifications/notifications.js';

Template.date_can_edit.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('dates.single', FlowRouter.getParam('id'), function() {
      Tracker.afterFlush(function() {
        let date = Dates.findOne();
        const start_date = $('.start-date').flatpickr({
          minDate: 'today',
          altInput: true,
          enableTime: true,
          onChange: function(selectedDates, dateStr, instance) {
            end_date.set('minDate', Date.parse(selectedDates[0]));
            Session.set('start_date', selectedDates[0]);
          }
        });
        const end_date = $('.end-date').flatpickr({
          minDate: 'today',
          altInput: true,
          enableTime: true,
          onChange: function(selectedDates, dateStr, instance) {
            start_date.set('maxDate', Date.parse(selectedDates[0]));
          }
        });
        start_date.setDate(date.starting);
        end_date.setDate(date.ending);
      });
    } );

    GoogleMaps.ready('locationMap', function(map) {
      let marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
    });
  });
});

Template.date_can_edit.onRendered(function() {
  GoogleMaps.initialize();
});

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
});

Template.date_can_edit.events({
  'click #check-in'(event) {
    console.log(event, 'check in');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('addEvent', lat, lng, accuracy, timestamp, id, function(error, response) {
          if ( error && error.error === "add-event" ) {
            Bert.alert( error.reason, "warning" );
          } else {
            console.log('success');
          }
        });
      });
    } else {
      console.log('no geo');
    }
  }
})
