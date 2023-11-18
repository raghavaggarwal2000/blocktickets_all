const mongoose = require("mongoose");
const User = require("./User");
const OrganizerSchema = new mongoose.Schema(
  {
    experienceLevel: {
      type: String,
    },
    teamSize: {
      type: Number,
    },
    eventType: {
      type: String,
    },
    organizerName: {
      type: String,
    },
    aboutOrganizer: {
      type: String,
    },
    referral: {
      type: String,
    },
    frequency: {
      type: String,
    },
    category: {
      type: String,
    },
    logoOriginal: {
      type: String,
    },
    logoCompress: {
      type: String,
    },
    isCreated:{
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrganizerDummy", OrganizerSchema);
