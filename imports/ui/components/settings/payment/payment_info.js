import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'

import './payment_info.html';

const stripe = Stripe('pk_test_nXsnM6WpNgi01xKTncchXhO2');
const elements = stripe.elements();

Template.paymentInfo.onRendered( () => {
  // Custom styling can be passed to options when creating an Element.
  // Add an instance of the card Element into the `card-element` <div>
  const style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      color: "#32325d",
    },
  };

  // Create an instance of the card Element
  window.card = elements.create('card', {style});
  card.mount('#card-element');
});

Template.paymentInfo.onDestroyed( function() {
  card.destroy();
})