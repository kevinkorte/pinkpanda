import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import flatpickr from 'flatpickr';
import './set-date.html';
import 'flatpickr/dist/flatpickr.min.css';

Template.setDate.onRendered(function() {
  let start_date = $('.start-date').flatpickr({
    minDate: "today",
    dateFormat: "D, M J, Y"
  });
  $('.start-time').flatpickr({
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K"
  });
});
Template.setDate.events({
  'change .start-date'(event, selectedDates, dateStr, instance) {
    console.log(event.target.value);
    console.log(selectedDates);
    console.log(dateStr);
    console.log(instance);
  }
})
