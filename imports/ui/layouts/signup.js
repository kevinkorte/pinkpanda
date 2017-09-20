import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './signup.html';

Template.App_signup.events({
  'submit .js-submit'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    Meteor.call('newUserSignup', email, password, (error, response) => {
      if ( error ) {
        //Todo: Better error handling
        console.log(error)
      } else {
        //Successfully logged in, go to the next route
      }
    })
  }
})
