const reader = require('xlsx')
const User = require('../models/User')
const crypto = require("crypto");
const connectDB = require("../db/connect");
const { encryptMsg } = require('../utils/cryptoGraphy');
const Ticket = require("../models/Tickets");
const { appendFileSync } =  require("fs");
const ObjectId = require("mongoose").Types.ObjectId;

class Contact {
    constructor(ticketname = "",firstName = "", lastName = "", email="", phoneNo = "", gender = "") {
        this.ticketname = ticketname;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNo = phoneNo;
        this.gender = gender;
    }
    saveAsCSV() {
        const csv = `${this.ticketname},${this.firstName},${this.lastName},${this.email},${this.phoneNo},${this.gender}\n`;
        try {
            appendFileSync("./nargisUsers.csv", csv);
        } catch (err) {
            console.error(err);
        }
    }
}

// Reading our test file
const file = reader.readFile('./scripts/users.xlsx')

require("dotenv").config();

// let data = []

const main = async() =>{
    console.log(new Date(1671017768000),"this date")
    const ticketsUsed = await Ticket.find({ticketUsed:true,createdAt : {$gte : new Date(1671017768000)}}).populate("nftRef")

    console.log(ticketsUsed[0],"ticket")
    for(let i = 0; i < ticketsUsed.length; i++)
    {
       const user = await User.findOne({_id : ticketsUsed[i].user})
       const contact1 = new Contact(ticketsUsed[i].nftRef.name,user.firstName, user.lastName, user.email, user.phoneNumber, user.gender);
       contact1.saveAsCSV();
    }
    console.log("Saved!")
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