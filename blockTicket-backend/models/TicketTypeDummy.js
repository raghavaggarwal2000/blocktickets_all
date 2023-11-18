const mongoose = require("mongoose");
const Event = require("./EventDummy");
const Nft = require("./Nft");

const TicketTypeSchema = new mongoose.Schema(
  {
    ticketName: {
      type: String,
    },
    ticketQuantity: {
      type: Number,
    },
    ticketType: {
      type: String,
    },
    price: {
      type: Number,
    },
    visible: {
      type: String,
      enum: ["HIDDEN", "VISIBLE"],
      default: "VISIBLE",
    },
    Event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Event,
    },
    sold: {
      type: Number,
      required: function () {
        return this.ticketQuantity >= this.sold;
      },
      default:0
    },
    ticketCategory:{
      type: String,
      enum:["PAID","DONATION","FREE"],
      default: "PAID"
    },
    currency:{
      type: String
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    ticketInfo:{
      type: String
    },
    isCreated:{
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TicketTypeDummy", TicketTypeSchema);

