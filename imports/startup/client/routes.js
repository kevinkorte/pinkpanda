import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/login.js';
import '../../ui/layouts/signup.js';
import '../../ui/layouts/onboarding.js';
import '../../ui/layouts/dashboard.js';
import '../../ui/pages/home/home.js';
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
  action() {
    BlazeLayout.render('App_signup');
  },
});

FlowRouter.route('/login', {
  name: 'App.login',
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
    console.log('fire');
    BlazeLayout.render('onboarding', { content: 'profile_name' } );
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action() {
    BlazeLayout.render('dashboard');
  }
})

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
