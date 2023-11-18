const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Event = require("../models/Event");
const Ticket = require("../models/TicketType");
const responseHandler = require('../responseHandler/sendResponse');
const SearchKeyword = require("../models/SearchKeyword");

module.exports.searchController = async (req, res) => {
  try {
    let response = await Event.find({
      $or: [
        { eventTitle: { $regex: req.query.key, $options: "i" } },
        { eventType: { $regex: req.query.key, $options: "i" } },
        {'location':{ $regex: req.query.key,$options: 'i'} },
      ],
      $and: [
        {isPublic: true}
      ]
    });

    const keywordResponse = await SearchKeyword.find({keyword:req.query.key});
    if(keywordResponse.length === 0){
      console.log(req.query.key.length)
      if(req.query.key.length > 4){
      const obj = {
        keyword: req.query.key,
        count: 1
      }
     const objSchema = SearchKeyword(obj)
     await objSchema.save()
    }
    }else{
      await SearchKeyword.findByIdAndUpdate(keywordResponse[0]._id,{count:keywordResponse[0].count + 1})
    }
   
    let refreshResponse = []
    console.log('in search bef tik 1');
    for(i=0; i < response.length; i++){
     let tik =  await Ticket.find({'Event': response[i]._id})
     refreshResponse.push({event: response[i], ticket: tik})
     console.log(tik.length);
     
    }
   // console.log(refreshResponse);
    responseHandler.sendResponse(res, StatusCodes.OK, 'get ticket',{refreshResponse});
  } catch (err) {
    throw new CustomError.NotFoundError(err.message);
  }
};

module.exports.searchKeywordController = async (req, res) => {
  try {
    const keywordResponse = await SearchKeyword.aggregate([
      {$sort:{count:-1}},
      {$project:{keyword:1}}
    ]).limit(10);
    console.log(keywordResponse)
        //res.status(StatusCodes.OK).json({ response });
    responseHandler.sendResponse(res, StatusCodes.OK, 'get keyword',{keywordResponse});
  } catch (err) {
    throw new CustomError.NotFoundError(`somthing wrong!!`);
  }
};