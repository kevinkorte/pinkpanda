import { Meteor } from 'meteor/meteor';
import { Dates } from '../../dates/dates.js';

Meteor.publish('dates.all', function () {
  return Dates.find();
});
