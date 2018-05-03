import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './tabs.html';

Template.tabs.helpers({
  getPrimaryUserEmail() {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    if ( user ) {
      if ( user.emails[0].address ) {
        return user.emails[0].address;
      }
    }
  },
  getUserName() {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    if ( user ) {
      if ( user.profile.name.first) {
        return user.profile.name.first + ' ' + user.profile.name.last;
      }
    }
  },
  getUserInitials() {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    if ( user ) {
      if ( user.profile.name.first) {
        let first = user.profile.name.first;
        let last = user.profile.name.last;
        let f = first.charAt(0);
        let l = last.charAt(0);
        return f + l;
      }
    }
  },
  userEmailIsVerified() {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    if ( user ) {
      if ( user.emails[0].verified ) {
        return true;
      }
    }
  }
});
