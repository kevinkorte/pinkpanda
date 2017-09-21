import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import stripePackage from 'stripe';

import './signup.js';

const stripe = stripePackage(Meteor.settings.private.stripeSecretKey);

Meteor.methods({
  newUserSignup(email, password) {
    //Todo: Check if user email already exists in the database
    let asyncToSync = Meteor.wrapAsync( stripe.customers.create, stripe.customers );
    resultOfStripeCreateCustomer = asyncToSync( { email: email } );
    console.log( resultOfStripeCreateCustomer );
    _createUserAccount( resultOfStripeCreateCustomer, password );

  },
});

let _createUserAccount = ( customer, password ) => {
  let userId = Accounts.createUser( { email: customer.email, password: password } );
  console.log('user id', userId);
}
