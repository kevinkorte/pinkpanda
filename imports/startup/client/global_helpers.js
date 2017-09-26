import { Meteor } from 'meteor/meteor';
import { Tempate } from 'meteor/templating';

Template.registerHelper( 'getProfilePicUrl', () => {
  let user = Meteor.users.findOne(Meteor.userId());
  if ( user ) {
    if ( user.profilePicture ) {
      return user.profilePicture;
    } else {
      //return a basic profile pic
    }
  }
});

Template.registerHelper( 'getProfileName', () => {
  let user = Meteor.users.findOne(Meteor.userId());
  if ( user ) {
    if ( user.profile.name ) {
      return user.profile.name;
    } else {
      return user.emails[0].address;
    }
  }
})
