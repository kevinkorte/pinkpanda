import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import moment from 'moment';

import { Dates } from '../../../api/dates/dates.js';
import './_dates.html';


Template.edit_dates.onRendered(function() {
  Session.set('startdate', $('.end-date').data('date'));
  const start_date = $('.start-date').flatpickr({
    minDate: 'today',
    altInput: true,
    enableTime: true,
    defaultDate: $('.start-date').data('date'),
    onChange: function(selectedDates, dateStr, instance) {
      end_date.set('minDate', Date.parse(selectedDates[0]));
      Session.set('start_date', selectedDates[0]);
    }
  });
  const end_date = $('.end-date').flatpickr({
    minDate: Session.get('startdate'),
    altInput: true,
    enableTime: true,
    defaultDate: $('.end-date').data('date'),
    onChange: function(selectedDates, dateStr, instance) {
      start_date.set('maxDate', Date.parse(selectedDates[0]));
    }
  });
})