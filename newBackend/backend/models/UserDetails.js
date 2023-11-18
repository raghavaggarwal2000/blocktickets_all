const mongoose = require("mongoose");

const Schema = mongoose.Schema

const UserDetailsSchema = new Schema({

    bio : {
        type : String
    },

    instagramLink : {
        type : String
    },

    twitterLink : {
        type : String
    },

    facebookLink : {
        type: String,
    },

    dob : {
      type : Date
    },

    verifiedOn : {
        type : Date
    },

    gender : {
        type : String
    },

    address : {
        type : String
    },

    landmark : {
        type : String
    },

    state : {
        type : String
    },
    
    city : {
        type : String
    },

    country  : { 
        type : String
    },
    
    pinCode : {
        type : String
    }

}, {timestamps : true});

module.exports = mongoose.model("UserDetails",UserDetailsSchema);