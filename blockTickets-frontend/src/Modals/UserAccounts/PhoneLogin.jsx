import React, { useEffect, useState } from "react";
// import { LoginUser } from "../../api/api-client";
import { useNavigate } from "react-router-dom";

// styles
import "./email.css";
// react bootstrap
import { Button } from "react-bootstrap";
// modal
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
// react phone
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { phoneLoginUser } from "../../api/api-client";
import { auth, googleProvider, fbProvider } from "./../../firebase/firebase";
import {
  OAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  linkWithCredential,
  RecaptchaVerifier,
  signOut,
} from "firebase/auth";
import OtpInput from "react-otp-input";
import Timer from "../../components/Timer/Timer";

const PhoneLogin = ({ setIsAdmin, showPhone, setShowPhone, value }) => {
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setShowPhone(true);
  const handleClose = () => setShowPhone(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  // otp login
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [firebaseError, setFirebaseError] = useState(false);

  let navigate = useNavigate();
  const onSubmits = async (e) => {
    e.preventDefault();
    // //console.log(phoneNumber);
    if (!phoneNumber) {
      setErrorMessage("Please enter your phone number!");
      return;
    }
    await getOtp();
  };
  var confirmResponse;
  const getOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    setOTP("");
    // let verify;
    try {
      //TODO: Add empty div with id 'recaptcha-container'
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
          },
          auth
        );
        // console.log(phoneNumber);
        if (!window.recaptchaVerifier) {
          alert("Please complete recaptcha");
        }
      }

      window.confirmationResult = await signInWithPhoneNumber(
        auth,
        `${phoneNumber}`,
        window.recaptchaVerifier
      );
      if (window.confirmationResult) {
        setSuccessMessage(
          "OTP has been sent to your registered mobile number."
        );
        setShowVerifyOTP(true);
      }
      setLoading(false);
    } catch (err) {
      console.error("errAB", JSON.stringify(err.message));
      setFirebaseError(true);
      setSuccessMessage("");
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      if (result) {
        // //console.log("user", result);
        const userInfo = await phoneLoginUser(result.user.accessToken);
        // console.log("userInfo", userInfo.response);

        // if some error occurred

        if (
          userInfo &&
          userInfo.response &&
          userInfo.response.data.status !== 200
        ) {
          // console.log(userInfo.response.data.status);
          setErrorMessage(userInfo.response.data.message);
          setSuccessMessage("");
          setShowVerifyOTP(false);
          setSeconds(30);
          setMinutes(0);
          setLoading(false);
          return;
        }

        //  success
        if (userInfo) {
          sessionStorage.setItem("token", userInfo.data.accessToken);
          value.setUserToken(userInfo.data.accessToken);
          sessionStorage.setItem(
            "user-data",
            JSON.stringify(userInfo.data.user)
          );
          sessionStorage.setItem(
            "METAMASK_WALLET",
            JSON.stringify(userInfo.data.user.wallets[0])
          );
          sessionStorage.setItem("isMetamaskConnected", false);

          if (
            JSON.parse(sessionStorage.getItem("user-data")) &&
            JSON.parse(sessionStorage.getItem("user-data")).isAdmin
          ) {
            setIsAdmin(JSON.parse(sessionStorage.getItem("user-data")).isAdmin);
          } else {
            setIsAdmin(true);
          }
          handleClose();
        }
        if (
          userInfo &&
          userInfo.data &&
          userInfo.data.user &&
          userInfo.data.user.wallets.length !== 0
        ) {
          setShowPhone(false);

          if (!window.location.pathname.includes("ticket")) {
            navigate("/");
          }
        }
        // else {
        //     navigate("/user-wallet-details");
        // }
        setLoading(false);
      }
      // //console.log(result.error)
    } catch (err) {
      setErrorMessage(err.message);
      setShowVerifyOTP(false);
      setSuccessMessage("");
      setLoading(false);
    }
  };
  const onSubmitVerifyOTP = async (e) => {
    e.preventDefault();
    // //console.log(otp.length)
    if (otp.length !== 6) {
      setErrorMessage("Please enter the 6 digit OTP number");
      return;
    }
    await verifyOtp();
  };

  const sendOtpAgain = async () => {
    setErrorMessage(false);
    setSuccessMessage("");
    setShowVerifyOTP(false);
    setSeconds(30);
    setMinutes(0);
  };

  useEffect(() => {
    if (phoneNumber) {
      setErrorMessage(false);
    }
  }, [phoneNumber]);
  return (
    <Modal
      open={showPhone}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        // sx={emailStyle}
        className="emailStyle"
      >
        <div className="email-login">
          <h3 className="email-login-title">Login with OTP</h3>
          <form
            className="l-in-input"
            // onSubmit={onSumbits}
          >
            <div className="l-input-element">
              <div style={{ marginTop: "10px" }}>
                <label htmlFor="phone">Phone Number</label>
              </div>

              <PhoneInput
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
            </div>
            {errorMessage && (
              <div className="error-message" style={{ textAlign: "center" }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="otp-input">
                <OtpInput
                  value={otp}
                  id="otp"
                  onChange={(o) => {
                    setOTP(o);
                  }}
                  numInputs={6}
                  separator={<span className="otp-separator">-</span>}
                />
                <div
                  className="success-message"
                  style={{ textAlign: "center" }}
                >
                  {successMessage} <br />
                  <span className="text-black flex flex-col items-center justify-center hover-underline">
                    Didn't receive? Resend OTP{" "}
                    <Timer
                      minutes={minutes}
                      seconds={seconds}
                      setMinutes={setMinutes}
                      setSeconds={setSeconds}
                    />
                  </span>
                </div>
                <button
                  onClick={() => sendOtpAgain()}
                  disabled={!(minutes === 0 && seconds === 0)}
                  className={`py-2 text-sm rounded-lg  
                                        ${
                                          minutes === 0 && seconds === 0
                                            ? "hover:underline"
                                            : "opacity-50"
                                        }`}
                ></button>
              </div>
            )}

            <div className="googleCaptcha">
              <small>
                This site is protected by reCAPTCHA and the Google
                <a href="https://policies.google.com/privacy">
                  Privacy Policy
                </a>{" "}
                and
                <a href="https://policies.google.com/terms">
                  Terms of Service
                </a>{" "}
                apply.
              </small>
            </div>
            <div className="recaptcha">
              <br />
              <div id="recaptcha-container"></div>
            </div>

            <div
              className="phone-btn-element"
              style={{ marginTop: "0px !important" }}
            >
              {!showVerifyOTP && (
                <button
                  className="w-full py-3 text-xl rounded-lg bg-BlueButton text-white"
                  onClick={!loading ? (e) => onSubmits(e) : null}
                  style={{ width: "100% !important" }}
                >
                  {loading ? "Loading…" : "Get OTP"}
                </button>
              )}

              {showVerifyOTP && (
                <button
                  className="w-full py-3 text-xl rounded-lg bg-BlueButton text-white"
                  onClick={!loading ? (e) => onSubmitVerifyOTP(e) : null}
                  style={{ width: "100% !important" }}
                >
                  {loading ? "Loading…" : "Verify OTP"}
                </button>
              )}
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default PhoneLogin;
