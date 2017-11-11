import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dates } from './dates.js';

Meteor.methods({
  'createNewDate'() {
    return Dates.insert({});
  },
  'updateDate'(id, start, end, place, placeName, formatted_address, lat, lng, dateName, dateURL) {
    check(id, String);
    check(start, String);
    check(end, String);
    check(place, String);
    check(placeName, String);
    check(formatted_address, String);
    check(lat, String);
    check(lng, String);
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
        dateName: dateName,
        dateURL: dateURL
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
          timestamp: new Date().getTime(),
          eventType: 'auto-end'
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
