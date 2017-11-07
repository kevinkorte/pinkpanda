import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Dates } from '../../api/dates/dates.js';

import "./dashboard.html";
import '../components/navigation.js';

Template.dashboard.onCreated(function() {
  let self = this;
  self.autorun(function() {
    console.log(self.subscribe('dates.all'));
    self.subscribe('dates.all');
  });
});

Template.dashboard.helpers({
  dates() {
    let dates = Dates.find()
    return dates;
  }
})
