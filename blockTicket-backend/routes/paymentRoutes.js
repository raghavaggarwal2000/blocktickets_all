const express = require("express");
const router = express.Router();

const {
  cashfreePayment,
  getOrderStatus,
  scriptCreateOrder,
  createPaymentIntentStripe,
  stripeWebhook,
} = require("../controllers/paymentController");

const {
  authenticateUser,
  isAuthenticated,
  verifyRoles,
} = require("../middleware/authentication");

router.post(
  "/cashfree-get-order-token",
  express.json(),
  // authenticateUser,
  cashfreePayment
);
router.post(
  "/cashfree-verify",
  express.json(),
  authenticateUser,
  getOrderStatus
);
router.post(
  "/scriptCreateOrder",
  express.json(),
  authenticateUser,
  scriptCreateOrder
);

// stripe
router.post(
  "/create-payment-intent",
  express.json(),
  authenticateUser,
  createPaymentIntentStripe
);
router.post(
  "/webhook/endpoint",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
