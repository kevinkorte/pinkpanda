import { Meteor } from 'meteor/meteor';
import { Payments } from '../payments.js';

Meteor.publish('payments', function() {
  return Payments.find({_id: 'gmEv4yfD8BAAAXSQt'});
  console.log(Payments.find({_id: 'gmEv4yfD8BAAAXSQt'}));
  let user = Meteor.users.findOne(this.userId);
  // console.log(user);
  if (user) {
    if ( user.stripeCustomerId ) {
      console.log(user.stripeCustomerId);
    }
    
  }
});