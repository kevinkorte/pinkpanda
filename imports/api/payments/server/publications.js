import { Meteor } from 'meteor/meteor';
import { Payments } from '../payments.js';

Meteor.publish('payments', function() {
  let user = Meteor.users.findOne(this.userId);
  if (user) {
    if ( user.stripeCustomerId ) {
      let payments = Payments.find({'data.object.customer': user.stripeCustomerId});
      return payments;
    }
  }
});