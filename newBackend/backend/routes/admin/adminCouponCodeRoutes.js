const express = require("express");
const router = express.Router();

const {
    createCouponCode
} = require("../../controllers/admin/adminCouponCodeControllers");

const { authenticateToken, authenticateUserId ,authenticateRoles} = require("../../middleware/authMiddleware");
const {getUserById} = require("../../middleware/userIdMiddleware");

router.param('userId', getUserById);

router.post(
"/create/:userId",
authenticateToken,
authenticateUserId,
authenticateRoles(["Admin"]),
createCouponCode
);


module.exports = router;