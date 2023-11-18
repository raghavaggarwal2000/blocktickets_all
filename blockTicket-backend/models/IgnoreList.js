const mongoose = require("mongoose");

const IgnoreListSchema = new mongoose.Schema(
  {
    ignoredUser: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IgnoreList", IgnoreListSchema);
