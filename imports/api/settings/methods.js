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
  },
  sendChangedPasswordEmail() {
    console.log('email', Meteor.user().emails[0].address);
    Email.send({
      to: "kevinkorte15@gmail.com",
      from: "NurseTAP <admin@nursetap.net>",
      subject: "Your password has been changed",
      text: "Your password on NurseTap has been changed. If you are expecting this, you can ignore this email. If you did not reset your password, get in touch with us."
    })
  },
})
