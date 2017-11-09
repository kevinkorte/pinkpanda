import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Dates } from '../../../api/dates/dates.js';

import './date_can_edit.html';

Template.date_can_edit.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('dates.single', FlowRouter.getParam('id') );
  });
});

Template.date_can_edit.onRendered(function() {
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17
  });
  map.setCenter({ lat: 46.2267042, lng:-119.24917970000001 });
  let marker = new google.maps.Marker({
    map: map,
    position: { lat: 46.2267042, lng:-119.24917970000001 }
  })
})

Template.date_can_edit.helpers({
  date() {
    return Dates.findOne();
  }
})
