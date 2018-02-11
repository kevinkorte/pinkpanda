import { Meteor } from 'meteor/meteor';
import { Sources } from '../sources.js';

Meteor.publish('sources', function() {
    let user = Meteor.users.findOne(this.userId);
    if ( user ) {
        if ( user.stripeCustomerId ) {
            return Sources.find({'data.object.customer': user.stripeCustomerId});
        }
    }
})