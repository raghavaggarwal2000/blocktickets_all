const User = require("../../models/User")
const UserDetails = require("../../models/UserDetails");
const StatusCodes = require("http-status-codes");
const responseHandler = require("../../responseHandler/sendResponse");


const getProfile = async (req, res) =>{
    try{
        const user = await User.findById(req.tokenPayload.userId)
        .populate("UserDetails")
        .select("-password -passwordToken -passwordTokenExpirationDate -verificationToken -google -otp -active -nonce -systemGenerated")
        
        responseHandler.sendResponse(res, StatusCodes.OK, "Profile Info", user);
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.NOT_MODIFIED, err.message, err);
    }
}

const editProfile = async (req, res) =>{
    try{
        const {
            bio,
            instagramLink,
            twitterLink,
            facebookLink,
            dob,
            verifiedOn,
            gender,
            address,
            landmark,
            state,
            city,
            country ,    
            pinCode,
            firstName,
            lastName
        } = req.body;

        const users = await User.findById(req.tokenPayload.userId).populate("UserDetails");

        await UserDetails.findByIdAndUpdate(users.UserDetails, {
            $set:{
                bio: bio || users.UserDetails.bio,
                instagramLink: instagramLink || users.UserDetails.instagramLink,
                twitterLink: twitterLink || users.UserDetails.twitterLink,
                facebookLink: facebookLink || users.UserDetails.facebookLink,
                dob: dob || users.UserDetails.dob,
                verifiedOn: verifiedOn || users.UserDetails.verifiedOn,
                gender: gender || users.UserDetails.gender,
                address: address || users.UserDetails.address,
                landmark: landmark || users.UserDetails.landmark,
                state: state || users.UserDetails.state,
                city: city || users.UserDetails.city,
                country:   country || users.UserDetails.country,
                pinCode: pinCode || users.UserDetails.pinCode
            }
        });
        console.log(lastName);
        const data = await User.findByIdAndUpdate(req.tokenPayload.userId, {
            $set:{
                firstName: firstName,
                lastName: lastName
            }
        }, { new: true });

        responseHandler.sendResponse(res, StatusCodes.OK, "Edited successfully",{
             _id: data._id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName
        })
    }
    catch(err){
        responseHandler.sendError(res, StatusCodes.NOT_MODIFIED, err.message, err);
    }
}

module.exports = {
    getProfile,
    editProfile
}