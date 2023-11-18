const CouponCode = require("../../models/CouponCode");
const Events = require("../../models/Events");
const TicketTypes = require("../../models/TicketType");
const StatusCodes = require("http-status-codes");
const CustomError = require("../../errors");
const responseHandler = require("../../responseHandler/sendResponse");
const {ObjectId} = require("mongoose");
const {timezoneIST} = require("../../utils");

function coupongenerator() {
    var coupon = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 6; i++) {
    coupon += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return coupon;
}


const createCouponCode = async (req, res) =>{
    try{
        let {
            EventId,
            TicketTypeId,
            code,
            quantity,
            show_coupon,
            discountPercentage,
            valid_from,
            valid_till
        } = req.body;


        if(quantity >= 100){
            return responseHandler.sendError(res, 
                StatusCodes.BAD_REQUEST, 
                "Please enter value Less than 100", 
                {});
        }

        if(discountPercentage <=0 || discountPercentage > 100){
            return responseHandler.sendError(res, 
                StatusCodes.BAD_REQUEST, 
                "Please enter value appropriate Discount Percentage", 
                {});
        }

        if(valid_from > valid_till)
            return responseHandler.sendError(res, StatusCodes.BAD_REQUEST, "Valid Till should be less than valid from", {});

        const event = await Events.findById(EventId);
        if(!event)
            return responseHandler.sendError(res, StatusCodes.BAD_REQUEST, "This Event Doesn't Exist", {});

        for(let i = 0;i < TicketTypeId.length; ++i){
            const ticketTypeData = await TicketTypes.find({_id:TicketTypeId[i], Event: EventId});
            if(ticketTypeData.length === 0)
                return responseHandler.sendError(res, StatusCodes.BAD_REQUEST, "Ticket Type doesn't exist",{});
        }

        if(code){
            const check = await CouponCode.findOne({code: code});
            if(check){
                return responseHandler.sendError(res, StatusCodes.BAD_REQUEST, "Already Exist", {});
            }
        }else{
            code = coupongenerator();
            while(await CouponCode.exists({code: code})){
                code = coupongenerator();
            }
        }
        console.log(EventId);
        let obj = {
            Event: EventId,
            TicketType: TicketTypeId,
            code: code,
            quantity: quantity,
            show_coupon: show_coupon,
            discountPercentage: discountPercentage,
            valid_from: timezoneIST(valid_from),
            valid_till: timezoneIST(valid_till)
        };

        const save = CouponCode(obj);
        const couponCodeSaved = await save.save();
        responseHandler.sendResponse(res, StatusCodes.CREATED, "Coupon Code Generated", {msg: couponCodeSaved});

    }
    catch(err){
        console.log(err);
        responseHandler.sendError(res, StatusCodes.BAD_REQUEST, err.message, {err: err});
    }
};


module.exports = {
    createCouponCode
}