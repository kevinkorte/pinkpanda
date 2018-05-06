import { Meteor } from 'meteor/meteor';
import { Dates } from '../../dates/dates.js';

Meteor.publish('dates.all', function () {
  let user = Meteor.users.findOne(this.userId);
  return Dates.find({ $or: [ { user: this.userId }, {'followers.email': user.emails[0].address}]}, {sort: { starting: 1 }} );
  // return Dates.find({$or: [{"followersEmail": user.emails[0].address},{user: this.userId}]}, {sort: {startTime: 1}});
});

Meteor.publish('dates.single', function (id) {
  console.log(id);
  return Dates.find({_id: id});
})
