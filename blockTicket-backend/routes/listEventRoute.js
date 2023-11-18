const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
  createListEventData 
} = require("../controllers/listEventFormController.js");


router.post('/user-list-form',authenticateUser,createListEventData);

module.exports = router;