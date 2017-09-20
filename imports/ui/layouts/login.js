import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './login.html';

Meteor.App_login.events({
  'submit .js-login'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    user = Accounts.findUserByEmail(email);
    if ( user ) {
      Meteor.loginWithPassword(user, password, (error, response) => {
        if (error) {
          //Todo: Better error handling
          console.log(error)
        } else {
          //Successfully logged in, go to the next route
        }
      })
    }
  }
})
