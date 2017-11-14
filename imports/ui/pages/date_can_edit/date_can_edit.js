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
        start_date.setDate(date.starting);
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
})
