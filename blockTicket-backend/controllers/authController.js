const User = require("../models/User");
const Token = require("../models/Token");
const firebase = require("firebase-admin");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require("../responseHandler/sendResponse");
const {
  createTokenPayload,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  createJWT,
  createLimitedTimeToken,
  createWalletAddressPayload,
} = require("../utils");
const crypto = require("crypto");
const Web3 = require("web3");
const { isError } = require("util");
const { decryptMsg } = require("../utils/cryptoGraphy");
var web3 = new Web3();
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { email, username, password, walletAddress, phoneNumber } = req.body;

    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    } else if (!username) {
      throw new CustomError.BadRequestError("Please provide the username");
    } else if (!password) {
      throw new CustomError.BadRequestError("Please provide the password");
    } else if (!phoneNumber) {
      throw new CustomError.BadRequestError("Please provide the phonenumber");
    }

    const emailAlreadyExists = await User.findOne({
      email: new RegExp(`^${email}$`, "i"),
    });
    console.log("emailAlreadyExists", emailAlreadyExists);
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError(
        "This email is already registered!"
      );
    }

    const walletAlreadyExists = await User.findOne({
      wallets: walletAddress,
    });
    if (walletAlreadyExists) {
      throw new CustomError.BadRequestError(
        "User already exists with this wallet"
      );
    }

    let userType = 1,
      wallets = [],
      nonce = null;
    if (walletAddress) {
      userType = 2;
      wallets.push(walletAddress);
      const randomString = crypto.randomBytes(10).toString("hex");
      const verifyNonce = await createHash(randomString);
      nonce = verifyNonce;
    }
    const verificationToken = crypto.randomBytes(40).toString("hex");

    let createObj = {
      username,
      email,
      password,
      userType,
      verificationToken,
      wallets,
      nonce,
      phoneNumber,
    };

    const user = await User.create(createObj);
    const origin = process.env.FRONTEND_ORIGIN;

    await sendVerificationEmail({
      name: user.username,
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });
    // send verification token back only while testing in postman!!
    // res.status(StatusCodes.CREATED).json({
    //   msg: "Success! Please check your email to verify account",
    // });
    responseHandler.sendResponse(
      res,
      StatusCodes.CREATED,
      "Success! Please check your email to verify account",
      {}
    );
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

//Api to resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    } 
    
    console.log("resenverfy",new RegExp(`^${email}$`, "i"))
    const user = await User.findOne({
      email: new RegExp(`^${email}$`, "i"),
    });
    const origin = process.env.FRONTEND_ORIGIN;

    await sendVerificationEmail({
      name: user.username,
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });
    // send verification token back only while testing in postman!!
    // res.status(StatusCodes.CREATED).json({
    //   msg: "Success! Please check your email to verify account",
    // });
    responseHandler.sendResponse(
      res,
      StatusCodes.CREATED,
      "Success! Please check your email to verify account",
      {}
    );
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

// should be for script
const createAccountScript = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    } else if (!username) {
      throw new CustomError.BadRequestError("Please provide the username");
    }

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      let user = emailAlreadyExists;
      const tokenUser = createTokenPayload(user);

      // check for existing token
      const existingToken = await Token.findOne({ user: user._id });

      if (existingToken) {
        await Token.findOneAndDelete({ user: user._id });
      }

      const token = createJWT({ payload: tokenUser });
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const userToken = { token, ip, userAgent, user: user._id };

      await Token.create(userToken);

      //res.status(StatusCodes.OK).json({ accessToken: token });
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "successfully loggedIn",
        {
          accessToken: token,
          user: {
            userId: user.id,
            username: user.username,
            email: user.email,
            userType: user?.userType,
            isVerified: user.isVerified,
            wallets: user.wallets,
            phoneNumber: user.phoneNumber,
            profilePic: user.profilePic,
            isAdmin: user.isAdmin,
            role: user.role,
            isVerifiedCreator: user.isVerifiedCreator,
          },
        }
      );
    }

    let userType = 1,
      nonce = null;

    const verificationToken = crypto.randomBytes(40).toString("hex");
    const randomPass = crypto.randomBytes(10).toString("hex");

    let createObj = {
      username,
      email,
      password: randomPass,
      userType,
      verificationToken,
      nonce,
      isVerified: true,
    };

    const user = await User.create(createObj);
    const origin = process.env.FRONTEND_ORIGIN;

    responseHandler.sendResponse(res, StatusCodes.CREATED, "Account Created", {
      user,
      password: randomPass,
    });
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

// Register users through the Eo url

const registerUser = async (req, res) => {
  try {
    let { email, firstName, lastName, phoneNo, gender, password, yob } =
      req.body;

    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    } else if (!password) {
      throw new CustomError.BadRequestError("Please provide password");
    }

    const users = await User.find({ identifier: false, systemGenerated: true });
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    await User.updateOne(
      { email: users[0].email },
      {
        firstName,
        lastName,
        email,
        username: email,
        password,
        phoneNumber: phoneNo,
        gender,
        yob,
        identifier: true,
      }
    );

    const user = await User.findOne({ email: email });

    responseHandler.sendResponse(res, StatusCodes.CREATED, {
      token: user.verificationToken,
    });
  } catch (e) {
    console.log(e);
    throw new CustomError.BadRequestError(e.message);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError.UnauthenticatedError("Invalid Email");
    }

    if (user.verificationToken === "") {
      throw new CustomError.UnauthenticatedError("User already verified");
    }

    if (user.verificationToken !== verificationToken) {
      throw new CustomError.UnauthenticatedError("Invalid verification token");
    }

    (user.isVerified = true), (user.verified = Date.now());
    user.verificationToken = "";

    await user.save();

    //res.status(StatusCodes.OK).json({ msg: "Email Successfully Verified" });
    responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "Email Successfully Verified",
      {}
    );
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const loginSystem = async (req, res) => {
  try {
    const { systemToken } = req.body;

    const user = await User.findOne({
      verificationToken: systemToken,
      systemGenerated: true,
      identifier: true,
    });
    if (!user) {
      throw new CustomError.UnauthenticatedError("User not valid");
    }
    const tokenUser = createTokenPayload(user);
    const existingToken = await Token.findOne({ user: user._id });
    if (existingToken) {
      await Token.findOneAndDelete({ user: user._id });
    }
    const token = createJWT({ payload: tokenUser });
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { token, ip, userAgent, user: user._id };
    await Token.create(userToken);
    responseHandler.sendResponse(res, StatusCodes.OK, "successfully loggedIn", {
      accessToken: token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        userType: user?.userType,
        isVerified: user.isVerified,
        wallets: user.wallets,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin,
        role: user.role,
        isVerifiedCreator: user.isVerifiedCreator,
        facebookLink: user.facebookLink,
        twitterLink: user.twitterLink,
        instagramLink: user.instagramLink,
      },
    });
  } catch (e) {
    console.log(e);
    throw new CustomError.BadRequestError(e.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, walletAddress, signature } = req.body;
    if (walletAddress && !email && !password) {
      if (signature) {
        let user;
        user = await User.findOne({
          wallets: walletAddress.toLowerCase(),
        });
        const signatureAddress = await web3.eth.accounts.recover(
          `I am signing my one-time nonce: ${user.nonce}`,
          signature
        );
        if (walletAddress.toLowerCase() === signatureAddress.toLowerCase()) {
          const tokenUser = createWalletAddressPayload(
            user,
            walletAddress.toLowerCase()
          );

          // check for existing token
          const existingToken = await Token.findOne({
            user: user._id,
          });
          // console.log('4')

          if (existingToken) {
            await Token.findOneAndDelete({ user: user._id });
          }

          const token = createJWT({ payload: tokenUser });
          const userAgent = req.headers["user-agent"];
          const ip = req.ip;
          const userToken = { token, ip, userAgent, user: user._id };

          await Token.create(userToken);

          let a = Math.random();
          a = String(a);
          a = a.substring(2, 6);
          user.nonce = a;

          await user.save();

          //res.status(StatusCodes.OK).json({ accessToken: token });
          responseHandler.sendResponse(
            res,
            StatusCodes.OK,
            "successfully loggedIn",
            {
              accessToken: token,
              user: {
                userId: user.id,
                username: user.username,
                email: user.email,
                userType: user?.userType,
                isVerified: user.isVerified,
                wallets: user.wallets,
                phoneNumber: user.phoneNumber,
                profilePic: user.profilePic,
                isAdmin: user.isAdmin,
                role: user.role,
                isVerifiedCreator: user.isVerifiedCreator,
                should_reset: user.should_reset,
              },
            }
          );
        } else {
          throw new CustomError.BadRequestError(
            "Invalid Signature. Please try again..!"
          );
        }
      } else {
        throw new CustomError.BadRequestError("Please provide the signature.");
      }
    } else {
      if (!email) {
        throw new CustomError.BadRequestError("Please provide an email.");
      } else if (!password) {
        throw new CustomError.BadRequestError("Please enter the password");
      }

      const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

      if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
      }

      const isPasswordCorrect = await user.comparePassword(password);
      // const isPasswordCorrect = true;

      if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
      }

      if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError("Please verify your email");
      }

      const tokenUser = createTokenPayload(user);

      // check for existing token
      const existingToken = await Token.findOne({ user: user._id });

      if (existingToken) {
        await Token.findOneAndDelete({ user: user._id });
      }

      const token = createJWT({ payload: tokenUser });
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const userToken = { token, ip, userAgent, user: user._id };

      await Token.create(userToken);

      //res.status(StatusCodes.OK).json({ accessToken: token });
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "successfully loggedIn",
        {
          accessToken: token,
          user: {
            userId: user.id,
            username: user.username,
            email: user.email,
            userType: user?.userType,
            isVerified: user.isVerified,
            wallets: user.wallets,
            phoneNumber: user.phoneNumber,
            profilePic: user.profilePic,
            isAdmin: user.isAdmin,
            role: user.role,
            isVerifiedCreator: user.isVerifiedCreator,
            facebookLink: user.facebookLink,
            twitterLink: user.twitterLink,
            instagramLink: user.instagramLink,
            should_reset: user.should_reset,
          },
        }
      );
    }
  } catch (e) {
    console.log(e);
    throw new CustomError.BadRequestError(
      `${e.message}, If error persists please reset your password.`
    );
  }
};

const socialLogin = async (req, res) => {
  try {
    // idToken comes from the client app
    // idToken comes from the client app
    const idToken = req.headers["authorization"];

    const decodedToken = await firebase
      .auth()
      .verifyIdToken(idToken.split(" ")[1]);
    const email = decodedToken.email;
    const provider = decodedToken.firebase.sign_in_provider;
    const user = await User.findOne({ email });
    if (user) {
      if (provider == "facebook.com") {
        await createFbUser(decodedToken, user);
        const updatedUser = await User.findOne({ email });
        await generateToken(req, res, updatedUser);
      } else if (provider == "google.com") {
        await createGoogleUser(decodedToken, user);
        const updatedUser = await User.findOne({ email });
        await generateToken(req, res, updatedUser);
      }
    } else {
      if (provider == "facebook.com") {
        await createFbUser(decodedToken, new User());
        const updatedUser = await User.findOne({ email });
        await generateToken(req, res, updatedUser);
      } else if (provider == "google.com") {
        await createGoogleUser(decodedToken, new User());
        const updatedUser = await User.findOne({ email });
        await generateToken(req, res, updatedUser);
      }
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const phoneLogin = async (req, res) => {
  try {
    // idToken comes from the client app
    const idToken = req.headers["authorization"];

    const decodedToken = await firebase
      .auth()
      .verifyIdToken(idToken.split(" ")[1]);
    const phoneNumber = decodedToken.phone_number;
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (user) {
      await generateToken(req, res, user);
    } else {
      responseHandler.sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        "This phone number is not registered",
        {}
      );
    }
  } catch (err) {
    console.log("err", err);
  }
};

const createFbUser = async (decodedToken, newUser) => {
  try {
    let userType = 1,
      wallets = [],
      nonce = null;
    if (newUser.wallets.length > 0) {
      userType = 2;
      wallets = newUser.wallets;
      const randomString = crypto.randomBytes(10).toString("hex");
      const verifyNonce = createHash(randomString);
      nonce = verifyNonce;
    }

    newUser.facebook.id = decodedToken.uid;
    newUser.facebook.email = decodedToken.email;
    newUser.facebook.name = decodedToken.name;
    if (!newUser.email) {
      newUser.email = decodedToken.email;
    }
    newUser.userType = userType;
    newUser.wallets = wallets;
    newUser.nonce = nonce;
    newUser.isVerified = true;
    await newUser.save();
  } catch (err) {
    console.log(err);
  }
};
const createGoogleUser = async (decodedToken, newUser) => {
  try {
    let userType = 1,
      wallets = [],
      nonce = null;
    if (newUser.wallets.length > 0) {
      userType = 2;
      wallets = newUser.wallets;
      const randomString = crypto.randomBytes(10).toString("hex");
      const verifyNonce = createHash(randomString);
      nonce = verifyNonce;
    }
    newUser.google.id = decodedToken.uid;
    newUser.google.email = decodedToken.email;
    newUser.google.name = decodedToken.name;
    if (!newUser.email) {
      newUser.email = decodedToken.email;
    }
    newUser.userType = userType;
    newUser.wallets = wallets;
    newUser.nonce = nonce;
    newUser.isVerified = true;
    await newUser.save();
  } catch (err) {
    console.log(err);
  }
};

const generateToken = async (req, res, user) => {
  try {
    const tokenUser = createTokenPayload(user);
    // check for existing token
    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
      await Token.findOneAndDelete({ user: user._id });
    }

    const token = createJWT({ payload: tokenUser });
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { token, ip, userAgent, user: user._id };

    await Token.create(userToken);
    responseHandler.sendResponse(res, StatusCodes.OK, "successfully loggedIn", {
      accessToken: token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        userType: user?.userType,
        isVerified: user.isVerified,
        wallets: user.wallets,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin,
        role: user.role,
        isVerifiedCreator: user.isVerifiedCreator,
        facebookLink: user.facebookLink,
        twitterLink: user.twitterLink,
        instagramLink: user.instagramLink,
        should_reset: user.should_reset,
      },
    });
  } catch (e) {}
};

const logout = async (req, res) => {
  try {
    await Token.findOneAndDelete({ user: req.user.userId });
    // res.status(StatusCodes.OK).json({ msg: "User logged out!" });
    responseHandler.sendResponse(res, StatusCodes.OK, "User logged out!", {});
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError("Please provide valid email");
    }

    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

    if (user) {
      const passwordToken = crypto.randomBytes(70).toString("hex");
      // send email

      // const origin = process.env.FRONTEND_ORIGIN;
      const origin = req.headers.origin;
      await sendResetPasswordEmail({
        name: user.username,
        email: user.email,
        token: passwordToken,
        origin,
      });
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();

      // res
      //   .status(StatusCodes.OK)
      //   .json({ msg: "Please check your email for reset password link" });
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "Please check your email for reset password link",
        {}
      );
    } else {
      // res.status(StatusCodes.OK).json({ msg: "Invalid User" });
      responseHandler.sendResponse(res, StatusCodes.OK, "Invalid User", {});
    }
  } catch (e) {
    console.log("E ", e);
    throw new CustomError.BadRequestError(e.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    } else if (!password) {
      throw new CustomError.BadRequestError("Please provide the password");
    } else if (!token) {
      throw new CustomError.BadRequestError("Please provide the token");
    }

    let user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

    if (user) {
      const currentDate = new Date();

      let newPassword = "";
      if (!user?.password) {
        user.password = password;
        await user.save();
      }
      user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

      if (
        user.passwordToken === createHash(token) &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
      }

      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "Password has been successfully updated",
        {}
      );
    } else {
      // res.status(StatusCodes.OK).json({ msg: "Invalid User" });
      responseHandler.sendResponse(res, StatusCodes.OK, "Invalid User", {});
    }
  } catch (e) {
    console.log("e: ", e);
    throw new CustomError.BadRequestError(e.message);
  }
};

const accountAmend = async (req, res) => {
  try {
    const allAcc = await User.find({ systemGenerated: true, identifier: true });
    const newIte = [];
    for (const item of allAcc) {
      if (item?.password?.length < 30) {
        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(item.password, salt);
        item.password = newPass;
        await item.save();
      }
    }

    // await allAcc.save()
    res.status(200).json({ items: newIte.length, accounts: newIte });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

module.exports = {
  register,
  login,
  loginSystem,
  socialLogin,
  phoneLogin,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  createAccountScript,
  accountAmend,
  registerUser,
  resendVerificationEmail,
};
