// This stores the backing data which is showed on event desciption
const mongoose = require("mongoose");

const BackingSchema = mongoose.Schema({
    link: {
        type: String
    },
    description: {
        type: String
    }
},{timestamps: true});

module.exports = mongoose.model("Backing", BackingSchema);
