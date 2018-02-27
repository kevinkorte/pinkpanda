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
    const placeName = target.placeName.value;
    const formatted_address = target.formatted_address.value;
    const lat = target.lat.value;
    const lng = target.lng.value;
    const phone = target.phone.value;
    const url = target.url.value;
    const dateName = target.dateName.value;
    const dateURL = target.dateURL.value;
    const followers = $('.edit-followers-input').val();
    Meteor.call('updateDate',
      id,
      start,
      new Date(end).toISOString(),
      place,
      placeName,
      formatted_address,
      lat,
      lng,
      phone,
      url,
      dateName,
      dateURL,
    (error, result) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      }
    });
    Meteor.call('addFollowers', followers, id, (error, result) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      }
    });
    FlowRouter.go('dashboard');
  }
});
