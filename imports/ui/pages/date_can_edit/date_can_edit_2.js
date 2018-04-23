import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Dates } from '../../../api/dates/dates.js';
import { Notifications } from '../../../api/notifications/notifications.js';
import flatpickr from 'flatpickr';
import moment from 'moment';
import 'flatpickr/dist/flatpickr.min.css';

import './date_can_edit_2.html';
import '../../components/svg/chillin.html';
import '../../components/notifications/notifications.js';

Template.date_can_edit_2.onRendered(function() {
  GoogleMaps.initialize();
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
        return '<i class="icon circular warning sign"></i>'
      } else if ( type == 'manual-end') {
        return '<i class="icon circular flag checkered"></i>'
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