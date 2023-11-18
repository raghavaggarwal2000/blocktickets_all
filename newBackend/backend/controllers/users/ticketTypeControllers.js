const TicketType = require("../../models/TicketType")
const responseHandler = require("../../responseHandler/sendResponse");
const StatusCodes = require("http-status-codes")


const getTicketType = async(req, res) => {
    try{
        const obj = {
            Event : req.params.eventId,
            visible: "VISIBLE",
            endDate: {$gt :new Date().toISOString().toLocaleString("en-US", {timezone : "Asia/Kolkata"})}
        }
        console.log(obj);
        const ticket = await TicketType.find(obj)
        .select("ticketName displayPrice basePrice basePriceFNB ticketQuantity currency startDate endDate ticketInfo flag color")
        console.log(ticket)

        responseHandler.sendResponse(res, StatusCodes.OK, "Ticket Type", ticket)
    }catch(err){

        responseHandler.sendResponse(res, StatusCodes.NOT_FOUND, "Ticket Not Found", err.message)
    }
}

module.exports = { 
    getTicketType
};