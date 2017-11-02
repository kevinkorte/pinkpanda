import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './followers.html';

import 'jquery-mask-plugin';

Template.manageFollowers.onRendered(function() {
  $('#phoneNumber').mask('(000) 000-0000', {
    placeholder: "(   )   -    "
  });
  $('#editPhoneNumber').mask('(000) 000-0000', {
    placeholder: "(   )   -    "
  });
});

Template.manageFollowers.events({
  'submit #create-follower'(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const phone = event.target.phoneNumber.value;
    const email = event.target.emailAddress.value;
    const tenDigitPhoneNumber = phone.replace(/[()-\s]/g, '');
    if(!name) {
      Session.set('nameRequired', 'Don\'t forget a name is required!');
    } else {
      Session.set('nameRequired', null);
      Meteor.call('addFollower', tenDigitPhoneNumber, email, name, function(error, result) {
        if (error) {
          Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
          Bert.alert('Cool, successfully added!', 'success', 'fixed-top', 'fa-check');
          $('.js-create-new-follower')[0].reset();
        }
      });
    }
  }
})
