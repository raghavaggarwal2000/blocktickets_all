const TicketLocked = require("../models/TicketLock");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require('../responseHandler/sendResponse')

// Increment locked

const ticketIncrementLocked = async (req, res) => {
  try {
  return responseHandler.sendResponse(res, StatusCodes.OK, "ticket inc", {});

    const selectedTickets = req.body.selectedTickets
    for(const ticket of selectedTickets){
    const num = parseInt(ticket.quantity);
    const ticketId = ticket._id;
    const response = await TicketLocked.findOne({ ticketId });
        console.log(
          response, ticketId
        );

    const ticketLocked = response.ticketLocked;
    if(!(ticketLocked+num <= response.ticketQuantity)) throw new CustomError.NotFoundError('All Tickets are locked try booking after some time');
    await TicketLocked.findByIdAndUpdate(response.id, {
      ticketLocked: ticketLocked + num,
    });
  }
    //res.status(StatusCodes.OK).send("ticket inc");
    responseHandler.sendResponse(res, StatusCodes.OK, 'ticket inc',{});
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

// Decrement locked

const ticketDecrementLocked = async (req, res) => {
  try {
      return responseHandler.sendResponse(res, StatusCodes.OK, "ticket inc", {});

     const selectedTickets = req.body.selectedTickets
    for(const ticket of selectedTickets){
    const num = parseInt(ticket.quantity);
    const ticketId = ticket._id;
    const response = await TicketLocked.find({ ticketId: ticketId });

    const ticketLocked = response[0].ticketLocked;
    if(!(ticketLocked-num >= 0)) throw new CustomError.NotFoundError('Try locking the ticket before unlocking');
    await TicketLocked.findByIdAndUpdate(response[0].id, {
      ticketLocked: ticketLocked - num
    });
  }
   // res.status(StatusCodes.OK).send("ticket dec");
   responseHandler.sendResponse(res, StatusCodes.OK, 'ticket dec',{});
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};
module.exports = { ticketIncrementLocked, ticketDecrementLocked };
