import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'

import './payment_info.html';

Template.paymentInfo.helpers({
  //this helper duplicated on payments page
  hasSource( id ) {
    let source;
    // let source = Sources.findOne({'data.object.customer': id});
    if ( source ) {
      return true;
    } else {
      return false;
    }
  },
})