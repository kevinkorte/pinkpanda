import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {zxcvbn} from 'zxcvbn';

import './settings.html';
import '../components/update_login/update_login.js';
import '../components/followers/edit_followers.js';
import '../components/changePassword/changePassword.js';

Template.settings.onRendered(function() {
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
})
