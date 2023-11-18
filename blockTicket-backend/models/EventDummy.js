const mongoose = require("mongoose");
const User = require("./User")
const Organizer = require("./OrganiserDummy")

const EventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref:User
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref:Organizer
    },
    sponser:{
     type:String
    },
    performer:{
        type:[String]
    },
    eventType: {
      type: String,
    },
    tags: {
      type: [String],
    },
    location: {
     type: String ,
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
    eventImageOriginal: {
      type: String,
    },
    eventImageCompress: {
      type: String,
    },
    eventDescription: {
      type: String,
    },
    eventStatus:{
        type: String,
        enum: ["CLOSED", "UPCOMING","CANCELLED","LIVE"],
        default: "UPCOMING",
    },
    totalTicket:{
        type:Number,
        default:0
    },
    totalBooked:{
      type: Number,
      default:0
    },
    isPublic:{
      type: Boolean,
      default: true
    },
    isPrivate:{
      type: Boolean,
      default: false
    },
    publishStatus:{
      type: String
    },
    isCreated:{
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventDummy", EventSchema);
