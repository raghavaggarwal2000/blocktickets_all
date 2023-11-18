const mongoose = require("mongoose");

// individual discount codes
const discountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    usedBy: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      default: null,
    },
    discountId: {
      type: mongoose.Types.ObjectId,
      ref: "Discount",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    valid_from: {
      type: Date,
      default: new Date(),
    },
    valid_till: {
      type: Date,
    },
    event:{
      type: mongoose.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType:{
      type: mongoose.Types.ObjectId,
      ref: "TicketType",
      required: true,
    }
  },
  { timestamps: true }
);

const discountSchema = new mongoose.Schema(
  {
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
const Discount = mongoose.model("Discount", discountSchema);

module.exports = {
  DiscountCode,
  Discount,
};
