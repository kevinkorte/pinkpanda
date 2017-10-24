import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './followers.html';

Template.followers.onRendered(function() {
  $('#select').select2({});
})
