import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./SignPageComponent.css";
import {
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import Web3 from "web3";
import {
  socialLoginUser,
  metamaskLogin,
  LoginUser,
  coinBaseLogin,
  walletConnectorLogin,
} from "../../api/api-client";
import { auth, googleProvider, fbProvider } from "../../firebase/firebase";
import { UserContext } from "../../Context/UserContext";
import { useNavigate, Navigate } from "react-router-dom";
import EmailLogin from "../../Modals/UserAccounts/EmailLogin";
import PhoneLogin from "../../Modals/UserAccounts/PhoneLogin";
import CreatorInfo from "../../Modals/EventCreatorInfo/CretorInfo";
import {
  ethereumCoinBase,
  walletConnectorProvider,
} from "../../Redux/contracts";
import useWeb3Ctx from "../../Context/Web3Context";
import { toast } from "react-toastify";

const SignPageComponent = (props) => {
  const dispatch = useDispatch();
  const [metaWallet, setMetaWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [metaError, setMetaError] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [messageDetail, setMessageDetail] = useState("Please Wait...");
  const { account, openModal } = useWeb3Ctx();
  let navigate = useNavigate();

  const value = useContext(UserContext);
  let redirect_url = "";
  const redirectParams = new URLSearchParams(window.location.search);
  redirect_url = redirectParams.get("redirect_url");
  let show_creator_info = redirectParams.get("show-creator-info");
  const showModalInfo = () => {
    if (Boolean(show_creator_info)) {
      //show creator info modal
      setCreatorOpen(true);
    }
  };
  const setAccessToken = async (token) => {
    try {
      const userInfo = await socialLoginUser(token);
      sessionStorage.setItem("token", `${userInfo.data.accessToken}`);
      value.setUserToken(userInfo.data.accessToken);
      sessionStorage.setItem("user-data", JSON.stringify(userInfo.data.user));
      sessionStorage.setItem(
        "METAMASK_WALLET",
        JSON.stringify(userInfo.data.user.wallets[0])
      );
      sessionStorage.setItem("isMetamaskConnected", "false");
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
      if (window.location.pathname.includes("/event")) {
        return;
      }
      if (window.location.pathname === "/login") {
        return navigate(-1);
      }
      if (redirect_url?.length > 0 && redirect_url?.includes("ticket")) {
        navigate(`/dashboard/v2`);
        console.log("here");
      } else if (!window.location.pathname.includes("ticket")) {
        navigate("/");
      }
    } catch (err) {
      //console.log(err);
    }
  };
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("result: ", result);
      const token = result.user.accessToken;
      console.log("token: ", token);
      await setAccessToken(token);
      if (token) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);

        if (window.location.pathname.includes("/event")) {
          return;
        }
        if (redirect_url?.length > 0 && redirect_url?.includes("ticket")) {
          navigate(`/dashboard/v2`);
        } else if (!window.location.pathname.includes("ticket")) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log("error: ", error);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
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
      // //console.log(token);
      setAccessToken(token);
      props.setSignIn(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/account-exists-with-different-credential") {
        try {
          var pendingCred = OAuthProvider.credentialFromError(error);
          var email = error.email;
          var provider = fbProvider;
          if (
            window.confirm(
              "You have signed in with Google before. Link account to facebook?"
            )
          ) {
            const result = await signInWithPopup(auth, googleProvider);
            const usercred = await linkWithCredential(result.user, pendingCred);
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
  // coinbase
  const connectToCoinbase = async () => {
    try {
      var web3 = new Web3(Web3.givenProvider);
      setLoading(true);
      const accounts = await ethereumCoinBase.enable();
      const res = await coinBaseLogin(accounts[0]);
      // console.log(res.response, res.response.status == 400);
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
        // //console.log(userInfo);
        sessionStorage.setItem("token", userInfo.data.accessToken);
        value.setUserToken(userInfo.data.accessToken);
        sessionStorage.setItem("user-data", JSON.stringify(userInfo.data.user));
        sessionStorage.setItem("isCoinbaseConnected", true);
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

        setLoading(false);
        if (!window.location.pathname.includes("ticket")) {
          navigate("/");
        }

        if (
          userInfo &&
          userInfo.data &&
          userInfo.data.user &&
          userInfo.data.user.wallets
        ) {
        }
      } else if (res && res.response && res.response.status == 400) {
        setLoading(false);
        toast.error(res.response.data.msg);
      } else if (res && res.response && res.response.data) {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setMessageDetail(err?.message);
      setMessageModal(true);
    }
  };
  //metamask
  let ethereum;
  if (!window.ethereum) {
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
        // signing address
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
          JSON.parse(sessionStorage.getItem("user-data")).isAdmin
        ) {
          props.setIsAdmin(
            JSON.parse(sessionStorage.getItem("user-data")).isAdmin
          );
        } else {
          props.setIsAdmin(true);
        }
        setLoading(false);
        if (!window.location.pathname.includes("ticket")) {
          navigate("/");
        }
      } else if (res && res.response && res.response.status === 400) {
        setLoading(false);
      } else if (res && res.response && res.response.data) {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setMessageDetail(err.message);
      setMessageModal(true);
    }
  };
  // wallet connect
  const connectToWalletConnector = async () => {
    try {
      setLoading(true);
      var web3 = new Web3(walletConnectorProvider);

      const accounts = await walletConnectorProvider.enable();
      // console.log(accounts);
      const res = await walletConnectorLogin(accounts[0]);
      // console.log(res);
      if (res && res.response && res.response.data) {
        //console.log(res.response);
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
        // //console.log(userInfo);
        sessionStorage.setItem("token", userInfo.data.accessToken);
        value.setUserToken(userInfo.data.accessToken);
        sessionStorage.setItem("user-data", JSON.stringify(userInfo.data.user));
        sessionStorage.setItem("isWalletConnectConnected", true);
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

        setLoading(false);
        if (!window.location.pathname.includes("ticket")) {
          navigate("/");
        }

        if (
          userInfo &&
          userInfo.data &&
          userInfo.data.user &&
          userInfo.data.user.wallets
        ) {
        }
      } else if (res && res.response && res.response.status === 400) {
        setLoading(false);
        // console.log(res.response.data.msg);
        return toast.error(res.response.data.msg);
      } else if (res && res.response && res.response.data) {
        setLoading(false);
      }
    } catch (err) {
      // console.log("err ", err);
      setLoading(false);
      setMessageDetail(err.message);
      setMessageModal(true);
    }
  };
  if (ethereum) {
    ethereum.on("accountsChanged", function (accounts) {
      //console.log(accounts[0]);
      setMetaWallet(accounts[0]);
      sessionStorage.setItem("METAMASK_WALLET", accounts[0]);
    });
  }
  const createWalletLogin = async () => {
    try {
      // console.log("in");
      var web3 = new Web3(Web3.givenProvider);
      if (!window.ethereum) {
        return window.alert("Please install Metamask first...");
      }
      const res = await metamaskLogin(account);
      if (res && res.response && res.response.data) {
        setErrorMessage(res.response.data.msg);
        setLoading(false);
      }
      if (res.status === 200) {
        // signing address
        const signAddress = await web3.eth.personal.sign(
          `I am signing my one-time nonce: ${res.data.data.nonce}`,
          account,
          "Signature"
        );
        const userInfo = await LoginUser({
          walletAddress: account,
          signature: signAddress,
        });
        sessionStorage.setItem("token", userInfo.data.accessToken);
        value.setUserToken(userInfo.data.accessToken);
        sessionStorage.setItem("user-data", JSON.stringify(userInfo.data.user));
        sessionStorage.setItem("isMetamaskConnected", true);
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
        setLoading(false);
        if (!window.location.pathname.includes("ticket")) {
          navigate("/");
        }
      } else if (res && res.response && res.response.status === 400) {
        setLoading(false);
        toast.error(res.response.data.msg);
      } else if (res && res.response && res.response.data) {
        setLoading(false);
      }
    } catch (err) {
      // console.log(err, "err");
    }
  };
  useEffect(() => {
    setMetaWallet(ethereum?.selectedAddress);
  }, [metaWallet]);

  useEffect(() => {
    document.body.scrollTop = 0;
    showModalInfo();
  }, []);
  if (sessionStorage.getItem("user-data")) {
    return <Navigate to="/" />;
  }
  return (
    <div className="grid grid-cols-1 flex-col gap-2 pt-[70px] min-h-screen bg-black">
      <CreatorInfo open={creatorOpen} setOpen={setCreatorOpen} />
      <h2 className="flex font-hnb items-center justify-center h-[70px] w-full text-center text-silver">
        Login or Signup
      </h2>

      {/* This option is temporarily turned off for some issues */}
      {/* <button
        className="flex items-center justify-center h-[70px] hover:opacity-75 text-xl rounded-lg bg-BlueButton text-white w-full"
        onClick={() => props.setLoginPhone(true)}
      >
        Login using phone
      </button> */}
      <button
        className="flex items-center justify-center h-[70px] hover:opacity-75 text-xl rounded-lg text-white w-full bg-[#BD4A41]"
        onClick={googleLogin}
      >
        Sign In with Google
      </button>
      <button
        className="flex items-center justify-center h-[70px] hover:opacity-75 text-xl rounded-lg text-white w-full bg-[#3b5998]"
        onClick={fbLogin}
      >
        Sign In with Facebook
      </button>

      {/* Metamast login option is disabled by the bloktickets as of now */}
      {/* <button
        className="flex items-center justify-center h-[70px] hover:opacity-75 text-xl rounded-lg text-white w-full bg-[#131313]"
        onClick={metaLogin}
      >
        Sign In with Metamask
      </button> */}
      <button
        className="flex items-center justify-center h-[70px] hover:opacity-75 text-xl rounded-lg bg-BlueButton text-white w-full"
        onClick={() => props.setShowEmail(true)}
      >
        Login
      </button>

      <div className="flex items-center justify-center h-[70px] text-xl text-white w-full flex font-bold  justify-center items-center">
        Or
      </div>
      <button
        className="flex items-center justify-center h-[70px] w-full text-xl rounded-lg text-white border-orange bg-orange flex justify-center items-center hover:opacity-75"
        onClick={() => {
          props.setSignIn(false);
          props.setSignUp(true);
        }}
      >
        Create new account
      </button>

      {props.showEmail ? (
        <EmailLogin
          value={value}
          setShowEmail={props.setShowEmail}
          showEmail={props.showEmail}
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
          setShowEmail={props.setShowEmail}
          showEmail={props.showEmail}
          setSignUp={props.setSignUp}
          setSignIn={props.setSignIn}
          signIn={props.signIn}
          signUp={props.signUp}
          setIsAdmin={props.setIsAdmin}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SignPageComponent;
