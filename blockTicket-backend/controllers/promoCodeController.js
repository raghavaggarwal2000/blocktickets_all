const Ticket = require("../models/Tickets");
const User = require("../models/User");
const Event = require("../models/Event");
const Artist = require("../models/Artist");
const TicketType = require("../models/TicketType");
const ObjectId = require("mongoose").Types.ObjectId;
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require("../responseHandler/sendResponse");
const axios = require("axios");
const { DiscountCode, Discount } = require("../models/PromoCode");
const crypto = require("crypto");
const { isWithinRange } = require("../utils/helpers");

function generateDiscountCode() {
  const length = 10;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  while (code.length < length) {
    const bytes = crypto.randomBytes(length);
    const randomChars = new Array(length);
    for (let i = 0; i < length; i++) {
      randomChars[i] = chars[bytes[i] % chars.length];
    }
    code = randomChars.join("");
  }
  return code;
}

const createPromoCode = async (req, res) => {
  try {
    const { code, eventValue, ticketValue, discountPercentage, quantity, validity, perCodeQty } = req.body;
    const { userId } = req.params;
    const check = await DiscountCode.findOne({code:code})
    if(check){
      return res.status(400).json({error: "This code already exists"});
    }
    // Validate input
    if (discountPercentage < 1 || discountPercentage > 100) {
      return res
        .status(400)
        .json({ error: "Discount percentage must be between 1 and 100." });
    }
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive integer." });
    }
    if (quantity > 50) {
      return res
        .status(400)
        .json({ error: "Quantity must be a less than 50." });
    }
    // Create discount object
    const discount = await Discount.create({
      discountPercentage,
      createdBy: userId,
    });

    // Generate discount codes
    const discountCodes = [];
    if(code === ""){
      let tempCode = generateDiscountCode();
      while (await DiscountCode.exists({ code })) {
        tempCode = generateDiscountCode();
      }
      discountCodes.push({
        code: tempCode,
        event: ObjectId(eventValue),
        ticketType: ObjectId(ticketValue),
        discountId: ObjectId(discount?._id),
        quantity: perCodeQty,
        valid_from: validity[0],
        valid_till: validity[1],
      });
    }else{
      discountCodes.push({
        code,
        event: ObjectId(eventValue),
        ticketType: ObjectId(ticketValue),
        quantity: perCodeQty,
        discountId: ObjectId(discount?._id),
        valid_from: validity[0],
        valid_till: validity[1]
      })
    }

    // Create discount code objects
    const createdDiscountCodes = await DiscountCode.create(discountCodes);
    console.log(createdDiscountCodes)
    // Add discount codes to discount object and save
    discount.discountCode = createdDiscountCodes;
    await discount.save();

    // Return response
    res.status(201).json(discount);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const getAllPromoCodes = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const skip = (parseInt(page) - 1) * limit;
    const all = await Discount.find({})
      .populate("createdBy", "email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalCount = await Discount.find({}).count();
    const event_data = {};
    const events = await Event.find({});
    const ticketType = {};
    for(let i = 0; i<events.length; ++i){
      const type = await TicketType.find({"Event": events[i]._id});
      ticketType[events[i]._id] = type;
    }
    res.status(200).send({
      all,
      events,
      ticketType,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("");
  }
};

const getPromoCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id: ", id);

    const discount = await Discount.findById(id).populate(
      "createdBy",
      "email "
    );
    const codes = await DiscountCode.find({
      discountId: ObjectId(id),
    }).populate("usedBy", "email");

    res.status(200).json({
      data: { discount, codes },
      msg: "success",
    });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send("Internal server error");
  }
};

const verifyCode = async (req, res) => {
  try {
    const { code } = req.params;
    const {event_id} = req.body;
    const _code = await DiscountCode.findOne({ code })
    .populate('ticketType');
    console.log("_code: ", _code);
    if (!_code) {
      return res.status(400).send("Promo code is incorrect");
    }
    if(!_code?.event.equals(event_id)){
      return res.status(400).send("This promo code is not valid for this event");
    }
    const _discount = await Discount.findOne({ _id: _code?.discountId });
    // validate quantity
    const isValid = _code?.usedBy?.length < _code?.quantity;
    // validate date
    const dateValidity = isWithinRange(_code?.valid_from, _code?.valid_till);
    console.log(dateValidity);
    if (!isValid) {
      return res.status(400).send("Promo code limit is exhausted");
    }
    // is valid
    if (!dateValidity) {
      return res.status(400).send("Promo code is expired");
    }
    const msg = `Promo code applied on ${_code?.ticketType?.ticketName}`
    res.status(200).json({
      msg: msg,
      info: {
        valid: isValid,
        code: _code?.code,
        percentage: _discount?.discountPercentage,
        ticketType: _code?.ticketType?._id,
        ticketName: _code?.ticketType?.ticketName
      },
    });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send("Internal server error");
  }
};

const updateDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    console.log("date: ", date);
    const updateById = await DiscountCode.findOneAndUpdate(
      { _id: id },
      { valid_from: date[0], valid_till: date[1] }
    );
    console.log("updateById: ", updateById);
    res.status(200).json({ msg: "Promo code updated successfully" });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send("Internal server error");
  }
};
const updateDetails = async (req,res) =>{
  try{
    const { id, code, quantity, discount, date} = req.body;
    const old_data = await DiscountCode.findById(id);
    if(old_data.code !== code){
      const check = await DiscountCode.find({code:code});
      if(check.length >0){
        return res.status(500).send("Coupon code already exists");
      }
    }
    const updateById = await DiscountCode.findOneAndUpdate({_id:id},
      { 
        code: code,
        quantity: quantity, 
        valid_from: date[0],
        valid_till: date[1]
      }
    );

    await Discount.findOneAndUpdate({_id: updateById.discountId},{
      discountPercentage: discount
    });
    res.status(200).json({ msg: "Promo code updated successfully" });
  }
  catch(err){
    console.log("err: ", err);
    res.status(500).send("Internal server error");
  }
}

const disableCode = async (req,res) =>{
  try{
    const id  = req.params.id;
    const yesterday = new Date(new Date());
    yesterday.setDate(yesterday.getDate() -1);
    await DiscountCode.findOneAndUpdate({_id:id},
      {
        valid_from: yesterday, valid_till: yesterday
      });

      
      res.status(200).json({ msg: "Promo code Disabled successfully" });
  }
  catch(err){
    res.status(500).send("Internal server error");
  }
}
module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  verifyCode,
  updateDate,  
  updateDetails,
  disableCode
};
