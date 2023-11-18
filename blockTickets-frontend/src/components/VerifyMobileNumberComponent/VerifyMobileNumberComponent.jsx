import React from "react";
import OTPInput, { ResendOTP } from "otp-input-react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import blockticketlogo from "../../images//blockticketlogo.png";
function VerifyMobileNumberComponent() {
  const [OTP, setOTP] = useState("");

  return (
    <div>
      <br></br>
      <img classname="blkticketlogo" src={blockticketlogo} />

      <div className="signInPara">Verify your phone number</div>
      <br></br>
      <div className="EmailBox">
        <p className="emailPara">Phone number</p>
        <input className="emailBox" placeholder="Enter Phone"></input>
      </div>
      <br></br>
      <br></br>

      <div className="EmailBox">
        <p className="emailPara">Enter OTP</p>

        <OTPInput
          value={OTP}
          onChange={setOTP}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={false}
          secure
          inputStyle={{
            border: "1px solid grey",
          }}
        />
        <br></br>
        <a href="#">Resend Otp</a>
      </div>
      <br></br>
      <br></br>
      <Button className="LoginBtn">Verify</Button>
    </div>
  );
}

export default VerifyMobileNumberComponent;
