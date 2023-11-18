const reader = require('xlsx')
const User = require('../models/User')
const crypto = require("crypto");
const connectDB = require("../db/connect");
var ObjectId = require("mongoose").Types.ObjectId;

require("dotenv").config();

const main = async() =>{
    const users = await User.find({systemGenerated:true})
    for(let i=0; i<users.length;i++){
        console.log(users[i],i)
        await User.remove({_id: new ObjectId(users[i]._id)})
    }
}

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      console.log("connected!")
      await main()
    } catch (err) {
      console.log(err);
    }
  };

  start()