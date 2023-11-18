const Event = require("../../models/Events");
const Artist = require("../../models/Artist");
const TicketType = require("../../models/TicketType");
const Backing = require("../../models/Backing");
const Organizer = require("../../models/Organiser");
const EventDetails = require("../../models/EventDetails")

const {StatusCodes} = require("http-status-codes");
const responseHandler = require("../../responseHandler/sendResponse");
const { timezoneIST, displayPrice, displayPriceFNB} = require("../../utils/index")
var slug = require('slug');


const createEvent = async (req, res) => {
    try{
        
        const data = req.body;

    //function to uniquely generate slug after creating event.
        const generateslug = async (eventTitle) => {
            let title = slug(eventTitle);
            let uniqueslugstring = "";
            let getevent = await Event.find().select("slug");

            for(let i=0; i < getevent.length; i++){
                if(getevent[i].slug === title){
                uniqueslugstring = slug(title + "-" + Math.random().toString(36).slice(2,6))
                }
            } 
            if(uniqueslugstring !== ""){
                //  console.log("uniqueslug", uniqueslugstring)
                return uniqueslugstring
            }else{
                //  console.log("slugify", title)
                return title
            }  

        }

        //About Performers
        const artistObj = {
            name : data?.name,
            about : data?.about,
            image : data?.image  //from s3
        }
    
        const artist =  Artist(artistObj)
        const artistResponse = await artist.save(); //saving into db.
        if(!artistResponse){
            throw new Error("Event not created");
        }
        console.log("Artist Details saved successfully.")
        
        
        //organiser details             
        const organiserObj = {
            organiserName : data?.organiserName,
            aboutOrganiser : data?.aboutOrganiser,
            teamSize : data?.teamSize,
            experienceLevel : data?.experienceLevel,
            numOfEvents : data?.numOfEvents,
            peopleAttended : data?.peopleAttended,
            referral : data?.referral,
            logoOriginal : data?.logoOriginal

        }
        // console.log(organiserDetails)

        const organiserDetails = Organizer(organiserObj)
        const organiserResponse = await organiserDetails.save();


        if(!organiserResponse){
            await Artist.findByIdAndDelete(artistResponse._id);
            throw new Error("Event not created");
        }

        console.log("Saved Successfully...")



        //About Event Details
        const eventDetailObj = {
            ageRequirement : data?.ageRequirement,
            valeParking : data?.valeParking,
            dressCode : data?.dressCode,
            freeWifi : data?.freeWifi,
            alcoholicDrink : data?.alcoholicDrink,
            foodAndBeverage : data?.foodAndBeverage
        }

        const eventdetail = EventDetails(eventDetailObj);        
        const eventDetailResponse = await eventdetail.save(); //saving into db

        
        console.log("Event detail saved successfully");
        
        const returnslug = await generateslug(data?.eventTitle) //function call to generate slug
        // Object.assign(eventObj, {"slug" : returnslug})

        const eventObj = {
                eventDetails: eventDetailResponse?._id,
                artist: artistResponse._id,
                organiser: organiserResponse._id,
                eventTitle : data?.eventTitle,
                location : data?.location,
                eventVenueLink : data?.eventVenueLink,
                startDate : timezoneIST(data?.startDate),
                startTime : data?.startTime,
                endDate : timezoneIST(data?.endDate),
                endTime : data?.endTime,
                eventType : data?.eventType,
                eventImageOriginal : data?.eventImageOriginal,
                eventSquareImage : data?.eventSquaryImage,
                seatingImage : data?.seatingImage,
                // timezone : data.timezone,
                fees : data?.fees,
                slug: returnslug,
                eventMobileImage: data?.eventMobileImage
        }
        console.log(eventObj);


        const event = Event(eventObj); //returns promise
        const eventResponse = await event.save(); //saving into db

        if(!eventResponse){
            throw new Error("Event not created");
        }
        
        console.log("Event saved successfully.");
        
        
        // TicketType

        const tickets = data.tickets;
        let createdTickets = [];
        let totalTicket = 0;
        for(let i = 0; i< tickets.length; ++i){
            const ticket = tickets[i];
            if (tickets[i].nftId == "") {
                throw new CustomError.NotFoundError(`Event not created on Polygon`);
            }

            const displayBasePrice = displayPrice(ticket?.basePrice, data.fees.platform_fee);
            const displayBaseFnbPrice = displayPriceFNB(ticket?.basePriceFNB, data.fees.platform_fee);
            
            const ticketObj = {
                Event:eventResponse._id,
                ticketName: ticket.ticketName,
                ticketQuantity: ticket.ticketQuantity,
                basePrice: ticket?.basePrice,
                basePriceFNB: ticket?.basePriceFNB,
                strikeOffPrice: ticket?.strikeOffPrice,
                displayPrice: Math.round(Number(displayBasePrice.totalBasePrice) + Number(displayBaseFnbPrice.totalFnbPrice)),
                advancePercentage: ticket?.advancePercentage,
                startDate: timezoneIST(ticket?.saleStartDateTime),
                endDate: timezoneIST(ticket?.saleEndDateTime),
                ticketEventStartDate: timezoneIST(ticket?.ticketStartDateTime),
                ticketEventEndDate: timezoneIST(ticket?.ticketEndDateTime),
                ticketCategory: ticket?.ticketCategory,
                ticketInfo: ticket?.ticketInfo,
                maticPrice: ticket?.maticPrice,
                flag: ticket?.flag,
                color: ticket?.color,
                currency: ticket?.currency,
            }
            totalTicket += ticket.ticketQuantity
            const ticketSave = TicketType(ticketObj);
            const ticketResponse = await ticketSave.save();

            if(!ticketResponse){
                await Event.findByIdAndDelete(eventResponse._id);
                for(let j = 0; j< createdTickets.length; ++j){
                    await TicketType.findByIdAndDelete(createdTickets[j]._id);
                }
                throw new Error("Event Not Created");
            }
            
            createdTickets.push(ticketResponse);

        }

        await Event.findByIdAndUpdate(eventResponse._id, {
            $set:{ totalTicket : totalTicket}
        });


        responseHandler.sendResponse(res, StatusCodes.CREATED, "Event created", {
            artist: artistResponse,
            event: eventResponse,
            organiser: organiserResponse,
            eventDetails: eventDetailResponse,
            ticketType: createdTickets
        })
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.NOT_ACCEPTABLE, err.message, err);
    }
    
    
    
    
    







}

module.exports = {
    createEvent
}