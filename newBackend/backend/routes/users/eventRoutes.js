const express = require("express");
const { 
    allBanner,
    getUpcomingEvent, 
    getPastEvent,
    getEventDetail,
    uploadImageS3
} = require("../../controllers/users/eventControllers");

const eventImageUploadLocal = require("../../middleware/eventImageUploadLocal");
const multerErrorHandler = require("../../middleware/multerErrorHandler")

const router = express.Router();

router.get("/getAllBanner", allBanner); // to get all banners image for home page
router.get('/getUpcomingEvent', getUpcomingEvent); // to get all upcoming event details for home page
router.get("/getPastEvent", getPastEvent); // to get all past event details for home page

router.get("/:slug", getEventDetail); // To get the details of selected event

router.post("/eventImageUpload",
eventImageUploadLocal.single("image"),
multerErrorHandler,
uploadImageS3); // upload image


module.exports = router;