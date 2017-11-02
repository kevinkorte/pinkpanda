import { Meteor } from 'meteor/meteor';
import { Followers } from '../followers.js';

Meteor.publish('followers.all', function() {
  console.log(Followers.find());
  return Followers.find();
});
