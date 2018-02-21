import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import flatpickr from 'flatpickr';
import './set-date.html';
import 'flatpickr/dist/flatpickr.min.css';

Template.setDate.onCreated(function() {

});

Template.setDate.onRendered(function() {
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
});
