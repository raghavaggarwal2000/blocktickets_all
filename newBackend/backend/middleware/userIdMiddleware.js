const User = require("../models/User")
const StatusCodes = require("http-status-codes");

const getUserById = async (req,res,next,id) => {
    try{
        const user = await User.findById(id);
        if(!user){
          return res.status(StatusCodes.NOT_FOUND).json({err: "User Not found"});
        }

        user.password = undefined;
        user.verificationToken = undefined;

        req.user = user;
        next();
      }
      catch(err){
        return res.status(StatusCodes.NOT_FOUND).json({err: err.message});
      }
}

module.exports = {
    getUserById
}