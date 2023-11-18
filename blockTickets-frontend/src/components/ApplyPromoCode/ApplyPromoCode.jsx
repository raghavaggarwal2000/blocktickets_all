import React from "react";
import InputField from "../InputField/InputField";

const ApplyPromoCode = ({
  register,
  errors,
  verifyCode,
  getValues,
  promoCodeInfo,
  setPromoCodeInfo,
  isLogin,
  setSignIn,
}) => {
  const inputProps = { register, errors };

  const handleApply = () => {
    if (!isLogin) return setSignIn(true);
    verifyCode(getValues("promoCode"));
  };
  return (
    <div className="grid grid-cols-4 gap-2">
      <InputField
        // label="Apply promo Code"
        type="text"
        className="col-span-3"
        value="promoCode"
        placeholder="Enter the promo code"
        // required="Please enter the promo code"
        disabled={promoCodeInfo?.valid}
        {...inputProps}
      />

      <div className="flex items-center">
        {promoCodeInfo?.valid ? (
          <button
            onClick={() => setPromoCodeInfo("")}
            className="max-h-[45px] col-span-1 w-full text-white border-orange bg-orange rounded-lg px-4 py-2 hover:opacity-75"
          >
            Change code
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="max-h-[45px] col-span-1 w-full text-white border-orange bg-orange rounded-lg px-4 py-2 hover:opacity-75"
          >
            Apply
          </button>
        )}
      </div>
      <div className="col-span-full text-title italic">
        {promoCodeInfo?.valid &&
          `*Promo code applied with ${promoCodeInfo?.percentage}% off on only ${promoCodeInfo?.ticketName}...`}
      </div>
    </div>
  );
};

export default ApplyPromoCode;
