// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';
import './smtp.js';

ServiceConfiguration.configurations.upsert(
  { service: 'facebook' },
  {
    $set: {
      loginStyle: "popup",
      appId: Meteor.settings.private.facebookAppId, // See table below for correct property name!
      secret: Meteor.settings.private.facebookSecret
    }
  }
);
