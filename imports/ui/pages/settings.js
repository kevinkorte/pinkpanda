import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './settings.html';

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
    if ( user.services.facebook.link ) {
      return user.services.facebook.link;
    }
  }
})
