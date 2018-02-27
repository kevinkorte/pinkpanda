import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Dates } from '../../api/dates/dates.js';

import moment from 'moment';
import timezone from 'moment-timezone';

import "./dashboard.html";
import '../components/navigation.js';
import '../components/svg/dashboard.html';

Template.dashboard.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('dates.all');
  });
});

Template.dashboard.helpers({
  hasdates() {
    let dates = Dates.find().count();
    if ( dates > 0 ) {
      return true;
    } else {
      return false;
    }
  },
  dates() {
    return Dates.find({ draft: false }, {sort: {starting: 1}});
  },
  getUserName(id) {
    let user = Meteor.users.findOne(id);
    if ( user ) {
      return user.profile.name.first + " " + user.profile.name.last;
    }
  },
  dateDay(timestamp) {
    return moment(timestamp).tz(moment.tz.guess()).format('ddd MMM, Do')
  },
  dateTime(timestamp) {
    let tz = moment.tz.guess();
    return moment(timestamp).tz(tz).format('h:mm a');
  },
  getNumOfFollowers(id) {
    let dates = Dates.findOne(id);
    if (dates) {
      if (dates.followers) {
        let num = Object.keys(dates.followers).length;
        return num;
      } else {
        return 0;
      }
    }
  },
  isActive(id) {
    let dates = Dates.findOne(id);
    if (dates) {
      if (dates.active == true) {
        return 'card-active'
      }
    }
  },
  isMine(id) {
    let date = Dates.findOne(id);
    if ( date ) {
      let user = date.user;
      if ( user == Meteor.userId() ) {
        return true;
      } else {
        return false;
      }
    }
  }
});

// Template.dashboard.events({
//   //duplicated from navigation events
//   'click .js-new-date'(event) {
//     Meteor.call('createNewDate', (error, result) => {
//       if (error) {
//         console.log(error)
//       } else {
//         console.log(result);
//         FlowRouter.go('new.date', {user: Meteor.userId(), id: result});
//       }
//     });
//   }
// })
