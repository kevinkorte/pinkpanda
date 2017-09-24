import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './navigation.html';

Template.dashboard_navigation.helpers({
  getProfilePicUrl() {
    let user = Meteor.users.findOne(Meteor.userId());
    if ( user ) {
      if ( user.profilePicture ) {
        return user.profilePicture;
      } else {
        //return a basic profile pic
      }
    }
  }
})
