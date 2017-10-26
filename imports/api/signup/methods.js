import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';
import { Subscriptions } from '../subscriptions/subscriptions.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import stripePackage from 'stripe';

import './signup.js';

const stripe = stripePackage(Meteor.settings.private.stripeSecretKey);

Meteor.methods({
  checkIfUserExists(email, password) {
    let checkIfUserExists = Accounts.findUserByEmail( email );
    if ( !checkIfUserExists ) {
      return;
    } else {
      throw new Meteor.Error('new-user-already-exists', "Email already exists.");
    }
  },
  newUserSignup(email, password) {
      let asyncToSync = Meteor.wrapAsync( stripe.customers.create, stripe.customers );
      resultOfStripeCreateCustomer = asyncToSync( { email: email } );
      _updateUserAccount( resultOfStripeCreateCustomer, Meteor.userId() );
      _subscribeToPlan( resultOfStripeCreateCustomer, Meteor.userId() );
  },
  loginWithFacebook(email) {
    Accounts.addEmail(Meteor.userId(), email, true);
    let asyncToSync = Meteor.wrapAsync( stripe.customers.create, stripe.customers );
    resultOfStripeCreateCustomer = asyncToSync( { email: email } );
    _updateUserAccount( resultOfStripeCreateCustomer, Meteor.userId() );
    _subscribeToPlan( resultOfStripeCreateCustomer, Meteor.userId() );
    let res = HTTP.call('GET', 'https://graph.facebook.com/v2.10/me?fields=picture&access_token='+Meteor.user().services.facebook.accessToken);
    _updateProfilePicFromFacebook( res, Meteor.userId() );
  },
  checkIfFacebookUserExists(email) {
    let checkIfUserExists = Accounts.findUserByEmail( email );
    if (!checkIfUserExists) {
      Meteor.call('loginWithFacebook', email );
    } else {
      //user account already exists
      console.log('user already exists');
    }
  }
});

// let _createUserAccount = ( customer, password ) => {
//   let userId = Accounts.createUser( { email: customer.email, password: password } );
//   return userId;
// };

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

let _updateProfilePicFromFacebook = ( picture, userId ) => {
  let profilePic = picture.data.picture.data.url;
  Meteor.users.update(userId, { $set: { profilePicture: profilePic } } );
}
