import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './onboarding.html';

Template.profile_name.events({
  'submit #add_name_to_account'(event) {
    event.preventDefault();
    console.log(event);
  }
})
