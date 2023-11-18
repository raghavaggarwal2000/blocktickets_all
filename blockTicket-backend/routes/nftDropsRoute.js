const express = require("express");
const {
  create,
  claim,
  getNftDropByOwner,
  getNftDropForUserByEvent,
} = require("../controllers/nftDropController");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");


router.route("/create").post(authenticateUser, create);
router.route("/claim").post(authenticateUser, claim);
router.route("/getByOwner").get(authenticateUser, getNftDropByOwner);
router.route("/getByEvent").post(getNftDropForUserByEvent);

module.exports = router;
