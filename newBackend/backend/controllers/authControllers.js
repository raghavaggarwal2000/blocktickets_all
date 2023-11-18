const User = require("../models/User");
const UserDetails = require("../models/UserDetails");
const Token = require("../models/Token");
const responseHandler = require("../responseHandler/sendResponse");
const {createJwtPayload, createJwtToken, verifyJwtToken, generateOTP } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");



const login = async (req, res) =>{
    try{
        const {phoneNumber} = req.body; //login via phone number.
        if(!phoneNumber){
            throw new CustomError.BadRequestError("Please provide with a phone Number");
        }

        const user = await User.findOne({phoneNumber: phoneNumber}); //find phone in the db.
        if(user === null || user.active === false){ //if exists or not.
            throw new CustomError.BadRequestError("Phone Number doesn't exist");
        }

        const otp = generateOTP(); 

        await User.findByIdAndUpdate(user._id, {otp: otp}); //search for registered user and update otp.

        // code for sending otp to be written here

        /* Not using password feature
        const result = await user.comparePassword(password);

        if(!result){
            throw new CustomError.BadRequestError("Password is wrong");
        }*/


        
        responseHandler.sendResponse(res, StatusCodes.OK, "OTP Send Successfully",{
            phoneNumber: phoneNumber,
        })
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.NOT_FOUND, err.message, {err: err})
    }
};


const signup = async (req, res) =>{
    try{
        const{
            firstName,
            lastName,
            phoneNumber,
            email
        } = req.body;
        
        if(typeof firstName === "undefined")
            throw new CustomError.BadRequestError("Please Enter First Name");

        if(typeof lastName === "undefined")
            throw new CustomError.BadRequestError("Please Enter Last Name");
 
        if(typeof phoneNumber === "undefined")
            throw new CustomError.BadRequestError("Please Enter Phone Number");

        const checkUser = await User.findOne({phoneNumber: phoneNumber}); 
        //check by phone number.
        if(checkUser !== null && checkUser.active === true){
            throw new CustomError.BadRequestError("This user already Exists");
        }else if(checkUser !== null && checkUser.active === false){
            await User.findOneAndUpdate({phoneNumber},{
                $set:{"otp":generateOTP()}
            });
        }else{
        
            const userDetailsCreate = UserDetails();
            const userDetailsSave = await userDetailsCreate.save();

            const obj = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                active: false,
                // UserDetails: userDetailsSave._id,
                otp: generateOTP() //otp generate for sign up.
            }
            console.log(obj);
            const createUser = User(obj)
            await createUser.save();
        
        }
        responseHandler.sendResponse(res, StatusCodes.CREATED, "OTP send Successful", {
            phoneNumber: phoneNumber
        });
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.NOT_ACCEPTABLE, err.message, err);
    }
}


const validateOTP = async (req, res) =>{
    try{
        const {
            phoneNumber, 
            otp
        } = req.body; //takes phone number and otp from the request.
        if(!phoneNumber){
            throw new CustomError.BadRequestError("Please provide with a Phone Number");
        }
        if(!otp){
            throw new CustomError.BadRequestError("Please Provide with an OTP");
        }
        let user = await User.findOne({phoneNumber: phoneNumber});
        if(user === null){
            throw new CustomError.BadRequestError("Phone Number doesn't exist");
        }

        if(otp !== user.otp){ //check the existing OTP present which was created during signup.
            throw new CustomError.BadRequestError("Wrong OTP");
        }

        user = await User.findByIdAndUpdate(user._id, {active: true, otp: ""});//if otp and phone number matches; set active true and delete the otp


        const payload = createJwtPayload(user);//payload consists of db data.
        const token = createJwtToken(payload);//jwt token created for a particular user.

        const tokenSchemaData = await Token.findOne({userId: user._id}); 
        console.log(tokenSchemaData)
        let obj = {
            token: token,
            ip: req.socket.remoteAddress, //fetch remote address of the server containing PORT, address.
            userAgent: req.get('User-Agent'),
        }
        if(tokenSchemaData){
            await Token.findOneAndUpdate({userId: user._id},
                obj,
                {new: true});
        }else{
            obj = {
                ...obj,
                userId:user._id
            };
            const tokenSave = Token(obj);
            await tokenSave.save();
        }


        res.cookie("authToken", token,{
            httpOnly: true, //accessed by web server
            secure: true, //https only
            sameSite: 'strict', //cross site            
            maxAge: 6* 60 * 60 * 1000 // 6 hours
        })

        responseHandler.sendResponse(res, StatusCodes.OK, "Successful", {
            user:{
                _id: user._id,
                email: user.email,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }
    catch(err){
        console.log(err);
        responseHandler.sendError(res, StatusCodes.NOT_ACCEPTABLE, err.message, err);
    }
}

const googleSignIn = async(req, res) => {
    console.log("inside google...")
    // console.log(req.body);
    try{
        const {
            uid,
            name,
            phoneNumber,
            email
        } = req.body;

        let user = await User.findOne({email}); 

        if(user === null){ //user does not exist.
            const details = await UserDetails().save(); //generates Object Id for User Details.

            const userObj = User({
                UserDetails: details._id,
                email,
                phoneNumber,
                firstName: name.split(" ")[0],
                lastName: name.split(" ")[1],
                active: false,
                google:{
                    id: uid,
                    name: name,
                    email: email
                }
            })
            console.log("not data" , userObj);
             user = await userObj.save(); //overriding let variable.
            console.log("here we are", user._id);
            responseHandler.sendResponse(res, StatusCodes.OK, "Phone Number Required",{
                _id: user._id,
                email: user.email,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName
            })
          }
        // else if(user.phoneNumber === "" || user.phoneNumber === null){
        //         // console.log(" ARM", user);
        //         const userData = {

        //             _id : user._id,
        //             email : user.email,
        //             firstName : user.firstName,
                    // phoneNumber: user.phoneNumber,
        //             lastName : user.lastName
        //         }
        //         console.log("ARM", userData);
        //         responseHandler.sendResponse(res, StatusCodes.Ok, "Phone Number Required", userData);

        
            // }
        else{
                responseHandler.sendResponse(res, StatusCodes.OK, "Login Successfull", { _id: user._id,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    firstName: user.firstName,
                    lastName: user.lastName})
            }
        
        // if(user.phoneNumber === "" || user.phoneNumber === null){

        //     responseHandler.sendResponse(res, StatusCodes.NOT_FOUND, "Phone Number Required", { _id: user._id,
        //         email: user.email,
        //         // phoneNumber: user.phoneNumber,
        //         firstName: user.firstName,
        //         lastName: user.lastName})
        // }else{
            // responseHandler.sendResponse(res, StatusCodes.OK, "Login Successfull", { _id: user._id,
            //     email: user.email,
            //     phoneNumber: user.phoneNumber,
            //     firstName: user.firstName,
            //     lastName: user.lastName})
        // }

       
    }
    catch(err){
        console.log(err)
        responseHandler.sendError(res, StatusCodes.NOT_IMPLEMENTED, err.message, err);
    }


}



const logout = async (req, res) =>{
    try{
        res.cookie("authToken", "", {maxAge:1});
        responseHandler.sendResponse(res, StatusCodes.OK, "Logout Successfully", {});
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.NOT_ACCEPTABLE, err.message, err);
    }
}


module.exports = {
    login,
    signup,
    validateOTP,
    logout,
    googleSignIn
};