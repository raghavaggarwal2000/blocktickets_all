const mongoose = require("mongoose");

const EventCreatorSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true
    },
    companyAddress: {
      type: String,
      required: true
    },
    city: {
      type:String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    bankAccountType: {
      type: String,
      required: true
    },
    bankAccountName: {
      type:String,
      required: true
    },
    bankAccountNumber: {
      type: String,
      required: true,
      unique: true
    },
    ifscCode: {
      type: String,
      required: true
    },
    chequeImage: {
      type:String
    },
    panImage: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventCreator", EventCreatorSchema);
