const TicketType = require("../models/TicketType");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Nft = require("../models/Nft");
const Ticket = require("../models/Tickets");
const Event = require("../models/Event");
const mongoose = require("mongoose");
const responseHandler = require("../responseHandler/sendResponse");
const NftTransaction = require("../models/NftTransaction");

const onSaleByTicketId = async (req, res) => {
  try {
    console.log(1);
    if (!req.body.ticketID) {
      console.log(2);
      throw new CustomError.NotFoundError(`please provide Ticket Id!!`);
    }
    console.log(3);

    const ticket = await Ticket.findById(req.body.ticketID).populate("nftRef");
    console.log(4);
    if (ticket == null || ticket == undefined || !ticket) {
      console.log(5);
      throw new CustomError.NotFoundError(`Ticket does not exist`);
    }
    console.log(6);
    if (ticket.user != req.user.userId) {
      console.log(7);
      throw new CustomError.NotFoundError(`You are not the owner of Ticket`);
    }
    console.log(8);
    if (ticket.onSale == true) {
      console.log(9);
      throw new CustomError.NotFoundError(`Ticket is already on sale`);
    }
    console.log(10);

    const nftTransactionExist = await NftTransaction.find({
      previousOwner: req.user.userId,
      ticket: ticket._id,
      isSuccessful: false,
    });
    console.log(11);
    console.log(nftTransactionExist);

    if (nftTransactionExist.length != 0) {
      console.log(11.1);
      throw new CustomError.NotFoundError(`Ticket is already on sale`);
    }
    console.log(12);
    const todayDate = new Date();
    const todayDateUTC = todayDate.toUTCString();
    const ticTransObj = {
      listedDate: todayDateUTC,
      previousOwner: req.user.userId,
      nft: ticket.nftRef._id,
      ticket: ticket._id,
      price: req.body.price,
    };
    console.log("Price-", req.body.price);
    console.log(13);

    const t = NftTransaction(ticTransObj);
    const tCreated = await t.save();
    console.log(14);

    await Ticket.findByIdAndUpdate(req.body.ticketID, {
      onSale: true,
      saleId: req.body.saleId,
    });
    console.log(15);
    responseHandler.sendResponse(res, StatusCodes.OK, "ticket added for sale", {
      sale: tCreated,
    });
  } catch (error) {
    throw new CustomError.NotFoundError(error.message);
  }
};

const cancleonSaleByTicketId = async (req, res) => {
  try {
    if (!req.body.ticketID) {
      console.log(2);
      throw new CustomError.NotFoundError(`please provide event Id!!`);
    }

    const ticket = await Ticket.findById(req.body.ticketID);
    if (ticket == null || ticket == undefined || !ticket) {
      throw new CustomError.NotFoundError(`Ticket does not exist`);
    }
    if (ticket.user != req.user.userId) {
      throw new CustomError.NotFoundError(`You are not the owner of Ticket`);
    }
    if (ticket.onSale == false) {
      throw new CustomError.NotFoundError(`Ticket in not on sale`);
    }

    const nftTransactionExist = await NftTransaction.find({
      previousOwner: req.user.userId,
      ticket: ticket._id,
      isSuccessful: false,
    });

    if (nftTransactionExist.length == 0) {
      console.log(11.1);
      throw new CustomError.NotFoundError(`Ticket in not on sale`);
    }

    await NftTransaction.findByIdAndDelete(nftTransactionExist[0]._id);

    await Ticket.findByIdAndUpdate(req.body.ticketID, {
      onSale: false,
      saleId: "-1",
    });
    responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "ticket removed from sale",
      null
    );
  } catch (error) {
    throw new CustomError.NotFoundError(error.message);
  }
};

const getAllTicketOnSale = async (req, res) => {
  try {
    ticket = await Ticket.find({
      user: req.user.userId,
      onSale: true,
    }).populate("nftRef");

    if (ticket.length == 0) {
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "No ticket on sale",
        null
      );
    } else {
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "ticket list on sale",
        ticket
      );
    }
  } catch (error) {
    throw new CustomError.NotFoundError(error.message);
  }
};

const getAllPlatformTicketOnSale = async (req, res) => {
  try {
    let page = 1;
    let limit = 3;
    let type = 0;
    let category = "";
    let location = "";
    if (req.query.page) {
      page = parseInt(req.query.page);
      console.log("in p");
    }
    if (req.query.type) {
      type = parseInt(req.query.type);
      console.log("in p");
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
      console.log("in l");
    }
    if (req.query.category) {
      category = req.query.category;
      console.log(category);
    }
    if (req.query.location) {
      location = req.query.location;
    }
    console.log(page);
    console.log(limit);
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    const date = new Date();
    let ticket;

    if (type == 0) {
      // previous
      console.log("IN");
      const newDate = new Date();
      const compareCurrentDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate()
      );
      console.log(compareCurrentDate);
      ticket = await Ticket.aggregate([
        {
          $match: {
            $and: [{ onSale: true }],
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "Event",
            foreignField: "_id",
            as: "EventDetails",
          },
        },
        {
          $match: {
            "EventDetails.endDate": { $lte: compareCurrentDate },
          },
        },
        {
          $lookup: {
            from: "tickettypes",
            localField: "ticketType",
            foreignField: "_id",
            as: "ticketType",
          },
        },
        {
          $sort: { CreatedAt: -1 },
        },
        {
          $facet: {
            metadata: [
              {
                $count: "total",
              },
            ],
            data: [
              {
                $skip: startIndex,
              },
              {
                $limit: limit,
              },
            ],
          },
        },
      ]);
    } else {
      // upcoming
      const newDate = new Date();
      const compareCurrentDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate()
      );

      ticket = await Ticket.aggregate([
        {
          $match: {
            $and: [{ onSale: true }],
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "Event",
            foreignField: "_id",
            as: "EventDetails",
          },
        },
        {
          $match: {
            $and: [
              {
                $and: [
                  {
                    "EventDetails.startDate": {
                      $lte: compareCurrentDate,
                    },
                  },
                  { "EventDetails.eventType": category },
                ],
              },
              {
                $and: [
                  {
                    "EventDetails.startDate": {
                      $lte: compareCurrentDate,
                    },
                  },
                  { "EventDetails.location": location },
                ],
              },
            ],
          },
        },
        {
          $lookup: {
            from: "tickettypes",
            localField: "ticketType",
            foreignField: "_id",
            as: "ticketType",
          },
        },

        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            metadata: [
              {
                $count: "total",
              },
            ],
            data: [
              {
                $skip: startIndex,
              },
              {
                $limit: limit,
              },
            ],
          },
        },
      ]);
    }

    if (ticket[0].data.length == 0) {
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "No ticket on sale",
        null
      );
    } else {
      // let ttt = ticket
      for (let i = 0; i < ticket[0].data.length; i++) {
        // ticket[0].data[i].name = "AAA";
        const nftT = await NftTransaction.find({
          ticket: ticket[0].data[i]._id,
          nft: ticket[0].data[i].nftRef._id,
          isSuccessful: false,
        });
        ticket[0].data[i].transaction = nftT;
      }
      console.log(typeof Ticket);
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "ticket list on sale",
        ticket
      );
    }
  } catch (error) {
    throw new CustomError.NotFoundError(error.message);
  }
};

const getAllTicketOnSale_ = async (req, res) => {
  try {
    let page = 1;
    let limit = 3;
    let type = 0;
    let location = "";
    if (req.query.page) {
      page = parseInt(req.query.page);
      console.log("in p");
    }
    if (req.query.location) {
      location = req.query.location;
    }

    if (req.query.limit) {
      limit = parseInt(req.query.limit);
      console.log("in l");
    }
    let startIndex = (page - 1) * limit;
    let lookupQuery = [];
    lookupQuery.push({
      $match: {
        $and: [
          {
            onSale: true,
          },
        ],
      },
    });
    lookupQuery.push({
      $lookup: {
        from: "events",
        localField: "Event",
        foreignField: "_id",
        as: "EventDetails",
      },
    });

    lookupQuery.push({
      $match: {
        "EventDetails.location": {
          $regex: location,
          $options: "i",
        },
      },
    });
    if (req.query.category && req.query.category !== "All") {
      console.log("req.query.category: ", req.query.category);
      lookupQuery.push({
        $match: {
          "EventDetails.eventType": {
            $regex: req.query.category,
            $options: "i",
          },
        },
      });
    }
    lookupQuery.push({
      $lookup: {
        from: "tickettypes",
        localField: "ticketType",
        foreignField: "_id",
        as: "ticketType",
      },
    });
    lookupQuery.push({
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: startIndex,
          },
          {
            $limit: limit,
          },
        ],
      },
    });

    let ticket = await Ticket.aggregate(lookupQuery);

    if (!ticket) {
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "No ticket on sale",
        null
      );
    } else {
      // let ttt = ticket
      for (let i = 0; i < ticket[0]?.data?.length; i++) {
        // ticket[0].data[i].name = "AAA";
        const nftT = await NftTransaction.find({
          ticket: ticket[0]?.data[i]?._id,
          nft: ticket[0]?.data[i]?.nftRef?._id,
          isSuccessful: false,
        });
        ticket[0].data[i].transaction = nftT;
      }
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "ticket list on sale",
        ticket
      );
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_GATEWAY).send();
  }
};

const getNftInfoFromTicket = async (req, res) => {
  try {
    if (!req.body.ticketID) {
      console.log(2);
      throw new CustomError.NotFoundError(`please provide event Id!!`);
    }

    const ticket = await Ticket.findById(req.body.ticketID).populate("nftRef");
    responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "ticket removed from sale",
      { ticket }
    );
  } catch (error) {
    throw new CustomError.NotFoundError(error.message);
  }
};

const buyTicketFromSale = async (req, res) => {
  try {
    if (!req.body.ticketID) {
      console.log(2);
      throw new CustomError.NotFoundError(`please provide Ticket Id!!`);
    }

    const ticket = await Ticket.findById(req.body.ticketID).populate("nftRef");
    console.log(4);
    if (ticket == null || ticket == undefined || !ticket) {
      console.log(5);
      throw new CustomError.NotFoundError(`Ticket does not exist`);
    }

    if (ticket.onSale == false) {
      console.log(9);
      throw new CustomError.NotFoundError(`Ticket is not for sale`);
    }

    const nftTransactionExist = await NftTransaction.find({
      ticket: ticket._id,
      isSuccessful: false,
    });

    if (nftTransactionExist.length == 0) {
      console.log(11.1);
      throw new CustomError.NotFoundError(`Ticket is not for sale`);
    }

    const todayDate = new Date();
    const todayDateUTC = todayDate.toUTCString();

    const updatedTransaction = await NftTransaction.findByIdAndUpdate(
      nftTransactionExist[0]._id,
      {
        purchasedDate: todayDateUTC,
        currentOwner: req.user.userId,
        transactionHash: req.body.txHash,
        isSuccessful: true,
      }
    );

    await Ticket.findByIdAndUpdate(req.body.ticketID, {
      user: req.user.userId,
      onSale: false,
    });

    responseHandler.sendResponse(res, StatusCodes.OK, "Ticket Purchased", {
      ticket: updatedTransaction,
    });
  } catch (error) {
    throw new CustomError.NotFoundError(error.message);
  }
};

const updateNftTransactionBuyer = async (req, res) => {
  try {
    console.log(req.body.id, " ID ");
    const updateNft = await Nft.findByIdAndUpdate(req.body.id, {
      currentOwnerAddress: req.body.currentOwnerAddress,
    });
    const updateTicket = await Ticket.findByIdAndUpdate(req.body.ticketId, {
      claimedWallet: req.body.currentOwnerAddress,
    });

    res.status(200).json({
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: "Internal Server Error!",
    });
  }
};

const getTicketsOnSale = async (req, res) => {
  let { page, limit } = req.query;
  const skip = (parseInt(page) - 1) * limit;
  try {
    let ticketsOnSale;
    let totalCount;
    if (req.profile.role === 1) {
      ticketsOnSale = await Ticket.find({ onSale: true })
        .populate("nftRef")
        .populate({
          path: "Event",
          match: {
            $or: [{ creator: req.profile._id }, { organizer: req.profile._id }],
          },
        })
        .skip(skip)
        .limit(limit);

      let filteredTickets = [];

      ticketsOnSale.forEach((ticket) => {
        if (ticket.Event !== null) {
          filteredTickets.push(ticket);
        }
      });

      ticketsOnSale = filteredTickets;
      totalCount = ticketsOnSale.length;
    } else if (req.profile.role === 2) {
      ticketsOnSale = await Ticket.find({ onSale: true })
        .populate("nftRef")
        .populate("Event")
        .skip(skip)
        .limit(limit);
      totalCount = ticketsOnSale.length;
    }

    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "Marketplace NFTs",
      {
        meta: {
          page: page,
          limit: limit,
          total: totalCount,
        },
        ticketsOnSale,
      }
    );
  } catch (error) {
    console.log(error);
    throw new CustomError.NotFoundError(error.message);
  }
};

module.exports = {
  onSaleByTicketId,
  cancleonSaleByTicketId,
  getAllTicketOnSale,
  getNftInfoFromTicket,
  buyTicketFromSale,
  getAllPlatformTicketOnSale,
  updateNftTransactionBuyer,
  getTicketsOnSale,
  getAllTicketOnSale_,
};
