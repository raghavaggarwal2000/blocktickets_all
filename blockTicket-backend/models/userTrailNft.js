const mongoose = require('mongoose');

const UserTrailNftSchema = new mongoose.Schema(
  {
    ticketId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    trailTransaction:{
      type:[]
    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserTrailNft', UserTrailNftSchema);
