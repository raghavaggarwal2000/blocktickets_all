const displayPrice = (basePrice, btFeePercentage) =>{
      let gst_base = 0;
      if (basePrice >= 500) {
        gst_base = basePrice * 0.18;
      }
      const bt_fee = (gst_base + basePrice) * btFeePercentage/100;
      const gst_bt_fee = bt_fee * 0.18;

      return{
        gst_base,
        bt_fee,
        gst_bt_fee,
        totalBasePrice: Number(basePrice) + Number(gst_base) +Number(bt_fee) + Number(gst_bt_fee)
      }
}

const displayPriceFNB = (basePriceFNB, btFeePercentage) =>{
    const gst_base_fnb = basePriceFNB * 0.05;
    const bt_fee_fnb = (basePriceFNB + gst_base_fnb) * btFeePercentage/100;
    const gst_bt_fee_fnb = bt_fee_fnb * 0.18;
    return{
        gst_base_fnb,
        bt_fee_fnb,
        gst_bt_fee_fnb,
        totalFnbPrice: Number(basePriceFNB) +
        Number(gst_base_fnb) +
        Number(bt_fee_fnb) +
        Number(gst_bt_fee_fnb)
    }
}


module.exports = {
    displayPrice,
    displayPriceFNB
}