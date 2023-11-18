const express = require("express");
const router = express.Router();
const {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  verifyCode,
  updateDate,  
  updateDetails,
  disableCode
} = require("../controllers/promoCodeController");
const { getUserById } = require("../controllers/userController");
const {
  authenticateUser,
  isAuthenticated,
  verifyRoles,
} = require("../middleware/authentication");

router.param("userId", getUserById);
router.post(
  "/generate/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([2]), //only super admin
  createPromoCode
);

router.get(
  "/all/view/:limit/:page/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([2]),
  getAllPromoCodes
);
router.get(
  "/view/:id/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([2]),
  getPromoCodeById
);
router.post("/verify/:code", authenticateUser, verifyCode);

router.post("/update/date", authenticateUser, updateDate);

router.put("/update/details", authenticateUser, updateDetails);
router.delete("/update/disable/:id", authenticateUser, disableCode);

module.exports = router;
