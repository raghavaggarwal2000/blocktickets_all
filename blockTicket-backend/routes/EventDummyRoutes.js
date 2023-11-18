const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const imageUpload = require('../middleware/Event-image-upload');

const {
    createEvent,
    getAllEvent,
    getEventbyId,
    getAllEventByUser,
    markEventCreated
  } = require('../controllers/EventDummyController');
  
  router.post('/create-event-dummy',authenticateUser,imageUpload.fields([{name:'image',maxCount: 1},{name:'logo',maxCount: 1}]), createEvent);
  router.post('/get-all-event-dummy', getAllEvent);
  router.post('/get-event-byId-dummy', getEventbyId);
  router.post('/mark-event-created-dummy', markEventCreated);


  module.exports = router;