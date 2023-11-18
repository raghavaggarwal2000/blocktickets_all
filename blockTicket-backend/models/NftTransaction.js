const mongoose = require("mongoose");

const transaction = new mongoose.Schema(
  {
    listedDate: {
      type: String,
    },
    purchasedDate: {
      type: String,
    },
    previousOwner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    currentOwner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    nft: {
      type: mongoose.Types.ObjectId,
      ref: "Nft",
    },
    ticket: {
        type: mongoose.Types.ObjectId,
        ref: "ticket",
      },
      price: {
        type: String,
      },
      transactionHash: {
        type: String,
      },
      isSuccessful:{
          type: Boolean,
          default: false
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("nftTransaction", transaction);
