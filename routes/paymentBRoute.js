const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/paymentBRoute");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

//generating token
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

//processing payment
router.post(
   "/payment/braintree/:userId",
   isSignedIn,
   isAuthenticated,
   processPayment
);

module.exports = router;
