const express = require("express");
const router = express.Router();
const {
    isAuthenticated,
    verifyRoles,
    authenticateUser,
} = require("../middleware/authentication");
const {getUserById} = require("../controllers/userController")
const imageUpload = require("../middleware/Event-image-upload");
const {
    createEventCreator,
    getEventCreatorList,
    verifyCreator,
    verifyEvent
} = require("../controllers/EventCreatorController");

router.param("userId", getUserById);
router.post( 
    "/register",
    authenticateUser,
    imageUpload.fields([
        { name: "cheque", maxCount: 1 },
        { name: "pan", maxCount: 1 },
    ]),
    createEventCreator
);
router.get(
    "/getEventCreatorList/:userId",
    authenticateUser,
    isAuthenticated,
    verifyRoles([2]),
    getEventCreatorList
);
router.put(
    "/verifyCreator/:userId/:id",
    authenticateUser,
    isAuthenticated,
    verifyRoles([2]),
    verifyCreator
)

router.put(
    "/verifyEvent/:userId/:eventId",
    authenticateUser,
    isAuthenticated,
    verifyRoles([2]),
    verifyEvent
)
module.exports = router;
