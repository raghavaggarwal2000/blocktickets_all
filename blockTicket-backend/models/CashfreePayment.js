const mongoose = require("mongoose");
const User = require("./User");
const Event = require("./Event");

const CashfreePaymentSchema = new mongoose.Schema(
  {
    orderToken: {
      type: String,
      default : "",
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Event,
    },
    orderId: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
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
    type: {
      type: String,
      required: true,
    },
    onTheSpot: {
      type: Boolean,
      default: false,
    },
    tickets: {
      type: Array,
      required: true,
      default: [],
    },
    totalTicketQuantity: {
      type: Number,
      required: true,
    },
    amount: {
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

module.exports = mongoose.model("CashfreePayment", CashfreePaymentSchema);
