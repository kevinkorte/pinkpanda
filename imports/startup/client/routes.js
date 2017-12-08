import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base'
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/dashboard/settings.js';
import '../../ui/layouts/login.js';
import '../../ui/layouts/signup.js';
import '../../ui/layouts/onboarding.js';
import '../../ui/layouts/dashboard.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/settings.js';
import '../../ui/pages/new-date/new-date.js';
import '../../ui/pages/date_can_edit/date_can_edit.js';
import '../../ui/pages/date_public/date_public.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/signup', {
  name: 'App.signup',
  triggersEnter: function(context, params) {
    $('body').addClass('signup-page');
  },
  triggersExit: function(context, params) {
    $('body').removeClass('signup-page');
  },
  action() {
    BlazeLayout.render('App_signup');
  },
});

FlowRouter.route('/login', {
  name: 'App.login',
  triggersEnter: function(context, params) {
    $('body').addClass('login-page');
  },
  triggersExit: function(context, params) {
    $('body').removeClass('login-page');
  },
  action() {
    BlazeLayout.render('App_login');
  },
});

FlowRouter.route('/welcome', {
  name: 'onboarding',
  action() {
    BlazeLayout.render('onboarding');
  }
});

FlowRouter.route('/welcome/:step', {
  name: 'onboarding.step',
  action() {
    BlazeLayout.render('onboarding', { content: 'profile_name' } );
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action() {
    BlazeLayout.render('dashboard');
  }
});

FlowRouter.route('/dashboard/me', {
  name: 'dashboard.me',
  action() {
    BlazeLayout.render('dashboard');
  }
});

FlowRouter.route('/date/:user/:id', {
  name: 'new.date',
  action() {
    BlazeLayout.render('App_body', { main: 'new_date' });
  }
});

FlowRouter.route('/:user/:id', {
  name: 'single.date',
  triggersEnter: function(context, params) {
    let user = FlowRouter.current().params.user;
    if ( Meteor.userId() == user ) {
      BlazeLayout.render('App_body', { main: 'date_can_edit' });
    } else {
      BlazeLayout.render('App_body', { main: 'date_public' });
    }
  }
});

FlowRouter.route('/settings', {
  name: 'settings',
  action() {
    BlazeLayout.render('App_settings', { main: 'settings' });
  }
})

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

Accounts.onEmailVerificationLink( function( token,done ) {
  Accounts.verifyEmail( token, function( error ) {
    if ( error ) {
      Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
    } else {
      done();
    }
  })
})
