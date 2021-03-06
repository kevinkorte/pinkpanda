import { Meteor } from 'meteor/meteor';
import { Dates } from '../imports/api/dates/dates.js';
import { SyncedCron } from 'meteor/percolate:synced-cron';

SyncedCron.config({log: false});

Meteor.startup(function() {
  SyncedCron.start();
});

SyncedCron.add({
  name: "Any jobs need auto start?",
  schedule: function(parser) {
    return parser.text('every 15 seconds');
  },
  job: function() {
    console.log('checking jobs');
    let dates = Dates.find({active: false, starting: { $lte: new Date().toISOString() } } ).fetch();
    console.log('dates', dates);
    dates.forEach(function(date) {
      console.log('solo date');
      Meteor.call('autoStartDate', date._id);
    });
  }
});

SyncedCron.add({
  name: "Have any jobs expired but not closed?",
  schedule: function(parser) {
    return parser.text('every 15 seconds');
  },
  job: function() {
    console.log('checking for expired jobs');
    let dates = Dates.find({active: true, ending: { $lte: new Date().toISOString() }, alertsSent: false }).fetch();
    console.log('expired', dates);
    dates.forEach(function( date ) {
      Meteor.call('autoEndDate', date._id);
    });
  }
});
