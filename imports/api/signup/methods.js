import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import stripePackage from 'stripe';

import './signup.js';

const stripe = stripePackage(Meteor.settings.private.stripeSecretKey);

Meteor.methods({
  newUserSignup(email, password) {
    let checkIfUserExists = Accounts.findUserByEmail( email );
    if ( !checkIfUserExists ) {
      let asyncToSync = Meteor.wrapAsync( stripe.customers.create, stripe.customers );
      resultOfStripeCreateCustomer = asyncToSync( { email: email } );
      let userId = _createUserAccount( resultOfStripeCreateCustomer, password );
                   _updateUserAccount( resultOfStripeCreateCustomer, userId );
    } else {
      throw new Meteor.Error('new-user-already-exists', "Email already exists.");
    }
  },
});

let _createUserAccount = ( customer, password ) => {
  let userId = Accounts.createUser( { email: customer.email, password: password } );
  return userId;
};
let _updateUserAccount = ( customer, userId ) => {
  //Todo Attach Stripe customer id to user accounts id
  console.log(userId, 'update user Accounts', customer);
}
