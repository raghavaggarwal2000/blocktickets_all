export const trimString = (str, len) => {
  return str?.length < len
    ? str?.slice(0, str.length - 1)
    : str?.slice(0, len) + "...";
};

export const twoWords = (str) => {
  const words = str.split(" ").slice(0, 1);
  const newString = words.join(" ");
  return (
    newString +
    "</br>" +
    str.split(" ").slice(1, 5).join(" ") +
    "</br>" +
    str.split(" ").slice(5).join(" ")
  );
};
export function getStrings(vipString) {
  var index = vipString?.indexOf("(");

  var vipAccess = vipString?.slice(0, index).trim();
  var newString = vipString?.slice(index).trim();

  return [vipAccess, newString];
}

export const sumProperty = (array) => {
  let sum = {
    total_bt_price: 0,
    totalDiscount: 0,
    total_price_after_discount: 0,
    price_after_promo: 0,
    total_gst_on_base: 0,
    total_bt_fee: 0,
    total_gst_bt_fee: 0,
    total_convenience_fee: 0,
    total_gst_convenience_fee: 0,
    totalPrice: 0,
    finalPrice: 0,
    ticket_price: 0,
    base_price: 0,
    dueAmount: 0,
  };
  // console.log(array);
  for (let i = 0; i < array.length; i++) {
    const tax = array[i]["tax_prices"];
    const quantity = array[i]["quantity"];
    console.log("gst", tax["dueAmount"])
    sum = {
      total_bt_price:
        Number(tax["total_bt_price"]) * quantity +
        Number(sum["total_bt_price"]), // base
       totalDiscount: Number(tax["discount"]) * quantity +
        Number(sum["totalDiscount"]),
        total_price_after_discount: Number(tax["price_after_discount"]) * quantity+ Number(sum["total_price_after_discount"]),
      total_bt_fee:
        Number(tax["bt_fee"]) * quantity + Number(sum["total_bt_fee"]),
      total_gst_on_base:
        Number(tax["gst_on_base"]) * quantity +
        Number(sum["total_gst_on_base"]), // GST
      total_gst_bt_fee:
        Number(tax["gst_bt_fee"]) * quantity + Number(sum["total_gst_bt_fee"]), // GST
      total_convenience_fee:
        Number(tax["convenience_fee"]) * quantity +
        Number(sum["total_convenience_fee"]), //Convenience fee
      total_gst_convenience_fee:
        Number(tax["gst_convenience_fee"]) * quantity +
        Number(sum["total_gst_convenience_fee"]), // GST
      finalPrice:
        Number(tax["finalPrice"]) * quantity + Number(sum["finalPrice"]), //Total price
      totalPrice:
      Number(tax["totalPrice"]) * quantity + Number(sum["totalPrice"]),
      ticket_price:
        Number(tax["ticket_price"]) * quantity + Number(sum["ticket_price"]),
      base_price:
      Number(tax["basePrice"]) * quantity + Number(sum["base_price"]),
      dueAmount:
      Number(tax["dueAmount"]) * quantity + Number(sum["dueAmount"])
    };
  }
  return array?.length === 0 ? 0 : sum;
};

export const isHTML = (str) =>
  !(str || "")
    // replace html tag with content
    .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, "")
    // remove remaining self closing tags
    .replace(/(<([^>]+)>)/gi, "")
    // remove extra space at start and end
    .trim();

export const applyDiscount = (totalPrice, discount) => {
  return (
    parseFloat(totalPrice) *
    ((100 - parseFloat(discount)) / 100)
  ).toFixed(2);
};

// calculating taxes having ticket base price including btFee
export function calculateTicketPrice(ticket, basePrice, fees, promoCodeInfo) {
  // basePrice = ticket.basePrice;
  console.log(basePrice);
  let discount = 0, price_after_discount = 0;
  if(promoCodeInfo?.ticketType === ticket?._id && promoCodeInfo?.percentage){
    basePrice *= (100 - promoCodeInfo?.percentage)/100;
    price_after_discount = basePrice;
    discount = (ticket.basePrice * promoCodeInfo?.percentage)/100;
  }
  var gst_on_basePrice = basePrice >= 500?
  basePrice * 0.18
  : 0;
  // const bt_fee_actual = (basePrice + gst_on_basePrice) * 0.5;
  const totalBtPrice = basePrice + gst_on_basePrice; 
  const bt_fee = totalBtPrice * 0.05
  const gst_on_bt_fee = bt_fee * 0.18;
  const discountedPrice = (basePrice + gst_on_basePrice + bt_fee + gst_on_bt_fee);
  const payablePrice = ticket?.undiscountedPrice !== 0
    ? (discountedPrice* ticket?.undiscountedPrice) / 100
    : discountedPrice;
    const remainingPrice =ticket?.undiscountedPrice !== 0
    ? (discountedPrice* (100 -ticket?.undiscountedPrice)) / 100
    : 0;
  const conv_fee = payablePrice * 0.03;
  const gst_on_conv_fee = conv_fee * 0.18;

  const finalPrice = (payablePrice + conv_fee + gst_on_conv_fee)  

  
  const tax = Number(fees?.tax / 100); // tax
  const gstRate = tax; // GST rate

  // console.log(discountedPrice, "here");
  return {
    // basePrice: Number(basePrice).toFixed(2),
    basePrice: ticket?.basePrice,
    price_after_discount: Number(price_after_discount).toFixed(2),
    discount: Number(discount).toFixed(2),
    ticket_price: discountedPrice.toFixed(2),
    bt_fee: bt_fee.toFixed(2),
    gst_rate: gstRate.toFixed(2),
    gst_bt_fee: gst_on_bt_fee.toFixed(2),
    gst_on_base: gst_on_basePrice.toFixed(2),
    total_bt_price: totalBtPrice.toFixed(2),
    convenience_fee: conv_fee.toFixed(2),
    gst_convenience_fee: gst_on_conv_fee.toFixed(2),
    totalPrice: (finalPrice + remainingPrice).toFixed(2),
    finalPrice : finalPrice.toFixed(2),
    dueAmount: remainingPrice.toFixed(2)
  };
}
