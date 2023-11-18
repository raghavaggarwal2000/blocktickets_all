const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  isAuthenticated,
  verifyRoles,
} = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getUserNonceByAddress,
  addAddress,
  removeAddress,
  addImage,
  getMyProfile,
  addBackgroundImage,
  allUsers,
  getUserById,
  getUserByEmail,
  assignUserRole,
  subscribeEmail,
  ignoreUserList,
  addToIgnore,
  userLocation,
  editUserByEmail,
} = require("../controllers/userController");

const imageUpload = require("../middleware/Event-image-upload");

router.param("userId", getUserById);
router.get("/userByEmail/:userEmail", getUserByEmail);
router.put("/editUser", editUserByEmail);
router.route("/").get(authenticateUser, getAllUsers);
router.route("/updateUserPassword").put(authenticateUser, updateUserPassword);
router.route("/get-nonce").post(getUserNonceByAddress);
router.route("/add-address").post(authenticateUser, addAddress);
router.route("/remove-address").post(authenticateUser, removeAddress);
router.route("/getMyProfile").get(authenticateUser, getMyProfile);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/:id").get(authenticateUser, getSingleUser);
router.post("/add-profilepic", authenticateUser, addImage);
router.post("/add-backgroundpic", authenticateUser, addBackgroundImage);
router.get("/get-user-location/:ip", userLocation);

// ! new routes for admin panel
router.post(
  "/get-user-ignore-list/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([2]),
  ignoreUserList
);
router.get(
  "/users/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([2]),
  allUsers
);

router.put(
  "/update-role/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([2]),
  assignUserRole
);
router.post(
  "/add-to-ignore/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([2]),
  addToIgnore
);

router.post("/subscribe/email", subscribeEmail);
module.exports = router;
