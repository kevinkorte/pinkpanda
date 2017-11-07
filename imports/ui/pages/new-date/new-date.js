import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './new-date.html';

import '../../components/places/places.js';
import '../../components/set-date/set-date.js';
import '../../components/plus_one/plus_one.js';
import '../../components/followers/followers.js';

Template.new_date.events({
  'submit #updateDate'(event) {
    event.preventDefault();
    const id = FlowRouter.getParam('id');
    const target = event.target;
    const start = target.startDate.value;
    const end = target.endDate.value;
    const place = target.place.value;
    const lat = target.lat.value;
    const lng = target.lng.value;
    const dateName = target.dateName.value;
    const dateURL = target.dateURL.value;
    Meteor.call('updateDate',
      id,
      start,
      end,
      place,
      lat,
      lng,
      dateName,
      dateURL,
    (error, result) => {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      }
    });
  }
})
