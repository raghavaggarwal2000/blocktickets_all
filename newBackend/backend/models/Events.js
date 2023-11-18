const mongoose = require("mongoose");
const Organiser = require("./Organiser");
const Artist = require("./Artist");
const EventDetails = require("./EventDetails");
const User = require("./User");
// let slug = require("mongoose-slug-generator");
// mongoose.plugin(slug)
// const Schema = 

const EventSchema = new mongoose.Schema({
    // creator : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : User
    // },
    organiser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Organiser"
    },
    artist : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Artist"
    },
    eventDetails : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "EventDetails"
    },
    timezone : {
        type : {}
    },
    eventTitle : {
        type : String
    },
    eventVenueLink : {
            type : String
    },
    slug : {
        type : String,
        // slug : "eventTitle",
        // unique: [true, "Slug should be unique"]
    },
    eventType : {
        type : String
    },
    eventNftId : {
        type : String
    },
    sponsor : {
        type : String
    },
    totalTicket : {
        type : Number
    },
    totalBooked : {
        type : Number
    }, 
    fees: {
        tax: {
          type: Number,
          default: 18,
          min: [0, "Min value should be zero"],
          max: [100, "Maximum value should be 100"],
        },
        //bt fee
        platform_fee: {
          type: Number,
          default: 5,
          min: [0, "Min value should be zero"],
          max: [100, "Maximum value should be 100"],
        },
        conv_fee: {
          type: Number,
          default: 3,
          min: [0, "Min value should be zero"],
          max: [100, "Maximum value should be 100"],
        }
        
      }, 
    startTime : {
        type : String
    }, 
    endTime : {
        type : String
    },
    startDate : {
        type : Date
    },
    endDate : {
        type : Date
    },
    tag : {
        type : Array
    },
    uri : {
        type : String
    },
    eventImageOriginal : {
        type : String
    }, 
   
    eventMobileImage:{
        type: String,
        default: "https://blocktickets-io.s3.ap-south-1.amazonaws.com/image1691733396252.png"
    },
    eventImageDescription : {
        type : String
    },
    eventSquareImage : {
        type : String
    },
    eventStatus : {
        type : String,
        enum: ["CLOSED", "UPCOMING", "CANCELLED", "LIVE"],
        default: "UPCOMING",
    }, 
    seatingImage: {
        type: String,
      },
    isPublic:{
        type: Boolean,
        default: false
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    publishStatus : {
        type : String
    },
    organiseWalletAddress : {
        type : String
    },
    show_on_banner:{
        type: Boolean,
        default:false
    },
    location : {
        type : String
    },


    // Delete Keys from hereee:
        freeWifi : {
        type : String
    },
    valeParking : {
        type : String
    },
    
ageRequirement: {
        type : String
    },
    dressCode : {
        type : String
    },
    alcoholicDrink : {
        type : String
    },
  
    foodAndBeverage : {
        type : String
    }
    // to here after prod is released
},  
    {timestamps : true });


    // EventSchema.pre("save", function(next) {
    //     this.slug = this.eventTitle.split(" ").join("-");
    //     next();
    // }),
    

module.exports = mongoose.model("Events", EventSchema)