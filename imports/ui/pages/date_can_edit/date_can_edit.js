import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Dates } from '../../../api/dates/dates.js';
import { Notifications } from '../../../api/notifications/notifications.js';
import flatpickr from 'flatpickr';
import moment from 'moment';
import 'flatpickr/dist/flatpickr.min.css';

import './date_can_edit.html';
import '../../components/notifications/notifications.js';

Template.date_can_edit.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('notifications', FlowRouter.getParam('id'));
    self.subscribe('dates.single', FlowRouter.getParam('id'), function() {
      Tracker.afterFlush(function() {
        let date = Dates.findOne();
        const start_date = $('.start-date').flatpickr({
          minDate: 'today',
          altInput: true,
          enableTime: true,
          onChange: function(selectedDates, dateStr, instance) {
            end_date.set('minDate', Date.parse(selectedDates[0]));
            Session.set('start_date', selectedDates[0]);
          }
        });
        const end_date = $('.end-date').flatpickr({
          minDate: 'today',
          altInput: true,
          enableTime: true,
          onChange: function(selectedDates, dateStr, instance) {
            start_date.set('maxDate', Date.parse(selectedDates[0]));
          }
        });
        start_date.setDate(date.starting);
        end_date.setDate(date.ending);
      });
    } );

    GoogleMaps.ready('locationMap', function(map) {
      let marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
      let infowindow = new google.maps.InfoWindow();
      let id = FlowRouter.getParam('id');
      let notifications = Notifications.find({dateId: id});
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
    });
  });
});

Template.date_can_edit.onRendered(function() {
  GoogleMaps.initialize();
});

Template.date_can_edit.helpers({
  date() {
    return Dates.findOne();
  },
  notifications() {
    console.log(Notifications.find());
    return Notifications.find();
  },
  locationMapOptions() {
    if ( GoogleMaps.loaded() ) {
      let dates = Dates.findOne(FlowRouter.getParam('id'));
      console.log(dates);
      if ( dates ) {
        return {
          center: new google.maps.LatLng(dates.lat, dates.lng),
          zoom: 17
        };
      }
    };
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
  notificationAddress(id) {
    let notification = Notifications.findOne(id);
    if ( notification ) {
      return notification.result[0].formattedAddress;
    }
  }
});

Template.date_can_edit.events({
  'click #check-in'(event) {
    console.log(event, 'check in');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('addNotification', lat, lng, accuracy, timestamp, id, function(error, response) {
          if ( error && error.error === "add-event" ) {
            Bert.alert( error.reason, "warning" );
          } else {
            console.log('success');
          }
        });
      });
    } else {
      console.log('no geo');
    }
  }
})
