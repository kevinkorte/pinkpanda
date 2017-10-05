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
  });
  let start_time = $('.start-time').flatpickr({
    enableTime: true,
    noCalendar: true,
    altInput: true,
    dateFormat: 'h:i K'
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
    dateFormat: 'D n-j-y'
  })
});
Template.setDate.events({
  'change .start-date'(event, selectedDates, dateStr, instance) {
    console.log(event.target.value);
    Session.set('start-date', event.target.value);
    if ( Session.get('start-date') ) {
      $('.end-date').flatpickr({
        minDate: Session.get('start-date'),
        altInput: true,
        dateFormat: 'D n-j-y'
      })
    }
  },
  'change .start-time'(event, selectedDates, dateStr, instance) {
    console.log(event.target.value);
    console.log(selectedDates, dateStr, instance);
  }
})
