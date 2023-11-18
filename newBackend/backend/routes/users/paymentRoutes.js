const express = require("express");
const router = express.Router();
const {createOrderInstance, cashfreeSuccess} = require("../../controllers/users/paymentController")
const { authenticateToken} = require("../../middleware/authMiddleware");

router.post("/checkout", authenticateToken, createOrderInstance);
router.post("/cashfreeSuccess", cashfreeSuccess);




module.exports = router