const ObjectId = require("mongoose").Types.ObjectId;
var momentTz = require("moment-timezone");
var moment = require("moment");

function calculateTicketPrice(basePrice, fees, quantity, promoCodeInfo) {
  const bt_fee_actual = basePrice*quantity * 0.05;

  let actualTicketPrice = basePrice*quantity;
  const isValidPromo = promoCodeInfo?._id ? true : false;
  if (isValidPromo) {
    actualTicketPrice = (
      (actualTicketPrice * (100 - promoCodeInfo?.discountPercentage)) /
      100
    ).toFixed(2);
  }

  console.log(actualTicketPrice,promoCodeInfo,"promo info")
  let bt_fee_discount_price = actualTicketPrice * 0.05;

  const btFee = isValidPromo ? bt_fee_discount_price : bt_fee_actual; // Bt fee
  const ticketPrice = Number(actualTicketPrice) + Number(btFee); // baseprice + bt fee

  const tax = Number(fees?.tax / 100); // tax
  const conv_fee = Number(fees?.platform_fee / 100); // convenience fee

  const gstRate = tax; // GST rate
  const gstOnBtFee = btFee * tax; // tax on bt fee
  const gstOnBasePrice = actualTicketPrice * gstRate; // tax on basePrice

  const totalBtPrice = ticketPrice + gstOnBtFee + gstOnBasePrice; //totalPrice
  //   now adding convenience fee
  const convenienceFee = actualTicketPrice * conv_fee; // convenience_fee on
  const gstOnConvenienceFee = convenienceFee * 0.18; // gst on convenience fee
  const totalPrice = Number(actualTicketPrice) + Number(convenienceFee) + Number(gstOnConvenienceFee); // final Price
  const dispaly_gst_bt_fee = gstOnBtFee;
  return {
    ticket_price: ticketPrice?.toFixed(1),
    bt_fee: btFee?.toFixed(2),
    gst_rate: gstRate?.toFixed(2),
    gst_bt_fee: dispaly_gst_bt_fee?.toFixed(2),
    gst_on_base: gstOnBasePrice?.toFixed(2),
    total_bt_price: totalBtPrice?.toFixed(2),
    convenience_fee: convenienceFee?.toFixed(2),
    gst_convenience_fee: gstOnConvenienceFee?.toFixed(2),
    finalPrice: totalPrice?.toFixed(2),
    quantity: quantity,
  };
}
function findObjectById(array, id) {
  const objectId = new ObjectId(id);
  // loop through the array
  for (let i = 0; i < array.length; i++) {
    // check if the current object has the matching _id value
    if (objectId.equals(array[i]._id)) {
      // return the matching object
      return array[i];
    }
  }
  // return null if no matching object was found
  return null;
}
function mergeArraysById(array1, array2) {
  const mergedArray = [];

  // loop through the arrays in parallel
  for (let i = 0; i < array1.length; i++) {
    // merge the two objects based on the _id property
    const find = findObjectById(array1, array2[i]._id);
    mergedArray.push({
      quantity: array2[i].quantity,
      price: find.price,
      _id: array2[i]._id,
    });
  }

  return mergedArray;
}

const sumProperty = (array) => {
  let sum = {
    finalPrice: 0,
    ticket_price: 0,
  };
  for (let i = 0; i < array.length; i++) {
    const tax = array[i];
    const quantity = array[i]["quantity"];
    sum = {
      finalPrice:
        Number(tax["finalPrice"]) * quantity + Number(sum["finalPrice"]), //Total price

      ticket_price:
        Number(tax["ticket_price"]) * quantity + Number(sum["ticket_price"]),
    };
  }
  return array?.length === 0 ? 0 : sum;
};

const timezoneAdjust = (timezone, date) => {
  // let adjustedDate = momentTz(date).tz(timezone.value).format();
  // console.log("adjustedDate: ", adjustedDate);

  const momentDate = moment.utc(date);
  let adjustedDate = momentDate.tz(timezone.value);
  const formattedTime = adjustedDate.format("HH:mm");
  // const adjustedMinutes = moment(adjustedDate).minutes();
  // const adjustedHours = moment(adjustedDate).hours();
  console.log("formattedTime: ", formattedTime);
  adjustedDate = adjustedDate.toLocaleString("en-US", {
    timeZone: timezone.value,
  });
  return { date: adjustedDate, time: formattedTime };
};

function isWithinRange(startDate, endDate) {
  const currentDate = new Date();
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  return currentDate >= startDate && currentDate <= endDate;
}

module.exports = {
  calculateTicketPrice,
  mergeArraysById,
  sumProperty,
  timezoneAdjust,
  isWithinRange,
};
