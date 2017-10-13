
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Dates = new Mongo.Collection('dates');

new SimpleSchema({
  starting: {
    type: Date,
    optional: true
  },
  ending: {
    type: Date,
    optional: true
  }
})
