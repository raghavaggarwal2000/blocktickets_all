const mongoose = require("mongoose");
const User = require("./User");

const ListEventFormSchema = new mongoose.Schema(
  {
    
    userFullName: {
      type: String
    },
    email: {
      type:String
    },
    phoneNumber : {
      type:Number
    },
    eventRegion: {
      type:String
    },
    eventCity: {
      type:String
    },
    eventType: {
      type:String
    },
    expectedAudience: {
      type:String
    },
    eventDate: {
      type:String
    },
    eventDesctiption: {
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ListEventForm", ListEventFormSchema);