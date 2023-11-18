const mongoose = require("mongoose");

const SearchKeywordSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
    },
    count: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchKeyword", SearchKeywordSchema);
