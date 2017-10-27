import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './update_login.html';

Template.update_login.events({
  'submit #update-email-form'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    Meteor.call('update_email', email, (error, response) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      } else {
        Bert.alert( 'Email updated.', 'success', 'fixed-top', 'fa-check' );
        $('#inputNewEmail').val('');
      }
    })
  }
})
