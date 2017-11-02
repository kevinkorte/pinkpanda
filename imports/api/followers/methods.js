import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Followers } from './followers.js';

import twilio from 'twilio';

// let accountSid = Meteor.settings.private.twilio.accountsid;
// let authToken = Meteor.settings.private.twilio.authToken;
// let client = new twilio(accountSid, authToken);

Meteor.methods({
  'addFollower'(phoneNumber, email, name) {
    check(name, String);
    if(phoneNumber) {
      check(phoneNumber, String);
    }
    if(email) {
      check(email, String)
    }
    Followers.insert({
      name: name,
      phoneNumber: phoneNumber,
      email: email,
    });
  },
})
