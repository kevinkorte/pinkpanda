import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './resetPassword.html';

Template.resetPassword.events({
  'submit #js-password-reset-form'(event) {
    event.preventDefault();
    let email = event.target.email.value;
    Meteor.call('sendResetPassword', email, (error, response) => {
      if ( error ) {
        console.log(error);
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Success! Check your email', 'success');
        FlowRouter.go('settings');
      }
    });
  }
});