import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "./user-account.css";
import "../../pages/Profile/signin.css";
import {
  metamaskLogin,
  LoginUser,
  socialLoginUser,
  phoneLoginUser,
} from "../../api/api-client.js";
import { UserContext } from "../../Context/UserContext.js";
import Web3 from "web3";
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
// images
import email from "../../images/profile/email.svg";
import google from "../../images/profile/google.svg";
import facebook from "../../images/profile/facebook.svg";
import mobile from "../../images/profile/mobileLogin.svg";
import EmailLogin from "./EmailLogin";
import PhoneLogin from "./PhoneLogin";
import FullLoading from "../../Loading/FullLoading";
import metamaskFace from "../../images/metamask_face.png";
import MessageModal from "../Message Modal/MessageModal";
import CloseIcon from "@mui/icons-material/Close";

const modalHeading = {
  fontFamily: "Montserrat",
  position: "absolute",
  top: "56%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 520,
  bgcolor: "#ffffff",
  border: "none",
  outline: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: "24px",
};

const UserAccounts = (props) => {
  const [metaWallet, setMetaWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [metaError, setMetaError] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const [messageModal, setMessageModal] = useState(false);
  const [messageDetail, setMessageDetail] = useState("Please Wait...");

  const value = useContext(UserContext);

  let navigate = useNavigate();

  const handleOpen = () => props.setSignIn(true);
  const handleClose = () => props.setSignIn(false);

  const setAccessToken = async (token) => {
    try {
      const userInfo = await socialLoginUser(token);
      sessionStorage.setItem("token", userInfo.data.accessToken);
      value.setUserToken(userInfo.data.accessToken);
      sessionStorage.setItem("user-data", JSON.stringify(userInfo.data.user));
      sessionStorage.setItem(
        "METAMASK_WALLET",
        JSON.stringify(userInfo.data.user.wallets[0])
      );
      sessionStorage.setItem("isMetamaskConnected", false);
      if (
        JSON.parse(sessionStorage.getItem("user-data")) &&
        JSON.parse(sessionStorage.getItem("user-data")).isAdmin
      ) {
        props.setIsAdmin(
          JSON.parse(sessionStorage.getItem("user-data")).isAdmin
        );
      } else {
        props.setIsAdmin(true);
      }

      if (window.location.pathname.includes("event-details")) {
        return;
      }
      if (!window.location.pathname.includes("ticket")) {
        navigate("/");
      }
      // else {
      //     navigate("/user-wallet-details");
      // }
    } catch (err) {
      //
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = result.user.accessToken;
      setAccessToken(token);

      if (token) {
        props.setSignIn(false);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        //
        if (window.location.pathname.includes("/event")) {
          return;
        }
        if (!window.location.pathname.includes("ticket")) {
          navigate("/");
        }
      }
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      setErrorMessage(error.message);

      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      setLoading(false);
    }
  };

  const fbLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, fbProvider);

      const token = result.user.accessToken;
      // //
      setAccessToken(token);
      props.setSignIn(false);
      setLoading(false);
      if (window.location.pathname.includes("/event")) {
        return;
      }
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/account-exists-with-different-credential") {
        try {
          // User's email already exists.
          // The pending Facebook credential.
          // //
          var pendingCred = OAuthProvider.credentialFromError(error);
          // The provider account's email address.
          var email = error.email;
          // Get sign-in methods for this email.

          // const methods = await fetchSignInMethodsForEmail(getAuth(), email)
          // //
          var provider = fbProvider;

          if (
            window.confirm(
              "You have signed in with Google before. Link account to facebook?"
            )
          ) {
            const result = await signInWithPopup(auth, googleProvider);
            // //
            const usercred = await linkWithCredential(result.user, pendingCred);
            // //
            const token = result.user.accessToken;
            setAccessToken(token);
            props.setSignIn(false);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
        }
      }
    }
  };

  //metamask
  let ethereum = 0;
  if (!window.ethereum) {
    //
  } else {
    ethereum = window.ethereum;
  }
  const metaLogin = async () => {
    var web3 = new Web3(Web3.givenProvider);
    if (!window.ethereum) {
      return window.alert("Please install Metamask first...");
    }
    setLoading(true);
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setMetaWallet(accounts[0]);
      const res = await metamaskLogin(accounts[0]);
      if (res && res.response && res.response.data) {
        setErrorMessage(res.response.data.msg);
        setLoading(false);
      }
      if (res.status === 200) {
        const signAddress = await web3.eth.personal.sign(
          `I am signing my one-time nonce: ${res.data.data.nonce}`,
          accounts[0],
          "Signature"
        );

        const userInfo = await LoginUser({
          walletAddress: accounts[0],
          signature: signAddress,
        });
        sessionStorage.setItem("token", userInfo.data.accessToken);
        value.setUserToken(userInfo.data.accessToken);
        sessionStorage.setItem("user-data", JSON.stringify(userInfo.data.user));
        sessionStorage.setItem("isMetamaskConnected", true);
        if (
          JSON.parse(sessionStorage.getItem("user-data")) &&
          JSON.parse(sessionStorage.getItem("user-data"))?.isAdmin
        ) {
          props.setIsAdmin(
            JSON.parse(sessionStorage.getItem("user-data"))?.isAdmin
          );
        } else {
          props.setIsAdmin(true);
        }
        setLoading(false);
        if (
          userInfo &&
          userInfo.data &&
          userInfo.data.user &&
          userInfo.data.user.wallets
        ) {
          handleClose();
        }
      } else if (res && res.response && res.response.status === 400) {
        setLoading(false);
      } else if (res && res.response && res.response.data) {
        setLoading(false);
      }
    } catch (err) {
      // //
      setLoading(false);
      setMessageDetail(err.message);
      setMessageModal(true);
      handleClose();
    }
  };
  if (ethereum) {
    ethereum.on("accountsChanged", function (accounts) {
      //
      setMetaWallet(accounts[0]);
      sessionStorage.setItem("METAMASK_WALLET", accounts[0]);
    });
  }

  useEffect(() => {
    setMetaWallet(ethereum.selectedAddress);
  }, [metaWallet]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 10000);
  }, [errorMessage]);

  return (
    <div>
      {loading && <FullLoading />}
      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={"Metamask Wallet"}
        message={messageDetail}
      />
      <Modal
        open={props.signIn}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalHeading} className="user-account-modal relative">
          <CloseIcon
            className="absolute cursor-pointer top-[12px] right-[12px]"
            fontSize="medium"
            onClick={() => props.setSignIn(false)}
          />
          <p className="font-medium text-center text-xl">Log in</p>
          <div id="modal-modal-description" sx={{ mt: 2 }} align="center">
            <button onClick={googleLogin} className="modal-account-btn">
              <img src={google} className="google" alt="email" />
              Google
            </button>
            <button onClick={fbLogin} className="modal-account-btn">
              <img src={facebook} className="facebook" alt="facebook" />
              Facebook
            </button>
            <button
              onClick={() => setShowPhone(true)}
              className="modal-account-btn"
            >
              <img src={mobile} className="phone" alt="mobile" />
              Mobile number
            </button>
            <button
              onClick={() => {
                props.setSignIn(false);
                setShowEmail(true);
              }}
              className="modal-account-btn"
            >
              <img src={email} className="email" alt="email" /> Email
            </button>
            <div className="mb-1 text-sm">Or</div>
            <button
              onClick={() => {
                props.setSignIn(false);

                props.setSignUp(true);
              }}
              className="modal-account-btn"
            >
              <img src={email} className="email" alt="email" /> Create account
              with email
            </button>
          </div>

          {errorMessage && (
            <div align="center" className="error-message">
              *{errorMessage}
            </div>
          )}
        </Box>
      </Modal>
      {showEmail ? (
        <EmailLogin
          value={value}
          setShowEmail={setShowEmail}
          showEmail={showEmail}
          setSignUp={props.setSignUp}
          setSignIn={props.setSignIn}
          signIn={props.signIn}
          signUp={props.signUp}
          setIsAdmin={props.setIsAdmin}
        />
      ) : (
        ""
      )}
      {showPhone ? (
        <PhoneLogin
          setShowPhone={setShowPhone}
          showPhone={showPhone}
          value={value}
          setIsAdmin={props.setIsAdmin}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default UserAccounts;
