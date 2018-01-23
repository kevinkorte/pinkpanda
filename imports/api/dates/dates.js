
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Dates = new Mongo.Collection('dates');

const DatingSchema = new SimpleSchema({
  user: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      }
    }
  },
  draft: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return true
      }
    }
  },
  starting: {
    type: Date,
    optional: true
  },
  ending: {
    type: Date,
    optional: true
  },
  place: {
    type: String,
    optional: true
  },
  placeName: {
    type: String,
    optional: true
  },
  formatted_address: {
    type: String,
    optional: true
  },
  lat: {
    type: String,
    optional: true
  },
  lng: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    optional: true
  },
  dateName: {
    type: String,
    optional: true
  },
  dateURL: {
    type: String,
    optional: true
  },
  followers: {
    type: Array,
    optional: true
  },
  expired: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return false;
      }
    }
  },
  active: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return false;
      }
    }
  },
  activeAt: {
    type: Date,
    optional: true
  },
  alertsSent: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return false
      }
    }
  },
  "followers.$": {
    type: Object
  },
  "followers.$.id": {
    type: String
  },
  "followers.$.name": {
    type: String,
    optional: true
  },
  "followers.$.phoneNumber": {
    type: String,
    optional: true
  },
  "followers.$.email": {
    type: String,
    optional: true
  }
});

Dates.attachSchema( DatingSchema );
