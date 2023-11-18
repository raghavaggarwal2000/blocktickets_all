const reader = require('xlsx')
const User = require('../models/User')
const crypto = require("crypto");
const connectDB = require("../db/connect");
const { encryptMsg } = require('../utils/cryptoGraphy');

// Reading our test file
const file = reader.readFile('./scripts/users.xlsx')

require("dotenv").config();

// let data = []

const main = async() =>{
    const sheets = file.SheetNames

let data = []

    for(let i = 0; i < sheets.length; i++)
    {
        const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
        temp.forEach(async(res,index) => {
            const verificationToken = crypto.randomBytes(40).toString("hex");
            let createObj = {
                username: res.Username,
                email : res['Email ID'],
                password : res.Password,
                verificationToken:verificationToken,
                userType : 1,
                systemGenerated : true,
                isVerified: true,
                identifier : false
            };
            data.push(createObj)
        })
    }

    for(let i=0; i<data.length;i++){
        console.log(data[i],i)
        await User.create(data[i])
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