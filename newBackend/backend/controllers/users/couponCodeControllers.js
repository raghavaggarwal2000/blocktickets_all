const CouponCode = require("../../models/CouponCode");
const Event = require("../../models/Events");
const responseHandler = require("../../responseHandler/sendResponse");
const StatusCodes = require("http-status-codes");
const CustomError = require("../../errors");
const TicketType = require("../../models/TicketType");

const availableCouponCode = async(req,res) =>{
    try{
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if(event === null){
            throw new CustomError.BadRequestError("Event doesn't exist");
        }
        const couponCode = await CouponCode.find({Event: eventId, show_coupon:true})
        .populate("TicketType");

        responseHandler.sendResponse(res, StatusCodes.OK, "Available Coupon Codes", couponCode);
    }
    catch(err){    
        responseHandler.sendError(res, StatusCodes.NOT_FOUND, "No Coupon Code found", {err: err.message});
    }

};


const verifyCouponCode = async (req,res) => {
    try{
        const {
            code,
            eventId,
        } = req.body

        let check = await CouponCode.findOne({code});
        if(check === null){
            throw new CustomError.BadRequestError("This coupon Code doesn't exist");
        }

        check = await CouponCode.findOne({code, Event: eventId});
        if(check === null){
            throw new CustomError.BadRequestError("This coupon Code is not valid for this event")
        }

        responseHandler.sendResponse(res, StatusCodes.OK, "Valid Coupon Code", check)
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.BAD_REQUEST, "No Coupon Code found", {err: err.message});
    }
};

module.exports = {
    availableCouponCode,
    verifyCouponCode
}