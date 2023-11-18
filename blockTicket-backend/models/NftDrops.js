const mongoose = require("mongoose");

const nftDrops = new mongoose.Schema(
  {
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
    ticket: {
      type: mongoose.Types.ObjectId,
      ref: "ticket",
    },
    dropTokenId:{
      type:String,
    },
    dropName:{
      type:String
    },
    dropUrl: {
      type: String,
    },
    claimedWallet:{
      type:String,
    },
    claimed:{
      type:Boolean,
      default:false
    },
    ownedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NftDrop", nftDrops);
