import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/dashboard/settings.js';
import '../../ui/layouts/login.js';
import '../../ui/layouts/signup.js';
import '../../ui/layouts/onboarding.js';
import '../../ui/layouts/dashboard.js';
import '../../ui/layouts/dashboard_drafts.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/settings.js';
import '../../ui/pages/new-date/new-date.js';
import '../../ui/pages/date_can_edit/date_can_edit.js';
import '../../ui/pages/date_public/date_public.js';
import '../../ui/pages/not-found/not-found.js';

Accounts.onResetPasswordLink( ( token, done ) => {
  console.log('password');
  FlowRouter.go('setNewPassword');
  Template.setNewPassword.events({
    'submit #js-password-reset-form'(event) {
      event.preventDefault();
      const password = event.target.password.value;
      const confirmPassword = event.target.confirmPassword.value;
      if ( password != confirmPassword ) {
        Bert.alert('Passwords do not match', 'danger');
      } else {
        Accounts.resetPassword(token, password, (error) => {
          if ( error ) {
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('Password successfully reset', 'success');
            FlowRouter.go('dashboard');
            done();
          }
        });
      }
    }
  });
});


// Set up all routes in the app
Accounts.onLogout( () => {
  FlowRouter.redirect('/login');
});

let authRoutes = FlowRouter.group({
  name: 'auth',
  triggersEnter: [function(context, redirect) {
    if ( !Meteor.userId() ) {
      redirect('/signup')
    }
  }]
});

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
    Session.set('error', null);
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
    Session.set('error', null);
  },
  action() {
    if ( Meteor.userId() ) {
      FlowRouter.go('dashboard');
    } else {
      BlazeLayout.render('App_login');
    }
  },
});

FlowRouter.route('/logout', {
  name: 'App.logout',
  action() {
    Meteor.logout( (error) => {
      if ( error ) {
        console.log(error);
      } else {
        FlowRouter.redirect('/login');
      }
    });
  }
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

authRoutes.route('/dashboard', {
  name: 'dashboard',
  triggersEnter: [function() {
    $('body').addClass('dashboard');
  }],
  triggersExit: [function() {
    $('body').removeClass('dashboard');
  }],
  action() {
    BlazeLayout.render('dashboard');
  }
});

authRoutes.route('/dashboard/drafts', {
  name: 'dashboard.draft',
  triggersEnter: [function() {
    $('body').addClass('dashboard');
  }],
  triggersExit: [function() {
    $('body').removeClass('dashboard');
  }],
  action() {
    BlazeLayout.render('dashboard_drafts');
  }
});

authRoutes.route('/dashboard/me', {
  name: 'dashboard.me',
  action() {
    BlazeLayout.render('dashboard');
  }
});

authRoutes.route('/date/:user/:id/new', {
  name: 'new.date',
  triggersEnter: [function() {
    $('body').addClass('new-date');
  }],
  triggersExit: [function() {
    $('body').removeClass('new-date');
  }],
  action() {
    BlazeLayout.render('App_body', { main: 'new_date' });
  }
});

FlowRouter.route('/date/:user/:id', {
  name: 'single.date',
  triggersEnter: function(context, params) {
  },
  action() {
    let user = FlowRouter.current().params.user;
    if ( Meteor.userId() == user ) {
      BlazeLayout.render('App_body', { main: 'date_can_edit' });
    } else {
      //Don't worry, someone still can't edit it, handling this on the
      //template level, need to sort this out
      BlazeLayout.render('App_body', { main: 'date_can_edit' });
    }
  }
});

authRoutes.route('/settings', {
  name: 'settings',
  action() {
    BlazeLayout.render('App_settings', { main: 'settings' });
  }
});

FlowRouter.route('/settings/reset-password', {
  name: 'reset-password',
  action() {
    BlazeLayout.render('App_settings', { main: 'resetPassword' });
  }
});

FlowRouter.route('/settings/set-new-password', {
  name: 'setNewPassword',
  action() {
    BlazeLayout.render('App_settings', { main: 'setNewPassword' } );
  }
});

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
});

