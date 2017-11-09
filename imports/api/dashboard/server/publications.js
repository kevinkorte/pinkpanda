import { Meteor } from 'meteor/meteor';
import { Dates } from '../../dates/dates.js';

Meteor.publish('dates.all', function () {
  return Dates.find();
});

Meteor.publish('dates.single', function (id) {
  console.log(id);
  return Dates.find({_id: id});
})
