const mongoose = require("mongoose");
const User = require("./User");
const CouponCodeUsageSchema = require("./CouponCodeUsage")
const Events = require("./Events")

const Schema = mongoose.Schema

const CouponCodeSchema = new Schema({
     usedBy : {
         type : [mongoose.Schema.Types.ObjectId],
         ref : "CouponCodeUsageSchema",
         default:null
     },

     createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     },

     Event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Events"
     },

     TicketType : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketType"
     }],

     code : {
        type : String,
        unique: [true, "Please enter a unique coupon code"]
     },

     quantity : {
        type : Number
     },

     show_coupon:{
      type: Boolean,
      default: false
     },

     valid_from : {
        type : Date
     },

     valid_till : {
      type : Date
     },
     
     discountPercentage : {
      type : Number 
     }
},{timestamps : true});

module.exports = mongoose.model("CouponCode", CouponCodeSchema)