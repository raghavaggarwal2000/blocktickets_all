const express = require("express"); 
const {
    onSaleByTicketId,
    cancleonSaleByTicketId,
    getAllTicketOnSale, 
    getNftInfoFromTicket,
    buyTicketFromSale,
    getAllPlatformTicketOnSale,
    updateNftTransactionBuyer,
    getTicketsOnSale,
    getAllTicketOnSale_
} = require("../controllers/NftTransactionController");
const { getUserById } = require("../controllers/userController");
const router = express.Router();
const { authenticateUser, isAuthenticated, verifyRoles } = require("../middleware/authentication");

router.param("userId", getUserById);

router.route("/onsale").post(authenticateUser, onSaleByTicketId);
router.route("/removesale").post(authenticateUser, cancleonSaleByTicketId);
router.route("/listsale").get(authenticateUser, getAllTicketOnSale);
router.route("/list-all-ticket-sale").get(getAllPlatformTicketOnSale);
router.route("/getnftindex").post(getNftInfoFromTicket);
router.route("/buyNft").post(authenticateUser, buyTicketFromSale);
router.route("/update-nft-owner").post(authenticateUser, updateNftTransactionBuyer);
router.route("/get-all-ticket-on-sale").get(getAllTicketOnSale_);
// ! New routes for admin

router.get(
    "/tickets-on-sale/:userId",
    authenticateUser, 
    isAuthenticated, 
    verifyRoles([1,2]), 
    getTicketsOnSale
    )

module.exports = router;
