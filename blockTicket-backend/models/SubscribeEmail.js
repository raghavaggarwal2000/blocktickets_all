const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const SubscribeEmailSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model("SubscribeEmail", SubscribeEmailSchema);
