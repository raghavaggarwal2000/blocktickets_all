const {verifyJwtToken} = require("../utils")
const StatusCodes = require("http-status-codes")    


// To authenticate Token
const authenticateToken = (req, res, next) =>{
    const token = req.cookies.authToken;
    if(token){
        const payload = verifyJwtToken(token);
        if(!payload){
            return res.status(StatusCodes.UNAUTHORIZED)
                .json({err: "Invalid token"})
        }
        req.tokenPayload = payload;
        return next();
    }else{
        return res.status(StatusCodes.UNAUTHORIZED)
        .json({err: "User not logged in"})
    }
};

// to check whether the user is having same token id as send from url
const authenticateUserId = (req, res, next) =>{
    if(!(req.tokenPayload.userId.toString() === req.user._id.toString())){
        return res.status(StatusCodes.UNAUTHORIZED).json({err: "Invalid User"});
    }
    return next();
};

// to authenticate whether the user is admin, organiser
const authenticateRoles = (roles) =>{
    return (req,res,next) => {
        if(roles.includes(req.user.role))
            next();
        else{
            res.status(StatusCodes.UNAUTHORIZED).json({err: "Access not provided"})
        }
    }
}

module.exports = {
    authenticateToken,
    authenticateUserId,
    authenticateRoles
}