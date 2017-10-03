import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import flatpickr from 'flatpickr';
import './set-date.html';
import 'flatpickr/dist/flatpickr.min.css';

Template.setDate.onRendered(function() {
  let start_date = $('.start-time').flatpickr({
    minDate: "today",
    enableTime: true,
    dateFormat: 'D n-j-y h:i K'
  });
  let end_date = $('.end-time').flatpickr({
    enableTime: true,
    minDate: Session.get('start-date')
  })
});
Template.setDate.events({
  'change .start-time'(event, selectedDates, dateStr, instance) {
    console.log(event.target.value);
    Session.set('start-date', new Date(event.target.value));
    console.log(selectedDates);
    console.log(dateStr);
    console.log(instance);
  }
})
