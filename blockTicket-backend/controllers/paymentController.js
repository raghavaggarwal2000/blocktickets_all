const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const responseHandler = require("../responseHandler/sendResponse");
const TicketType = require("../models/TicketType");
const Event = require("../models/Event");
const NftTransaction = require("../models/NftTransaction");
const CashfreePayment = require("../models/CashfreePayment");
const Web3 = require("web3");
const axios = require("axios");
var ObjectId = require("mongoose").Types.ObjectId;
const { v4: uuidv4 } = require("uuid");
const AddOn = require("../models/AddOn");
const { DiscountCode, Discount } = require("../models/PromoCode");
const {
  calculateTicketPrice,
  mergeArraysById,
  sumProperty,
} = require("../utils/helpers");
const CC = require("currency-converter-lt");
const StripePayment = require("../models/StripePayment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// test -- 	https://sandbox.cashfree.com/pg
// prod --  https://api.cashfree.com/pg
const cashfreeApi = process.env.CASHFREE_BASE_URL;

// function for price and discount
const price_calculate = async ({ couponCode, selectedTickets }) => {
  let discount = null;
  if (couponCode) {
    const verifyCode = await DiscountCode.findOne({ code: couponCode });
    const isValid = verifyCode?.usedBy?.length < verifyCode?.quantity;
    if (!isValid)
      throw new CustomError.BadRequestError("Promo code is invalid!");
    discount = await Discount.findOne({ discountId: verifyCode?._id });
  }

  var currentDate = new Date();
  var expireDate = new Date(currentDate.getTime() + 30 * 60000);
  var uniqueNumber = new Date().valueOf();
  const eventFee = await Event.findOne({
    _id: ObjectId(selectedTickets[0]?.Event),
  }).select("fees");

  let selected = selectedTickets.map((ti) => ti._id);
  let tickets = await TicketType.find({ _id: selected }).select("price");
  let quantities = selectedTickets.map((ti) => {
    return { _id: ti._id, quantity: ti.quantity };
  });
  let totalQuantity = 0;
  selectedTickets.forEach((ti) => {
    return (totalQuantity += ti.quantity);
  });
  
  const marr = mergeArraysById(tickets, quantities);
  
  let tp = [];
  for (let i = 0; i < marr.length; i++) {
    const item = marr[i];
    const totalPrices = calculateTicketPrice(
      item.price,
      eventFee?.fees,
      item.quantity,
      discount
      );
      tp.push(totalPrices);
    }

  const summation = sumProperty(tp);
  
  let amountInInr = (summation?.finalPrice).toFixed(2);
  let currencyConverter = new CC({
    from: "INR",
    to: "USD",
    amount: Number(amountInInr),
  });
  const dollarAmount = await currencyConverter.convert();
  // const dollarAmount = await convert(Number(amountInInr), "USD", "INR");
  // console.log("CONVERT dollarAmount: ", dollarAmount);
  return { amountInInr, expireDate, uniqueNumber, dollarAmount, totalQuantity };
};

const cashfreePayment = async (req, res) => {
  try {
    const { couponCode, selectedTickets, breakupPrices, eventId } = req.body;
    // console.log('breakupPrices', breakupPrices.finalPrice)
    const { amountInInr, expireDate, uniqueNumber, totalQuantity } =
    await price_calculate({
      couponCode,
      selectedTickets,
    });
    var phone;
    if (req.body.userInfo.phone !== null) {
      phone = req.body.userInfo.phone;
    } else {
      phone = 9999999999;
    }
    // console.log('check',breakupPrices.finalPrice )
    let _cashfree_create;
    if (breakupPrices?.finalPrice >= 1) {
      var data = JSON.stringify({
        order_id: `order_${uniqueNumber}`, //unique ID using timestamp
        order_amount: Math.round(breakupPrices.finalPrice * 100) / 100, //amount in inr
        order_currency: "INR",
        order_expiry_time: expireDate,
        customer_details: {
          customer_id: req.body.userInfo.userId,
          customer_email: req.body.userInfo.email,
          customer_phone: phone,
        },
      });
      var config = {
        method: "post",
        url: `${cashfreeApi}/orders`,
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-01-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_APP_SECRET,
        },
        data: data,
        order_expiry_time: expireDate,
      };
      _cashfree_create = await axios(config);
      // console.log("checkkkkk", _cashfree_create?.data);
    }

    const createPay = {
      orderToken: _cashfree_create?.data?.order_token || "",
      eventId: eventId,
      orderId: `order_${uniqueNumber}`,
      customerId: req.body.userInfo.userId,
      customerEmail: req.body.userInfo.email,
      customerPhone: phone,
      orderStatus: _cashfree_create?.data?.order_status || "PAID",
      type: "ticket-buying",
      tickets: req.body.selectedTickets,
      totalTicketQuantity: totalQuantity,
      amount: Math.round(breakupPrices.finalPrice * 100) / 100,
      couponCode: couponCode,
      breakupPrices,
    };
    await CashfreePayment.create(createPay);
    res.status(200).json({
      orderToken: _cashfree_create?.data.order_token || "",
      orderId: uniqueNumber,
      message: "Order created successfully",
    });
  } catch (err) {
    console.log("err: ", err);
    res.status(400).json({ msg: err.message });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    var order_id = req.body.orderId;

    var config = {
      method: "get",
      url: `${cashfreeApi}/orders/${order_id}`,
      headers: {
        Accept: "application/json",
        "x-api-version": "2022-01-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_APP_SECRET,
      },
    };
    axios(config)
      .then(async (orderStatus) => {
        // find and update
        const updateOrder = await CashfreePayment.find({
          orderId: `${order_id}`,
        });

        updateOrder[0].orderStatus = orderStatus.data.order_status;
        await updateOrder[0].save();
        res.status(200).json({
          result: orderStatus.data,
          status: 200,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err.message,
          // status:err.status
        });
      });
  } catch (err) {
    throw new CustomError.NotFoundError(`Something went wrong`);
  }
};

const scriptCreateOrder = async (req, res) => {
  try {
    var uniqueNumber = new Date().valueOf();
    const TicketT = await TicketType.findOne({
      _id: ObjectId(req.body.ticketId),
    });
    const addon = await AddOn.find({ ticketId: ObjectId(req.body.ticketId) });

    if (addon) TicketT["addon"] = addon;
    const createPay = {
      orderToken: `order_${uniqueNumber}`,
      orderId: `order_${uniqueNumber}`,
      customerId: req.body.userInfo.userId,
      customerEmail: req.body.userInfo.email,
      orderStatus: "Bought",
      type: "ticket-buying",
      tickets: [TicketT],
      amount: 25,
    };
    const payIt = await CashfreePayment.create(createPay);

    res.status(200).json({
      orderId: `order_${uniqueNumber}`,
    });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// STRIPE PAYMENT GATEWAY
const endpointSecret = process.env.ENDPOINT_SECRET;
const createPaymentIntentStripe = async (req, res) => {
  try {
    const {
      couponCode,
      items,
      selectedTickets,
      breakupPrices,
      userId,
      userEmail,
    } = req.body;

    let { amountInInr, expireDate, uniqueNumber, dollarAmount } =
      await price_calculate({
        couponCode,
        selectedTickets,
      });
    // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
    // and attach the PaymentMethod to a new Customer
    const uniqueId = uuidv4();
    const customer = await stripe.customers.create();
    console.log("customer: ", customer);

    const in_cents = Math.round(dollarAmount * 100);
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      setup_future_usage: "off_session",
      amount: in_cents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { user: userId, uniqueId },
    });
    console.log("paymentIntent ", paymentIntent);
    const paymentObj = {
      tickets: selectedTickets,
      breakupPrices,
      orderToken: customer.created,
      orderId: paymentIntent?.id,
      customerId: userId,
      customerEmail: userEmail,
      orderStatus: paymentIntent.status,
      tickets: selectedTickets,
      amount: in_cents,
      currency: paymentIntent.currency,
      couponCode: couponCode,
      uniqueId: uniqueId,
    };
    await StripePayment.create(paymentObj);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log("err: ", err?.message);
    res.status(500).send(err?.message);
  }
};

const updateChargeStatus = async ({ status, id }) => {
  return await StripePayment.findOneAndUpdate(
    { orderId: id }, //payment intent
    { orderStatus: status }
  );
};
const stripeWebhook = async (request, response) => {
  let event = request.body;
  console.log("event: ", event);
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  // const id = event.
  try {
    switch (event.type) {
      case "charge.captured":
        const chargeCaptured = event.data.object;
        // Then define and call a function to handle the event charge.captured
        await updateChargeStatus({
          id: chargeCaptured.payment_intent,
          status: chargeCaptured.status,
        });
        break;
      case "charge.expired":
        const chargeExpired = event.data.object;
        // Then define and call a function to handle the event charge.expired
        await updateChargeStatus({
          id: chargeExpired.payment_intent,
          status: chargeExpired.status,
        });
        break;
      case "charge.failed":
        const chargeFailed = event.data.object;

        // Then define and call a function to handle the event charge.failed
        await updateChargeStatus({
          id: chargeFailed.payment_intent,
          status: chargeFailed.status,
        });
        break;
      case "charge.pending":
        const chargePending = event.data.object;
        await updateChargeStatus({
          id: chargePending.payment_intent,
          status: chargePending.status,
        });
        // Then define and call a function to handle the event charge.pending
        break;
      case "charge.refunded":
        const chargeRefunded = event.data.object;
        await updateChargeStatus({
          id: chargeRefunded.payment_intent,
          status: chargeRefunded.status,
        });
        // Then define and call a function to handle the event charge.refunded
        break;
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        console.log("chargeSucceeded: ", chargeSucceeded);
        const statusSaved = await StripePayment.findOne(
          { orderId: chargeSucceeded.payment_intent } //payment intent
        ).select("orderStatus");
        if (statusSaved?.orderStatus !== "succeeded") {
          // update stripe payment
          await updateChargeStatus({
            id: chargeSucceeded.payment_intent,
            status: chargeSucceeded.status,
          });
          // generate tickets
          console.log(
            "chargeSucceeded.payment_intent: ",
            chargeSucceeded.payment_intent
          );
          const booking = await axios.post(
            `${process.env.SERVER_URL}/ticket/book-ticket`,
            {
              orderId: chargeSucceeded.payment_intent,
              method: "stripe",
              userId: chargeSucceeded.metadata.user,
            }
          );
          console.log("booking ", booking?.response?.data);
        }

        // Then define and call a function to handle the event charge.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.log(err?.response ? err?.response?.data : err);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

module.exports = {
  cashfreePayment,
  getOrderStatus,
  scriptCreateOrder,
  createPaymentIntentStripe,
  stripeWebhook,
};
