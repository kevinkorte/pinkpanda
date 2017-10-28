import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './followers.html';

import 'jquery-mask-plugin';

Template.manageFollowers.onRendered(function() {

$('#phoneNumber').mask('(000) 000-0000', {
  placeholder: "(   )   -    "
});
$('#editPhoneNumber').mask('(000) 000-0000', {
  placeholder: "(   )   -    "
});

});
