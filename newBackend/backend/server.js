require("dotenv").config();
require("express-async-errors");
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// database
const connectDB = require("./db/connect");

app.use(morgan("dev"));
app.use(helmet());
app.use(
    cors({
      origin: "*",
    })
);
app.use(xss());
app.use(mongoSanitize());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// to retrive the cookie data by req.cookies
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static("./public"));

const authRoutes = require("./routes/authRoutes");
const userIndexRoutes = require("./routes/users/indexUser");
const adminIndexRoutes = require("./routes/admin/indexAdmin");


app.use("/auth", authRoutes);

// Customer
app.use("/user/event", userIndexRoutes.event);
app.use("/user/ticketType", userIndexRoutes.ticketType);
app.use("/user/couponCode", userIndexRoutes.couponCode);
app.use("/user/user", userIndexRoutes.user);
app.use("/user/payment", userIndexRoutes.payment)

// Admin
app.use("/admin/couponCode",adminIndexRoutes.adminCouponCode);

//Event Admin Controller
app.use("/admin/event", adminIndexRoutes.adminEvent);




app.get("/", (req,res)=> {
  res.status(200).send("hey")
})


const PORT = process.env.PORT || 8001;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      app.listen(PORT, (err) => {
        if (err) throw err;
        console.log("PLEASE CHECK things to do when in prod.txt after importing of PROD DB")
        console.log(`DB Connected ${process.env.MONGO_URL}`);
        console.log(`Server is up and running on ${PORT}`);
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  start();
