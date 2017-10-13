import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import flatpickr from 'flatpickr';
import './set-date.html';
import 'flatpickr/dist/flatpickr.min.css';

Template.setDate.onCreated(function() {

});

Template.setDate.onRendered(function() {
  let start_date = $('.start-date').flatpickr({
    minDate: 'today',
    altInput: true,
    enableTime: true,
    onChange: function(selectedDates, dateStr, instance) {
      Session.set('start-date-stamp', Date.parse(selectedDates[0]));
      // Meteor.call('set-start-timestamp', selectedDates[0]);
      console.log(typeof Session.get('start-date-stamp'));
      $('.end-date').flatpickr({
        minDate: Session.get('start-date-stamp'),
        altInput: true,
        enableTime: true,
      })
    }
  });
  let end_date = $('.end-date').flatpickr({
    minDate: 1508562000000,
    altInput: true,
    enableTime: true,
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
