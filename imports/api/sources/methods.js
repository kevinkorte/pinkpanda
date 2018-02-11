import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Sources } from './sources.js';

let stripe = require("stripe")(
  "sk_test_K7UqikJwYiDZUBELEysK2wjG"
);

Meteor.methods({
  updateSource(token) {
    console.log('called update source');
    let user = Meteor.users.findOne(Meteor.userId);
    let cus = user.stripeCustomerId;
    if ( cus ) {
      stripe.customers.update(cus, {
        source: token.id
      }, function(err, customer) {
        // asynchronously called
      });
    } else {
      //can't find customer id
    }
  },
  addPaymentSource(request) {
    Sources.insert(request, {filter: false, validate: false}, function(error, response) {
      if ( error ) {
        console.log(error)
      } else {
        console.log(response)
      }
    })
  },
  deletePaymentSource(request) {
    let cardToRemove = Sources.findOne({'data.object.id': request.data.object.id});
    if ( cardToRemove ) {
      Sources.remove(cardToRemove._id);
    }
  } 
})