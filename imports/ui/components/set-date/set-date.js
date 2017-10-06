import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import flatpickr from 'flatpickr';
import './set-date.html';
import 'flatpickr/dist/flatpickr.min.css';

Template.setDate.onCreated(function() {

});

Template.setDate.onRendered(function() {
  let start_date = $('.start-date').flatpickr({
    minDate: "today",
    altInput: true,
    onChange: function(selectedDates, dateStr, instance) {
      Session.set('start-date-stamp', selectedDates[0]);
    }
  });
  let start_time = $('.start-time').flatpickr({
    enableTime: true,
    noCalendar: true,
    altInput: true,
    // dateFormat: 'h:i K'
    onChange: function(selectedDates, dateStr, instance) {
      let hour = selectedDates[0].getHours();
      let min = selectedDates[0].getMinutes();
      let date = new Date(Session.get('start-date-stamp'));
      date.setHours(hour);
      date.setMinutes(min);
      console.log(date.toISOString());
      console.log(new Date().toISOString());
      // Meteor.call('saveDate', date.toISOString());
    }
  });
  let end_time = $('.end-time').flatpickr({
    enableTime: true,
    noCalendar: true,
    altInput: true,
    dateFormat: 'h:i K'
  });
  let end_date = $('.end-date').flatpickr({
    minDate: "today",
    altInput: true,
    // dateFormat: 'D n-j-y'
  })
});
Template.setDate.events({
  'change .start-date'(event, selectedDates, dateStr, instance) {
    Session.set('start-date', event.target.value);
    if ( Session.get('start-date') ) {
      $('.end-date').flatpickr({
        minDate: Session.get('start-date'),
        altInput: true,
        // dateFormat: 'D n-j-y'
      })
    }
  },
  // 'change .start-time'(event, selectedDates, dateStr, instance) {
  //   console.log(event.target.value);
  //   console.log(selectedDates, dateStr, instance);
  // }
})
