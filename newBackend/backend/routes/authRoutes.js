const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    validateOTP,
    logout,
    googleSignIn
} = require("../controllers/authControllers");



router.post("/login", login);
router.post("/signup", signup);
router.post("/validateOTP", validateOTP);
router.get("/logout", logout);
router.post("/details", googleSignIn);



module.exports = router;