const CustomError = require("../errors");
const { isTokenValid } = require("../utils");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const ObjectId = require("mongoose").Types.ObjectId;

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"];
    const bearerToken = accessToken.split(" ")[1];
    if (accessToken) {
      const payload = isTokenValid(bearerToken);
      if (!payload) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "PL:Invalid Token" });
      }

      req.user = payload;
      return next();
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid Token" });
    }
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

// ! new middlewares

// We can use this for user authentication
const isAuthenticated = (req, res, next) => {
  let checker = req.user.userId === req?.profile?._id.toString();
  if (!checker) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

const verifyRoles = (roles) => {
  return (req, res, next) => {
    const userRole = req.profile.role;
    if (roles.includes(userRole)) {
      next();
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "ACCESS DENIED" });
    }
  };
};

module.exports = { authenticateUser, isAuthenticated, verifyRoles };
