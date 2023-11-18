// This stores the organizers data which is showed on event desciption
const mongoose = require("mongoose")

const OrganiserSchema = new mongoose.Schema({

    organiserName : {
        type : String
    },

    experienceLevel : {
        type : String
    },

    teamSize : {
        type : String
    },

    eventType : {
        type : String
    },

    aboutOrganiser : {
        type : String
    },

    numOfEvents : { 
        type : String
    },
    
    peopleAttended : {
        type : String
    },

    category : {
        type : String
    },

    frequency : { 
        type : String
    },

    referral : {
        type : String
    },

    logoOriginal : {
        type : String
    },
    
    logoCompress : { 
        type : String
    }

    }, {timestamps : true})


module.exports = mongoose.model("Organiser", OrganiserSchema)