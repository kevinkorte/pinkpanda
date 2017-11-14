import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dates } from './dates.js';
import { Notifications } from '../notifications/notifications.js';

import twilio from 'twilio';

let accountSid = Meteor.settings.private.twilio.accountsid;
let authToken = Meteor.settings.private.twilio.authToken;
let client = new twilio(accountSid, authToken);

Meteor.methods({
  'createNewDate'() {
    return Dates.insert({});
  },
  'updateDate'(id, start, end, place, placeName, formatted_address, lat, lng, phone, url, dateName, dateURL) {
    check(id, String);
    check(start, String);
    check(end, String);
    check(place, String);
    check(placeName, String);
    check(formatted_address, String);
    check(lat, String);
    check(lng, String);
    check(phone, String);
    check(url, String)
    check(dateName, String);
    check(dateURL, String);
    Dates.update(id, { $set: {
        starting: new Date(start),
        ending: new Date(end),
        place: place,
        placeName: placeName,
        formatted_address: formatted_address,
        lat: lat,
        lng: lng,
        phone: phone,
        website: url,
        dateName: dateName,
        dateURL: dateURL
      }
    });
  },
  'autoStartDate'(id) {
    Dates.update(id, { $set: { active: true } }, { validate: false }, function(error, response) {
      if ( error ) {
        console.log(error);
      } else {
        Notifications.insert({
          dateId: id,
          timestamp: new Date().toISOString(),
          notificationType: 'auto-start'
        }, function(error, response) {
          if ( error ) {
            console.log(error);
          } else {
            let date = Dates.findOne(id);
            if ( date ) {
              SSR.compileTemplate('auto-start-message', Assets.getText('auto-start-text.html'));
              let t_user = Meteor.users.findOne(date.user);
              let data = {
                userName: t_user.profile.name,
                address: date.address
              };
              date.followers.forEach(function(follower) {
                if ( follower.phoneNumber ) {
                  client.messages.create({
                    body: SSR.render('auto-start-message', data),
                    to: '+1'+follower.phoneNumber,
                    from: Meteor.settings.private.twilio.number
                  })
                  .then((message) => console.log(message.sid));
                }
              });
            } else {
              //can't find a date by id
            }
          }
        });
      }
    });
  },
  'autoEndDate'(id) {
    Dates.update(id, { $set: { expired: true, alertSent: true } }, function(error, response) {
      if ( error ) {
        console.log(error);
      } else {
        Notifications.insert({
          dateId: id,
          timestamp: new Date().toISOString(),
          notificationType: 'auto-end'
        }, function(error, response) {
          if ( error ) {
            console.log(error)
          } else {
            let date = Dates.findOne(id);
            if ( date ) {
              SSR.compileTemplate('auto-end-message', Assets.getText('auto-end-text.html'));
              let t_user = Meteor.users.findOne(date.user);
              let data = {
                userName: t_user.profile.name,
                address: date.address,
                endTime: moment(date.ending).format('h:mm a')
              };
            }
          }
        })
      }
    })
  }
});
