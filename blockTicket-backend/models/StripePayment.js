const mongoose = require("mongoose");

const StripePaymentSchema = new mongoose.Schema(
  {
    orderToken: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      // required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },

    tickets: {
      type: Array,
      required: true,
      default: [],
    },
    amount: {
      type: String,
    },
    currency: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    breakupPrices: {
      type: {},
    },
    invoice: {
      type: String,
      default: null,
    },
    uniqueId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StripePayment", StripePaymentSchema);
