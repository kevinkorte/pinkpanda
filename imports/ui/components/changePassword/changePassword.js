import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './changePassword.html';

Template.changePassword.events({
  'submit #update-password'(event) {
    event.preventDefault();
    const target = event.target;
    const currentPassword = target.currentPassword.value;
    const newPassword = target.newPassword.value;
    const confirmPassword = target.confirmPassword.value;
    if (newPassword !== confirmPassword ) {
      Session.set('passwordsDontMatch', 'Passwords do not match');
    } else {
      Accounts.changePassword(currentPassword, newPassword, function(error) {
        if (error) {
          Session.set('passwordsDontMatch', null);
          Session.set('changePasswordError', error.reason);
        } else {
          $('.js-change-password').addClass('loading');
          Session.set('passwordsDontMatch', null);
          Session.set('changePasswordError', null);
          Meteor.call('sendChangedPasswordEmail', function(error) {
            if (error) {
              Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
            } else {
              $('.js-change-password').removeClass('loading');
              $('#resetPasswordModal').modal('hide');
              swal({
                title: "Password Successfully Changed",
                type: "success"
              });
            }
          });
        }
      });
    }
  }
})
