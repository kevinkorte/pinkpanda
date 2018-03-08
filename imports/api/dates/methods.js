import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dates } from './dates.js';
import { Notifications } from '../notifications/notifications.js';

import twilio from 'twilio';
import moment from 'moment';

let accountSid = Meteor.settings.private.twilio.accountsid;
let authToken = Meteor.settings.private.twilio.authToken;
let client = new twilio(accountSid, authToken);

Meteor.methods({
  'createNewDate'() {
    return Dates.insert({});
  },
  'updateDate'(id, start, end, place, placeName, formatted_address, lat, lng, phone, url, dateName, dateURL) {
    console.log('start', start);
    console.log(typeof start);
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
        starting: start,
        ending: end,
        place: place,
        placeName: placeName,
        formatted_address: formatted_address,
        lat: lat,
        lng: lng,
        phone: phone,
        website: url,
        dateName: dateName,
        dateURL: dateURL,
        draft: false
      }
    });
  },
  'autoStartDate'(id) {
    Dates.update(id, { $set: { active: true } }, { validate: false }, function(error, response) {
      if ( error ) {
        // console.log(error);
      } else {
        Notifications.insert({
          dateId: id,
          timestamp: new Date().toISOString(),
          notificationType: 'auto-start'
        }, function(error, response) {
          if ( error ) {
            // console.log(error);
          } else {
            const date = async function findDate() {
              return await Dates.findOne(id)
              console.log('await');
            };
            if ( date ) {
              SSR.compileTemplate('auto-start-text', Assets.getText('auto-start-text.html'));
              SSR.compileTemplate('auto-start-email', Assets.getText('auto-start-email.html'));
              console.log('date after', date);
              let the_user = Meteor.users.findOne(date.user);
              if ( Meteor.isProduction) {
                console.log('is production');
              } else {
                console.log( 'not production' );
              }
                if ( Meteor.isProduction ) {
                  let data ={
                    userName: the_user.profile.name.first,
                    address: date.place,
                    url: 'https://www.safetap.net/date/'+date.user+'/'+date._id,
                  };
                } else {
                  let data = {
                    userName: the_user.profile.name.first,
                    address: date.place,
                    url: 'http://localhost:3000/date/'+date.user+'/'+date._id,
                  };
                }
                if ( data ) {
                  console.log('data', data);
                }
              if ( date.followers ) {
                date.followers.forEach(function(follower) {
                  if ( follower.phoneNumber ) {
                    client.messages.create({
                      body: SSR.render('auto-start-text', data),
                      to: '+1'+follower.phoneNumber,
                      from: Meteor.settings.private.twilio.number
                    })
                    .then((message) => console.log(message.sid));
                  }
                  if ( follower.email ) {
                    Email.send({
                      from: 'SafeTap <notifications@safetap.com>',
                      to: follower.email,
                      subject: 'Auto-start for ' + data.userName,
                      html: SSR.render('auto-start-email', data)
                    });
                  }
                });
              }

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
              SSR.compileTemplate('auto-end-text', Assets.getText('auto-end-text.html'));
              SSR.compileTemplate('auto-end-email', Assets.getText('auto-end-email.html'));
              let the_user = Meteor.users.findOne(date.user);
              if ( the_user ) {
                let data = {
                  userName: the_user.profile.name.first,
                  address: date.address,
                  endTime: moment(date.ending).format('h:mm a')
                };
                if ( date.followers ) {
                  date.followers.forEach(function(follower) {
                    if (follower.phoneNumber) {
                      client.messages.create({
                        body: SSR.render('auto-end-text', data),
                        to: '+1'+follower.phoneNumber,
                        from: Meteor.settings.private.twilio.number
                      })
                      .then((message) => console.log(message.sid));
                    }
                    if (follower.email) {
                      Email.send({
                        from: 'SafeTap <notifications@safetap.com>',
                        to: follower.email,
                        subject: 'Auto-end for ' + data.userName,
                        html: SSR.render('auto-end-email', data)
                      });
                    }
                  });
                }
              }
            }
          }
        })
      }
    })
  },
  startDate(lat, lng, accuracy, timestamp, id) {
    console.log(lat,lng,accuracy, timestamp, id);
    check(lat, Number);
    check(lng, Number);
    check(accuracy, Number);
    check(timestamp, Number);
    check(id, String);
    let date = Dates.findOne(id);
    Dates.update(id, { $set: { active: true, started: new Date() } } );
    let geo = new GeoCoder({
      httpAdapter: "https",
      apiKey: Meteor.settings.public.googleApiKey
    });
    let coords = geo.reverse(lat, lng);
    Notifications.insert({
      dateId: id,
      lat: lat,
      lng: lng,
      accuracy: accuracy,
      timestamp: timestamp,
      notificationType: 'manual-start'
    }, ( error, result ) => {
      if ( error ) {
        throw new Meteor.Error('add-notification', 'We encountered a problem');
      } else {
        Notifications.update(result, { $set: { coords } }, { filter: false, validate: false }, ( error, result ) => {
          if ( error ) {
            throw new Meteor.Error('add-notification', 'We encountered a problem');
          } else {
            SSR.compileTemplate('manual-start-text', Assets.getText('manual-start-text.html'));
            SSR.compileTemplate('manual-start-email', Assets.getText('manual-start-email.html'));
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
              address: coords[0].formattedAddress
            };
            if ( date.followers ) {
              date.followers.forEach(function(follower) {
                if (follower.phoneNumber) {
                  client.messages.create({
                    body: SSR.render('manual-start-text', data),
                    to: '+1'+follower.phoneNumber,
                    from: Meteor.settings.private.twilio.number
                  })
                  .then((message) => console.log(message.sid));
                }
                if (follower.email) {
                  Email.send({
                    from: 'SafeTap <notifications@safetap.com>',
                    to: follower.email,
                    subject: data.userName + ' has just started',
                    html: SSR.render('manual-start-email', data)
                  });
                }
              });
            }            
            //This is where we send that message to all followers
          }
        })
      }
    })
  },
  endDate(lat, lng, accuracy, timestamp, id) {
    console.log(lat,lng,accuracy, timestamp, id);
    check(lat, Number);
    check(lng, Number);
    check(accuracy, Number);
    check(timestamp, Number);
    check(id, String);
    let date = Dates.findOne(id);
    Dates.update(id, { $set: { active: false, ended: new Date() } } );
    let geo = new GeoCoder({
      httpAdapter: "https",
      apiKey: Meteor.settings.public.googleApiKey
    });
    let coords = geo.reverse(lat, lng);
    Notifications.insert({
      dateId: id,
      lat: lat,
      lng: lng,
      accuracy: accuracy,
      timestamp: timestamp,
      notificationType: 'manual-end'
    }, ( error, result ) => {
      if ( error ) {
        throw new Meteor.Error('add-notification', 'We encountered a problem');
      } else {
        Notifications.update(result, { $set: { coords } }, { filter: false, validate: false }, ( error, result ) => {
          if ( error ) {
            throw new Meteor.Error('add-notification', 'We encountered a problem');
          } else {
            SSR.compileTemplate('manual-end-text', Assets.getText('manual-end-text.html'));
            SSR.compileTemplate('manual-end-email', Assets.getText('manual-end-email.html'));
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
              address: coords[0].formattedAddress
            };
            if ( date.followers ) {
              date.followers.forEach(function(follower) {
                if (follower.phoneNumber) {
                  client.messages.create({
                    body: SSR.render('manual-end-text', data),
                    to: '+1'+follower.phoneNumber,
                    from: Meteor.settings.private.twilio.number
                  })
                  .then((message) => console.log(message.sid));
                }
                if (follower.email) {
                  Email.send({
                    from: 'SafeTap <notifications@safetap.com>',
                    to: follower.email,
                    subject: data.userName + ' has just completed their appointment',
                    html: SSR.render('manual-end-email', data)
                  });
                }
              });
            }            
            //This is where we send that message to all followers
          }
        })
      }
    })
  }
});
