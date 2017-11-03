import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Followers } from '../../../api/followers/followers.js';

import './followers.html';

Template.followers.onCreated(function () {
  Meteor.subscribe('followers.all');
});

Template.followers.onRendered(function() {
  $('#select').select2({
    'multiple': true
  });
});

Template.followers.helpers({
  follower() {
    return Followers.find();
  },
});

Template.followers.events({
  'submit .add-followers'(event) {
    event.preventDefault();
    let followers = $('.edit-followers-input').val();
    // followers.forEach(function(el) {console.log(el)});
    let eventId = FlowRouter.getParam('id');
    Meteor.call('addFollowers', followers, eventId, function(error, result) {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      } else {

      }
    })
  },
})
