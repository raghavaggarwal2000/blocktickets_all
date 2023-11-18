const mongoose = require("mongoose");
const UserDetails = require("./UserDetails");
const validator = require("validator");
const Events = require("./Events");
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({

    UserDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails"
    },

    phoneNumber: {
        type: String,
        // unique:[true, "Phone Number exist"]
    },

    email:{
        type: String,
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email",
        },
    },

    password: {
        type: String,
        minlength: [6, "Password minimum length should be of 6 digits"],
    },

    //  for password reset
    passwordToken: {
        type: String,
    },
      passwordTokenExpirationDate: {
        type: Date,
    },

    // for verification
    verificationToken: {
        type: String
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
        type: String,
        enum: ["Customer", "Organiser", "Admin"],
        default: "Customer"
        // enum: [0, 1, 2], //0- Normal User & 1- Event Organiser 2- Super admin
        // default: 0,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    google:{
        id: String,
        email: String,
        name: String,
    },
    wallets: {
        type: [],
    },
    nonce: {
        type: String
    },

    savedEvents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Events"
    },

    // when email is generated from ots
    systemGenerated: {
        type: Boolean,
        default: false,
    },

    otp:{
        type: Number
    },
    active: Boolean,






    // ########################## Delete the keys below after shifted to prod as they are in userDetails
    bio : {
        type : String
    },

    instagramLink : {
        type : String
    },

    twitterLink : {
        type : String
    },

    facebookLink : {
        type: String,
    },

    dob : {
      type : Date
    },

    verifiedOn : {
        type : String
    },

    gender : {
        type : String
    },

    address : {
        type : String
    },

    landmark : {
        type : String
    },

    state : {
        type : String
    },
    
    city : {
        type : String
    },

    country  : { 
        type : String
    },
    
    pcode : {
        type : String
    },

    // ######################## permanently delete this keys after shifted to prod
    yob :Number,
    bgPic: String,
    userType: Number,
    username: String,
    isAdmin: Boolean,
    identifier: Boolean,
    isVerifiedCreator: Boolean,
    should_reset: Boolean,
    facebook: {
        id: String,
        email: String,
        name: String,
      },
    email_0: String

}, {timestamps : true});

UserSchema.pre("save", async function(){
    if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* Not using password feature
UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
}; */


module.exports = mongoose.model("User", UserSchema);