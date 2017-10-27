import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  send_verification_email() {
    Accounts.sendVerificationEmail(Meteor.userId());
  }
})
