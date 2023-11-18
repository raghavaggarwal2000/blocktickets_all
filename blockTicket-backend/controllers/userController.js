const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenPayload } = require("../utils");
const Web3 = require("web3");
var web3 = new Web3();
const responseHandler = require("../responseHandler/sendResponse");
const Compress = require("../utils/compress-image");
const Organizer = require("../models/Organizer");
const Ticket = require("../models/Tickets");
var ObjectId = require("mongoose").Types.ObjectId;
const SubscribeEmail = require("../models/SubscribeEmail");
const IgnoreList = require("../models/IgnoreList");
const bcrypt = require("bcryptjs");
var ipLocation = require("ip-location");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  // res.status(StatusCodes.OK).json({ users });
  responseHandler.sendResponse(res, StatusCodes.OK, "all users", { users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  // res.status(StatusCodes.OK).json({ user });
  responseHandler.sendResponse(res, StatusCodes.OK, " users", { user });
};

const getUserNonceByAddress = async (req, res) => {
  const walletAddress = req.body.publicAddress.toLowerCase();
  const checkAddress = await web3.utils.isAddress(walletAddress);
  console.log(walletAddress, checkAddress);
  if (checkAddress) {
    const user = await User.findOne({ wallets: walletAddress });
    console.log(user);

    if (user) {
      if (user.nonce != null) {
        // res
        // .status(StatusCodes.OK)
        // .json({ walletAddress: walletAddress, nonce: user.nonce });
        responseHandler.sendResponse(res, StatusCodes.OK, "user nonce", {
          walletAddress: walletAddress,
          nonce: user.nonce,
        });
      } else {
        throw new CustomError.BadRequestError("Blockchain Address not set");
      }
    } else {
      //   const randomString = crypto.randomBytes(10).toString("hex");
      //   const verifyNonce = await createHash(randomString);

      //   const wallets = [walletAddress];
      //   let createObj = {
      //     wallets,
      //     nonce: verifyNonce,
      //   };
      //   const newUser = await User.create(createObj);
      //   res
      //     .status(StatusCodes.CREATED)
      //     .json({ walletAddress: walletAddress, nonce: newUser.nonce });
      throw new CustomError.BadRequestError(
        "Add address to your account before login."
      );
    }
  } else {
    throw new CustomError.BadRequestError("Invalid Wallet Address");
  }
};

// register address
const addAddress = async (req, res) => {
  const walletAddress = req.body.publicAddress.toLowerCase();

  const checkAddress = await web3.utils.isAddress(walletAddress);
  if (checkAddress) {
    const user = await User.findById(req.user.userId);
    console.log(req.user.userId);
    console.log(user);
    if (!user) {
      throw new CustomError.BadRequestError("user does not exist");
    }
    const duplicate = await User.findOne({ wallets: walletAddress });
    console.log(req.user.userId);
    console.log(user);
    console.log(12345);
    const w = user.wallets;
    console.log(54321);

    if (duplicate)
      throw new CustomError.BadRequestError("address already exist");
    if (user) {
      const wallets = [...w, walletAddress];
      let a = Math.random();
      a = String(a);
      a = a.substring(2, 6);
      user.nonce = a;
      user.wallets = wallets;

      await user.save();
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "address successfully added",
        {}
      );
    } else {
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "Please add valid address",
        {}
      );
    }
  } else {
    throw new CustomError.BadRequestError("Invalid Wallet Address");
  }
};

// remove address
const removeAddress = async (req, res) => {
  const walletAddress = req.body.publicAddress.toLowerCase();

  const checkAddress = await web3.utils.isAddress(walletAddress);
  if (checkAddress) {
    const user = await User.findById(req.user.userId);
    const duplicate = await User.findOne({ wallets: walletAddress });
    const w = user.wallets;

    if (!duplicate)
      throw new CustomError.BadRequestError("address is not linked to you");

    console.log(user._id);
    console.log(duplicate._id);
    console.log(user.id == duplicate.id);

    if (user.id != duplicate.id) {
      throw new CustomError.BadRequestError(
        "address you are requesting to remove is not linked to your account"
      );
    }

    if (user) {
      const wallets = user.wallets;
      let index = wallets.indexOf(walletAddress);
      if (index == -1) {
        throw new CustomError.BadRequestError("address is not linked to you");
      }
      wallets.splice(index, 1);
      user.wallets = wallets;

      await user.save();
      responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "address successfully removed",
        {}
      );
    } else {
      responseHandler.sendResponse(res, 400, "Please add valid address", {});
    }
  } else {
    throw new CustomError.BadRequestError("Invalid Wallet Address");
  }
};

const showCurrentUser = async (req, res) => {
  // res.status(StatusCodes.OK).json({ user: req.user });
  responseHandler.sendResponse(res, StatusCodes.OK, "current users", {
    user: req.user,
  });
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "bio",
    "facebookLink",
    "twitterLink",
    "instagramLink",
    "phoneNumber",
    "dob",
    "gender",
    "address",
    "landmark",
    "country",
    "state",
    "city",
    "pcode",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    throw new CustomError.BadRequestError("invalid data");
  }
  try {
    updates.forEach(async (update) => {
      if (update === "phoneNumber") {
        const mobile = await User.findOne({
          phoneNumber: req.body.phoneNumber,
        });
        if (mobile) {
          throw new CustomError.BadRequestError("phonenumber already exist");
        }
      }
      user[update] = req.body[update];
    });
    console.log("before", user);
    await user.save();
    const updatedUser = await User.findById(req.user.userId);
    updatedUser.password = undefined;
    updatedUser.verificationToken = undefined;
    responseHandler.sendResponse(res, StatusCodes.OK, "profile updated", {
      updatedUser,
    });
  } catch (e) {
    throw new CustomError.BadRequestError(e.message);
  }
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }  
  const user = await User.findOne({ email: email });

  const isPasswordCorrect = await user.comparePassword(oldPassword.trim());
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid old password");
  }
  user.password = newPassword;
  user.should_reset = false;

  await user.save();
  //res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
  responseHandler.sendResponse(
    res,
    StatusCodes.OK,
    "Success! Password Updated.",
    {}
  );
};
function separateEvents(events) {
  console.log("events: ", events);
  let future_events = [];
  let past_events = [];
  let distinct_future_events = new Set();
  let distinct_past_events = new Set();
  let nearest_future_event;
  const current_date = new Date();
  let nearest_date = new Date();
  nearest_date.setFullYear(9999); //set a distant future date

  for (let event of events) {
    const event_date = new Date(event.startDate);
    if (event_date > current_date) {
      if (!distinct_future_events.has(event.Event)) {
        future_events.push(event);
        distinct_future_events.add(event.Event);
        if (event_date < nearest_date) {
          nearest_date = event_date;
          nearest_future_event = event;
        }
      }
    } else {
      if (!distinct_past_events.has(event.Event)) {
        past_events.push(event);
        distinct_past_events.add(event.Event);
      }
    }
  }

  return {
    distinctFutureEventsCount: distinct_future_events.size,
    distinctPastEventsCount: distinct_past_events.size,
    nearest_future_event,
  };
}
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const data = await Ticket.find(
      { user: req.user.userId },
      {
        sort: { endDate: 1 },
      }
    ).populate("Event");
    let resData = data.map((it) => {
      return { Event: it?.Event?._id, startDate: it?.Event?.startDate };
    });
    resData = separateEvents(resData);
    console.log("resData: ", resData);

    user.password = undefined;
    user.verificationToken = undefined;
    responseHandler.sendResponse(res, StatusCodes.OK, "Profile", {
      user,
      past: resData?.distinctPastEventsCount || 0,
      futureEventOn: resData?.nearest_future_event || "",
    });
  } catch (err) {
    console.log("err ", err);
    responseHandler.sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Profile",
      {}
    );
  }
};

// add profile pic
const addImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const user = await User.findById(req.user.userId);
    user.profilePic = imageUrl;
    await user.save();
    responseHandler.sendResponse(res, StatusCodes.OK, "profile pic added ", {
      url: imageUrl,
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

const addBackgroundImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const user = await User.findById(req.user.userId);
    user.bgPic = imageUrl;
    await user.save();
    responseHandler.sendResponse(res, StatusCodes.OK, "bg pic added ", {
      url: imageUrl,
    });
  } catch (err) {
    console.log(err);
    throw new CustomError.NotFoundError(err.message);
  }
};

// Parameter extractor for userid
const getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    } else {
      user.password = undefined;
      user.verificationToken = undefined;
      req.profile = user;
      next();
    }
  } catch (error) {
    throw new CustomError.NotFoundError(err.message);
  }
};

// Api to get user by email from user collection
const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.userEmail });
    if (user) {
      return responseHandler.sendResponse(
        res,
        StatusCodes.OK,
        "user found",
        user
      );
    }
  } catch (error) {
    throw new CustomError.NotFoundError(err.message);
  }
};

// Api to edit user by email in user collection
const editUserByEmail = async (req, res) => {
  try {
    const { userId, username, email, phoneNumber, password } = req.body;
    const userDetails = await User.findOne({ _id: userId });
    if (userDetails.isVerified) return;
    const user = await User.updateOne(
      { _id: userId },
      {
        $set: {
          username: username,
          email: email,
          phoneNumber: phoneNumber,
        },
      },
      {
        upsert: false,
      }
    );
    user
      ? responseHandler.sendResponse(res, StatusCodes.OK, "user found", user)
      : responseHandler.sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          "user NOT found",
          user
        );
  } catch (error) {
    throw new CustomError.NotFoundError(err.message);
  }
};

const allUsers = async (req, res) => {
  const { page, limit } = req.query;
  const { email } = req.params;
  console.log("email ", email);
  try {
    const skip = (parseInt(page) - 1) * limit;

    if (req.profile.role < 2) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "ACCESS DENIED" });
    }
    const totalCount = await User.count({ role: { $lt: 2 } });
    const users = await User.find({ role: { $lt: 2 } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return responseHandler.sendResponse(res, StatusCodes.OK, "all users", {
      meta: { page: parseInt(page), limit: parseInt(limit), total: totalCount },
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

const assignUserRole = async (req, res) => {
  // This route is only accessible for superadmin
  if (req.profile.role < 2)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "ACCESS DENIED" });

  const { userId, role } = req.body;

  if (!(0 <= role <= 1)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "role can be 1 or 0" });
  }

  try {
    const user = await User.findById(userId);
    console.log(user);
    const isSameRole = user.role === role;
    if (isSameRole)
      return res.status(400).json({ error: "This role is already assigned !" });
    const isSuperAdmin = user.role === 2;
    if (isSuperAdmin) return res.status(400).json({ error: "Not allowed" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    if (role === 0) {
      const deletedUser = await Organizer.findOneAndDelete({ user: userId });
      console.log(userId, deletedUser);
    } else if (role === 1) {
      const newOrganizer = new Organizer({ user: userId });
      const savedNewOrganizer = await newOrganizer.save();
    }
    return responseHandler.sendResponse(
      res,
      StatusCodes.OK,
      "user role updated",
      updatedUser
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const findEmail = await SubscribeEmail.findOne({ email });
    if (findEmail?._id) {
      return res.status(400).send("This email is already registered");
    }
    const subscribe = await SubscribeEmail.create({ email });

    res.status(200).send("Email subscription successful");
  } catch (err) {
    res.status(500).send();
  }
};

const ignoreUserList = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const skip = (parseInt(page) - 1) * limit;

    const ignoredData = await IgnoreList.find({}).skip(skip).limit(limit);
    const totalCount = await IgnoreList.find({}).count();

    res.status(200).send({
      ignoredData,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({});
  }
};
const addToIgnore = async (req, res) => {
  try {
    const { ignoreEmail } = req.body;
    // find user exists
    const findUser = await User.findOne({ email: ignoreEmail }).select(
      "_id email"
    );

    const Exists = await IgnoreList.findOne({ ignoredUser: ignoreEmail });
    if (Exists?.ignoredUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    let ignore_obj = { ignoredUser: ignoreEmail };
    if (findUser?._id) {
      ignore_obj = { ...ignore_obj, userId: findUser?._id };
    }
    const updateIgnoreList = await IgnoreList.create(ignore_obj);
    console.log("updateIgnoreList: ", updateIgnoreList);
    res.status(200).json({ msg: "Updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({});
  }
};
const userLocation = async (req, res) => {
  try {
    console.log("req: ", req);
    const { ip } = req.params;
    // const data = await ipLocation("github.com");
    console.log("data: ", data);
    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    res.status(500).send(err?.message);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getUserNonceByAddress,
  addAddress,
  removeAddress,
  addImage,
  addBackgroundImage,
  getMyProfile,
  getUserById,
  getUserByEmail,
  allUsers,
  assignUserRole,
  subscribeEmail,
  ignoreUserList,
  addToIgnore,
  userLocation,
  editUserByEmail,
};
