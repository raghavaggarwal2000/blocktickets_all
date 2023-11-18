const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  register,
  login,
  socialLogin,
  phoneLogin,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  createAccountScript,
  accountAmend,
  registerUser,
  loginSystem,
  resendVerificationEmail
} = require("../controllers/authController");

router.post("/register", register);
router.post("/resendVerificationEmail", resendVerificationEmail);
router.post("/login", login);
router.post("/system-login", loginSystem);
router.post("/social-login", socialLogin);
router.post("/phone-login", phoneLogin);
router.delete("/logout", authenticateUser, logout);
router.post("/verify-email", verifyEmail);
router.post("/register-with-token", registerUser);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

router.post("/createAccountScript", createAccountScript);

router.post("/accountAmend", accountAmend);

module.exports = router;
