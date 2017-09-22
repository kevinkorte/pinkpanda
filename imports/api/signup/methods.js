import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Subscriptions } from '../subscriptions/subscriptions.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
                   _subscribeToPlan( resultOfStripeCreateCustomer, userId );
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
  Meteor.users.update(userId, { $set: { stripeCustomerId: customer.id } } );
}

let _subscribeToPlan = ( customer, userId ) => {
  let asyncToSync = Meteor.wrapAsync( stripe.subscriptions.create, stripe.subscriptions );
  resultOfStripeCreateCustomer = asyncToSync( { customer: customer.id, trial_period_days: 7, items: [ { plan: 'basic0917'  } ] } );

  Meteor.users.update(userId, { $set: { stripeSubscriptionId: resultOfStripeCreateCustomer.id } } );
  let sub = Subscriptions.insert({ resultOfStripeCreateCustomer });
  console.log(sub);
}
