import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dates } from './dates.js';

Meteor.methods({
  'createNewDate'() {
    return Dates.insert({});
  }
});
