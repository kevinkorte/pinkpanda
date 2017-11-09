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
  getUserName(id) {
    let user = Meteor.users.findOne(id);
    if ( user ) {
      return user.emails[0].address;
    }
  },
  cardDate(timestamp) {
    return moment(timestamp).format('MMM Do h:mm a');
  },
  getNumOfFollowers(id) {
    let dates = Dates.findOne(id);
    if (dates) {
      if (dates.followers) {
        let num = Object.keys(dates.followers).length;
        return num;
      } else {
        return 0;
      }
    }
  },
})
