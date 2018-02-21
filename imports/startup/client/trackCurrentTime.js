import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Meteor.startup(function() {
  Meteor.setInterval(function() {
    Session.set("time", new Date().getTime());
  }, 15000);
});
