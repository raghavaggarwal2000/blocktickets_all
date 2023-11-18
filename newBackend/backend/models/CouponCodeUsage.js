const mongoose = require("mongoose");
const User = require("./User");

const CouponCodeUsageSchema = new mongoose.Schema(
  {
    usedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    order_id:{
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CouponCodeUsage", CouponCodeUsageSchema);
