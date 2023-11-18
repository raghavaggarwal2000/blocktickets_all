const mongoose = require('mongoose');
const Schema = mongoose.Schema
const User = require("./User")
const Events = require("./Events")
const Nft = require("./Nft")
const TicketType = require("./TicketType")

const TicketSchema = new Schema({
    
    User : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    Event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Events"
    },

    ticketType : {

        type : mongoose.Schema.Types.ObjectId,
        ref :"TicketType"
    },

    NftRef : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Nft"
    },

    nftIndex : {
        type : String
    },

    orderId : {
        type : String
    },
    bookingId : {
        type : String
    },
    saleId : {
        type : String,
        default : "-1"
    },

    couponCode : {
        type : String
    },
    couponCodePercentage : {
        type : Number
    },
    paymentGateway : {
        type : String,
        enum : ["POS", "CASH", "CASHFREE", "STRIPE"],
        uppercase : true
    },

    ticketImage : {
        type : String,
        default : ""
    },

    addOn : {
        type : Array,
        default : []
    },

    qrCode : {
        type : String
    },

    prices : {
        type : {}
    },

    price : {
        type : Number,
        default : 0
    },
    nftHash: {
        type: String,
    },
    invoiceurl : {
        type : String
    },

    onSale : {
        type : Boolean,
        default: false
    },
    onTheSpot: {
        type: Boolean,
        default: false,
    },

    specialPackageClaimed : {
        type : Boolean,
        default:false
    },

    claimedWallet : {
        type : String,
        default : ""
    },

    totalTicketPrice : {
        type : String,
    },

    ticketUsed : {
        type : Boolean,
        deafult : false
    },


    generateCode : {
        _from : {
            type : String, 
            default: "blocktickets.io"
        },

        _reason : {
            type : String,
            default : ""
        },

        _approved_by_id : {
            type: String,
            default: "",
        },

        _approved_by_email : {
            type : String,
            default : ""
            
        },

        _sold : {
            type : Number,
            default : 0
        },

    _bundle_id : {
        type : String
    },
},

    check_in_details : {

        check_in_time : {
            type : Date
        },

        check_in_by : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    },



    // ########################################### delete keys:

    fullyPaid: Boolean
}, {timestamps : true});


module.exports = mongoose.model('Ticket', TicketSchema)