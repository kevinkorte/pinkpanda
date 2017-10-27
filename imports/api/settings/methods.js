import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  send_verification_email() {
    Accounts.sendVerificationEmail(Meteor.userId());
  },
  update_email( email ) {
    let user = Meteor.users.findOne(Meteor.userId());
    if ( user ) {
      let userEmail = user.emails[0].address;
      Accounts.addEmail(Meteor.userId(), email );
      Accounts.sendVerificationEmail(Meteor.userId(), email );
      Accounts.removeEmail(Meteor.userId(), userEmail );
    }
  }
})
