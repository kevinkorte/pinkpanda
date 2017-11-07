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
  }
});
