const USER = require("../models/User");
require("dotenv").config();
const {
    sendEoRiseEmail
} = require("../utils");
const { encryptMsg, decryptMsg } = require("../utils/cryptoGraphy");
const connectDB = require("../db/connect");


const sendMails =async (data) =>{
  try {
    const origin = process.env.FRONTEND_ORIGIN;
    const redirectUrl = 'https://eo360-page.vercel.app/form?token=' + data.identifier
    await sendEoRiseEmail({
            email: data.email_0,
            origin,
            redirectUrl: redirectUrl,
        });
  } catch (error) {
    console.log(error)
  }
}

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      console.log("connected!")
      const users = await USER.find({systemGenerated:true})
        for(let i=0; i<users.length; i++){
          await  sendMails(users[i])
        }
    } catch (err) {
      console.log(err);
    }
  };

start()