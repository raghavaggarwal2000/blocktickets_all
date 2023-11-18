const Nft = require("../models/Nft");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require('../responseHandler/sendResponse')

const create = async (req, res) => {
  const { imageIpfs, jsonIpfs, name, description, imageUrl, nftType, userWallet } =
    req.body;
  const uploadedBy = req.user.userId;

  
  const createObj = {
    imageHash: imageIpfs,
    jsonHash: jsonIpfs,
    name,
    description,
    imageUrl,
    nftType,
    uploadedBy,
  };
  console.log(createObj);
  const data = await Nft.create(createObj);
  //res.status(StatusCodes.CREATED).json({ data });
  responseHandler.sendResponse(res, StatusCodes.CREATED, 'nft created',{data: data});
};

const get = async (req, res) => {
  const nftId = req.params.id;
  const nft = await Nft.findOne({ _id: nftId });

  if (!nft) {
    throw new CustomError.NotFoundError(`Invalid Nft`);
  }

 // res.status(StatusCodes.OK).json({ data: nft });
 responseHandler.sendResponse(res, StatusCodes.OK, 'nfts',{data: nft});
};

const getAll = async (req, res) => {
  const nfts = await Nft.find({});
  //res.status(StatusCodes.OK).json({ data: nfts });
  responseHandler.sendResponse(res, StatusCodes.OK, 'all nfts',{data: nfts});
};

const update = async (req, res) => {
  const {} = req.body;
};

module.exports = { create, get, getAll, update };
