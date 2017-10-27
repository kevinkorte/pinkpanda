import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './userEmail.html';

import '../update_login/update_login.js';

Template.userEmail.helpers({
  getPrimaryUserEmail() {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    if ( user ) {
      if ( user.emails[0].address ) {
        return user.emails[0].address;
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
