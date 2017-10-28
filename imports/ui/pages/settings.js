import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {zxcvbn} from 'zxcvbn';

import './settings.html';
import './followers/followers.js';
import '../components/settings/nav/tabs.js';
import '../components/settings/account/userEmail.js';
import '../components/settings/password/password.js';
import '../components/settings/card/card.js';
import '../components/settings/subscription/subscription.js';
import '../components/followers/edit_followers.js';

Template.settings.onRendered(function() {
  Meteor.subscribe('subs.all');
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
});

Template.settings.helpers({
  hasFacebookProfile() {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    if ( user ) {
      if ( user.services.facebook ) {
        return true;
      } else {
        return;
      }
    }
  },
  getFacebookProfileUrl() {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    if ( user ) {
      if ( user.services.facebook.link ) {
        return user.services.facebook.link;
      }
    }
  }
});

Template.settings.events({
  'click #send-verification-email'(event) {
    Meteor.call('send_verification_email', (error, response) => {
      if ( error ) {
        console.log(error);
      } else {
        Bert.alert( 'Verification email sent, check your email.', 'success', 'fixed-top', 'fa-check');
      }
    })
  }
})
