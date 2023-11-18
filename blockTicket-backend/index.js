require("dotenv").config();
require("express-async-errors");
const bodyParser = require("body-parser");
// express
const express = require("express");
const app = express();
// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//firebase
const admin = require("firebase-admin");

const serviceAccount = require("./firebase.json");

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const nftRouter = require("./routes/nftRoutes");
const nftDropRouter = require("./routes/nftDropsRoute");
const eventRouter = require("./routes/EventRoutes");
const ticketLockedRouter = require("./routes/ticketLocked");
const ticketRouter = require("./routes/TicketRoutes");
const searchRouter = require("./routes/searchRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const dummyRoutes = require("./routes/EventDummyRoutes");
const nftTransaction = require("./routes/NftTransactionRouter");
const listEventRoutes = require("./routes/listEventRoute");
const EventCreatorRoutes = require("./routes/eventCreator");
const PromoCodeRoutes = require("./routes/promoCodeRoutes");
const Compress = require("./utils/compress-image");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
// app.use(function (req, res, next) {
//   req.setHeader(
//     "Access-Control-Allow-Origin",
//     "*"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");
//   res.set("Referrer Policy", "no-referrer");
//   next();
// });
app.use(xss());
app.use(mongoSanitize());
app.use("/payment", paymentRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.static("./public"));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/nft", nftRouter);
app.use("/event", eventRouter);
app.use("/ticketlocked", ticketLockedRouter);
app.use("/ticket", ticketRouter);
app.use("/search", searchRouter);

app.use("/dummy", dummyRoutes);
app.use("/nftDrop", nftDropRouter);
app.use("/nft-transaction", nftTransaction);
app.use("/list-event", listEventRoutes);
app.use("/event-creator", EventCreatorRoutes);
app.use("/promo", PromoCodeRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`DB Connected ${process.env.MONGO_URL}`);
      console.log(`Server is up and running on ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
