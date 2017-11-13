import { Meteor } from 'meteor/meteor';
import { Notifications } from '../notifications.js';

Meteor.publish('notifications', function (id) {
  return Notifications.find({dateId: id});
});
