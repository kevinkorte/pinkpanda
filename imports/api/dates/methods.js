import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dates } from './dates.js';

Meteor.methods({
  'createNewDate'() {
    return Dates.insert({});
  },
  'updateDate'(id,start,end,place, lat,lng,dateName,dateURL) {
    check(id, String);
    check(start, String);
    check(end, String);
    check(place, String);
    check(lat, String);
    check(lng, String);
    check(dateName, String);
    check(dateURL, String);
    Dates.update(id, { $set: {
        starting: new Date(start),
        ending: new Date(end),
        place: place,
        lat: lat,
        lng: lng,
        dateName: dateName,
        dateURL: dateURL
      }
    });
  }
});
