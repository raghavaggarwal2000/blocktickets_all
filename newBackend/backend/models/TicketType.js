const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Events = require("./Events");
const Organiser = require("./Organiser")

const TicketTypeSchema = new mongoose.Schema({
    Event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Events"
    },

    ticketName : {
        type : String
    },

    ticketQuantity: {
        type: Number,
    },

    ticketType : {
        type : String
    },
    
    ticketNftId : {
        type : String
    },

    basePrice:{
        type: Number,
    },

    basePriceFNB : {
        type : Number,
        default: 0
    },

    strikeOffPrice : { //price which is used to strike off on home page
        type : Number
    },

    displayPrice : {
        type : Number
    },

    advancePercentage : {
        type : Number
    },

    visible : {
        type : String,
        enum: ["HIDDEN", "VISIBLE"],
        default: "VISIBLE",
    },

    sold : {
        type : Number,
        // required: function () {
        //     return this.ticketQuantity >= this.sold;
        // },
        default: 0,
    },

    ticketCategory : {
        type : String,
        enum: ["PAID", "DONATION", "FREE"],
        default: "PAID",
    },

    currency : {
        type : String
    },

    startDate : {
        type : Date
    },

    endDate : {
        type : Date
    },

    startTime : {
        type : String
    },

    endTime : {
        type : String
    },

    ticketInfo : {
        type : String
    },

    gasFee : {
        type : String
    },

    maticPrice : {
        type : Number
    },

    ticketEventStartDate: {
        type: Date,
    },

    ticketEventStartTime: {
        type: String,
        },

    ticketEventEndDate: {
        type: Date,
    },

    ticketEventEndTime: {
        type: String,
        },
        
    flag: {
        type: String,
        },

    ticketSponsorImage: {
        type: String,
        },

    ticketDisplayOrder: { //order no in which ticket will show in the user side when showing tickets
        type: Number,
    },

    color: {
        type: String,
        // ['redDark','red','silver','gold','platinum','black']
        },

    sold_out: {
        type: Boolean,
        default: "false"
        },

}, {timestamps : true})

module.exports = mongoose.model("TicketType", TicketTypeSchema);