import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Followers } from '../../../api/followers/followers.js';

import './followers.html';


Template.manageFollowers.onRendered(function() {
  $('#select').select2({});
})
