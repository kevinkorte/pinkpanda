
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
