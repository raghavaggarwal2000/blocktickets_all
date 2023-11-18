const ListEvent = require("../models/ListEventForm.js");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require('../responseHandler/sendResponse');


const createListEventData = async (req,res) => {
  const {userFullName,
        email,
        phoneNumber,
        eventRegion,
        eventCity,
        eventType,
        expectedAudience,
        eventDate,
        eventDesctiption
        } = req.body; 
        if (!email) {
          throw new CustomError.BadRequestError("Please provide an email");
        } else if (!userFullName) {
          throw new CustomError.BadRequestError("Please provide the userFullName");
        } else if (!phoneNumber) {
          throw new CustomError.BadRequestError("Please provide the phoneNumber");
        }else if (!eventRegion) {
          throw new CustomError.BadRequestError("Please provide the eventRegion");
        }else if (!eventCity) {
          throw new CustomError.BadRequestError("Please provide the eventCity");
        }else if (!eventType) {
          throw new CustomError.BadRequestError("Please provide the eventType");
        }else if (!expectedAudience) {
          throw new CustomError.BadRequestError("Please provide the expectedAudience");
        }else if (!eventDate) {
          throw new CustomError.BadRequestError("Please provide the eventDate");
        }else if (!eventDesctiption) {
          throw new CustomError.BadRequestError("Please provide the eventDesctiption");
        }
  const createObj = {
        userFullName,
        email,
        phoneNumber,
        eventRegion,
        eventCity,
        eventType,
        expectedAudience,
        eventDate,
        eventDesctiption
  }

  const result = await ListEvent.create(createObj);
  responseHandler.sendResponse(res, StatusCodes.CREATED, 'Success! Your form submitted',{});
}

module.exports = {
  createListEventData
}