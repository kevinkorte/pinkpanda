import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import "./dashboard.html";

Template.dashboard.helpers({
  getProfilePicUrl() {
    let user = Meteor.users.findOne(Meteor.userId());
    if ( user ) {
      return user.profilePicture;
    }
  }
})
