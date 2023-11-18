const CashfreePayment = require("../models/CashfreePayment");
var FormData = require("form-data");
const TicketType = require("../models/TicketType");
const TicketLockedSchema = require("../models/TicketLock");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Nft = require("../models/Nft");
const Ticket = require("../models/Tickets");
const Event = require("../models/Event");
const USER = require("../models/User");
const UserTrail = require("../models/userTrailNft");
const mongoose = require("mongoose");
const responseHandler = require("../responseHandler/sendResponse");
const axios = require("axios");
const qr = require("qrcode");

const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const pdf = require("html-pdf");
const AWS = require("aws-sdk");
const connectDB = require("../db/connect");
var ObjectId = require("mongoose").Types.ObjectId;

require("dotenv").config();
const {
    sendPurchasedEmail
} = require("../utils");

const AWSCredentials = {
    accessKey: "AKIA5BOLECF2PAHOXBQT",
    secret: "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",
    bucketName: "blocktickets",
};
const s3 = new AWS.S3({
    accessKeyId: AWSCredentials.accessKey,
    secretAccessKey: AWSCredentials.secret,
});

const createEventContractAddress = "0x7c45aF8c6E729a9A2800102BA0872dddece7A1Fa";

const book = async(userId,orderId) =>{
    try {
        // const orderId = "order_1671045629294"
        const orderDetails = await CashfreePayment.findOne({ orderId});
        const tickets = orderDetails.tickets;
        let ticketBooking = [];
        let bookedTickets = [];
        let index = 0;
        let qtyTick = 0;
        for (let i = 0; i < tickets.length; i++) {
            const currentTicket = tickets[i];
            const currentTicketType = await TicketType.findById(
                currentTicket._id
            );
            qtyTick += Number(currentTicket.quantity) || 0;
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
                    dollar: currentTicketType.price,
                    addon: currentTicket.addon,
                    transactionCharge: currentTicketType.price * 0.02,
                    otherCharge: 0,
                    totalPrice: currentTicketType.price,
                    ticketOrderId: "",
                    totalTicketPrice: Number(currentTicketType.price) * 1.02,
                });

                let nftDetails = {
                    imageHash: currentTicketType.uri,
                    jsonHash: currentTicketType.uri,
                    name: currentTicketType.ticketName,
                    description: currentTicketType.ticketInfo,
                    imageUrl: currentTicketType.uri,
                    nftType: "image",
                    uploadedBy: userId,
                };
                await Nft.create(nftDetails)
                .then(async (result) => {
                    bookedTickets[index]["nftId"] = result._id;
                })
                .catch((err) => {
                    console.log(err);
                    throw new CustomError.BadRequestError(
                        "Booking Failed!"
                    );
                });
                index++;
            }
        }
        await bookTicketHelper(
            bookedTickets,
            userId,
            orderDetails,
            qtyTick
        );

        console.log("ticket booked")
    } catch (err) {
        console.log(err);
    }
}

const bookTicketHelper = async (tickets, userId, order, qtyTick) => {
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
                const conveince_charges = (order.amount/100)*2;

                invoicePDFUrl = `https://blocktickets.s3.ap-south-1.amazonaws.com/invoice/${order.orderId}.pdf`;

            } else {
                throw new CustomError.NotFoundError("unable to create ticket");
            }
        } else {
            throw new CustomError.NotFoundError(`somthing wrong!!`);
        }
        for (let i = 0; i < tickets.length; i++) {
            const currentTicket = tickets[i];
            const nftResponse = await Nft.findById(currentTicket.nftId);
            if (!nftResponse)
                throw new CustomError.NotFoundError("nftid is not correct");

            let qrdata = JSON.stringify({
                mintedBy: process.env.ADMIN_ID,
                minterAddress: currentTicket.minterAddress,
                currentOwnerAddress: currentTicket.minterAddress,
                ownedBy: process.env.ADMIN_ID,
                showTo: userId,
                price: currentTicket.price,
                totalPrice: currentTicket.totalPrice,
                tokenId: currentTicket.nftIndex,
                nftId : nftResponse._id
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
                    currentTicket.paymentMode === "CARD"
                        ? process.env.ADMIN_ID
                        : userId,
                minterAddress: currentTicket.minterAddress,
                currentOwnerAddress: currentTicket.minterAddress,
                ownedBy:
                    currentTicket.paymentMode === "CARD"
                        ? process.env.ADMIN_ID
                        : userId,
                showTo: userId,
                price: currentTicket.price,
                dollar: currentTicket.dollar,
                transactionCharge: currentTicket.transactionCharge,
                totalPrice: currentTicket.totalPrice,
                otherCharge: currentTicket.otherCharge,
                tokenId: currentTicket.nftIndex,
            };
            await Nft.findByIdAndUpdate(
                currentTicket.nftId,
                obj
            );
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
                dollar: currentTicket.dollar,
                addon: currentTicket.addon,
                transactionCharge: currentTicket.transactionCharge,
                totalPrice: currentTicket.totalPrice,
                otherCharge: currentTicket.otherCharge,
                onSale: false,
                qrCode: qrCodeGenerated,
                invoiceUrl: invoicePDFUrl,
            };
            const ticketCreated = Ticket(ticketObj);
            const ticketC = await ticketCreated.save();

            ticketCreatedRes.push(ticketC);
            aTicketId = ticketC?.id;
            await Event.findByIdAndUpdate(currentTicket.Event, {
                totalBooked: parseInt(eventResponse.totalBooked) + 1,
            });
            await TicketType.findByIdAndUpdate(currentTicket._id, {
                sold: ticketResponse.sold + 1,
            });
        }

        var redirectUrl =
            `https://marketplace.unicus.one/nft/137/${createEventContractAddress}/` +
            tickets[0].nftIndex;

        //// EMAIL CODE
        let name = "User";
        const origin = process.env.FRONTEND_ORIGIN;
        // await sendPurchasedEmail({
        //     name: uDetails.email,
        //     email: uDetails.email,
        //     event: eventResponse,
        //     origin,
        //     ticketOrderId: order.orderId,
        //     redirectUrl: redirectUrl,
        //     invoiceUrl: invoicePDFUrl,
        //     location: eventResponse?.location || "",
        //     eventImage: eventResponse?.eventImageOriginal || "",
        //     price: order.amount,
        //     ticketName: eventResponse.eventTitle,
        //     ticketId: eventResponse._id,
        //     qty: qtyTick,
        // });

        // EMAIL CODE
    } catch (err) {
        console.log(err);
        throw new CustomError.NotFoundError(`unable to book your ticket`);
    }
};

const orders = ["order_1671080627942",
                "order_1671077578085",
                "order_1671080768625",
                "order_1671080835883"]

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      console.log("connected!")
    //   const users = await USER.find({systemGenerated:true})
        // for(let i=0; i<users.length; i++){
            for(let j=0; j<orders.length;j++){
                await  book(new ObjectId("6399e772cf0354ebb1c8ea17"),orders[j])
            }
        // }
    } catch (err) {
      console.log(err);
    }
  };

start()