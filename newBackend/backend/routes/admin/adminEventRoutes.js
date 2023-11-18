const express = require('express');
const {createEvent} = require("../../controllers/admin/adminEventControllers")

const router = express.Router()

router.post("/createEvent", createEvent);

module.exports = router;



