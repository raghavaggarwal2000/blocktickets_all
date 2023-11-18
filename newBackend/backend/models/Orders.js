//for cashfree payment integration 
const mongoose = require("mongoose");
const Events = require("./Events");
const User = require("./User")

const Schema = mongoose.Schema

const Orders = new Schema({

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
    },

    customerId: {//mongoose generated ID.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    orderToken: {
        type: String,
        default: "",
    },
        
    orderId: { //use timestamps to generate unique id ---new Date().valueOf()
        type: String,
        required: true,
    },

    orderStatus: {//PAID, PENDING
        type: String,
        required: true,
    },
        
    customerEmail: {
        type: String,
        required: true,
    },

    customerPhone: {
        type: String
    },

    tickets: {
        type: Array,
        // required: true,
        default: [],
    },
    
    totalTicketQuantity: {
        type: Number,
        // required: true,
    },
    
    amount: {
        type: String,
    },
        
    couponCode: {
        type: String,
    },
    
    couponCodePercentage : {
        type : Number
    },
    
    type: { // ticket-buying only
        type: String,
        required: true,
    },

    paymentGateway: {
        type: String,
        enum : ["POS", "CASH", "CASHFREE", "STRIPE"],
    },

    modeOfPayment: {
        type: String,
    },

    onTheSpot: {
        type: String,
    },

    breakupPrices: {
        type: {},
    },

    invoice: {
        type: String,
        default: null,
    },
    bookingId: {
        type: String,
    },

}, {timestamps : true});


module.exports = mongoose.model("cashfreeSchema", Orders)