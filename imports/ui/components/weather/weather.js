import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import moment from 'moment';

import './weather.html';

Template.weather.onRendered(function() {
  Tracker.autorun(() => {
    let start_date = Session.get(start_date);
    console.log(start_date);
    // if ( start_date ) {
    //   let within10days = moment(start_date).add(10, 'days');
    //   let today = moment();
    //   if ( within10days.isSameOrAfter(today) ) {
    //     console.log('yes');
    //   } else {
    //     console.log('no')
    //   }
    // }
  })
});
