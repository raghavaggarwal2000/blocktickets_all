const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  verifyRoles,
  isAuthenticated,
} = require("../middleware/authentication");

const {
  bookTicket,
  newBookTicket,
  getTicket,
  getTicketbyTicketID,
  getTicketbyUserID,
  getTicketByNftIndex,
  addGasFee,
  updateTicketPaymentStatus,
  sendAirdropEmail,
  updateTicketClaimed,
  setTicketUsed,
  generateQrCode,
  getTicketbyUserIDAPP,
  getuserTicketbyEventID,
  createTrail,
  getTrail,
  getTicketTypes,
  getAllTickets,
  addTicketTypeToEvent,
  updateTicketType,
  deleteTicketType,
  getTicketByTicketId,
  getTicketsByEventId,
  getAllTicketsByRole,
  getTicketByNftId,
  ticketInfo,
  getNfts,
  generateFreeTicket,
  allSales,
  ticketOrderId,
  updatePaidPrice,
  getTicketByEmailChange,
  getTicketByEmailChangeWithoutEventId
} = require("../controllers/ticketController");
const { getUserById } = require("../controllers/userController");

router.param("userId", getUserById);

router.post("/book-ticket", newBookTicket);
router.get("/get-ticket", authenticateUser, getTicket);
router.post("/get-ticket-by-ticketId", authenticateUser, getTicketbyTicketID);
router.post("/get-ticket-by-userId", authenticateUser, getTicketbyUserID);
router.post("/get-ticket-by-userId-app", getTicketbyUserIDAPP);
router.post("/getTicketByNftId", getTicketByNftId);
router.post("/getNfts", authenticateUser, getNfts);
router.post("/getTicketByNftIndex", getTicketByNftIndex);
router.post("/add-gas-fee", addGasFee);
router.post("/create-trail", createTrail);
router.patch("/update-ticket-payment-status", updateTicketPaymentStatus);
router.patch("/ticket-claim", updateTicketClaimed);
router.post("/sendAirdrops", sendAirdropEmail);
router.patch("/set-ticket-used", authenticateUser, setTicketUsed);
router.get("/get-qr-code", generateQrCode);
router.post("/get-user-tickets-by-event", getuserTicketbyEventID);
router.route("/getTrail").post(getTrail);
// ! new routes for admin panel
router.get(
  "/get-all-tickets/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  getAllTickets
);

router.get(
  "/all-tickets-sale/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  allSales
);
router.get(
  "/tickets-by-event/:eventId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  getTicketsByEventId
);

router.get(
  "/ticket/:ticketId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  getTicketByTicketId
);

router.get(
  "/ticketOrderId/:orderId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  ticketOrderId
);

// router.get(
//   "/ticketOrderId/:userId/:eventId",
//   // authenticateUser,
//   // isAuthenticated,
//   // verifyRoles([1, 2]),
//   ticketOrderId
// );
router.get(
  "/get-ticketsBy-emailChange/:email/:eventId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  getTicketByEmailChange
);
router.get(
  "/get-ticketsBy-emailChange/:email/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  getTicketByEmailChangeWithoutEventId
);

router.get(
  "/get-ticket-types/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  getAllTicketsByRole
);

router.post(
  "/ticket-type/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  addTicketTypeToEvent
);

router.put(
  "/ticket-type/:ticketId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  updateTicketType
);

// Paid price update from admin panel
router.put(
  "/update-paid-price/:order_id/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  updatePaidPrice
);

router.delete(
  "/ticket-type/:ticketId/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  deleteTicketType
);
router.post(
  "/ticket-type/generateFreeTickets/:userId",
  authenticateUser,
  isAuthenticated,
  verifyRoles([1, 2]),
  generateFreeTicket
);

router.get("/event-ticket/info/:eventId", ticketInfo);

module.exports = router;
