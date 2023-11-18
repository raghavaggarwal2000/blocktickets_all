const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // minlength: 2,
      // maxlength: 50
    },
    lastName: {
      type: String,
      // minlength: 2,
      // maxlength: 50
    },
    profilePic: {
      type: String,
    },
    bgPic: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: Number,
      enum: [0, 1, 2], //0- Normal User & 1- Event Organiser 2- Super admin
      default: 0,
    },
    username: {
      type: String,
      minlength: [3, "Username should have at least 3 characters"],
      maxlength: [50, "Username cannot have more than 50 characters"],
    },
    bio: {
      type: String,
    },
    facebookLink: {
      type: String,
    },
    instagramLink: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    email: {
      type: String,
      unique: [true, "Email has already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    email_0: {
      type: String,
      unique: [true, "Email has already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password minimum length should be of 6 digits"],
    },
    facebook: {
      id: String,
      email: String,
      name: String,
    },
    google: {
      id: String,
      email: String,
      name: String,
    },
    // should be deprecated
    // userType: {
    //   type: Number,
    //   enum: [1, 2], //1- Non Crypto & 2- Crypto User
    //   default: 1,
    // },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedOn: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    wallets: {
      type: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: String,
    },
    dob: {
      type: Date,
    },
    yob: {
      type: Number,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    landmark: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pcode: {
      type: String,
    },
    nonce: String,
    isVerifiedCreator: {
      type: Boolean,
      default: false,
    },
    systemGenerated: {
      type: Boolean,
      default: false,
    },
    identifier: {
      type: Boolean,
    },

    savedEvents: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    should_reset: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
