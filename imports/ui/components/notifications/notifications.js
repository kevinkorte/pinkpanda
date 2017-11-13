import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Notifications } from '../../../api/notifications/notifications.js';

import './notifications.html';

Template.notifications.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('notifications', FlowRouter.getParam('id'));
  });
});

Template.notifications.helpers({
  notifications() {
    return Notifications.find();
  },
  textColorClass(id) {
    let date = Dates.findOne(id);
    if ( date ) {
      if (date.eventType == 'manual-start' || date.eventType == 'auto-start') {
        return 'text-success'
      } else if (date.eventType == 'auto-end') {
        return 'text-danger'
      }
    }
  },
  notificationTitle() {
    return
  }
})
