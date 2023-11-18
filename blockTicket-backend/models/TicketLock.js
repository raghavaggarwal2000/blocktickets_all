const mongoose = require("mongoose");
const Event = require("./Event");

const TicketLockedSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    ticketQuantity: {
      type: Number,
    }, 
    ticketLocked: {
      type: Number,
      required: true,
      default:0
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TicketLocked", TicketLockedSchema);



// payment mode crypto or fiat
// if payment is fiat then the owner is admin from backend but show user as owner in FE
// mintid
