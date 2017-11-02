import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Followers } from '../../../api/followers/followers.js';

import './followers.html';

import 'jquery-mask-plugin';

Template.manageFollowers.onCreated(function () {
  Meteor.subscribe('followers.all');
});

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
  },'click .editFollower'(event) {
    event.preventDefault();
    let followerId = $(event.target).data('id');
    let follower = Followers.findOne(followerId);
    if (follower) {
      Session.set('follower', follower);
      Tracker.afterFlush(() => { $('#editPhoneNumber').trigger('input') })
    }
  },
  'click .close-edit-modal'(event) {
    Session.set('follower', null);
    // $('#editPhoneNumber').unbind('trigger');
  },
});

Template.manageFollowers.helpers({
  follower() {
    console.log(Followers.find());
    return Followers.find();
  },
  hasPhone(id) {
    let follower = Followers.findOne(id);
    if (follower) {
      if (follower.phoneNumber) {
        return '<i class="fa fa-phone"></i>';
      }
    }
  },
  hasEmail(id) {
    let follower = Followers.findOne(id);
    if (follower) {
      if (follower.email) {
        return '<i class="fa fa-envelope"></i>';
      }
    }
  },
  editFollowerName() {
    let follower = Session.get('follower');
    if (follower) {
      return follower.name;
    }
  },
  editFollowerPhone() {
    let follower = Session.get('follower');
    if (follower) {
      return follower.phoneNumber;
    }
  },
  editFollowerEmail() {
    let follower = Session.get('follower');
    if (follower) {
      return follower.email;
    }
  },
  hasDanger() {
    if (Session.get('nameRequired')) {
      return 'has-danger';
    }
  },
  nameRequired() {
    if (Session.get('nameRequired')) {
      return Session.get('nameRequired');
    }
  },
})
