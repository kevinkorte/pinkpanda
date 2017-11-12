import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Notifications = new Mongo.Collection('notifications');

const NotificationsSchema = new SimpleSchema({
  dateId: {
    type: String,
  },
  lat: {
    type: String,
    optional: true
  },
  lng: {
    type: String,
    optional: true
  },
  accuracy: {
    type: Number,
    optional: true
  },
  timestamp: {
    type: Number,
  },
  eventType: {
    type: String
  }
});

Notifications.attachSchema( NotificationsSchema );
