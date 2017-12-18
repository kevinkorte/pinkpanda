import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './login.html';

Template.App_login.helpers({
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
});

Template.App_login.events({
  'submit .js-login'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    Meteor.loginWithPassword(email, password, (error, response) => {
      if ( error ) {
        Session.set('error', error.reason);
      } else {
        FlowRouter.go('dashboard');
      }
    })
  }
})
