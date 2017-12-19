import { Meteor } from 'meteor/meteor';
import { Subscriptions } from '../subscriptions.js';

Meteor.publish('subs.all', function() {
  let user = Meteor.users.findOne(this.userId);
  return Subscriptions.find({ 'resultOfStripeCreateCustomer.customer': user.stripeCustomerId });
})
