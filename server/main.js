// Server entry point, imports all server code
import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import '/imports/startup/both';

import { Subscriptions } from '../imports/api/subscriptions/subscriptions.js';

Meteor.publish('users.all', function() {
  return Meteor.users.find({});
});
