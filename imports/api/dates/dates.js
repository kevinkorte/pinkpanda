
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Dates = new Mongo.Collection('dates');

const DatingSchema = new SimpleSchema({
  starting: {
    type: Date,
    optional: true
  },
  ending: {
    type: Date,
    optional: true
  },
  followers: {
    type: Array,
    optional: true
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
