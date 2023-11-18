const Event = require("../models/EventDummy");
const TicketType = require("../models/TicketTypeDummy");
var ObjectId = require('mongoose').Types.ObjectId;
const TicketLocked = require("../models/TicketLock");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require("../responseHandler/sendResponse");
const Compress = require("../utils/compress-image");
const Organizer = require("../models/OrganiserDummy");

const createEvent = async (req, res) => {
  req.body.ticket = JSON.parse(req.body.ticket);
  const data = req.body;
  let totalTicket = 0;
  console.log(req.user.logoImage,"req.dbok")

  try {
    const eventImageId = await Compress(
      req.user.userId,
      req.user.organizerImage
    );
    const logoImageId = await Compress(req.user.userId, req.user.logoImage);

    const organizerObject = {
      experienceLevel: data.experienceLevel,
      teamSize: data.teamSize,
      eventType: data.eventType,
      organizerName: data.organizerName,
      aboutOrganizer: data.aboutOrganizer,
      referral: data.referral,
      frequency: data.frequency,
      category: data.category,
      logoOriginal: logoImageId[1].secure_url,
      logoCompress: logoImageId[0].secure_url,
    };

    const organizerObj = Organizer(organizerObject);
    const organizeResponse = await organizerObj.save();
    const eventObject = {
      eventTitle: data.eventTitle,
      eventDescription: data.eventDescription,
      eventType: data.eventType,
      creator: req.user.userId,
      eventImageCompress: eventImageId[0].secure_url,
      eventImageOriginal: eventImageId[1].secure_url,
      organizer: organizeResponse._id,
      startDate: data.startDate,
      endDate: new Date(data.endDate),
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location
    };
    const eventObj = Event(eventObject);
    const eventResponse = await eventObj.save();

    if (!eventResponse) {
      throw new CustomError.NotFoundError(`event not created`);
    }

    let ticketCreatedArray = [];
    let LockedArray = [];

    for (i = 0; i < data.ticket.length; i++) {
      const ticketObject = {
        ticketName: data.ticket[i].ticketName,
        ticketQuantity: data.ticket[i].ticketQuantity,
        price: data.ticket[i].price,
        Event: eventResponse._id,
        startDate: new Date(data.ticket[i].ticketstartDate),
        endDate: new Date(data.ticket[i].ticketendDate),
        startTime: data.ticket[i].ticketstartTime,
        endTime: data.ticket[i].ticketendTime,
        currency: data.ticket[i].currency,
        ticketCategory: data.ticket[i].ticketCategory,
        ticketInfo: data.ticket[i].ticketInfo
      };
      const ticketObj = TicketType(ticketObject);
      const ticketResponse = await ticketObj.save();

      if (!ticketResponse) {
        await Event.findByIdAndDelete(eventResponse.id);
        for (j = 0; j < ticketCreatedArray.length; j++) {
          await TicketType.findByIdAndDelete(ticketCreatedArray[j].id);
        }
        throw new CustomError.NotFoundError(`ticket not created`);
      }

      const ticketLockedObj = TicketLocked({
        ticketId: ticketResponse._id,
        ticketQuantity: data.ticket[i].ticketQuantity,
      });
      const ticketLockedResponse = await ticketLockedObj.save();
      if (!ticketLockedResponse) {
        for (j = 0; j < LockedArray.length; j++) {
          await TicketLocked.findByIdAndDelete(LockedArray[j].id);
        }
        throw new CustomError.NotFoundError(`ticket not locked!!`);
      }

      totalTicket = totalTicket + data.ticket[i].ticketQuantity;
      ticketCreatedArray.push(ticketResponse);
      LockedArray.push(ticketLockedResponse);
    }

    await Event.findByIdAndUpdate(eventResponse.id, {
      totalTicket: totalTicket,
    });

    const eventDataRes = await Event.findById(eventResponse.id).populate('organizer')
    const ticketTypeRes = await TicketType.find({'Event':eventResponse.id})

    //res.status(StatusCodes.OK).send("create event");
    responseHandler.sendResponse(res, StatusCodes.OK, "create event", {Event:eventDataRes,TicketDetails:ticketTypeRes});
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

const getEventbyId = async (req, res) => {
  try {
    console.log(1);
    if(!req.body.eventID){
      console.log(2);
      throw new CustomError.NotFoundError(`please provide event Id!!`);
    }
    console.log(3);
    const data = await Event.findById(req.body.eventID).populate('organizer')
    const ticketType = await TicketType.find({'Event':req.body.eventID})
    if (!data) {
      console.log(4);
      throw new CustomError.NotFoundError(`event not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(res, StatusCodes.OK, "event data", { Event:data,TicketDetails:ticketType });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};


const getAllEvent = async (req, res) => {
  try {
    const desiredData = req.body.reqData;
    let data;

    if(desiredData == 'created'){
        data = await Event.find({isCreated: true}).populate('organizer');
    }else {
        if(desiredData == 'not-created'){
            data = await Event.find({isCreated: false}).populate('organizer');
        }else{
            data = await Event.find({}).populate('organizer');
        }
    }
     
    const resData = []
    for(i=0; i< data.length ;i++){
      const ticketTypeData = await TicketType.find({'Event':data[i].id})
      resData.push({
        event:data[i],
        ticketType:ticketTypeData
      })
    }
    if (!data) {
      throw new CustomError.NotFoundError(`event not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(res, StatusCodes.OK, "event data", { eventData:resData });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

const markEventCreated = async (req, res) =>{
    if(!req.body.eventID){
        console.log(2);
        throw new CustomError.NotFoundError(`please provide event Id!!`);
      }
      try {
        const data = await Event.findByIdAndUpdate(req.body.eventID, {isCreated: true})
        responseHandler.sendResponse(res, StatusCodes.OK, "event marked as created", {data});

          
      } catch (error) {
        throw new CustomError.NotFoundError(err.message);
      }
}

const getAllEventByUser = async (req, res) => {
  try {
    const id = new ObjectId(req.body.userId);
    console.log(id);
    console.log(ObjectId.isValid(id));
    if( !ObjectId.isValid(id) ){
      throw new CustomError.NotFoundError(`Provide valid user Id`);
    }
    const data = await Event.find({creator: req.body.userId}, null, {sort: {endDate: 1}}).populate('organizer');

    const resData = []
    for(i=0; i< data.length ;i++){
      const ticketTypeData = await TicketType.find({'Event':data[i].id})
      resData.push({
        event:data[i],
        ticketType:ticketTypeData
      })
    }

    if (!data) {
      throw new CustomError.NotFoundError(`event not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(res, StatusCodes.OK, "event data", { eventData:resData });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};


module.exports = { createEvent, getAllEvent, getEventbyId, getAllEventByUser,markEventCreated};
