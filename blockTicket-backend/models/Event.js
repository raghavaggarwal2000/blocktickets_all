const mongoose = require("mongoose");
const User = require("./User");
const Organizer = require("./Organizer");

const EventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Organizer,
    },
    sponser: {
      type: String,
    },
    artist: {
      type: mongoose.Types.ObjectId,
      ref: "Artist",
    },
    eventType: {
      type: String,
    },
    eventNftId: {
      type: String,
    },
    tags: {
      type: [String],
    },
    location: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    duration: {
      type: Number,
    },
    uri: {
      type: String,
    },
    eventImageOriginal: {
      type: String,
    },
    eventImageCompress: {
      type: String,
    },
    seatingImage: {
      type: String,
    },
    eventDescription: {
      type: String,
    },
    eventStatus: {
      type: String,
      enum: ["CLOSED", "UPCOMING", "CANCELLED", "LIVE"],
      default: "UPCOMING",
    },
    totalTicket: {
      type: Number,
      default: 0,
    },
    totalBooked: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    publishStatus: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    organizerWalletAddress: {
      type: String,
    },
    freeWifi: {
      type: String,
    },
    valeParking: {
      type: String,
    },
    ageRequirement: {
      type: String,
    },
    dressCode: {
      type: String,
    },
    alcoholicDrink: {
      type: String,
    },
    foodAndBeverage: {
      type: String,
    },
    eventSquareImage: {
      type: String,
    },
    eventVenueLink: {
      type: String,
    },
    dummy: {
      type: Boolean,
      default: false,
    },
    eventVideo: {
      type: String,
    },
    show_on_banner: {
      type: Boolean,
      default: false,
    },
    timezone: {
      type: {},
    },
    fees: {
      tax: {
        type: Number,
        default: 18,
        min: [0, "Min value should be zero"],
        max: [100, "Maximum value should be 100"],
      },
      //convenience fee
      platform_fee: {
        type: Number,
        default: 3,
        min: [0, "Min value should be zero"],
        max: [100, "Maximum value should be 100"],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
