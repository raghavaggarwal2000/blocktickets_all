const mongoose = require("mongoose");

const NftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "NFT name is required"],
    },
    imageHash: { type: String },
    jsonHash: { type: String },
    imageUrl: { type: String },
    nftType: {
      type: String,
      enum: {
        values: ["image", "audio", "video", "experential"],
        message: `{VALUE} is not supported`,
      },
      default: "image",
    },
    description: {
      type: String,
      required: [true, "Nft description is required"],
    },
    tags: [String],
    isApproved: { type: Boolean, default: false },
    approvedAt: Date,
    approveHash: String,
    blockNumber: Number,
    mintHash: String,
    mintReceipt: {},
    tokenId: String,
    auctionId: Number,
    views: { type: Number, default: 0 },
    uploadedBy: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    mintedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    chain: {
      type: String,
      default: 'matic'
    },
    minterAddress:{
      type: String
    },
    currentOwnerAddress:{
      type: String
    },
    ownedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    showTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    price:{
      type: Number
    },
    dollar: {
      type: String
    },
    transactionCharge:{
      type: Number
    },
    otherCharge:{
      type: Number
    },
    totalPrice:{
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nft", NftSchema);


// current ownner