const express = require("express");
const { getAll, get, update, create } = require("../controllers/nftController");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const { imageUpload } = require("../middleware/image-upload");
const { uploadToPinata } = require("../middleware/upload-pinata");
const { uploadImageToS3 } = require("../middleware/s3_upload.js");

router
  .route("/")
  .get(authenticateUser, getAll)
  .post(authenticateUser, create)
  .patch(authenticateUser, update);

router.route("/:id").get(authenticateUser, get);
router.route("/upload-pinata").post(
  imageUpload.single("image"),
  // uploadImageToS3().fields([{ name: "image", maxCount: 1 }]),
  uploadToPinata
);
module.exports = router;
