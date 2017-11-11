Meteor.startup(function() {
  SyncedCron.start();
});

SyncedCron.add({
  name: "Have any jobs expired but not closed?",
  schedule: function(parser) {
    return parser.text('every 1 minute');
  },
  job: function() {
    let dates = Dates.find({active: true, ending: { $lte: new Date() }, alertSent: false }).fetch();
    dates.forEach(function( date ) {
      Meteor.call('autoEndDate', date._id);
    });
  }
});
