import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Followers } from '../../../api/followers/followers.js';

import './followers.html';

Template.manageFollowers.onCreated(function () {
  Meteor.subscribe('followers.all');
});

Template.manageFollowers.onRendered(function() {
  $('#select').select2({});
})

Template.manageFollowers.helpers({
  follower() {
    console.log(Followers.find());
    return Followers.find();
  },
});
