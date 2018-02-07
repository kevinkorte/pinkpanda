import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './payment.html';

Template.payment.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('payments');
  });
});