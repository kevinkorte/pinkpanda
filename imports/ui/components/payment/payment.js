import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';

import './payment.html';
import '../settings/card/add_card_modal.js';
import { Payments } from '../../../api/payments/payments.js';
import { Sources } from '../../../api/sources/sources.js';
import { Subscriptions } from '../../../api/subscriptions/subscriptions.js';

Template.payment.onRendered(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('payments');
    self.subscribe('sources');
  });
});

Template.payment.helpers({
  payments() {
    return Payments.find();
  },
  sources() {
    return Sources.find();
  },
  //this helper duplicated on settings page
  hasSource( id ) {
    let source = Sources.findOne();
    console.log(source);
    if ( source ) {
      return true;
    } else {
      return false;
    }
  },
  getSubStatus() {
    let sub = Subscriptions.findOne();
    if ( sub ) {
      console.log(sub.resultOfStripeCreateCustomer.status);
      return sub.resultOfStripeCreateCustomer.status;
    }
  },
  getLast4ofCard() {
    let source = Sources.findOne();
    console.log(source);
    if ( source ) {
      console.log(source);
      return source.data.object.last4;
    }
  },
  getStartDate( date ) {
    if ( date ) {
      return moment.unix(date).format("MMM DD, YYYY");
    }
  },
  getEndDate( date ) {
    if ( date ) {
      return moment.unix(date).format("MMM DD, YYYY");
    }
  },
  getPaymentDate( date ) {
    if ( date ) {
      return moment.unix(date).format("MMM DD, YYYY");
    }
  },
  getPaymentAmount( amount ) {
    let dollars = amount / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});  
  },
});