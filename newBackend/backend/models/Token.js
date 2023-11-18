const mongoose = require("mongoose")
const User = require("./User")
const Schema = mongoose.Schema

const TokenSchema = new Schema({
   userId : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "User"
     },
     token : {
        type : String
     },
     ip : {
        type : String
     },
     userAgent : {
        type : String
     }
}, 
    
    {timestamps : true}
    );

module.exports = mongoose.model("Token", TokenSchema)