const CashfreePayment = require("../models/CashfreePayment");
var FormData = require("form-data");
const TicketType = require("../models/TicketType");
const TicketLockedSchema = require("../models/TicketLock");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Nft = require("../models/Nft");
const NftTransaction = require("../models/NftTransaction");
const Ticket = require("../models/Tickets");
const Event = require("../models/Event");
const USER = require("../models/User");
const UserTrail = require("../models/userTrailNft");
const mongoose = require("mongoose");
const responseHandler = require("../responseHandler/sendResponse");
const axios = require("axios");
const qr = require("qrcode");
const AddOn = require("../models/AddOn");
var ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const { v4: uuid } = require("uuid");
// const uuid = require("short-uuid");
//const data = require('./../data.json');
const pdf = require("html-pdf");
const AWS = require("aws-sdk");
const { DiscountCode, Discount } = require("../models/PromoCode");
const createEventContractAddress = "0x7c45aF8c6E729a9A2800102BA0872dddece7A1Fa";

const getEmailData = async (TicketType, eventResponse, Event) => {
  let ticketNamePointThree = "",
    ticketNamePointOne = "";
  const typeResponse = await TicketType.find({ Event: Event });
  typeResponse.forEach((result) => {
    if (result.undiscountedPrice === 100) {
      if (ticketNamePointThree.length !== 0) {
        ticketNamePointThree += ", ";
      }
      ticketNamePointThree += result.ticketName;
    } else {
      if (ticketNamePointOne.length !== 0) {
        ticketNamePointOne += ", ";
      }
      ticketNamePointOne += result.ticketName;
    }
  });
  let eventDescription = eventResponse.eventDescription;
  eventDescription = eventDescription.replace(/(<([^>]+)>)/gi, "");

  return { ticketNamePointOne, ticketNamePointThree, eventDescription };
};

const AWSCredentials = {
  accessKey: "AKIA5BOLECF2PAHOXBQT",
  secret: "OCyilTLfWnIS0Qnk3QuuVZT9Lgvva5cwLOtSfvia",
  bucketName: "blocktickets",
};
const s3 = new AWS.S3({
  accessKeyId: AWSCredentials.accessKey,
  secretAccessKey: AWSCredentials.secret,
});

const compile = async function (templateName, data) {
  const filePath = path.join(
    process.cwd(),
    "invoice-html",
    `${templateName}.hbs`
  );
  const html = await fs.readFile(filePath, "utf8");
  return hbs.compile(html)(data);
};
const {
  sendPurchasedEmail,
  airdropNftMail,
  sendUserEmail,
} = require("../utils");
const IgnoreList = require("../models/IgnoreList");
const StripePayment = require("../models/StripePayment");
const { calculateTicketPrice } = require("../utils/helpers");
const { response } = require("express");

async function generateTicketPdfwithUpload(data) {
  try {
    const content = await compile("index", data);
    const options = {
      format: "A2",
    };
    pdf
      .create(content, options)
      .toFile(`invoice/${data.orderId}.pdf`, (err, res) => {
        if (err) {
        }
        //  const url =  uploadToS3(`invoice/${ticketID}.pdf`);
        const fileName = `invoice/${data.orderId}.pdf`;
        const fileContent = fs.readFileSync(fileName);

        // Setting up S3 upload parameters
        const params = {
          Bucket: AWSCredentials.bucketName,
          Key: fileName,
          Body: fileContent,
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
          if (err) {
            throw err;
          }
          return data.Location;
        });

        fs.unlink(`${fileName}`);
      }); 
  } catch (e) {
    return "null";
  }
}

const newBookTicket = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const payment_method = req.body.method;
    const couponCode = req.body.couponCode;
    const finalPrices = req.body.finalPrices;
    const discountDetails = await DiscountCode.findOne({ code: couponCode });
    const discount = await Discount.findOne({
      _id: discountDetails?.discountId,
    });
    let orderDetails = "";
    if (payment_method === "stripe") {
      orderDetails = await StripePayment.findOne({ orderId });
    } else {
      orderDetails = await CashfreePayment.findOne({ orderId });
    }
    const userId = req.body.userId;
    if (payment_method !== "stripe" && userId != orderDetails?.customerId) {
      throw new CustomError.UnauthorizedError(`Unauthorized Account`);
    }
    const tickets = orderDetails.tickets;
    let ticketBooking = [];
    let bookedTickets = [];
    let index = 0;
    let qtyTick = 0;
    let ticketNames = "";
    let showPrices = {};
    for (let i = 0; i < tickets.length; i++) {
      const currentTicket = tickets[i];
      if (!currentTicket.quantity) {
        currentTicket.quantity = 1;
      }
      const currentTicketType = await TicketType.findById(currentTicket._id);
      ticketNames += currentTicketType?.ticketName + ", ";
      const addon_ = await AddOn.find({ ticketId: currentTicket._id });
      qtyTick += Number(currentTicket.quantity) || 0;
      let basePrice = currentTicket.basePrice;
      let price_after_discount = basePrice;
      let finalDiscountPercentage = 0;
      if (
        discount?.discountPercentage &&
        discountDetails?.ticketType._id.equals(currentTicket?._id)
      ) {
        price_after_discount =
          (basePrice * (100 - discount?.discountPercentage)) / 100;
        finalDiscountPercentage = discount?.discountPercentage;
      }

      var gst_on_basePrice = price_after_discount * 0.18;
      if (price_after_discount < 500) {
        gst_on_basePrice = 0;
      }
      const bt_fee = (gst_on_basePrice + price_after_discount) * 0.05;
      const gst_on_bt_fee = bt_fee * 0.18;
      const discountedPrice = price_after_discount + gst_on_basePrice + gst_on_bt_fee + bt_fee;
      var paidPrice = (discountedPrice * (currentTicketType?.undiscountedPrice))/100;
      const remainingAmount = (discountedPrice * (100 - currentTicketType?.undiscountedPrice))/100;
      const conv_fee = paidPrice * 0.03;
      const gst_conv_fee = conv_fee * 0.18;
      paidPrice += conv_fee + gst_conv_fee;


      showPrices = {
        ticket_price: discountedPrice,
        total_convenience_fee: conv_fee,
        total_gst_convenience_fee: gst_conv_fee,
        finalPrice: paidPrice,
      };
      for (let j = 0; j < currentTicket.quantity; j++) {
        ticketBooking.push(currentTicketType);
        bookedTickets.push({
          minterAddress: "",
          nftIndex: "",
          nftHash: "",
          Event: currentTicketType.Event,
          paymentMode: "CARD",
          _id: currentTicketType._id,
          price: currentTicketType.price,
          basePrice: basePrice,
          gst_on_basePrice: gst_on_basePrice,
          bt_fee: bt_fee,
          gst_on_bt_fee: gst_on_bt_fee,
          conv_fee: conv_fee,
          discountedPrice: price_after_discount,
          gst_conv_fee: gst_conv_fee,
          paidPrice: paidPrice,
          due_with_taxes: remainingAmount,
          addon: currentTicket.addon,
          discountPercentage: finalDiscountPercentage,
          // transactionCharge: currentTicketType.price * 0.02,
          // otherCharge: 0,
          // totalPrice: currentTicketType.price,
          ticketOrderId: orderId,
          totalTicketPrice: Number(currentTicketType.price) * 1.02,
          addon: addon_,
          ticketName: currentTicket?.ticketName,
          orderId,
        });
        let nftDetails = {
          imageHash: currentTicketType.uri,
          jsonHash: currentTicketType.uri,
          name: currentTicketType.ticketName,
          description: currentTicketType.ticketInfo || "nftInfo",
          imageUrl: currentTicketType.uri,
          nftType: "image",
          uploadedBy: userId,
        };
        await Nft.create(nftDetails)
          .then(async (result) => {
            bookedTickets[index]["nftId"] = result._id;
          })
          .catch((err) => {
            throw new CustomError.BadRequestError("Booking Failed!");
          });
        index++;
      }
    }
    await bookTicketHelper(
      bookedTickets,
      userId,
      orderDetails,
      qtyTick,
      ticketNames,
      orderDetails?.breakupPrices,
      showPrices
    );

    for (let i = 0; i < bookedTickets.length; i++) {
      const ticketInfo = ticketBooking[i];
      const ticketNftDetails = bookedTickets[i];
      axios({
        method: "post",
        url: "https://unicus-storefront-backend.herokuapp.com/auth/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: "Blocktickets85@gmail.com",
          password: "Blocktickets2022",
        }),
      })
        .then(async (loginRes) => {
          var unicusformData = {
            name: ticketInfo.ticketName,
            royalty: 10,
            description: ticketInfo.ticketInfo,
            category: "movies",
            collectionName: ticketInfo.Event + " " + ticketNftDetails.nftIndex,
            jsonIpfs: ticketInfo.uri,
            nftType: "jpg",
            chain: 137,
            tokenId: ticketNftDetails.nftIndex,
            contractAddress: createEventContractAddress,
            mintedInfo: "blocktickets",
            userInfo: "blocktickets",
            cloudinaryUrl: ticketInfo.image,
            uploadedBy: loginRes.data.user._id,
            mintedBy: loginRes.data.user._id,
            owner: loginRes.data.user._id,
          };
          let newaxiosConfig = {
            headers: {
              Authorization: "Bearer " + loginRes.data.accessToken,
              enctype: "multipart/form-data",
              "Content-Type": "application/json",
            },
          };
          await axios
            .post(
              `https://unicus-storefront-backend.herokuapp.com/nft/create`,
              unicusformData,
              newaxiosConfig
            )
            .then((res) => {})
            .catch((err) => {});
        })
        .catch((loginErr) => {});
    }
    responseHandler.sendResponse(res, StatusCodes.OK, "ticket booked", {
      Ticket: tickets,
    });
  } catch (err) {
    console.log("err: ", err);
    throw new CustomError.NotFoundError(`unable to book your ticket`);
  }
};

const bookTicketHelper = async (
  tickets,
  userId,
  order,
  qtyTick,
  ticketNames,
  breakupPrices,
  showPrices
) => {
  try {
    let ticketCreatedRes = [];
    let couponCode = order?.couponCode ? order?.couponCode : null;
    if (couponCode)
      await DiscountCode.findOneAndUpdate(
        { code: couponCode },
        { $push: { usedBy: ObjectId(userId) } }
      );

    const eventResponse = await Event.findById(tickets[0].Event).populate(
      "organizer"
    );
    const platform_fee = eventResponse?.fees?.platform_fee;
    const tax = eventResponse?.fees?.tax;
    const uDetails = await USER.findById(userId);
    const ticketResponse = await TicketType.findById(tickets[0]._id);

    var invoicePDFUrl = "none";
    if (eventResponse && ticketResponse) {
      if (
        eventResponse.totalBooked < eventResponse.totalTicket &&
        ticketResponse.sold < ticketResponse.ticketQuantity
      ) {
        let EventName = eventResponse.eventTitle;
        const currentDateforTicket = new Date();
        const conveince_charges = (order.amount / 100) * 2;
        // const ticketObjforPdf = {
        //   uname: uDetails.email,
        //   uemail: uDetails.email,
        //   Event: tickets[0].Event,
        //   paymentMode: tickets[0].paymentMode,
        //   tickets,
        //   price: order.amount,
        //   totalPrice: order.amount,
        //   quantity: qtyTick,
        //   orderId: order.orderId,
        //   Ename: EventName,
        //   IssueDate: currentDateforTicket,
        //   ticketOrderId: order.orderId,
        //   conv_charge: conveince_charges,
        // };

        // const add = await generateTicketPdfwithUpload(ticketObjforPdf);
        invoicePDFUrl = `https://blocktickets.s3.ap-south-1.amazonaws.com/invoice/${order.orderId}.pdf`;
      } else {
        throw new CustomError.NotFoundError("unable to create ticket");
      }
    } else {
      throw new CustomError.NotFoundError(`somthing wrong!!`);
    }
    let ticketPriceArr = 0;
    let tickets_all = [];
    let qrFirst = "";
    const bundleId = uuid();
    for (let i = 0; i < tickets.length; i++) {
      tickets_all.push({
        ticketName: tickets[i]?.ticketName,
        ticketPrice: tickets[i]?.price,
      });
    }
    let currency = "";
    for (let i = 0; i < tickets.length; i++) {
      const currentTicket = tickets[i];
      const nftResponse = await Nft.findById(currentTicket.nftId);
      if (!nftResponse)
        throw new CustomError.NotFoundError("nftid is not correct");

      let qrdata = JSON.stringify({
        mintedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        minterAddress: currentTicket.minterAddress,
        currentOwnerAddress: currentTicket.minterAddress,
        ownedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        showTo: userId,
        totalPrice: order.amount,
        tokenId: currentTicket.nftIndex,
        nftId: nftResponse._id,
        bundleId: bundleId,
        tickets_bundle: tickets_all,
      });
      let qrCodeGenerated;

      qr.toDataURL(qrdata, function (err, code) {
        if (err) {
          return "Some error ocurred...";
        }
        qrCodeGenerated = code;
      });
      const obj = {
        mintedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        minterAddress: currentTicket.minterAddress,
        currentOwnerAddress: currentTicket.minterAddress,
        ownedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        showTo: userId,
        price: currentTicket.price,
        dollar: currentTicket.dollar,
        transactionCharge: currentTicket.transactionCharge,
        totalPrice: (
          currentTicket.price * (platform_fee / 100) +
          ((currentTicket.price + (platform_fee / 100) * currentTicket.price) *
            tax) /
            100 +
          currentTicket.price
        ).toFixed(2),
        otherCharge: currentTicket.otherCharge,
        tokenId: currentTicket.nftIndex,
      };
      await Nft.findByIdAndUpdate(currentTicket.nftId, obj);

      const currentTicketType = await TicketType.findById(currentTicket._id);
      currency = currentTicketType?.currency;
      const ticketObj = {
        Event: currentTicket.Event,
        nftIndex: currentTicket.nftIndex,
        nftRef: currentTicket.nftId,
        paymentMode: currentTicket.paymentMode,
        ticketType: currentTicket._id,
        user: userId,
        nftHash: currentTicket.nftHash,
        quantity: currentTicket.quantity,
        prices: {
          displayPrice: currentTicket.price,
          basePrice: currentTicket.basePrice,
          gst_on_basePrice: currentTicket.gst_on_basePrice,
          bt_fee: currentTicket.bt_fee,
          gst_on_bt_fee: currentTicket.gst_on_bt_fee,
          conv_fee: currentTicket.conv_fee,
          paidPrice: currentTicket.paidPrice,
          gst_conv_fee: currentTicket.gst_conv_fee,
          discountedPrice: currentTicket.discountedPrice,
          due_with_taxes: currentTicket.due_with_taxes,
          discountPercentage: currentTicket.discountPercentage,
        }, //calculated by undiscountedPrice percentage
        addon: currentTicket.addon,
        transactionCharge: currentTicket.transactionCharge,
        // dollar: currentTicket.dollar,
        // totalPrice: (
        //   currentTicket.price * (platform_fee / 100) +
        //   ((currentTicket.price + (platform_fee / 100) * currentTicket.price) *
        //     tax) /
        //     100 +
        //   currentTicket.price
        // ).toFixed(2),
        // otherCharge: currentTicket.otherCharge,
        onSale: false,
        qrCode: qrCodeGenerated,
        invoiceUrl: invoicePDFUrl,
        addon: currentTicket.addon,
        bookingId: uuid(),
        generated: {
          _bundle_id: bundleId,
        },
        couponCode: couponCode,
        orderId: currentTicket.orderId,
      };
      if (i == 0) {
        qrFirst = qrCodeGenerated;
      }
      ticketPriceArr += currentTicket?.price;
      const ticketCreated = Ticket(ticketObj);
      const ticketC = await ticketCreated.save();

      ticketCreatedRes.push(ticketC);
      aTicketId = ticketC?.id;
      const totalTickets = await Ticket.find({
        Event: ObjectId(currentTicket.Event),
      }).count();

      await Event.findByIdAndUpdate(currentTicket.Event, {
        totalBooked: parseInt(totalTickets),
      });
      const totalTicketType = await Ticket.find({
        ticketType: ObjectId(currentTicket._id),
      }).count();

      await TicketType.findByIdAndUpdate(currentTicket._id, {
        sold: parseInt(totalTicketType),
      });
    }

    const getData = await getEmailData(
      TicketType,
      eventResponse,
      tickets[0].Event
    );
    // EMAIL CODE
    await sendPurchasedEmail({
      name: uDetails?.username
        ? uDetails?.username
        : uDetails?.google?.name
        ? uDetails?.google?.name
        : uDetails.email,
      email: uDetails.email,
      ticketOrderId: bundleId,
      invoiceUrl: invoicePDFUrl,
      location: eventResponse?.location || "",
      eventImage: eventResponse?.eventSquareImage
        ? eventResponse?.eventSquareImage
        : eventResponse?.eventImageOriginal || "",
      price: order.amount,
      ticketPrice: showPrices,
      ticketName: ticketNames ? ticketNames : eventResponse.eventTitle,
      ticketId: eventResponse._id,
      qty: qtyTick,
      fees: eventResponse?.fees,
      eventEndTime: eventResponse?.endTime,
      eventStartTime: eventResponse?.startTime,
      eventDate: eventResponse?.startDate,
      eventName: eventResponse?.eventTitle || "",
      qrCode: qrFirst,
      eventDescription: getData.eventDescription,
      ticketNamePointThree: getData.ticketNamePointThree,
      ticketNamePointOne: getData.ticketNamePointOne,
      currency: currency
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(`unable to book your ticket`);
  }
};

const bookTicket = async (req, res) => {
  try {
    const ticketCreatedRes = [];

    let eventResponse, ticketName, aTicketId;
    for (i = 0; i < req.body.quantity; i++) {
      const nftResponse = await Nft.findById({
        _id: req.body.ticket[i].nftId,
      });
      if (!nftResponse)
        throw new CustomError.NotFoundError("nftid is not correct");

      let qrdata = JSON.stringify({
        mintedBy:
          req.body.ticket[i].paymentMode === "CARD"
            ? process.env.ADMIN_ID
            : req.user.userId,
        minterAddress: req.body.ticket[i].minterAddress,
        currentOwnerAddress: req.body.ticket[i].minterAddress,
        ownedBy:
          req.body.ticket[i].paymentMode === "CARD"
            ? process.env.ADMIN_ID
            : req.user.userId,
        showTo: req.user.userId,
        price: req.body.ticket[i].price,
        totalPrice: req.body.ticket[i].totalPrice,
        tokenId: req.body.ticket[i].nftIndex,
      });
      let qrCodeGenerated;

      qr.toDataURL(qrdata, function (err, code) {
        if (err) {
          return res.status(400).json({
            error: "Some error ocurred...",
          });
        }
        qrCodeGenerated = code;
      });

      const obj = {
        mintedBy:
          req.body.ticket[i].paymentMode === "CARD"
            ? process.env.ADMIN_ID
            : req.user.userId,
        minterAddress: req.body.ticket[i].minterAddress,
        currentOwnerAddress: req.body.ticket[i].minterAddress,
        ownedBy:
          req.body.ticket[i].paymentMode === "CARD"
            ? process.env.ADMIN_ID
            : req.user.userId,
        showTo: req.user.userId,
        price: req.body.ticket[i].price,
        dollar: req.body.ticket[i].dollar,
        transactionCharge: req.body.ticket[i].transactionCharge,
        totalPrice: req.body.ticket[i].totalPrice,
        otherCharge: req.body.ticket[i].otherCharge,
        tokenId: req.body.ticket[i].nftIndex,
      };

      eventResponse = await Event.findById({
        _id: req.body.ticket[i].eventId,
      });

      const ticketResponse = await TicketType.findById({
        _id: req.body.ticket[i].ticketId,
      });

      ticketName = ticketResponse.ticketName;
      var invoicePDFUrl = "none";
      if (eventResponse && ticketResponse) {
        if (
          eventResponse.totalBooked < eventResponse.totalTicket &&
          ticketResponse.sold < ticketResponse.ticketQuantity
        ) {
          const uDetails = await USER.findById(req.user.userId);
          const Edata = await Event.findById(
            req.body.ticket[i].eventId
          ).populate("organizer");
          let EventName = Edata.eventTitle;
          const currentDateforTicket = new Date();

          const ticketObjforPdf = {
            uname: uDetails.name,
            uemail: uDetails.email,
            Event: req.body.ticket[i].eventId,
            paymentMode: req.body.ticket[i].paymentMode,
            price: parseFloat(req.body.ticket[i].price) * 1.02,
            totalPrice: req.body.ticket[i].totalPrice,
            quantity: req.body.quantity,
            orderID: req.body.ticket[0].ticketOrderId,
            Ename: EventName,
            IssueDate: currentDateforTicket,
            ticketOrderId: req.body.ticket[0].ticketOrderId,
          };
          console.log(
            "ticketobjpdf ",
            req.body.ticket[0].ticketOrderId,
            ticketObjforPdf
          );
          // const invoiceUrl =  await generateTicketPdf(req.body.ticket[0].ticketOrderId,ticketObjforPdf);
          //
          //  exit;
          await generateTicketPdfwithUpload(
            req.body.ticket[0].ticketId,
            ticketObjforPdf
          );
          invoicePDFUrl = `https://blocktickets.s3.ap-south-1.amazonaws.com/invoice/${req.body.ticket[0].ticketId}.pdf`;

          const ticketObj = {
            Event: req.body.ticket[i].eventId,
            nftIndex: req.body.ticket[i].nftIndex,
            nftRef: nftResponse._id,
            paymentMode: req.body.ticket[i].paymentMode,
            ticketType: req.body.ticket[i].ticketId,
            user: req.user.userId,
            nftHash: req.body.ticket[i].nftHash,
            price: req.body.ticket[i].price,
            dollar: req.body.ticket[i].dollar,
            transactionCharge: req.body.ticket[i].transactionCharge,
            totalPrice: req.body.ticket[i].totalPrice,
            otherCharge: req.body.ticket[i].otherCharge,
            onSale: false,
            qrCode: qrCodeGenerated,
            invoiceUrl: invoicePDFUrl,
          };
          const ticketCreated = Ticket(ticketObj);
          const ticketC = await ticketCreated.save();
          ticketCreatedRes.push(ticketC);
          aTicketId = ticketC?.id;
          await Event.findByIdAndUpdate(req.body.ticket[i].eventId, {
            totalBooked: eventResponse.totalBooked + 1,
          });
          await TicketType.findByIdAndUpdate(req.body.ticket[i].ticketId, {
            sold: ticketResponse.sold + 1,
          });

          const response = await Nft.findByIdAndUpdate(
            req.body.ticket[i].nftId,
            obj
          );
          //res.status(StatusCodes.OK).send('create ticket');
        } else {
          throw new CustomError.NotFoundError("unable to create ticket");
        }
      } else {
        throw new CustomError.NotFoundError(`somthing wrong!!`);
      }
    }
    const resT = [];
    for (j = 0; j < ticketCreatedRes.length; j++) {
      const t = await Ticket.findById(ticketCreatedRes[j].id)
        .populate("Event")
        .populate("nftRef")
        .populate("ticketType");
      resT.push(t);
    }

    var redirectUrl =
      "https://marketplace.unicus.one/nft/137/0x2f376c69feEC2a4cbb17a001EdB862573898E95a/" +
      req.body.ticket[0].nftIndex;

    //// EMAIL CODE
    let name = "User";
    const u = await USER.findById(req.user.userId);

    const origin = process.env.FRONTEND_ORIGIN;
    console.log("EMAIL ", {
      name: u.email,
      email: u.email,
      ticketData: resT,
      origin,
      ticketOrderId: req.body.ticket[0].ticketOrderId,
      redirectUrl: redirectUrl,
      invoiceUrl: invoicePDFUrl,
      location: eventResponse?.location || "",
      eventImage: eventResponse?.eventImageOriginal || "",
    });

    let ticketNamePointThree = "",
      ticketNamePointOne = "";
    const typeResponse = await TicketType.find({
      Event: req.body.tickets[0].Event,
    });
    typeResponse.forEach((result) => {
      if (result.undiscountedPrice === 100) {
        if (ticketNamePointThree.length !== 0) {
          ticketNamePointThree += ", ";
        }
        ticketNamePointThree += result.ticketName;
      } else {
        if (ticketNamePointOne.length !== 0) {
          ticketNamePointOne += ", ";
        }
        ticketNamePointOne += result.ticketName;
      }
    });

    let eventDescription = eventResponse.eventDescription;
    eventDescription = eventDescription.replace(/(<([^>]+)>)/gi, "");

    await sendPurchasedEmail({
      name: u.email,
      email: u.email,
      ticketData: resT,
      origin,
      ticketOrderId: req.body.ticket[0].ticketOrderId,
      redirectUrl: redirectUrl,
      invoiceUrl: invoicePDFUrl,
      location: eventResponse?.location || "",
      eventImage: eventResponse?.eventImageOriginal || "",
      price: parseFloat(req.body.ticket[0].price) * 1.02,
      ticketName: ticketName,
      ticketId: aTicketId,
      eventDescription: eventDescription,
      ticketNamePointThree: ticketNamePointThree,
      ticketNamePointOne: ticketNamePointOne,
    });

    // EMAIL CODE

    responseHandler.sendResponse(res, StatusCodes.OK, "ticket booked", {
      Ticket: resT,
    });
  } catch (err) {
    throw new CustomError.NotFoundError(`unable to book your ticket`);
  }
};

const createTrail = async (req, res) => {
  try {
    const findTrail = await UserTrail.findOne({
      ticketId: req.body.ticketId,
    });
    const fct = await Nft.findOne({
      _id: mongoose.Types.ObjectId(req.body.nftRef),
    });

    if (!findTrail) {
      const createTrail = await UserTrail.create({
        trailTransaction: [
          {
            buyer: req.body.trailTransaction[0].buyer,
            seller: "Blocktickets",
            price: req.body.price,
          },
        ],
        ticketId: req.body.ticketId,
      });

      return res.status(200).json({
        msg: "Trail Created Successfully",
      });
    }

    const updateTrail = await UserTrail.updateOne(
      { ticketId: req.body.ticketId },
      {
        $push: {
          trailTransaction: [
            {
              buyer: req.body.trailTransaction[0].buyer,
              seller: fct.currentOwnerAddress,
              price: req.body.price,
            },
          ],
        },
      }
    );

    res.status(200).json({
      // data:createTrail
      success: true,
      msg: "Trail updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      err: "CreateTrail: Internal Server Error",
    });
  }
};
const getTrail = async (req, res) => {
  try {
    const getTrailData = await UserTrail.findOne({
      ticketId: ObjectId(req.body.ticketId),
    });

    if (!getTrailData) {
      return res.status(404).json({
        err: "No data found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      trails: getTrailData,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error!",
    });
  }
};
const generateQrCode = async (req, res) => {
  try {
    let data = {
      id: 1,
      name: "User",
      email: "user@gmail.com",
    };

    let strData = JSON.stringify(data);
    // qr.toString(strData, { type: "terminal" }, function (err, code) {
    //     if (err) return

    //
    // });

    qr.toDataURL(strData, function (err, code) {
      if (err) {
        return res.status(400).json({
          error: "Some error ocurred...",
        });
      }

      //
      res.status(200).json({
        ticketQrCode: code,
      });
    });
  } catch (err) {
    res.status(400).json({
      error: "Error ocurred...",
    });
  }
};

//send email to user after claiming additional NFT's
const sendAirdropEmail = async (req, res) => {
  try {
    const { email, tokenId1, ticketNft } = req.body;
    const redirect =
      "https://marketplace.unicus.one/nft/137/0x2f376c69feEC2a4cbb17a001EdB862573898E95a/" +
      tokenId1;
    await airdropNftMail({
      email: email,
      // "redirectNftA":redirectA,
      ticketNft: ticketNft,
      redirect: redirect,
    });

    res.status(200).json({
      success: "email sent!",
    });
  } catch (err) {
    res.status(400).json({
      error: "Some error ocurred...",
    });
  }
};
const updateTicketClaimed = async (req, res) => {
  try {
    const tickId = req.body.ticketId;

    const tick = await Ticket.find({ _id: tickId });
    if (!tick || tick == null) {
      return res.status(200).json({
        error: "Ticket not found...",
      });
    }
    tick[0].specialPackageClaimed = true;
    tick[0].save();
    res.status(200).json({
      tick,
    });
  } catch (err) {
    res.status(400).json({
      error: "Some error ocurred...",
    });
  }
};

const getTicket = async (req, res) => {
  try {
    const data = await TicketType.aggregate([
      {
        $match: {
          Event: mongoose.Types.ObjectId(req.query.eventId),
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "id",
          as: "event",
        },
      },
      {
        $unwind: {
          path: "$event",
        },
      },
      {
        $match: {
          "event._id": mongoose.Types.ObjectId(req.query.eventId),
        },
      },
    ]);
    if (!data) {
      throw new CustomError.NotFoundError(`event not found`);
    }
    //res.status(StatusCodes.OK).json({data});
    responseHandler.sendResponse(res, StatusCodes.OK, "get ticket", {
      data,
    });
  } catch (err) {
    throw new CustomError.NotFoundError(`somthing wrong!!`);
  }
};

const getTicketbyTicketID = async (req, res) => {
  try {
    if (!req.body.ticketID) {
      throw new CustomError.NotFoundError(`please provide Ticket Id!!`);
    }

    const data = await Ticket.findById(req.body.ticketID)
      .populate("Event")
      .populate("nftRef")
      .populate("ticketType");
    const trans = await NftTransaction.find({
      nft: ObjectId(data.nftRef._id),
    });

    if (!data) {
      throw new CustomError.NotFoundError(`Ticket not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "ticket data by ticket id",
      { TicketDetails: data, transaction: trans }
    );
  } catch (err) {
    throw new CustomError.NotFoundError(err.message);
  }
};

const getTicketbyUserID = async (req, res) => {
  try {
    if (!req.user.userId) {
      throw new CustomError.NotFoundError(`please provide User Id!!`);
    }
    const { eventId } = req.body;
    const data = await Ticket.find({
      user: req.user.userId,
      Event: ObjectId(eventId),
    })
      .populate("Event")
      .populate({
        path: "Event",
        populate: {
          path: "organizer",
        },
      })
      .populate("nftRef")
      .populate("ticketType");

    if (!data) {
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "No tickets minted yet",
        {
          TicketDetails: [],
        }
      );
    }
    responseHandler.sendResponse(res, StatusCodes.OK, "event data by user id", {
      TicketDetails: data,
    });
  } catch (err) {
    throw new CustomError.NotFoundError(err.message);
  }
};

const getNfts = async (req, res) => {
  try {
    if (!req.user.userId) {
      throw new CustomError.NotFoundError(`please provide User Id!!`);
    }
    const data = await Ticket.find({
      user: req.user.userId,
    })
      .populate("ticketType")
      .populate("Event");

    if (!data) {
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "No tickets minted yet",
        {
          TicketDetails: [],
        }
      );
    }
    responseHandler.sendResponse(res, StatusCodes.OK, "nft data by user id", {
      TicketDetails: data,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("");
  }
};

const getuserTicketbyEventID = async (req, res) => {
  try {
    if (!req.body.userId) {
      throw new CustomError.NotFoundError(`please provide User Id!!`);
    }

    const event = req.body.eventId;

    const data = await Ticket.find({ Event: event, user: req.body.userId })
      .populate("Event")
      // .populate("nftRef")
      .populate("ticketType");

    if (!data) {
      throw new CustomError.NotFoundError(`Ticket not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(res, StatusCodes.OK, "event data by user id", {
      TicketDetails: data,
    });
  } catch (err) {
    throw new CustomError.NotFoundError(err.message);
  }
};

const ticketAmountCalculation = (userData) => {
  userData.map(async (ticket) => {
    const discount = await DiscountCode.find({
      code: ticket?.couponCode,
    }).populate("discountId");

    let ticketDisplayPrice = ticket?.ticketType?.displayPrice;
    const paidAmmount = ticket?.prices?.finalPrice;
    const discountPercentage = discount[0]?.discountId?.discountPercentage;

    if (discountPercentage && ticketDisplayPrice > 0) {
      ticketDisplayPrice -= (discountPercentage / ticketDisplayPrice) * 100;
    }
    const remainingPrice =
      ticketDisplayPrice > paidAmmount ? ticketDisplayPrice - paidAmmount : 0;
    const paid = remainingPrice ? true : false;
    return { remainingPrice, paid };
  });
};

const getTicketbyUserIDAPP = async (req, res) => {
  try {
    if (!req.body.userID) {
      throw new CustomError.NotFoundError(`please provide User Id!!`);
    }
    const data = await Ticket.find({ user: req.body.userID })
      .populate("Event")
      // .populate("nftRef")
      .populate("ticketType");

    const unresolvedPromises = data.map(async (ticket) => {
      let discount = await DiscountCode.find({
        code: ticket?.couponCode,
      }).populate("discountId");
      // let calculatePaidPrice = (tp) => {
      //   if (
      //     tp == "64158f68677b50d0a12b8e35" ||
      //     tp == "64158f68677b50d0a12b8e39" ||
      //     tp == "64158f68677b50d0a12b8e3d" ||
      //     tp == "64158f68677b50d0a12b8e41"
      //   ) {
      //     let calc = (15 * ticketDisplayPrice) / 100;
      //     return Math.round(calc * 1.0354 * 100) / 100;
      //   } else return ticketDisplayPrice;
      // };
      let ticketDisplayPrice = ticket?.prices?.displayPrice;
      let paidAmmount = ticket?.prices?.paidPrice;
      let discountPercentage = discount[0]?.discountId?.discountPercentage;
      if (ticketDisplayPrice == paidAmmount || ticketDisplayPrice <= 0) {
        return {
          ticket,
          paymentDetails: { remainingPrice: 0, paid: true },
        };
      }

      if (discountPercentage && ticketDisplayPrice > 0) {
        ticketDisplayPrice -= (discountPercentage * ticketDisplayPrice) / 100;
      }
      ticketDisplayPrice = Math.round(ticketDisplayPrice * 100) / 100;
      ticketDisplayPrice = Math.round(ticketDisplayPrice * 1.0354 * 100) / 100;

      let remainingPrice =
        ticketDisplayPrice > paidAmmount
          ? Math.round(ticketDisplayPrice - paidAmmount)
          : 0;

      let paid = remainingPrice ? false : true;
      return {
        ticket,
        paymentDetails: { remainingPrice, paid },
      };
    });

    const ticketData = await Promise.all(unresolvedPromises);

    if (!ticketData) {
      throw new CustomError.NotFoundError(`Ticket not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(res, StatusCodes.OK, "event data by user id", {
      TicketDetails: ticketData,
    });
  } catch (err) {
    throw new CustomError.NotFoundError(err.message);
  }
};

const getTicketByNftId = async (req, res) => {
  const { nftId } = req.body;

  // const nft = await Nft.findOne({ _id: new ObjectId(nftId) });

  let result = await Ticket.findOne({ nftRef: ObjectId(nftId) })
    .populate("Event")
    .populate("nftRef")
    .populate("ticketType")
    .populate("check_in_details.checked_in_by", { email: 1 })
    .populate("user", {
      email: 1,
      username: 1,
      firstName: 1,
      lastName: 1,
      google: 1,
      facebook: 1,
    });
  let discount = await DiscountCode.find({
    code: result?.couponCode,
  }).populate("discountId");

  let ticketsByOrderId = await Ticket.find({ orderId: result.orderId });

  let discountPercentage = discount[0]?.discountId?.discountPercentage || 0;
  const ticketAmountCalculation = (ticket) => {
    let ticketDisplayPrice = ticket?.prices?.displayPrice;
    let paidAmmount = ticket?.prices?.paidPrice || ticket?.prices.displayPrice;

    if (discountPercentage && ticketDisplayPrice > 0) {
      ticketDisplayPrice -= (discountPercentage * ticketDisplayPrice) / 100;
    }
    ticketDisplayPrice = Math.round(ticketDisplayPrice * 100) / 100;
    ticketDisplayPrice = Math.round(ticketDisplayPrice * 1.0354 * 100) / 100;
    let remainingPrice =
      ticketDisplayPrice > paidAmmount
        ? Math.round(ticketDisplayPrice - paidAmmount)
        : 0;
    let paid = remainingPrice ? false : true;
    return { remainingPrice, paid };
  };

  let calculatePaidPrice = () => {
    return (
      result?.prices?.paidPrice -
      (result?.prices?.paidPrice * discountPercentage) / 100
    );
  };

  const isFree = result?.generated?._from !== "blocktickets.io";

  const newObj = {
    generated: result?.generated,
    ticketUsed: result?.ticketUsed,
    check_in_details: result?.check_in_details,
    price: result?.price,
    totalPrice: isFree ? "FULL" : result?.totalPrice, //amountPaid
    displayPrice: result?.prices?.displayPrice,
    _id: result?._id,
    issueTime: result?.createdAt,
    balancePaymentDue: result?.ticketType?.displayPrice
      ? Number(result?.ticketType?.displayPrice) - Number(result?.totalPrice)
      : null,
    Event: {
      fees: result?.Event?.fees,
      _id: result?.Event?._id,
      eventTitle: result?.Event?.eventTitle,
      eventStartDate: result?.Event?.startDate,
      eventStartTime: result?.Event?.startTime,
      eventEndDate: result?.Event?.endDate,
      eventEndTime: result?.Event?.endTime,
      eventImageOriginal: result?.Event?.eventImageOriginal,
      eventImageCompress: result?.Event?.eventImageCompress,
      eventSquareImage: result?.Event?.eventSquareImage,
      location: result?.Event?.location,
    },
    nftIndex: result?.nftIndex,
    nftRef: {
      _id: result?.nftRef?._id,
      tokenId: result?.nftRef?.tokenId,
    },
    ticketType: {
      _id: result?.ticketName?._id,
      ticketName: result?.ticketType?.ticketName,
      total: result?.ticketType?.ticketQuantity,
      price: calculatePaidPrice(),

      undiscountedPrice: result?.ticketType?.undiscountedPrice,
      ticketInfo: result?.ticketType?.ticketInfo,
    },
    user: {
      email: result?.user?.email || "",
      name: result?.user?.google
        ? result?.user?.google?.name
        : result?.user?.firstName
        ? result?.user?.firstName + result?.user?.lastName
        : result?.user?.username,
    },
    ticketsByQR: ticketsByOrderId?.length,
    paymentStatus: ticketAmountCalculation(result),
  };
  res.status(StatusCodes.OK).json({ result: newObj });
};

const getTicketByNftIndex = async (req, res) => {
  const { nftIndex } = req.body;

  const result = await Ticket.find({ nftIndex })
    .populate("Event")
    .populate("nftRef")
    .populate("ticketType");
  res.status(StatusCodes.OK).json({ result });
};

const addGasFee = async (req, res) => {
  try {
    const params = req.body.params;

    const gas = req.body.gas;
    const id = req.body.ticketId;
    // const t = await Ticket.findByIdAndUpdate(id, {gasFee: gas});
    const t = await Ticket.findById(id);

    if (t) {
      res.json({ t });
    } else {
      throw new CustomError.NotFoundError("Not Found...");
    }
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

// update ticket payment status CARD OR CRYPTO
const updateTicketPaymentStatus = async (req, res) => {
  try {
    const ticketId = req.body.ticketId;
    const nftRefId = req.body.nftRefId;

    const findTicket = await Ticket.findById({ _id: ticketId });
    const findNft = await Nft.findById({ _id: nftRefId });
    if (findTicket == null) {
      return res.status(404).json({
        message: "Ticket Not Found Error... 1",
      });
    }
    if (findNft == null) {
      return res.status(404).json({
        message: "Ticket Not Found Error... 2",
      });
    }
    findTicket.paymentMode = "CRYPTO";
    findTicket.specialPackageClaimed = true;
    await findTicket.save();
    findNft.currentOwnerAddress = req.body.currentOwnerAddress;
    await findNft.save();

    res.status(200).json({
      status: 200,
      findTicket,
      findNft,
    });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const setTicketUsed = async (req, res) => {
  try {
    const { ticketUsedStatus, bundleId } = req.body;

    //add check in time
    const check_in_time = new Date();

    //add checked in by
    const checked_in_by = req.user.userId;

    const updateMultiple = await Ticket.updateMany(
      {
        "generated._bundle_id": bundleId,
      },
      {
        $set: {
          ticketUsed: ticketUsedStatus,
          check_in_details: {
            check_in_time,
            checked_in_by,
          },
        },
      }
    );

    if (!(updateMultiple.modifiedCount > 0)) {
      return res.status(400).json("Tickets were not updated");
    }
    res.status(200).json({
      Message: "Tickets Updated Successfully",
      bundleId,
      ticketsUsedStatus: ticketUsedStatus,
    });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

// ! Mahesh's code start's here
const getTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find();
    if (ticketTypes.length === 0) {
      return res
        .status(StatusCodes.NotFoundError)
        .json({ msg: "No ticket types found" });
    }
    responseHandler.sendResponse(res, StatusCodes.OK, "ticket types", {
      ticketTypes: ticketTypes,
    });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const getTicketsByEventId = async (req, res) => {
  let { eventId } = req.params;
  const { page, limit } = req.query;

  try {
    const skip = (parseInt(page) - 1) * limit;
    const totalCount = await CashfreePayment.count({ eventId: eventId });
    // const tickets = await Ticket.find({ Event: eventId })
    //   // .sort({ updatedAt: 1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .populate("Event")
    //   .populate("ticketType")
    //   .populate("user");

    const tickets = await CashfreePayment.aggregate([
      {
        $match: {
          eventId: ObjectId(eventId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $addFields: {
          event: { $arrayElemAt: ["$event", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
    ]);
    responseHandler.sendResponse(res, StatusCodes.OK, "tickets by eventId", {
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
      },
      tickets,
    });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ error: err.message });
  }
};

const getAllTickets = async (req, res) => {
  const userId = req.profile._id;
  const { page, limit } = req.query;

  try {
    const skip = (parseInt(page) - 1) * limit;
    let allTickets;
    let totalCount;
    // Show organizer tickets related to only his events
    if (req.profile.role === 1) {
      allTickets = await Ticket.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: "user",
          select: ["username", "email"],
        })
        .populate({
          path: "Event",
          match: {
            $or: [{ creator: userId }, { organizer: userId }],
          },
          select: ["eventTitle"],
        })
        .populate("ticketType")
        .exec();

      let filteredTickets = [];
      allTickets.forEach((ticket) => {
        if (ticket.Event) {
          filteredTickets.push(ticket);
        }
      });
      allTickets = filteredTickets;
      totalCount = allTickets.length;
    }
    // show all tickets to super admin
    else if (req.profile.role === 2) {
      totalCount = await Ticket.count();
      allTickets = await Ticket.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: "user",
          select: ["username", "email"],
        })
        .populate({
          path: "Event",
          select: ["eventTitle"],
        })
        .populate("ticketType")
        .exec();
    }

    responseHandler.sendResponse(res, StatusCodes.OK, "all tickets", {
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
      },
      allTickets,
    });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const allSales = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * limit;
    const totalCount = await CashfreePayment.count();

    const tickets = await CashfreePayment.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },

      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $addFields: {
          event: { $arrayElemAt: ["$event", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
    ]);

    responseHandler.sendResponse(res, StatusCodes.OK, "tickets sale", {
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
      },
      tickets,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err?.message);
  }
};

// const getTicketByEmailChange = async (req, res) => {
//   try {
//     const { page, limit } = req.query;
//     const skip = (parseInt(page) - 1) * limit;
//     const { email, eventId } = req.params;
//     const userRegex = new RegExp(email.trim(), "i");
//     // const userRegex = new RegExp(`^${email.trim()}$`, "ig");

//     const tickets = await Ticket.aggregate([
//       {
//         $match: {
//           Event: ObjectId(eventId),
//         },
//       },
//       // {
//       //   $match: {
//       //     $expr: {
//       //       $cond: {
//       //         if: { eventId: { $ne: [$eventId, " "] } },
//       //         then: { Event: ObjectId(eventId) },
//       //         else: { Event: { $ne: null } },
//       //       },
//       //     },
//       //   },
//       // },
//       // {
//       //   $sort: { $createdAt: -1 },
//       // },
//       {
//         $group: {
//           _id: "$orderId",
//           tickets: { $push: "$$ROOT" },
//         },
//       },
//       {
//         $skip: skip,
//       },
//       {
//         $limit: parseInt(limit),
//       },
//       {
//         $lookup: {
//           from: "events",
//           localField: "tickets.Event",
//           foreignField: "_id",
//           as: "event",
//         },
//       },
//       {
//         $addFields: {
//           event: { $arrayElemAt: ["$event", 0] },
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           let: { userId: "$user" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $regexMatch: {
//                     input: "$email",
//                     regex: userRegex,
//                   },
//                 },
//               },
//             },
//           ],
//           as: "user",
//         },
//       },
//       {
//         $unwind: "$user",
//       },
//       {
//         $match: {
//           "user._id": { $ne: null },
//         },
//       },
//     ]);
//     responseHandler.sendResponse(
//       res,
//       StatusCodes.OK,
//       "tickets by email change",
//       {
//         meta: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           // total: totalCount,
//         },
//         tickets,
//       }
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err?.message);
//   }
// };

const getTicketByEmailChange = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * limit;
    const { email, eventId } = req.params;
    const userRegex = new RegExp(email.trim());

    const totalCount = await CashfreePayment.countDocuments({
      eventId: ObjectId(eventId),
      customerEmail: {
        $regex: userRegex,
        $options: "i",
      },
      function(err, count) {
        if (err) {
          conosle.log("err", err);
          return 0;
        }
        return count;
      },
    });
    const tickets = await CashfreePayment.aggregate([
      // {
      //   $match: {
      //     $cond: [
      //        { $eq: [ eventId, "" ] },
      //        { eventId: { $ne: null } },
      //       { eventId: ObjectId(eventId) }
      //     ]
      //   }
      // },
      {
        $match: {
          eventId: ObjectId(eventId),
          customerEmail: {
            $regex: userRegex,
            $options: "i",
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $addFields: {
          event: { $arrayElemAt: ["$event", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
    ]);
    responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "tickets by email change",
      {
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
        },
        tickets,
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err?.message);
  }
};
const getTicketByEmailChangeWithoutEventId = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * limit;
    const { email, eventId } = req.params;
    const userRegex = new RegExp(email.trim());
    const totalCount = await CashfreePayment.count({
      customerEmail: {
        $regex: userRegex,
        $options: "i",
      },
    });
    const tickets = await CashfreePayment.aggregate([
      // {
      //   $match: {
      //     $cond: [
      //        { $eq: [ eventId, "" ] },
      //        { eventId: { $ne: null } },
      //       { eventId: ObjectId(eventId) }
      //     ]
      //   }
      // },
      {
        $match: {
          customerEmail: {
            $regex: userRegex,
            $options: "i",
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $addFields: {
          event: { $arrayElemAt: ["$event", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
    ]);
    responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "tickets by email change",
      {
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
        },
        tickets,
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err?.message);
  }
};

// need to fix the .map situation
const ticketOrderId = async (req, res) => {
  try {
    if (!req.params.orderId) {
      throw new CustomError.NotFoundError(`please provide order Id!!`);
    }
    const data = await Ticket.find({
      orderId: req.params.orderId,
    })
      .populate("Event")
      .populate("ticketType")
      .populate("user");
    if (data !== null) {
      const unresolvedPromises = data.map(async (ticket) => {
        const discount = await DiscountCode.find({
          code: ticket?.couponCode,
        }).populate("discountId");

        // console.log("*******check", ticketDisplayPrice * 1.0345, discountPercentage, paidAmmount)
        const remainingPrice = ticket?.prices?.due_with_taxes;
        const paid = remainingPrice ? false : true;
        const paidPrice = ticket?.prices?.paidPrice;
        return {
          ticket,
          paymentDetails: { remainingPrice, paid, paidPrice },
          discountPercentage: ticket?.prices?.discountPercentage,
        };
      });

      const ticketData = await Promise.all(unresolvedPromises);
      // console.log(ticketData);
      const paymentStatus = {};
      const approve = {
        due: 0,
        paid: 0,
        order_id: req.params.orderId,
      };
      console.log(approve.order_id);
      for (let i = 0; i < data?.length; ++i) {
        const name = data[i]?.ticketType?.ticketName;
        const due = data[i]?.prices?.due_with_taxes
          ? data[i]?.prices?.due_with_taxes
          : 0;
        const paid = data[i]?.prices?.paidPrice;
        // console.log(data[i]);
        if (!paymentStatus[name]) {
          const temp = {
            qty: 1,
            amount_due: due,
            advance: paid,
          };
          paymentStatus[name] = temp;
        } else {
          paymentStatus[name].qty += 1;
          paymentStatus[name].amount_due += Number(due);
          paymentStatus[name].advance += Number(paid);
        }
        approve.due += Number(due);
        approve.paid += Number(paid);
      }
      if (!ticketData) {
        throw new CustomError.NotFoundError(`Ticket not found`);
      }
      //res.status(StatusCodes.OK).json({ data });
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "event data by user id",
        {
          TicketDetails: ticketData,
          paymentStatus,
          approve,
        }
      );
    } else {
      throw new CustomError.NotFoundError(`No Tickets found`);
    }
  } catch (err) {
    res.status(500).send(err?.message);
  }
};

const addTicketTypeToEvent = async (req, res) => {
  const { userId } = req.params;
  const ticket = req.body;
  try {
    const isDuplicateName = await TicketType.find({
      Event: ticket.Event,
      ticketName: ticket.ticketName,
    });
    if (isDuplicateName.length > 0)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Ticket Name already exists in this event" });
    const savedTicket = await new TicketType(ticket).save();
    await new TicketLockedSchema({
      ticketId: savedTicket._id,
      ticketQuantity: req.body.ticketQuantity,
    }).save();

    for (let j = 0; j < ticket.ad?.length; j++) {
      const addOnObj = ticket.ad[j];
      if (addOnObj.addOnName != "") {
        addOnObj.ticketId = savedTicket._id;
        addOnObj.Event = savedTicket._id;

        const obj = AddOn(addOnObj);
        await obj.save();
      }
    }
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "ticket type added",
      savedTicket
    );
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ err: err.message });
  }
};

const removeTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
    if (!deletedTicket)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Ticket not found" });
    responseHandler.sendResponse(res, StatusCodes.OK, "ticket deleted", {
      deletedTicket,
    });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const updateTicketData = req.body;
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      updateTicketData,
      { new: true }
    );
    if (!updatedTicket)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Ticket not found" });

    return responseHandler.sendResponse(res, StatusCodes.OK, "Ticket updated", {
      updatedTicket: updatedTicket,
    });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const updateTicketType = async (req, res) => {
  if (req.body.sold) {
    delete req.body.sold;
  }
  const { ticketId } = req.params;

  // const { timezone } = await Event.findById(ObjectId(req.body.Event)).select(
  //   "timezone"
  // );

  // if (timezone) {
  //   console.log("timezone", timezone);
  // }
  let newStartDate = req.body.startDate;

  let newEndDate = req.body.endDate;

  const obj = { ...req.body, startDate: newStartDate, endDate: newEndDate };
  let gst_base = 0;
  if(obj.basePrice >= 500){
    gst_base = obj.basePrice * 0.18;
  }
  const bt_fee = (Number(gst_base) + Number(obj.basePrice)) * 0.05;
  const gst_bt_fee = bt_fee * 0.18;
  obj.price = Math.round(Number(Number(obj.basePrice) + Number(gst_base) + Number(bt_fee) + Number(gst_bt_fee)));
  try {
    const updatedTicket = await TicketType.findByIdAndUpdate(ticketId, obj, {
      new: true,
    });
    // also update TicketLocked collection
    await TicketLockedSchema.findOneAndUpdate(
      { ticketId },
      { ticketQuantity: req.body.ticketQuantity }
    );
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "ticket type updated",
      updatedTicket
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const deleteTicketType = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const deletedTicket = await TicketType.findByIdAndDelete(ticketId);
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "ticket type deleted",
      deletedTicket
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const getTicketByTicketId = async (req, res) => {
  const ticketId = req.params.ticketId;

  try {
    if (!ticketId) {
      throw new CustomError.NotFoundError(`please provide Ticket Id!!`);
    }

    const data = await Ticket.findById(ticketId)
      .populate("Event")
      .populate("nftRef")
      .populate("ticketType")
      .populate("user", ["username", "email", "phoneNumber", "userType"]);
    if (!data) {
      throw new CustomError.NotFoundError(`Ticket not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "ticket data by ticket id",
      { TicketDetails: data }
    );
  } catch (err) {
    throw new CustomError.NotFoundError(err.message);
  }
};

const getAllTicketsByRole = async (req, res) => {
  const userId = req.profile._id;
  const role = req.profile.role;
  const { userType, filter, eventType } = req.query;
  let excludedUserIds = [];
  let ignoreList = await IgnoreList.find({}).select("userId");
  excludedUserIds = ignoreList
    .map((toIgnore) => toIgnore?.userId)
    .filter((item) => item !== undefined);
  const date_filter = {
    upcoming: {
      "event.startDate": {
        $gte: new Date(),
      },
    },
    thisMonth: {
      "event.startDate": {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    },
    thirtyDays: {
      "event.startDate": {
        $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    ninetyDays: {
      "event.startDate": {
        $gte: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000),
      },
    },
    allTime: {},
  };

  let pipeline = [];
  pipeline.push({
    $match: {
      user: {
        $nin: userType === "realUsers" ? excludedUserIds : [],
      },
    },
  });

  pipeline.push({
    $group: {
      _id: "$Event",
      ticketSold: {
        $sum: 1,
      },
      overallTotalAmount: {
        $sum: "$prices.displayPrice",
      },
      previousTotalAmount: {
        $sum: "$price",
      },
      ticketCheckedIn: {
        $sum: {
          $cond: [{ $eq: ["$ticketUsed", true] }, 1, 0],
        },
      },
    },
  });

  pipeline.push({
    $lookup: {
      from: "events",
      localField: "_id",
      foreignField: "_id",
      as: "event",
    },
  });
  pipeline.push({
    $unwind: "$event",
  });
  pipeline.push({
    $match: date_filter[filter],
  });
  if (userType === "realUsers" || eventType === "eventsByRevenue") {
    pipeline.push({
      $match: {
        "event.dummy": false,
      },
    });
  }

  pipeline.push({
    $group: {
      _id: null,
      events: {
        $push: {
          event: "$event",
          eventId: "$event._id",
          count: "$ticketSold",
          overallTotalAmount: "$overallTotalAmount",
          previousTotalAmount: "$previousTotalAmount",
          ticketCheckedIn: "$ticketCheckedIn",
        },
      },
      totalCount: {
        $sum: "$ticketSold",
      },
      overallTotalAmount: {
        $sum: "$overallTotalAmount",
      },
      previousTotalAmount: { $sum: "$previousTotalAmount" },

      ticketCheckedIn: {
        $sum: "$ticketCheckedIn",
      },
    },
  });
  pipeline.push({
    $sort: {
      "event.startDate": 1,
    },
  });
  pipeline.push({
    $project: {
      _id: 0,
      events: 1,
      totalCount: 1,
      overallTotalAmount: 1,
      previousTotalAmount: 1,
    },
  });
  try {
    let ticketTypes;
    if (role === 2) {
      let searchType = {};
      if (userType === "realUsers") {
        searchType = { ...searchType };
      }
      ticketTypes = await Ticket.aggregate(pipeline);
    } else if (role === 1) {
      ticketTypes = await Ticket.find({ organizerId: userId });
    }
    return responseHandler.sendResponse(res, StatusCodes.OK, "ticket count", {
      info: ticketTypes[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ticketInfo = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ _id: ObjectId(eventId) });
    console.log(
      "new Date().toISOString(): ",
      new Date(),
      new Date().toISOString()
    );
    let getTickets = await TicketType.find({
      visible: "VISIBLE",
      Event: ObjectId(eventId),
      endDate: { $gte: new Date().toISOString() },
      startDate: { $lte: new Date().toISOString() },
    }).sort({ ticketDisplayOrder: 1 });
    if (getTickets?.length === 0)
      return res.status(200).json({
        msg: "No tickets found for the event,  Please contact support.",
        image: {
          eventImage: event?.eventImageCompress
            ? event?.eventImageCompress
            : event?.eventImageOriginal,
          eventSquareImage: event?.eventSquareImage,
          seatingImage: event?.seatingImage,
        },
        tickets: [],
        eventName: event?.eventTitle,
      });
    for (let it of getTickets) {
      const addOn = await AddOn.find({ ticketId: it._id });
      it._doc["addon"] = addOn;
    }
    res.status(200).json({
      tickets: getTickets,
      image: {
        eventImage: event?.eventImageCompress
          ? event?.eventImageCompress
          : event?.eventImageOriginal,
        eventSquareImage: event?.eventSquareImage,
        seatingImage: event?.seatingImage,
      },
      fee: event.fees,
      eventName: event?.eventTitle,
    });
  } catch (err) {
    res.status(500).json({ err: "internal server error" });
  }
};

const generateFreeTicket = async (req, res) => {
  try {
    const {
      numFreeTicket,
      reason,
      sendToEmail,
      ticketType,
      adminEmail,
      firstName,
      lastName,
      couponCode,
      eventId,
    } = req.body;
    const adminId = req.user.userId;
    const tickets = await TicketType.findOne({ _id: ObjectId(ticketType) });
    let discount = null;
    let verifyCode = null;
    if (couponCode) {
      verifyCode = await DiscountCode.findOne({ code: couponCode });

      // if (!verifyCode?.ticketType.equals(ticketType)) {
      //   throw new CustomError.BadRequestError(
      //     "This promo code is not valid for this ticket"
      //   );
      // }

      const isValid = verifyCode?.usedBy?.length < verifyCode?.quantity;
      if (!isValid)
        throw new CustomError.BadRequestError("Promo code limit is exhausted");

      if (new Date() > verifyCode?.valid_till)
        throw new CustomError.BadRequestError("Promo Code is expired");

      if (!verifyCode.ticketType.equals(tickets._id))
        throw new CustomError.BadRequestError(
          `Promo code is not valid for ${tickets.ticketName}`
        );

      discount = await Discount.findOne({ _id: verifyCode?.discountId });
    }
    // check if user exists
    const user_exists = await USER.findOne({ email: sendToEmail });
    let userId_mint = "",
      userObj;
    if (!user_exists) {
      userObj = {
        email: sendToEmail,
        username: sendToEmail,
        password: "BT/" + Date.now(),
        identifier: true,
        systemGenerated: true,
        isVerified: true,
        verified: Date.now(),
        verificationToken: "",
        should_reset: true,
        firstName,
        lastName,
      };
      // generate a user and password
      const systemGenerateUser = await USER.create(userObj);
      userId_mint = systemGenerateUser?._id;
      userObj._id = systemGenerateUser?._id;
    } else {
      userId_mint = user_exists?._id;
      userObj = {
        email: user_exists?.email,
        username: user_exists?.email,
        password: "",
        firstName: firstName,
        lastName: lastName,
      };
    }

    await DiscountCode.findOneAndUpdate(
      { code: couponCode },
      { $push: { usedBy: userObj?._id ? userObj?._id : user_exists?._id } }
    );
    // now generate ticket for userId mint
    const orderId = "";
    const orderDetails = "";

    let ticketBooking = [];
    let bookedTickets = [];
    let index = 0;
    let qtyTick = numFreeTicket;
    const addon_ = await AddOn.find({ ticketId: ticketType });

    ticketBooking.push(tickets);

    const basePrice = tickets.basePrice;
    const price_after_discount = discount?.discountPercentage
      ? (basePrice * (100 - discount?.discountPercentage)) / 100
      : basePrice;

    var gst_on_basePrice = price_after_discount * 0.18;
    if (price_after_discount < 500) {
      gst_on_basePrice = 0;
    }
    // const gst_on_basePrice = basePrice * 0.18;
    const bt_fee = (gst_on_basePrice + price_after_discount) * 0.05;
    const gst_on_bt_fee = bt_fee * 0.18;
    const discountedPrice =
      price_after_discount + gst_on_basePrice + gst_on_bt_fee + bt_fee;
    // const conv_fee = discountedPrice * 0.03;
    // const gst_conv_fee = conv_fee * 0.18;
    const uniqueNumber = new Date().valueOf();

    const showPrice = {
      ticket_price: discountedPrice,
      convenience_fee: 0,
      gst_convenience_fee: 0,
      finalPrice: discountedPrice ,
    };
    bookedTickets.push({
      minterAddress: "",
      couponCode,
      nftIndex: "",
      nftHash: "",
      Event: tickets.Event,
      paymentMode: "CARD",
      _id: tickets._id,
      price: tickets.price,
      basePrice: basePrice,
      gst_on_basePrice: Number(gst_on_basePrice),
      bt_fee: Number(bt_fee).toFixed(2),
      gst_on_bt_fee: Number(gst_on_bt_fee).toFixed(2),
      conv_fee: 0,
      discountedPrice: Number(price_after_discount).toFixed(2),
      gst_conv_fee: 0,
      paidPrice: Number(discountedPrice).toFixed(2),
      orderId: `order_${uniqueNumber}`,
      discountPercentage: discount?.discountPercentage,
      // price: ticketPrice,
      // dollar: ticketPrice,
      addon: addon_,
      // transactionCharge: ticketPrice * 0.02,
      // otherCharge: 0,
      // totalPrice: ticketPrice,
      ticketOrderId: orderId,
      totalTicketPrice: Number(tickets.price) * 1.02,
      addon: addon_,
      ticketName: tickets.ticketName,
      // prices: {
      //   finalPrice: discount?.discountPercentage
      //     ? (ticketPrice * (100 - discount?.discountPercentage)) / 100
      //     : ticketPrice,
      // },
    });
    let nftDetails = {
      imageHash: tickets.uri,
      jsonHash: tickets.uri,
      name: tickets.ticketName,
      description: tickets.ticketInfo,
      imageUrl: tickets.uri,
      nftType: "image",
      uploadedBy: userId_mint,
    };
    await Nft.create(nftDetails)
      .then(async (result) => {
        bookedTickets[index]["nftId"] = result._id;
      })
      .catch((err) => {
        console.log(err);
        throw new CustomError.BadRequestError(err.message);
      });

    await freeBookTicketHelper(
      bookedTickets,
      userId_mint,
      orderDetails,
      qtyTick,
      reason,
      adminId,
      adminEmail,
      userObj,
      discount,
      showPrice,
      sendToEmail,
      couponCode,
      eventId
    );

    res.status(StatusCodes.ACCEPTED).send("Tickets generated");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const freeBookTicketHelper = async (
  tickets,
  userId,
  order,
  qtyTick,
  reason,
  adminId,
  adminEmail,
  userObj,
  discount,
  showPrice,
  email,
  couponCode,
  eventId
) => {
  try {
    let ticketCreatedRes = [];

    const eventResponse = await Event.findById(tickets[0].Event).populate(
      "organizer"
    );
    const uDetails = await USER.findById(userId);
    const ticketResponse = await TicketType.findById(tickets[0]._id);

    var invoicePDFUrl = "none";
    if (eventResponse && ticketResponse) {
      if (
        eventResponse.totalBooked < eventResponse.totalTicket &&
        ticketResponse.sold < ticketResponse.ticketQuantity
      ) {
        let EventName = eventResponse.eventTitle;
        const currentDateforTicket = new Date();
        const conveince_charges = 0;
        // const ticketObjforPdf = {
        //   uname: uDetails.email,
        //   uemail: uDetails.email,
        //   Event: tickets[0].Event,
        //   paymentMode: tickets[0].paymentMode,
        //   tickets,
        //   price: order.amount,
        //   totalPrice: order.amount,
        //   quantity: qtyTick,
        //   orderId: order.orderId,
        //   Ename: EventName,
        //   IssueDate: currentDateforTicket,
        //   ticketOrderId: order.orderId,
        //   conv_charge: conveince_charges,
        // };

        // const add = await generateTicketPdfwithUpload(ticketObjforPdf);
        invoicePDFUrl = `https://blocktickets.s3.ap-south-1.amazonaws.com/invoice/${order?.orderId}.pdf`;
      } else {
        throw new CustomError.NotFoundError("Ticket's are sold out");
      }
    } else {
      throw new CustomError.NotFoundError(`somthing wrong!!`);
    }
    const bundleId = uuid();
    let tickets_all = [];
    let qrFirst = "";
    // let ticketArray = tickets[0];
    // for (let i = 0; i < qtyTick; i++) {
    //   tickets_all.push({
    //     ticketName: tickets[0]?.ticketName,
    //     ticketPrice: tickets[0]?.price,
    //   });
    //   ticketArray.push(tickets[0]);
    // }
    // console.log("outside the looop", ticketArray);
    let currency = "";
    for (let i = 0; i < qtyTick; i++) {
      const currentTicket = tickets[0];
      const bookingId = uuid();
      const nftResponse = await Nft.findById(currentTicket.nftId);
      if (!nftResponse)
        throw new CustomError.NotFoundError("nftid is not correct");

      let qrdata = JSON.stringify({
        mintedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        minterAddress: currentTicket.minterAddress,
        currentOwnerAddress: currentTicket.minterAddress,
        ownedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        showTo: userId,
        totalPrice: tickets[0] * qtyTick,
        tokenId: currentTicket.nftIndex,
        nftId: nftResponse._id,
        tickets_bundle: tickets_all,
        bundleId: bundleId,
      });
      let qrCodeGenerated;

      qr.toDataURL(qrdata, function (err, code) {
        if (err) {
          return "Some error ocurred...";
        }
        qrCodeGenerated = code;
      });

      const obj = {
        mintedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        minterAddress: currentTicket.minterAddress,
        currentOwnerAddress: currentTicket.minterAddress,
        ownedBy:
          currentTicket.paymentMode === "CARD" ? process.env.ADMIN_ID : userId,
        showTo: userId,
        price: currentTicket.price,
        dollar: currentTicket.dollar,
        transactionCharge: currentTicket.transactionCharge,
        totalPrice: currentTicket.totalPrice,
        otherCharge: currentTicket.otherCharge,
        tokenId: currentTicket.nftIndex,
        bookingId: bookingId,
      };
      const response = await Nft.findByIdAndUpdate(currentTicket.nftId, obj);
      const ticketObj = {
        Event: currentTicket.Event,
        nftIndex: currentTicket.nftIndex,
        nftRef: currentTicket.nftId,
        paymentMode: currentTicket.paymentMode,
        ticketType: currentTicket._id,
        user: userId,
        nftHash: currentTicket.nftHash,
        quantity: currentTicket.quantity,
        price: currentTicket.price,
        // dollar: currentTicket.dollar,
        addon: currentTicket.addon,
        // transactionCharge: currentTicket.transactionCharge,
        // totalPrice: currentTicket.totalPrice,
        // otherCharge: currentTicket.otherCharge,
        onSale: false,
        qrCode: qrCodeGenerated,
        invoiceUrl: invoicePDFUrl,
        addon: currentTicket.addon,
        generated: {
          _from: "admin.blocktickets.io",
          _reason: reason,
          _approved_by_id: adminId,
          _approved_by_email: adminEmail,
          _bundle_id: bundleId,
        },
        bookingId: bookingId,
        prices: {
          displayPrice: currentTicket.price,
          basePrice: currentTicket.basePrice,
          gst_on_basePrice: currentTicket.gst_on_basePrice,
          bt_fee: currentTicket.bt_fee,
          gst_on_bt_fee: currentTicket.gst_on_bt_fee,
          conv_fee: currentTicket.conv_fee,
          paidPrice: currentTicket.paidPrice,
          gst_conv_fee: currentTicket.gst_conv_fee,
          discountedPrice: currentTicket.discountedPrice,
          due_with_taxes: 0,
          discountPercentage: currentTicket.discountPercentage,
        },
        onTheSpot: true,
        orderId: currentTicket.orderId,
        couponCode: currentTicket?.couponCode,
      };
      qrFirst = qrCodeGenerated;
      const ticketCreated = Ticket(ticketObj);
      const ticketC = await ticketCreated.save();

      ticketCreatedRes.push(ticketC);
      aTicketId = ticketC?.id;
      const totalTickets = await Ticket.find({
        Event: ObjectId(currentTicket.Event),
      }).count();
      await Event.findByIdAndUpdate(currentTicket.Event, {
        totalBooked: parseInt(totalTickets),
      });
      const totalTicketType = await Ticket.find({
        ticketType: ObjectId(currentTicket._id),
      }).count();
      const currentTicketType = await TicketType.findByIdAndUpdate(currentTicket._id, {
        sold: parseInt(totalTicketType),
      });
      currency = currentTicketType?.currency;
    }
    const createPay = {
      orderToken: null,
      eventId: eventId,
      orderId: tickets[0].orderId,
      customerId: userId,
      customerEmail: email,
      customerPhone: null,
      orderStatus: "UNPAID",
      type: "ticket-buying",
      tickets: tickets,
      totalTicketQuantity : qtyTick,
      amount: tickets[0].price + tickets[0].bt_fee + tickets[0].gst_on_bt_fee,
      couponCode: couponCode,
      onTheSpot: true,
      breakupPrices: {
        total_bt_price: tickets[0].bt_fee + tickets[0].gst_on_bt_fee,
        total_bt_fee: tickets[0].bt_fee,
        total_gst_on_base: tickets[0].gst_on_basePrice,
        total_gst_bt_fee: tickets[0].gst_on_bt_fee,
        total_convenience_fee: tickets[0].conv_fee,
        total_gst_convenience_fee: tickets[0].gst_conv_fee,
        finalPrice: tickets[0].discountedPrice,
        ticket_price: tickets[0].price,
      },
    };
    await CashfreePayment.create(createPay);
    // EMAIL CODE
    const origin = process.env.FRONTEND_ORIGIN;
    // console.log(ticketResponse, "response");

    // const prices = calculateTicketPrice(
    //   ticketResponse?.price,
    //   eventResponse.fees,
    //   qtyTick,
    //   discount
    // );

    const getData = await getEmailData(
      TicketType,
      eventResponse,
      tickets[0].Event
    );

    await sendUserEmail({
      email: userObj?.email,
      origin,
      password: userObj?.password,
      token: btoa(userObj?.password),
      firstName: userObj?.firstName,
      lastName: userObj?.lastName,
      eventImage: eventResponse?.eventSquareImage
        ? eventResponse?.eventSquareImage
        : eventResponse?.eventImageOriginal || "",
      ticketName: ticketResponse?.ticketName,
      bookingId: bundleId,
      numFreeTickets: qtyTick,
      eventDate: eventResponse?.startDate,
      eventStartTime: eventResponse?.startTime,
      eventEndTime: eventResponse?.endTime,
      eventLocation: eventResponse?.location,
      ticketPrice: showPrice,
      eventName: eventResponse?.eventTitle,
      fees: eventResponse?.fees,
      qrCode: qrFirst,
      eventDescription: getData.eventDescription,
      ticketNamePointThree: getData.ticketNamePointThree,
      ticketNamePointOne: getData.ticketNamePointOne,
      currency: currency
    });
  } catch (err) {
    console.log("err: ", err.message);
    throw new CustomError.NotFoundError(err.message);
  }
};

// Paid price update from admin panel
const updatePaidPrice = async (req, res) => {
  const { order_id } = req.params;
  try {
    const updateEvent = await Ticket.find({ orderId: order_id });
    for (let i = 0; i < updateEvent.length; ++i) {
      await Ticket.findOneAndUpdate(
        { _id: updateEvent[i]._id },
        {
          $set: {
            fullyPaid: true,
            "prices.paidPrice": parseFloat(
              updateEvent[i]?.prices?.paidPrice +
                updateEvent[i]?.prices?.due_with_taxes
            ),
            "prices.due_with_taxes": 0,
          },
        }
      );
    }

    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "event updated",
      updatedEvent
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

module.exports = {
  updateTicketClaimed,
  bookTicket,
  getTicket,
  getTicketbyTicketID,
  getTicketbyUserID,
  getTicketByNftIndex,
  addGasFee,
  updateTicketPaymentStatus,
  sendAirdropEmail,
  setTicketUsed,
  generateQrCode,
  getTicketbyUserIDAPP,
  getuserTicketbyEventID,
  createTrail,
  getTrail,
  getTicketTypes,
  getAllTickets,
  addTicketTypeToEvent,
  getTicketsByEventId,
  updateTicketType,
  deleteTicketType,
  getTicketByTicketId,
  newBookTicket,
  getAllTicketsByRole,
  getTicketByNftId,
  ticketInfo,
  getNfts,
  generateFreeTicket,
  allSales,
  ticketOrderId,
  updatePaidPrice,
  getTicketByEmailChange,
  getTicketByEmailChangeWithoutEventId,
};
