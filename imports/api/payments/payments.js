import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema';

export const Payments = new Mongo.Collection("payments");

PaymentSchema = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  }
});

Payments.attachSchema( PaymentSchema );