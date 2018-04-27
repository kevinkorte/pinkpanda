import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './_dates.html';


Template.edit_dates.onRendered(function() {
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
})