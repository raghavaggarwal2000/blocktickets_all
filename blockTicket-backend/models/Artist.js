const mongoose = require("mongoose");
const Event = require("./Event");
const Nft = require("./Nft");
const TicketType = require("./TicketType");

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artist", ArtistSchema);
