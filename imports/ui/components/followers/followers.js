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
})
