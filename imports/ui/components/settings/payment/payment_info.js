import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Sources } from '../../../../api/sources/sources.js';

import './payment_info.html';

Template.paymentInfo.helpers({
  //this helper duplicated on payments page
  hasSource() {
    let source = Sources.findOne();
    if ( source ) {
      return true;
    } else {
      return false;
    }
  },
  creditCardIcon() {
    let source = Sources.findOne();
    if ( source ) {
      switch ( source.data.object.brand ) {
        case 'Visa':
        return 'visa';
        break;
      }
    }
  },
  last4() {
    let source = Sources.findOne();
    if ( source ) {
      return source.data.object.last4;
    }
  }
})