Meteor.startup(function() {
  Meteor.setInterval(function() {
    Session.set("time", new Date().getTime());
  }, 15000);
});
