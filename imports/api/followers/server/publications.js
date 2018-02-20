import { Meteor } from 'meteor/meteor';
import { Followers } from '../followers.js';

Meteor.publish('followers.all', function() {

  return Followers.find({ 'belongs_to': this.userId });
});
