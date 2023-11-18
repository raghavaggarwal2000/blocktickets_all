const User = require("../models/User");
const Event = require("../models/Event");
const EventCreator = require("../models/EventCreator");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { sendVerifiedCreator } = require("../utils");
const Compress = require("../utils/compress-image");

const createEventCreator = async (req, res) => {
    try {
         console.log(" sdfd sf fdsff ds ",req.user?.cheque)
        const {
            companyName,
            companyAddress,
            city,
            state,
            zip,
            phone,
            email,
            bankAccountType,
            bankAccountName,
            bankAccountNumber,
            ifscCode,
        } = req.body;
        console.log("AAA ", req.user);
        const panImageId = await Compress(req.user.userId, req.user.pan)
        const chequeImageId = await Compress(req.user.userId, req.user.cheque)

        const createObj = {
            companyName: companyName,
            companyAddress: companyAddress,
            city: city,
            state: state,
            zip: zip,
            phone: phone,
            email: email,
            bankAccountType: bankAccountType,
            bankAccountName: bankAccountName,
            bankAccountNumber: bankAccountNumber,
            ifscCode: ifscCode,
            chequeImage: chequeImageId[1].secure_url,
            panImage: panImageId[1].secure_url
        };
        //create account
        const creating = await EventCreator.create(createObj);
        console.log("creatingcreatingcreating ", creating);
        res.status(200).json({
            msg: "Event Creator Registered Successfully",
        });
    } catch (err) {
        console.log("err ",err)
        res.status(500).json({
            err: "Internal Server Error",
        });
    }
};

const getEventCreatorList = async (req, res) => {
    try {
        let page = 1;
        let limit = 20;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        let startIndex = (page - 1) * limit;
        const getData = await EventCreator.find().limit(limit).skip(startIndex);

        const getTotal = await EventCreator.find().countDocuments();
        if (!getData) {
            return res.status(404).json({
                err: "No requests found...",
            });
        }
        res.status(200).json({
            data: getData,
            metadata: {
                page: page,
                total: getTotal,
                limit: limit,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err: "AWInternal Server Error",
        });
    }
};

const verifyCreator = async (req, res) => {
    try {
        const eventCreator = await EventCreator.findOne({ _id: req.params.id });
        const updateCreator = await EventCreator.findOneAndUpdate(
            { _id: req.params.id },
            { isVerified: true }
        );
        const updateUserRole = await User.findOneAndUpdate(
            { email: eventCreator.email, isVerifiedCreator: true },
            { role: 1, isAdmin: true }
        );
        console.log(updateCreator);

        //send email to creator
        await sendVerifiedCreator({
            name: eventCreator.companyName,
            email: eventCreator.email,
        });
        res.status(200).json({
            msg: "User updated successfully!",
        });
        //update user role
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err: "Internal Server Error",
        });
    }
};
const verifyEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const updateEvent = await Event.findOneAndUpdate(
            { _id: eventId },
            { isPublic: true, isVerified: true }
        );
        console.log("updateEvent ",updateEvent)

        res.status(200).json({
            msg: "Event Verified Successfully!"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal Server Error!",
        });
    }
};

module.exports = { createEventCreator, getEventCreatorList, verifyCreator, verifyEvent };
