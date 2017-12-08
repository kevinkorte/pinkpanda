import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Subscriptions } from '../../api/subscriptions/subscriptions.js';

import './signup.html';

Template.App_signup.onCreated( function() {
  Meteor.subscribe('subs.all');
  Meteor.subscribe('users.all');
  console.log(Meteor.subscribe('subs.all'));
});

Template.App_signup.onRendered( function() {
  Meteor.subscribe('subs.all');
});

Template.App_signup.helpers({
  sub() {
    return Subscriptions.find({})
  },
  hasError() {
    if (Session.get('error')) {
      return true;
    } else {
      return;
    }
  },
  errorMessage() {
    return Session.get('error');
  }
})

Template.App_signup.events({
  'submit .js-submit'(event) {
    event.preventDefault();
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    Meteor.call('checkIfUserExists', email, password, (error, response) => {
      if ( error ) {
        console.log( error );
        Session.set('error', error.reason);
      } else {
        Accounts.createUser( { email: email, password: password, profile: {name: { first: firstName, last: lastName } } } );
        Meteor.call('newUserSignup', email, password, (error, response) => {
          if ( error ) {
            //Todo: Better error handling
            console.log(error)
          } else {
            //Successfully logged in, go to the next route
            FlowRouter.go( 'onboarding.step', {step: 'name'} );
          }
        });
      }
    });
  },
  'click .js-loginFacebook'(event) {
    console.log(event);
    event.preventDefault();
    Meteor.loginWithFacebook({
      requestPermissions: [ "email", "public_profile" ]
    }, (error) => {
      if (error) {
        Session.set('errorMessage', error.reason || 'Unknown error');
      } else {
        Meteor.call('checkIfFacebookUserExists', Meteor.user().services.facebook.email, function(error, response) {
          if (error) {
            console.log(error)
          } else {
            FlowRouter.go('dashboard');
          }
        });
      }
    });
  }
})
