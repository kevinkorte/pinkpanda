import { Meteor } from 'meteor/meteor';

import stripePackage from 'stripe';

import './signup.js';

const stripe = stripePackage(Meteor.settings.private.stripeSecretKey);

Meteor.methods({
  newUserSignup(email, password) {
    console.log('go');
    stripe.customers.create({
      email: "jenny.rosen@example.com",
    }, function(err, customer) {
      // asynchronously called
    });
  }
});
