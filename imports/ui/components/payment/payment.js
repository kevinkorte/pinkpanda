import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment';

import './payment.html';
import { Payments } from '../../../api/payments/payments';

Template.payment.onRendered(function() {
  let self = this;
  self.autorun(function() {
    console.log(self.subscribe('payments'));
    self.subscribe('payments');
  });
});

Template.payment.helpers({
  payments() {
    return Payments.find();
  },
  getLast4ofCard( id ) {

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