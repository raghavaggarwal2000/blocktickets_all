const NftDrops = require("../models/NftDrops"); 
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require("../responseHandler/sendResponse");
const Ticket = require("../models/Tickets");
const axios = require("axios");
const Nft = require("../models/Nft");



const create = async (req, res) => {
  try {
    const { event, ticket, dropTokenId, dropName, dropUrl } = req.body;
    const createObj = {
      event,
      ticket,
      dropTokenId,
      dropName,
      dropUrl,
      ownedBy: req.user.userId,
    };
    console.log(createObj);
    const result = NftDrops.create(createObj);
    responseHandler.sendResponse(res, StatusCodes.CREATED, "nft drop created", {
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const claim = async (req, res) => {
  try {
    const { ticketNft, userWallet } = req.body;
    const nftIndex = ticketNft.toString()
    const ticket = await Ticket.findOne({ nftIndex });
    // console.log(req.user.userId,"dr", ticket, ticketNft, userWallet);
    if(!ticket){
      throw new CustomError.BadRequestError("Ticket not found");
    }
    if (ticket.user != req.user.userId) {
      throw new CustomError.UnauthorizedError("Unauthorised User");
    }
    if (ticket.specialPackageClaimed == true) {
      throw new CustomError.BadRequestError("Already claimed");
    }
    const user = await User.findOne({ _id: req.user.userId });
    // if (!user.wallets.includes(account)) {
    //   throw new CustomError.BadRequestError("Wallet not linked to user");
    // }
    const adminResult = await axios.post(`${process.env.ADMIN_API}/claimnft`, {
      ticketNft,
      userWallet,
    });
    if(!adminResult){
      throw new CustomError.BadRequestError("Claim Failed");
    }
    const result = await Ticket.updateOne(
      { _id: ticket._id },
      { specialPackageClaimed: true, claimedWallet: userWallet  }
    );
    const nftResult = await Nft.updateOne(
      { tokenId: ticketNft },
      { currentOwnerAddress: userWallet }
    );
    responseHandler.sendResponse(res, StatusCodes.OK, "nft drop claimed", {
      data: result,
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.BadRequestError(err.message);
  }
};

const getNftDropByOwner = async (req, res) => {
  const userTickets = await Ticket.find({ user: req.user.userId });

  let addOns=[];
  for (const ticket in userTickets)
  {
      const addon = ticket.addon
      addOns.push(...addon)
  }

  responseHandler.sendResponse(res, StatusCodes.OK, "nft drop by owner", {
    data: addOns,
  });
};

const getNftDropForUserByEvent = async (req, res) => {
   const userTickets = await Ticket.find({
     Event: req.body.event,
     user: req.body.userId,
   });

  let addOns=[];
  for (const ticket in userTickets)
  {
      const addon = ticket.addon
      addOns.push(...addon)
  }

  responseHandler.sendResponse(res, StatusCodes.OK, "nft drop by owner", {
    data: addOns,
  });
};

module.exports = { create, claim, getNftDropByOwner, getNftDropForUserByEvent };
