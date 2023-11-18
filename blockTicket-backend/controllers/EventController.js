const Ticket = require("../models/Tickets");
const AddOn = require("../models/AddOn");
const User = require("../models/User");
const Event = require("../models/Event");
const Artist = require("../models/Artist");
const TicketType = require("../models/TicketType");
var ObjectId = require("mongoose").Types.ObjectId;
const TicketLocked = require("../models/TicketLock");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require("../responseHandler/sendResponse");
const Compress = require("../utils/compress-image");
const Organizer = require("../models/Organizer");
const axios = require("axios");
const { timezoneAdjust } = require("../utils/helpers");

const createEvent = async (req, res) => {
  const data = req.body;
  let totalTicket = 0;
  // return console.log(data);
  try {
    const organizerObject = {
      experienceLevel: data.experienceLevel.value,
      teamSize: data.teamSize.value,
      eventType: data.eventType.value,
      organizerName: data.organizerName,
      aboutOrganizer: data.organiserDescription,
      referral: data.referral.value,
      frequency: data?.frequency,
      category: data.category.value,
      logoOriginal: data?.Logo?.s3,
      logoCompress: data?.Logo?.s3,
      user: req.user.userId,
      peopleAttended: data.peopleAttended,
      numOfEvents: data.numOfEvents.value,
    };

    if (data.nftId == "") {
      throw new CustomError.NotFoundError(`Event not created on polygon`);
    }
    //find organiser
    // const organizerFind = await Organizer.findOne({user: req.user.userId});
    let organizerObj, peopleAttendedorganizeResponse;
    // if(!organizerFind) {
    organizerObj = Organizer(organizerObject);
    organizeResponse = await organizerObj.save();
    const artistObj = {
      name: data.artistName,
      about: data.aboutPerformer,
      image: data["Artist image"]?.s3,
    };
    let artistObjMongo = Artist(artistObj);
    let createArtist = await artistObjMongo.save();
    const timezone = data?.timezone;
    let startDateTime = timezoneAdjust(
      timezone,
      data?.startDateTime || new Date()
    );
    console.log(data?.startDateTime, "startDateTime: ", startDateTime);
    let endDateTime = timezoneAdjust(timezone, data?.endDateTime);
    console.log(data?.endDateTime, "endDateTime: ", endDateTime);

    const eventObject = {
      eventTitle: data.eventTitle,
      eventDescription: data.eventDescription,
      eventType: data.eventType.value,
      creator: req.user.userId,
      artist: createArtist._id,
      eventImageCompress: data["Event Banner Image"]?.s3,
      eventImageOriginal: data["Event Banner Image"]?.pinata?.pin_image,
      eventSquareImage: data["Event Square Banner Image"]?.s3,
      seatingImage: data["Seating image"]?.s3,
      uri: data["Event Banner Image"].pinata?.tokenUri,
      eventNftId: data.eventId,
      organizer: organizeResponse._id,
      startDate: startDateTime.date,
      endDate: endDateTime.date,
      startTime: startDateTime.time,
      endTime: endDateTime.time,
      location: data.eventVenue,
      organizerWalletAddress: data.organizerWalletAddress,
      freeWifi: data.freeWifi.value,
      valeParking: data.valeParking.value,
      ageRequirement: data.ageRequirement.value,
      dressCode: data.dressCode.value,
      foodAndBeverage: data.foodAndBeverage.value,
      alcoholicDrink: data.alcoholicDrink.value,
      eventVenueLink: data.eventVenueLink,
      eventVideo: data["Event video"]?.s3,
      timezone: timezone,
    };

    const eventObj = Event(eventObject);
    const eventResponse = await eventObj.save();

    if (!eventResponse) {
      throw new CustomError.NotFoundError(`event not created`);
    }

    let ticketCreatedArray = [];
    let LockedArray = [];
    const tickets = data.tickets;
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (data.tickets[i].nftId == "") {
        throw new CustomError.NotFoundError(`Event not created on Polygon`);
      }
      const colorArr = [
        "redDark",
        "red",
        "silver",
        "gold",
        "platinum",
        "black",
      ];

      const saleStartDateTime = timezoneAdjust(
        timezone,
        ticket.saleStartDateTime
      );
      const saleEndDateTime = timezoneAdjust(timezone, ticket.saleEndDateTime);
      const ticketStartDateTime = timezoneAdjust(
        timezone,
        ticket.ticketStartDateTime
      );
      const ticketEndDateTime = timezoneAdjust(
        timezone,
        ticket.ticketEndDateTime
      );
      const basePrice = Number(ticket.ticketPrice)
      let gst_base = 0;
      if(basePrice >= 500){
        gst_base = basePrice * 0.18;
      }
      const bt_fee = (gst_base + basePrice) * 0.05;
      const gst_bt_fee = bt_fee * 0.18;
      const ticketObject = {
        ticketName: ticket.ticketName,
        ticketQuantity: ticket.ticketQuantity,
        basePrice: basePrice,
        price: Math.round((Number(basePrice) + Number(gst_base) + Number(bt_fee) + Number(gst_bt_fee)).toFixed(2)),
        undiscountedPrice: ticket.undiscountedPrice, // in percent
        displayPrice: ticket.undiscountedPrice
          ? Math.round(Number(ticket.ticketPrice).toFixed(2))
          : 0,
        uri: ticket?.uri,
        ticketDisplayOrder: i,
        ticketNftId: ticket.nftId,
        Event: eventResponse._id,
        startDate: saleStartDateTime.date,
        endDate: saleEndDateTime.date,
        startTime: saleStartDateTime.time,
        endTime: saleEndDateTime.time,
        // event dates
        ticketEventStartDate: ticketStartDateTime.date,
        ticketEventStartTime: ticketStartDateTime.time,
        ticketEventEndDate: ticketEndDateTime.date,
        ticketEventEndTime: ticketEndDateTime.time,
        currency: ticket?.currency?.value,
        ticketCategory: ticket.ticketCategory,
        ticketInfo: ticket.ticketInfo,
        image: ticket.image || "",
        maticPrice: ticket?.maticPrice,
        flag: ticket?.flag?.value,
        ticketSponsorImage: ticket?.ticketSponsorImage,
        color: colorArr[i % 6],
      };
      const ticketObj = TicketType(ticketObject);
      const ticketResponse = await ticketObj.save();

      if (!ticketResponse) {
        await Event.findByIdAndDelete(eventResponse.id);
        for (j = 0; j < ticketCreatedArray.length; j++) {
          await TicketType.findByIdAndDelete(ticketCreatedArray[j].id);
        }
        throw new CustomError.NotFoundError(`Tickets not created`);
      } else {
        for (let j = 0; j < ticket?.addOns?.length; j++) {
          const addOnObj = ticket.addOns[j];
          if (addOnObj.addOnName != "") {
            addOnObj.ticketId = ticketResponse._id;
            addOnObj.Event = eventResponse._id;
            const obj = AddOn(addOnObj);
            await obj.save();
          }
        }
      }

      const ticketLockedObj = TicketLocked({
        ticketId: ticketResponse._id,
        ticketQuantity: ticket.ticketQuantity,
      });
      const ticketLockedResponse = await ticketLockedObj.save();
      if (!ticketLockedResponse) {
        for (j = 0; j < LockedArray.length; j++) {
          await TicketLocked.findByIdAndDelete(LockedArray[j].id);
        }
        throw new CustomError.NotFoundError(`ticket not locked!!`);
      }

      totalTicket = Number(totalTicket) + Number(ticket.ticketQuantity);
      ticketCreatedArray.push(ticketResponse);
      LockedArray.push(ticketLockedResponse);
    }

    await Event.findByIdAndUpdate(eventResponse.id, {
      totalTicket: totalTicket,
    });

    const eventDataRes = await Event.findById(eventResponse.id).populate(
      "organizer"
    );
    const ticketTypeRes = await TicketType.find({
      Event: eventResponse.id,
    });

    //res.status(StatusCodes.OK).send("create event");
    responseHandler.sendResponse(res, StatusCodes.OK, "create event", {
      Event: eventDataRes,
      TicketDetails: ticketTypeRes,
    });
  } catch (err) {
    console.log(err, "error");
    throw new CustomError.NotFoundError(err.message);
  }
};

const getEventbyId = async (req, res) => {
  try {
    const userId = req.body?.userId || "";
    if (!req.body.eventId) {
      throw new CustomError.NotFoundError(`please provide event Id!!`);
    }
    const data = await Event.findById(req.body.eventId)
      .populate("organizer")
      .populate("artist");
    const ticketType = await TicketType.find({ Event: req.body.eventId });
    for (let it of ticketType) {
      const addOn = await AddOn.find({ ticketId: it._id });
      it._doc["addon"] = addOn;
    }
    if (!data) {
      throw new CustomError.NotFoundError(`event not found`);
    }

    let savedEvents = null;
    if (userId) {
      const query = {
        _id: ObjectId(userId),
        savedEvents: { $in: [req.body.eventId] },
      };
      savedEvents = await User.findOne(query).select("savedEvents");
    }
    let freeTickets = [];
    if (req?.query?.userId) {
      freeTickets = await Ticket.find({
        Event: ObjectId(req.body.eventId),
        "generated._from": "admin.blocktickets.io",
      })
        .sort({ createdAt: -1 })
        .populate("ticketType")
        .populate({
          path: "user",
          select: "email firstName lastName",
        });
      freeTickets = freeTickets.reduce((uniqueObjects, currentObject) => {
        const foundObject = uniqueObjects.find(
          (object) =>
            object?.generated?._bundle_id ===
            currentObject?.generated?._bundle_id
        );
        if (!foundObject) {
          uniqueObjects.push({
            generated: currentObject?.generated,
            ticketType: currentObject?.ticketType,
            user: {
              email: currentObject?.user?.email,
              firstName: currentObject?.user?.firstName,
              lastName: currentObject?.user?.lastName,
            },
            price: currentObject?.prices?.paidPrice
            ? currentObject?.prices?.paidPrice 
            : currentObject?.price,
            count: 1,
            couponCode: currentObject?.couponCode,
            createdAt: currentObject?.createdAt,
          });
        } else {
          foundObject.count++;
        }
        return uniqueObjects;
      }, []);
    }
    let eventExpired = false;
    let end;
    if (data?.startDate.getDate() === data?.endDate.getDate()) {
      end = data?.endDate;
      end.setHours(23, 59, 59, 999);
      const currDate = new Date().getTime();
      eventExpired = new Date(end).getTime() <= currDate ? true : false;
    } else {
      end = new Date(data?.endDate).getTime();
      const currDate = new Date().getTime();
      eventExpired = end <= currDate ? true : false;
    }
    responseHandler.sendResponse(res, StatusCodes.OK, "event data", {
      Event: data,
      TicketDetails: ticketType,
      freeTickets: freeTickets ? freeTickets : [],
      saved: savedEvents?._id ? true : false,
      end,
      eventExpired,
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

const getAllEvent = async (req, res) => {
  try {
    let page = 1;
    let limit = 30;
    let filter = req.query.filter;
    let obj = {
      isPublic: true,
      isVerified: true,
    };
    let pastObj = {};
    console.log(new Date().toISOString());
    if (filter == "latest") {
      obj = { ...obj, endDate: { $gte: new Date().toISOString() } };
      pastObj = {
        isPublic: true,
        isVerified: true,
        dummy: false,
        endDate: { $lte: new Date().toISOString() },
      };
    }
    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    if (req.query.type) {
      page = parseInt(req.query.page);
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const data = await Event.find(obj)
      .sort({ startDate: -1 })
      .populate("organizer");
    let pastEvents = [];
    if (Object.keys(pastObj).length > 0)
      pastEvents = await Event.find(pastObj)
        .select("eventSquareImage eventTitle")
        .sort({ startDate: -1 });
    const bannerImages = await Event.find({ show_on_banner: true })
      .sort({ createdAt: -1 })
      .select("eventImageOriginal eventImageCompress eventTitle")
      .sort({ startDate: -1 });
    const resData = [];
    for (i = 0; i < data.length; i++) {
      // const ticketTypeData = await TicketType.find({ Event: data[i].id });
      resData.push({
        event: data[i],
        // ticketType: ticketTypeData,
      });
    }
    if (!data) {
      throw new CustomError.NotFoundError(`event not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(res, StatusCodes.OK, "event data", {
      eventData: resData,
      pastEvents: pastEvents,
      bannerImages: bannerImages ? bannerImages : [],
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};
const getCurrentEvents = async (req, res) => {
  try {
    const eventData = await Event.find({
      $or: [
        {
          startDate: {
            $gte: new Date(),
            $lt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 12),
          },
        },
        {
          startDate: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2),
            $lt: new Date(),
          },
        },
      ],
    });

    res.status(200).json({
      data: eventData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const getAllEventByUser = async (req, res) => {
  try {
    const id = new ObjectId(req.body.userId);
    console.log(id);
    console.log(ObjectId.isValid(id));
    if (!ObjectId.isValid(id)) {
      throw new CustomError.NotFoundError(`Provide valid user Id`);
    }
    const data = await Event.find({ creator: req.body.userId }, null, {
      sort: { endDate: 1 },
    }).populate("organizer");

    const resData = [];
    for (i = 0; i < data.length; i++) {
      const ticketTypeData = await TicketType.find({ Event: data[i].id });
      resData.push({
        event: data[i],
        ticketType: ticketTypeData,
      });
    }

    if (!data) {
      throw new CustomError.NotFoundError(`event not found`);
    }
    //res.status(StatusCodes.OK).json({ data });
    responseHandler.sendResponse(res, StatusCodes.OK, "event data", {
      eventData: resData,
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

const getAllEventUserBoughtTickets = async (req, res) => {
  try {
    const id = new ObjectId(req.user.userId);
    if (!ObjectId.isValid(id)) {
      throw new CustomError.NotFoundError(`Provide valid user Id`);
    }
    const data = await Ticket.find(
      { user: id },
      {
        sort: { endDate: 1 },
      }
    ).populate("Event");

    let resData = data.map((it) => it.Event);
    resData = [...new Set(resData)];
    resData = resData.filter((it) => it !== null);

    const getArrayOfSavedEvents = await User.findOne({ _id: id }).select(
      "savedEvents"
    );
    let savedEvents = [];
    console.log("getArrayOfSavedEvents", getArrayOfSavedEvents);
    if (
      getArrayOfSavedEvents?._id &&
      getArrayOfSavedEvents?.savedEvents?.length > 0
    ) {
      const query = {
        _id: { $in: getArrayOfSavedEvents?.savedEvents },
      };
      console.log(getArrayOfSavedEvents?.savedEvents);
      savedEvents = await Event.find(query);
    }

    if (!data) {
      throw new CustomError.NotFoundError(`event not found`);
    }
    responseHandler.sendResponse(res, StatusCodes.OK, "event data", {
      eventData: resData,
      savedEvents,
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

const getAllEvents = async (req, res) => {
  let { page, limit, filter, eventType, userType, filterTypes } = req.query;
  try {
    let skip = (parseInt(page) - 1) * limit;
    let events;
    let totalCount;
    // Event organizer will only see his events

    if (req.profile.role === 1) {
      let searchType = {
        $or: [{ creator: req.profile._id }, { organizer: req.profile._id }],
      };
      if (eventType.trim() === "eventsByRevenue" || filterTypes === "real") {
        searchType = { ...searchType, dummy: false };
      }
      if (filterTypes === "dummy") searchType = { dummy: true };
      totalCount = await Event.count(searchType);
      events = await Event.find(searchType).skip(skip).limit(limit);
    } else if (req.profile.role === 2) {
      let searchType = {};
      if (eventType.trim() === "eventsByRevenue" || filterTypes === "real")
        searchType = { dummy: false };

      if (filterTypes === "dummy") searchType = { dummy: true };
      totalCount = await Event.count(searchType);
      events = await Event.find(searchType).sort({ startDate: -1 });
    }
    return responseHandler.sendResponse(res, StatusCodes.OK, "events data", {
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
      },
      eventData: events,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const updateEventData = async (req, res) => {
  const { eventId } = req.params;
  const eventUpdationData = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      eventUpdationData,
      { new: true }
    );
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "event updated",
      updatedEvent
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};
const updateArtistData = async (req, res) => {
  const { artistId } = req.params;
  const eventUpdationData = req.body;
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      eventUpdationData,
      { new: true }
    );
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "artist updated",
      updatedArtist
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const updateOrganizerData = async (req, res) => {
  const { organizerId } = req.params;
  const organizerUpdationData = req.body;
  try {
    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      organizerId,
      organizerUpdationData,
      { new: true }
    );
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "organizer updated",
      updatedOrganizer
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const updateEventImage = async (req, res) => {
  const { eventId } = req.params;
  const { imageType, s3 } = req.body;
  console.log("update api", req.body);
  try {
    // const eventImageId = await Compress(req.user.userId, req.user.logoImage);
    const eventImageObj =
      imageType === "eventImageOriginal"
        ? {
            eventImageOriginal: req.body.image,
            eventImageCompress: s3,
            uri: req.body.uri,
          }
        : imageType === "seatingImage"
        ? {
            seatingImage: s3,
          }
        : {
            eventSquareImage: s3,
          };

    const eventUpdateRes = await Event.findByIdAndUpdate(
      eventId,
      eventImageObj,
      { new: true }
    );
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "event Image updated",
      eventUpdateRes
    );
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const updateArtistImage = async (req, res) => {
  const { artistId } = req.params;
  const { s3 } = req.body;

  try {
    // const eventImageId = await Compress(req.user.userId, req.user.logoImage);
    const updateObj = {
      image: s3,
    };

    const eventUpdateRes = await Artist.findByIdAndUpdate(artistId, updateObj, {
      new: true,
    });
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "artist Image updated",
      eventUpdateRes
    );
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const updateOrganizerImage = async (req, res) => {
  const { organizerId } = req.params;
  const { s3 } = req.body;

  try {
    // const eventImageId = await Compress(req.user.userId, req.user.logoImage);
    const updateObj = {
      logoOriginal: req.body.image,
      logoCompress: s3,
    };

    const eventUpdateRes = await Organizer.findByIdAndUpdate(
      organizerId,
      updateObj,
      { new: true }
    );
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "organizer Image updated",
      eventUpdateRes
    );
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const getLatestEvent = async (req, res) => {
  try {
    // const eventImageId = await Compress(req.user.userId, req.user.logoImage);
    const getLatestEvent = await Event.findOne({ isPublic: true })
      .sort({
        createdAt: -1,
      })
      .populate("organizer")
      .limit(1);
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "Latest Event",
      getLatestEvent
    );
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const saveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.user;
    const filter = {
      _id: ObjectId(userId),
      savedEvents: { $ne: ObjectId(eventId) },
    };
    const update = {
      $addToSet: {
        savedEvents: { $each: [ObjectId(eventId)], $ne: ObjectId(eventId) },
      },
    };
    const result = await User.findOneAndUpdate(filter, update);
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "schema not found" });
    }
    return res.send({ message: "id added successfully" });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("Could not save event!");
  }
};
const unsaveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.user;
    const filter = {
      _id: ObjectId(userId),
    };
    const update = {
      $pull: { savedEvents: ObjectId(eventId) },
    };
    const result = await User.findOneAndUpdate(filter, update);
    console.log("result");
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "schema not found" });
    }
    return res.send({ message: "id removed successfully" });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("Could not save event!");
  }
};
const updateSponsorImage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticketUpdateRes = await TicketType.findByIdAndUpdate(
      ticketId,
      { ticketSponsorImage: req.body.image },
      { new: true }
    );
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "event Image updated",
      ticketUpdateRes
    );
  } catch (err) {
    res.status(500).send("Could not save image!");
  }
};
module.exports = {
  createEvent,
  getAllEvent,
  getEventbyId,
  getAllEventByUser,
  getAllEventUserBoughtTickets,
  getAllEvents,
  getAllEvents,
  updateEventData,
  updateArtistData,
  updateOrganizerData,
  updateEventImage,
  updateArtistImage,
  updateOrganizerImage,
  getLatestEvent,
  saveEvent,
  unsaveEvent,
  updateSponsorImage,
  getCurrentEvents,
};
