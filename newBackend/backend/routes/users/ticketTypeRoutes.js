const express = require("express");
const { 
    getTicketType
} = require("../../controllers/users/ticketTypeControllers");

const router = express.Router();

router.get("/getTicketType/:eventId", getTicketType)

module.exports = router;