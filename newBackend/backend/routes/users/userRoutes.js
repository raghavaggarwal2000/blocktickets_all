const express = require("express");
const router = express.Router();
const { 
    getProfile,
    editProfile
 } = require("../../controllers/users/userControllers");

 const { authenticateToken } = require("../../middleware/authMiddleware");

router.get("/getProfile", authenticateToken, getProfile);
router.put("/editProfile", authenticateToken, editProfile);


module.exports = router;