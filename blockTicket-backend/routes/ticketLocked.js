const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    ticketIncrementLocked,
    ticketDecrementLocked
  } = require('../controllers/ticketLockedController');
  
router.post('/ticket-locked-increment',authenticateUser, ticketIncrementLocked);
router.post('/ticket-locked-decrement',authenticateUser, ticketDecrementLocked);


module.exports = router;