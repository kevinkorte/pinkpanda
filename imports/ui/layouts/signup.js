import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Subscriptions } from '../../api/subscriptions/subscriptions.js';

import './signup.html';

Template.App_signup.onCreated( function() {
  Meteor.subscribe('subs.all');
  console.log(Meteor.subscribe('subs.all'));
});

Template.App_signup.onRendered( function() {
  Meteor.subscribe('subs.all');
});

Template.App_signup.helpers({
  sub() {
    return Subscriptions.find({})
  }
})

Template.App_signup.events({
  'submit .js-submit'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    Meteor.call('newUserSignup', email, password, (error, response) => {
      if ( error ) {
        //Todo: Better error handling
        console.log(error)
      } else {
        //Successfully logged in, go to the next route
      }
    })
  }
})
