const express = require("express");
const router = express.Router();
const imageUpload = require("../middleware/Event-image-upload");
const { getUserById } = require("../controllers/userController");
const {
  createEvent,
  getAllEvent,
  getEventbyId,
  getAllEventByUser,
  getAllEventUserBoughtTickets,
  getAllEvents,
  updateEventData,
  updateEventImage,
  updateOrganizerImage,
  updateArtistImage,
  getLatestEvent,
  saveEvent,
  unsaveEvent,
  updateSponsorImage,
  getCurrentEvents,
  updateArtistData,
  updateOrganizerData,
} = require("../controllers/EventController");
const {
  isAuthenticated,
  verifyRoles,
  authenticateUser,
} = require("../middleware/authentication");

router.param("userId", getUserById);

router.post("/create-event", authenticateUser, createEvent);

router.get("/get-all-event", getAllEvent);
router.get("/current-events", getCurrentEvents);
router.post("/get-event-byId", getEventbyId);
router.post("/get-event-byUserId", getAllEventByUser);
router.post(
  "/get-event-user-has-tickets-for",
  authenticateUser,
  getAllEventUserBoughtTickets
);
router.get("/getLatestEvent", getLatestEvent);

// updating images from admin panel
router.put(
  "/update-image/:eventId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  imageUpload.fields([{ name: "image", maxCount: 1 }]),
  updateEventImage
);
router.put(
  "/update-organizer-image/:organizerId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  imageUpload.fields([{ name: "image", maxCount: 1 }]),
  updateOrganizerImage
);
router.put(
  "/update-artist-image/:artistId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  imageUpload.fields([{ name: "image", maxCount: 1 }]),
  updateArtistImage
);
router.put(
  "/update-sponsor-image/:ticketId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  imageUpload.fields([{ name: "image", maxCount: 1 }]),
  updateSponsorImage
);
// ! new routes for admin panel
router.get(
  "/all-events/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  getAllEvents
);

router.put(
  "/event/:eventId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  updateEventData
);
router.put(
  "/updateArtist/:artistId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  updateArtistData
);
router.put(
  "/updateOrganizer/:organizerId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  updateOrganizerData
);

router.post("/save-event/:eventId", authenticateUser, saveEvent);
router.post("/unsave-event/:eventId", authenticateUser, unsaveEvent);

module.exports = router;
