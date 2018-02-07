import { Meteor } from 'meteor/meteor';
import { Notifications } from '../notifications.js';

Meteor.publish('notifications', function (id) {
  // console.log('notification: ', id);
  return Notifications.find({dateId: id});
});
