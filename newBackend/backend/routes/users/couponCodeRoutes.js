const express = require("express");
const router = express.Router();

const {
    availableCouponCode,
    verifyCouponCode
} = require("../../controllers/users/couponCodeControllers")


router.get("/availableCouponCode/:eventId", availableCouponCode);
router.post("/verifyCouponCode", verifyCouponCode)

module.exports = router;