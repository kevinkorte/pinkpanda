import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Dates } from '../../../api/dates/dates.js';
import { Notifications } from '../../../api/notifications/notifications.js';
import flatpickr from 'flatpickr';
import moment from 'moment';
import 'flatpickr/dist/flatpickr.min.css';

import './date_can_edit_2.html';
import './_dates.js';
import './_map.js';
import '../../components/svg/chillin.html';
import '../../components/notifications/notifications.js';

Template.date_can_edit_2.onRendered(function() {
  GoogleMaps.initialize();
  $('#editModal').on('shown.bs.modal', () => {
    let center = GoogleMaps.maps.editableMap.instance.getCenter();
    google.maps.event.trigger(GoogleMaps.maps.editableMap.instance, "resize");
    GoogleMaps.maps.editableMap.instance.setCenter(center);
  });

});

Template.date_can_edit_2.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('notifications', FlowRouter.getParam('id'));
    self.subscribe('dates.single', FlowRouter.getParam('id'), function() {
    });

    GoogleMaps.ready('locationMap', function(map) {
      let marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
      let infowindow = new google.maps.InfoWindow();
      let id = FlowRouter.getParam('id');
      let notifications = Notifications.find({dateId: id});
      if ( notifications ) {
        notifications.forEach(function(notification) {
          if (notification.notificationType == 'check-in') {
            let position = new google.maps.LatLng(notification.lat, notification.lng);
            let marker = new google.maps.Marker({
              position: position,
              map: map.instance,
              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
            let circle = new google.maps.Circle({
              strokeColor: '#1f9be2',
              strokeOpacity: 0.6,
              strokeWeight: 2,
              fillColor: '#52a5ea',
              fillOpacity: 0.15,
              map: map.instance,
              center: position,
              radius: notification.accuracy
            });
            google.maps.event.addListener(marker, 'click', function(){
              infowindow.close(); // Close previously opened infowindow
              infowindow.setContent( "<div id='infowindow'>"+ notification.result[0].formattedAddress +"</div>" + "<div class='time-ago text-muted'><i class='fa fa-clock-o' aria-hidden='true'></i> "+moment(notification.timestamp).fromNow()+"</div>");
              infowindow.open(map, marker);
            });
          } else if (notification.notificationType == 'manual-start') {
            let position = new google.maps.LatLng(notification.lat, notification.lng);
            let marker = new google.maps.Marker({
              position: position,
              map: map.instance,
              icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            });
          }
        });
      }
    });
  });
});

Template.date_can_edit_2.helpers({
  date() {
    return Dates.findOne();
  },
  getAuthorName(user_id) {
    let user = Meteor.users.findOne(user_id);
    if ( user ) {
      return user.profile.name.first + " " + user.profile.name.last;
    }
  },
  getDate(timestamp) {
    return moment(timestamp).format('M/DD/YY [at] h:mm a');
  },
  locationMapOptions() {
    if ( GoogleMaps.loaded() ) {
      let dates = Dates.findOne(FlowRouter.getParam('id'));
      if ( dates ) {
        return {
          center: new google.maps.LatLng(dates.lat, dates.lng),
          zoom: 15
        };
      }
    };
  },
  isAuthor(author) {
    let id = Meteor.userId();
    if ( id ) {
      if ( id != author) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  getJobStatusClass(id) {
    let date = Dates.findOne(id);
    if ( date ) {
      if ( date.active == true && date.expired == false ) {
        return 'active-viewing'
      } else if ( date.active == false && date.expired == false ) {
        return 'upcoming-viewing'
      } else if ( date.expired == true) {
        return 'expired-viewing'
      }
    }   
  },
  isActive(id) {
    let date = Dates.findOne(id);
    if ( date ) {
      if ( date.active == true && date.expired == false ) {
        return true;
      }
    }
  },
  hasNotifications() {
    let notifications = Notifications.find().count();
    if ( notifications > 0 ) {
      return true;
    } else {
      return false;
    }
  },
  notifications() {
    return Notifications.find({},{ sort: { timestamp: -1 } });
  },
  getNotificationIcon(type) {
    if ( type == 'check-in') {
        return '<span class="fa-stack text-primary"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-location-arrow fa-stack-1x fa-inverse"></i></span>';
      } else if ( type == 'manual-start' || type == 'auto-start') {
        return '<span class="fa-stack text-success"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-flag fa-stack-1x fa-inverse"></i></span>';
      } else if ( type == 'auto-end') {
        return '<span class="fa-stack text-danger"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-flag-checkered fa-stack-1x fa-inverse"></i></span>'
      } else if ( type == 'manual-end') {
        return '<span class="fa-stack text-secondary"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-flag-checkered fa-stack-1x fa-inverse"></i></span>'
      }
  },
  notificationTitle(type) {
    if (type == 'check-in') {
      return "Check-In"
    } else if (type == 'manual-start') {
      return "Start"
    } else if (type == 'auto-start') {
      return "Auto Start"
    } else if (type == 'auto-end') {
      return "Time Expired"
    } else if (type == 'manual-end') {
      return "Ended"
    }
  },
  notificationTimestamp(timestamp) {
    Session.get('time');
    return moment(timestamp).fromNow();
  },
  notificationAddress(id) {
    let notification = Notifications.findOne(id);
    if ( notification ) {
      return notification.coords[0].formattedAddress;
    }
  },
  getLatLng(id) {
    let notification = Notifications.findOne(id);
    if ( notification ) {
      return notification.coords[0].latitude + " " + notification.coords[0].longitude
    }
  }
});

Template.date_can_edit_2.events({
  'click #start'(event) {
    $(event.target).html($(event.target).data('loading'));
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('startDate', lat, lng, accuracy, timestamp, id, (error, result) => {
          if ( error ) {
            Bert.alert(error.reason, "warning");
            $(event.target).html('Start');
          } else {
            $(event.target).html('Start');
          }
        });
      })
    } else {
      Bert.alert('Geolocation is not enabled on your browser.', "warning");
      $(event.target).html('Start');
    }
  },
  'click #checkin'(event) {
    $(event.target).html($(event.target).data('loading'));
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('addNotification', lat, lng, accuracy, timestamp, id, function(error, result) {
          if ( error ) {
            Bert.alert( error.reason, "warning" );
            $(event.target).html('Check In');
          } else {
            $(event.target).html('Check In');
          }
        });
      });
    } else {
      Bert.alert('Geolocation is not enabled on your browser.', "warning");
      $(event.target).html('Check In');
    }
  },
  'click #stop'(event) {
    if ( "geolocation" in navigator ) {
      navigator.geolocation.getCurrentPosition( (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('endDate', lat, lng, accuracy, timestamp, id, (error, result) => {
          if ( error ) {
            Bert.alert(error.reason, "warning");
          }
        });
      })
    } else {
      console.log('no geo');
    }
  }
});