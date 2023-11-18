const mongoose = require("mongoose");
const Event = require("./Event");
const Nft = require("./Nft");
const TicketType = require("./TicketType");
const User = require("./User");

const TicketSchema = new mongoose.Schema(
  {
    Event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Event,
    },
    nftIndex: {
      type: String,
    },
    nftRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Nft,
    },
    paymentMode: {
      type: String,
      enum: ["CARD", "CRYPTO"],
      uppercase: true,
    },
    ticketType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TicketType,
    },
    ticketImage: {
      type: String,
      default: "",
    },
    addon: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    nftHash: {
      type: String,
    },
    prices: {
      type: {},
    },
    price: {
      type: Number,
    },
    onTheSpot: {
      type: Boolean,
      default: false,
    },
    // dollar: {
    //   type: String,
    // },
    // transactionCharge: {
    //   type: Number,
    // },
    // otherCharge: {
    //   type: Number,
    // },
    // totalPrice: {
    //   type: Number,
    // },
    // addonTxHash: {
    //   type: String,
    //   default: "",
    // },
    onSale: {
      type: Boolean,
      default: false,
    },
    saleId: {
      type: String,
      default: "-1",
    },
    specialPackageClaimed: {
      type: Boolean,
      default: false,
    },
    claimedWallet: {
      type: String,
      default: "",
    },
    fullyPaid: {
      type: Boolean,
      default: false,
    },
    ticketUsed: {
      type: Boolean,
      default: false,
    },
    qrCode: {
      type: String,
    },
    invoiceUrl: {
      type: String,
    },
    totalTicketPrice: {
      type: String,
    },
    bookingId: {
      type: String,
    },
    generated: {
      _from: { type: String, default: "blocktickets.io" },
      _reason: { type: String, default: "" },
      _approved_by_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
      _approved_by_email: {
        type: String,
        default: "",
      },
      _sold: {
        type: Number,
        default: 0,
      },
      _bundle_id: {
        type: String,
      },
    },
    check_in_details: {
      check_in_time: {
        type: Date,
      },
      checked_in_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    },
    couponCode: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
