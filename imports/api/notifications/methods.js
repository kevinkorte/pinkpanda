import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
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
    var result = geo.reverse(lat, lng);
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
      Notifications.update(response, {$set: {result}}, {filter: false, validate: false}, function(error,response){
        if (error) {
          throw new Meteor.Error('add-event', 'Opps, something went wrong updating your location');
        } else {
          SSR.compileTemplate('checkin-text-message', Assets.getText('checkin-text.html'));
          let t_userId = date.user;
          let t_user = Meteor.users.findOne(t_userId);
            let data = {
              userName: t_user.profile.name,
              address: result[0].formattedAddress,
              lat: result.lat,
              lng: result.lng
            };
          console.log('data', data);
          if ( date.followers ) {
            date.followers.forEach(function(follower) {
              if (follower.phoneNumber) {
                client.messages.create({
                  body: SSR.render('checkin-text-message', data),
                  to: '+1'+follower.phoneNumber,
                  from: '+15097923432'
                })
                .then((message) => console.log(message.sid));
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
