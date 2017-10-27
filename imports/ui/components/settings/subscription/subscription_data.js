import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Subscriptions } from '../../../../api/subscriptions/subscriptions.js';

import moment from 'moment';

import './subscription_data.html';

Template.subscription.helpers({
  subscription() {
    return Subscriptions.findOne();
  },
  subscriptionRenewDate( timestamp ) {
    return moment.unix(timestamp).format("dddd, MMMM Do YYYY");
  },
  subscriptionAmount( result ) {
    let amount = result.data[0].plan.amount;
    var dollars = amount / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
  }
})
