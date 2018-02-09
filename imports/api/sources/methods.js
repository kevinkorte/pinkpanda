import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

let stripe = require("stripe")(
  "sk_test_K7UqikJwYiDZUBELEysK2wjG"
);

Meteor.methods({
  updateSource(token) {
    let user = Meteor.users.findOne(Meteor.userId);
    let cus = user.stripeCustomerId;
    if ( cus ) {
      stripe.customers.update(cus, {
        source: token
      }, function(err, customer) {
        // asynchronously called
      });
    } else {
      //can't find customer id
    }
  }
})