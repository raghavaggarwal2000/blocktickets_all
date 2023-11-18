import React from "react";
import "../modals.css";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

const MobileNumber = ({
  show,
  setShow,
  onContinue,
  setPhoneNumber,
  phoneNumber,
}) => {
  const onClose = () => setShow(false);
  const numberInputOnWheelPreventChange = (e) => {
    // Prevent the input value change
    e.target.blur();
    // Prevent the page/container scrolling
    e.stopPropagation();
    // Refocus immediately, on the next tick (after the current
    // function is done)
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };
  return (
    <React.Fragment>
      <Dialog
        onClose={onClose}
        open={show}
        PaperProps={{ style: { width: "440px", height: "300px" } }}
      >
        <form
          onSubmit={onContinue}
          className="bg-blackishGray flex items-center gap-4 justify-center relative flex-col w-full h-full p-4"
        >
          <div
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white"
          >
            <CloseIcon />
          </div>
          <h2 className="text-center text-white">
            Please enter your mobile number
          </h2>
          <input
            placeholder="99999 99999"
            className="bid-input-price"
            type="tel"
            pattern="[0-9]{10}"
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber}
            onWheel={numberInputOnWheelPreventChange}
            required
          />
          <button
            className="py-3 px-6 bg-black hover:opacity-75 text-white text-lg rounded-lg"
            type={"submit"}
          >
            Continue
          </button>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default MobileNumber;
