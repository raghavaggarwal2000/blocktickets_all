const mongoose = require("mongoose");
// const Schema = mongoose.Schema

const EventDetailsSchema = new mongoose.Schema({
    freeWifi : {
        type : String
    },
    valeParking : {
        type : String
    },
    ageRequirement : {
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
}, {timestamps : true});

module.exports = mongoose.model("EventDetails", EventDetailsSchema)