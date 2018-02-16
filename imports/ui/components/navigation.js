import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Dates } from '../../api/dates/dates.js';

import './navigation.html';

Template.dashboard_navigation.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('dates.all');
  });
});

Template.dashboard_navigation.onRendered( function() {

})

Template.dashboard_navigation.helpers({
  getDraftCount() {
    return Dates.find({draft: true}).count();
  }
  // getProfilePicUrl() {
  //   let user = Meteor.users.findOne(Meteor.userId());
  //   if ( user ) {
  //     if ( user.profilePicture ) {
  //       return user.profilePicture;
  //     } else {
  //       //return a basic profile pic
  //     }
  //   }
  // },
  // getProfileName() {
  //   let user = Meteor.users.findOne(Meteor.userId());
  //   if ( user ) {
  //     if ( user.profile.name ) {
  //       return user.profile.name;
  //     } else {
  //       return user.emails[0].address;
  //     }
  //   }
  // }
});

Template.dashboard_navigation.events({
  'click .js-new-date'(event) {
    Meteor.call('createNewDate', (error, result) => {
      if (error) {
        console.log(error)
      } else {
        FlowRouter.go('new.date', {user: Meteor.userId(), id: result});
      }
    });
  }
});
