import { Meteor } from 'meteor/meteor';

Meteor.publish('payments', function() {
  console.log('payments');
  let user = Meteor.users.findOne(this.userId);
  // console.log(user);
  if (user) {
    let stripeCustomerId = user.stripeCustomerId;
    
  }
});