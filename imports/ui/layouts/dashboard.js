import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Dates } from '../../api/dates/dates.js';

import moment from 'moment';

import "./dashboard.html";
import '../components/navigation.js';

Template.dashboard.onCreated(function() {
  let self = this;
  self.autorun(function() {
    console.log(self.subscribe('dates.all'));
    self.subscribe('dates.all');
  });
});

Template.dashboard.helpers({
  dates() {
    let dates = Dates.find()
    return dates;
  },
  getStartHour(timestamp) {
    return moment(timestamp).format('ha');
  },
  getStartDay(timestamp) {
    let month = moment(timestamp).format('MMM');
    let day = moment(timestamp).format('D');
    return '<small>'+month+'</small><span class="font-weight-bold">'+day+'</span>';
  },
  getEndHour(timestamp) {
    return moment(timestamp).format('ha');
  }
})
