const mongoose = require("mongoose");

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
