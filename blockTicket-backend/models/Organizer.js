const mongoose = require("mongoose");
const User = require("./User");
const OrganizerSchema = new mongoose.Schema(
  {
    experienceLevel: {
      type: String
    },
    teamSize: {
      type: String
    },
    eventType: {
      type: String
    },
    organizerName: {
      type: String
    },
    aboutOrganizer: {
      type: String
    },
    referral: {
      type: String
    },
    frequency: {
      type: String
    },
    category: {
      type: String
    },
    logoOriginal: {
      type: String
    },
    logoCompress: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    peopleAttended: {
      type: String
    },
    numOfEvents: {
      type: String
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model("Organizer", OrganizerSchema);
