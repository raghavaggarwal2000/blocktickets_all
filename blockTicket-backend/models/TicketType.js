const mongoose = require("mongoose");
const Event = require("./Event");
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
    ticketNftId: {
      type: String,
    },
    basePrice:{
      type: Number,
    },
    price: {
      type: Number,
    },
    undiscountedPrice: {
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
      default: 0,
    },
    uri: {
      type: String,
    },
    image: {
      type: String,
    },
    ticketCategory: {
      type: String,
      enum: ["PAID", "DONATION", "FREE"],
      default: "PAID",
    },
    currency: {
      type: String,
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
    ticketInfo: {
      type: String,
    },
    gasFee: {
      type: String,
    },
    // ! new field to get total no of tickets of an organizer
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    maticPrice: {
      type: Number,
    },
    ticketEventStartDate: {
      type: String,
    },
    ticketEventStartTime: {
      type: String,
    },
    ticketEventEndDate: {
      type: String,
    },
    ticketEventEndTime: {
      type: String,
    },
    flag: {
      type: String,
    },
    ticketSponsorImage: {
      type: String,
    },
    displayPrice: {
      type: Number,
    },
    ticketDisplayOrder: {
      type: Number,
    },
    color: {
      type: String,
      // ['redDark','red','silver','gold','platinum','black']
    },
    should_advanced: {
      type: Boolean,
    },
    sold_out: {
      type: Boolean,
      default: "false"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TicketType", TicketTypeSchema);
