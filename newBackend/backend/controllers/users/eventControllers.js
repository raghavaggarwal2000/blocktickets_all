const Event = require("../../models/Events");
const TicketType = require("../../models/TicketType")
const responseHandler = require("../../responseHandler/sendResponse");
const StatusCodes = require("http-status-codes")
const { uploadFile, timezoneIST } = require("../../utils");
const CustomError = require("../../errors")

// Home page Controllers :
const allBanner = async (req, res) => {
    // let eventImageOriginal = [];
    // let eventMobileImage = [];
    // let slug = []
    try{
        const obj = {
            show_on_banner: true,
            isPublic: true,
            isVerified: true,
            endDate: {$gt : new Date().toISOString().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})},
        };

        const eventData = await Event.find(obj)
        .sort({startDate : 1})
        .select("eventImageOriginal eventMobileImage slug");
        
        // eventData.forEach((event) => {
        //     eventMobileImage.push(event["eventMobileImage"])
        //     eventImageOriginal.push(event["eventImageOriginal"])
        //     slug.push(event["slug"])
        // })
        

        responseHandler.sendResponse(res, StatusCodes.OK,"Hero Banner", eventData);

    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.NOT_FOUND, "Data not found", err.message);

    }
}

const getUpcomingEvent = async (req, res) =>{
        //startDate, eventTitle, location, Price, imageMobile, imageCompress --> new UI
        // startDate, eventImageCompress, eventMobileImage, title, location. --> old UI
        // displayPrice from ticketsTypes.

    // let startDate= [];
    // let eventSquareImage = [];
    // let eventTitle = [];
    // let location = [];
    // let slug = [];
    // let displayPrice = [];

    try {
        const obj = {
        isPublic : true,
        isVerified : true,
        endDate: {$gt : timezoneIST(new Date())},
        }

        var upcomingEvent = await Event.find(obj)
        .sort({startDate : 1})
        .select("startDate eventSquareImage eventTitle location slug displayPrice");
        
        // let data = JSON.parse(JSON.stringify(upcomingEvent)) //to allow merging two referencing table e.g Event and ticketTypes
        
        for(let i = 0; i <upcomingEvent.length; i++){
            var ticket= await TicketType.find({Event : upcomingEvent[i]._id, visible : "VISIBLE"}).select("displayPrice");
            upcomingEvent[i]["displayPrice"] = ticket[0].displayPrice //to assign(updating) displayPrice key and its corresponding value.
        }
        
        

        // upcomingEvent.forEach((item) => {
        //     startDate.push(item.startDate);
        //     eventSquareImage.push(item.eventSquareImage);
        //     eventTitle.push(item.eventTitle);
        //     location.push(item.location);
        //     slug.push(item.slug);
        //     displayPrice.push(item.displayPrice);
        // })       

        responseHandler.sendResponse(res, StatusCodes.OK, "Upcoming Events", upcomingEvent)

    }catch(err){

        console.log(err) 
        responseHandler.sendResponse(res, StatusCodes.NOT_FOUND, "Data Not Found", err.message)

    }
}

const getPastEvent = async (req, res) => {
            //eventImageCompress, eventTitle, startDate
    // let eventTitle = [];
    // let eventSquareImage = [];
    // let startDate = [];
    try{
        const obj = {
            isPublic : true,
            isVerified : true,
            endDate : {$lt : timezoneIST(new Date())}
        }

    const pastEvents = await Event.find()
    .sort({endDate : -1})
    .select("eventTitle eventSquareImage startDate")

    // pastEvents.forEach((item) => {
    //     eventTitle.push(item.eventTitle);
    //     eventSquareImage.push(item.eventSquareImage);
    //     startDate.push(item.startDate);
    // })
    
    responseHandler.sendResponse(res,StatusCodes.OK, "Past Events", pastEvents)

    }catch(err){
        
        console.log(err)
        responseHandler.sendResponse(res, StatusCodes.NOT_FOUND, "Data Not Found", err.message)
    }
}

const getEventDetail = async (req, res) => {
    try{
        const eventdetails = await Event.find({slug : req.params.slug})
        .select("eventTitle location slug startDate endDate")
        
        responseHandler.sendResponse(res, StatusCodes.OK, "Event Details", eventdetails)

    }catch(err){

        console.log(err)
        responseHandler.sendResponse(res, StatusCodes.NOT_FOUND, "Data Not Found", err.message)
    }
}


const uploadImageS3 = async(req, res) =>{
    try{    
        if(typeof req.file === "undefined"){
            throw new CustomError.BadRequestError("File Not found");
        }
        const data = await uploadFile(req.file);

        responseHandler.sendResponse(res, StatusCodes.CREATED, "Image uploaded on AWS successfully", data.Location);
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.BAD_REQUEST, err.message, {});
    }
};


module.exports = { 
    allBanner,
    getUpcomingEvent,
    getPastEvent,
    uploadImageS3,
    getEventDetail,
}
