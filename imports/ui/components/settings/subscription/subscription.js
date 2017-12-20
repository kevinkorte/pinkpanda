import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Subscriptions } from '../../../../api/subscriptions/subscriptions.js';

import './subscription.html';

import './subscription_data.js';

Template.subscriptionOverview.helpers({
  trialing() {
    let sub = Subscriptions.findOne();
    if ( sub ) {
      if ( sub.resultOfStripeCreateCustomer.status == "trialing" ) {
        return true;
      } else {
        return false;
      }
    }
  },
  active() {
    let sub = Subscriptions.findOne();
    if ( sub ) {
      if ( sub.resultOfStripeCreateCustomer.status == "active" ) {
        return true;
      } else {
        return false;
      }
    }
  },
  past_due() {
    let sub = Subscriptions.findOne();
    if ( sub ) {
      if ( sub.resultOfStripeCreateCustomer.status == "past_due" ) {
        return true;
      } else {
        return false;
      }
    }
  }
})
