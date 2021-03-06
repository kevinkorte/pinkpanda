import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Subscriptions } from '../../api/subscriptions/subscriptions.js';

import './signup.html';
import '../components/svg/signup.html';


Template.App_signup.onCreated( function() {
  // Meteor.subscribe('subs.all');
  // Meteor.subscribe('users.all');
  // console.log(Meteor.subscribe('subs.all'));
});

Template.App_signup.onRendered( function() {
  // Meteor.subscribe('subs.all');
  $('.js-submit').validate({
    rules: {
      firstName: {
        required: true
      },
      lastName: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true
      }
    },
    errorClass: 'is-invalid',
    validClass: 'is-valid',
    submitHandler: function(form) {
      let spinner = $('.sign-up-button').data('btn-spin');
      $('.sign-up-button').html( spinner );
      event.preventDefault();
      const firstName = event.target.firstName.value;
      const lastName = event.target.lastName.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
      if (firstName && lastName && email && password) {
        Meteor.call('checkIfUserExists', email, password, (error, response) => {
          if ( error ) {
            console.log( error );
            Session.set('error', error.reason);
            $('.sign-up-button').html('Create My Account');
          } else {
            Accounts.createUser( { email: email, password: password, profile: {name: { first: firstName, last: lastName } } } );
            Meteor.call('newUserSignup', email, password, (error, response) => {
              if ( error ) {
                //Todo: Better error handling
                console.log(error)
                Session.set('error', error.reason);
                $('.sign-up-button').html('Create My Account');
              } else {
                //Successfully logged in, go to the next route
                FlowRouter.go( 'dashboard' );
              }
            });
          }
        });
      } else {
        Session.set('error', 'Please make sure all fields are filled in.');
      }
    }
  })
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
  // 'submit .js-submit'(event) {
  //   event.preventDefault();
  //   const firstName = event.target.firstName.value;
  //   const lastName = event.target.lastName.value;
  //   const email = event.target.email.value;
  //   const password = event.target.password.value;
  //   Meteor.call('checkIfUserExists', email, password, (error, response) => {
  //     if ( error ) {
  //       console.log( error );
  //       Session.set('error', error.reason);
  //     } else {
  //       Accounts.createUser( { email: email, password: password, profile: {name: { first: firstName, last: lastName } } } );
  //       Meteor.call('newUserSignup', email, password, (error, response) => {
  //         if ( error ) {
  //           //Todo: Better error handling
  //           console.log(error)
  //         } else {
  //           //Successfully logged in, go to the next route
  //           FlowRouter.go( 'dashboard' );
  //         }
  //       });
  //     }
  //   });
  // },
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
