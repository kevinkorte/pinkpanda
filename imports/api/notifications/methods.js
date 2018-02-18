import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { Dates } from '../dates/dates.js';
import { Notifications } from './notifications.js';

import twilio from 'twilio';

let accountSid = Meteor.settings.private.twilio.accountsid;
let authToken = Meteor.settings.private.twilio.authToken;
let client = new twilio(accountSid, authToken);

Meteor.methods({
  addNotification(lat, lng, accuracy, timestamp, eventId) {
    check(lat, Number);
    check(lng, Number);
    check(accuracy, Number);
    check(timestamp, Number);
    check(eventId, String);
    let date = Dates.findOne(eventId);
    var geo = new GeoCoder({
      // geocoderProvider: "mapquest",
      httpAdapter: "https",
      apiKey: Meteor.settings.public.googleApiKey
    });
    var coords = geo.reverse(lat, lng);
    // console.log(result);
    Notifications.insert({
      dateId: eventId,
      lat: lat,
      lng: lng,
      accuracy: accuracy,
      timestamp: timestamp,
      notificationType: 'check-in'
    }, function(error, response) {
      if (error) {
        console.log(error);
        throw new Meteor.Error('add-event', 'Opps, something went wrong updating your location');
      }
      Notifications.update(response, {$set: {coords}}, {filter: false, validate: false}, function(error,response){
        if (error) {
          throw new Meteor.Error('add-event', 'Opps, something went wrong updating your location');
        } else {
          SSR.compileTemplate('checkin-text-message', Assets.getText('checkin-text-message.html'));
          SSR.compileTemplate('checkin-text-email', Assets.getText('checkin-text-email.html'));
          
          function username(user) {
            let the_user = Meteor.users.findOne(user);
            if ( the_user ) {
              if ( the_user.profile.name ) {
                return the_user.profile.name.first;
              } else {
                return the_user.emails[0].address
              }
            }
          }
            let data = {
              userName: username(date.user),
              address: coords[0].formattedAddress,
              lat: coords[0].latitude,
              lng: coords[0].longitude
            };
          if ( date.followers ) {
            date.followers.forEach(function(follower) {
              if (follower.phoneNumber) {
                client.messages.create({
                  body: SSR.render('checkin-text-message', data),
                  to: '+1'+follower.phoneNumber,
                  from: Meteor.settings.private.twilio.number
                })
                .then((message) => console.log(message.sid));
              }
              if (follower.email) {
                Email.send({
                  from: 'SafeTap <notifications@safetap.com>',
                  to: follower.email,
                  subject: data.userName + ' has just checked in',
                  html: SSR.render('checkin-text-email', data)
                });
              }
            });
          }
          return response;
        }
      });
    });
    // Events.update({result}, {filter: false, validate: false});
  },
})
