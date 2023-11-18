const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema(
  {
    auctionType: {
      type: String,
      required: true,
    },
    auctionId: {
      type: Number,
      required: true,
    },
    auctionTimer: {
      type: Number,
      default: 0,
    },
    auctionStatus: {
      type: Number,
      enum: { values: [1, 2, 3, 4], message: `{VALUE} is not a valid` }, // 1- Auction Created,2- Auction Started, 3-Auction Finished, 4- Auction Cancelled
      default: 1,
    },
    auctionStartOn: Date,
    auctionStartTxnHash: String,
    auctionEndedOn: Date,
    auctionEndTxnHash: String,
    auctionCancelledOn: Date,
    auctionCancelTxnHash: String,
    tokenId: Number,
    nftId: {
      type: mongoose.Types.ObjectId,
      ref: "Nft",
    },
    chain: String,
    lastBid: {
      type: Number,
      default: 0,
    },
    bidsPlaced: {
      type: Number,
      default: 0,
    },
    startBid: {
      type: Number,
      default: 0,
    },
    bids: {
      type: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    auctionWinner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", AuctionSchema);
