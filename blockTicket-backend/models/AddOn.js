const mongoose = require("mongoose");
const Event = require("./Event");
const Nft = require("./Nft");
const TicketType = require("./TicketType");

const AddOnSchema = new mongoose.Schema(
  {
    Event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Event,
    },
    addOnName: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    addOnInfo: {
      type: String,
    },
    uri: {
      type: String,
    },
    termsAndCondition: {
      type: String
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TicketType,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddOn", AddOnSchema);
