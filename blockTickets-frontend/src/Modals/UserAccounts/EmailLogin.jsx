import React, { useState } from "react";
import { LoginUser } from "../../api/api-client";
import { useNavigate } from "react-router-dom";

// styles
import "./email.css";
// react bootstrap
import { Button } from "react-bootstrap";
// images
import emailLogo from "../../images/profile/email.svg";
import passwordLogo from "../../images/profile/password.svg";
// modal
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const EmailLogin = ({
  setIsAdmin,
  value,
  showEmail,
  setShowEmail,
  setSignUp,
  setSignIn,
  signIn,
  signUp,
}) => {
  const handleOpen = () => setShowEmail(true);
  const handleClose = () => setShowEmail(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const userData = {
    email: user.email,
    password: user.password,
  };
  const redirectParams = new URLSearchParams(window.location.search);
  const redirect_url = redirectParams.get("redirect_url");

  const [passwordType, setPasswordType] = useState("password");
  const togglePassword =()=>{
    if(passwordType==="password")
    {
     setPasswordType("text")
     return;
    }
    setPasswordType("password")
  }


  const onSumbits = async (event) => {
    try {
      event.preventDefault();
      if (!userData.email && !userData.password) {
        setErrorMessage("Please enter your email and password!");
        return;
      }
      if (!userData.email) {
        setErrorMessage("Please enter your email!");
        return;
      }
      if (!userData.password) {
        setErrorMessage("Please enter your password!");
        return;
      }
      setLoading(true);
      const userD = await LoginUser(userData);
      // //console.log(userD.status);
      if (userD.status === 200) {
        const receiveData = userD.data.data;
        value.setUserToken(receiveData.accessToken);
        sessionStorage.setItem("token", receiveData.accessToken);
        sessionStorage.setItem("user-data", JSON.stringify(receiveData.user));
        sessionStorage.setItem(
          "METAMASK_WALLET",
          JSON.stringify(receiveData.user.wallets[0])
        );
        sessionStorage.setItem("isMetamaskConnected", false);

        handleClose();
        console.log("redirect_url: ", redirect_url);
        if (redirect_url?.length > 0 && redirect_url?.includes("ticket")) {
          console.log("dashboard/v2 ", redirect_url);
          setTimeout(() => {
            navigate("/dashboard/v2");
          }, 100);
          return;
        }
        console.log("here 78");
        if (window.location.pathname.includes("/event")) {
          return;
        }
        console.log("here 82");

        if (window.location.pathname === "/login") {
          console.log("here 85");
          navigate(-1);
          setTimeout(() => {
            if (window.location.pathname === "/user/verify-email")
              return navigate("/");
          }, 100);
          return;
        }
        console.log("here 88");
        if (!window.location.pathname.includes("ticket")) {
          console.log("here 90");
          navigate("/");
        }
        console.log("herre");
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data?.msg || "Please try again");
      setLoading(false);
    }
  };
  const handle = (e) => {
    const newData = { ...user };
    newData[e.target.id] = e.target.value;
    setUser(newData);
  };
  const goToForgotPass = () => {
    setShowEmail(false);
    navigate("/forgot-password");
  };
  return (
    <Modal
      open={showEmail}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        // sx={emailStyle}
        className='emailStyle relative'
      >
        <CloseIcon
          className='absolute cursor-pointer top-[12px] right-[12px]'
          fontSize='medium'
          onClick={handleClose}
        />
        <div className='email-login '>
          <h3 className='email-login-title'>Login with Email</h3>
          <form className='l-in-input' onSubmit={onSumbits}>
            <div className='l-input-element'>
              <div>
                <label htmlFor='email'>Email</label>
              </div>
              <span className='l-icon'>
                <img src={emailLogo} alt='' />
              </span>
              <input
                type='email'
                id='email'
                placeholder='your@email.com'
                value={user.email}
                onChange={(e) => handle(e)}
              />
              <br />
            </div>

            <div className='l-input-element'>
              <div>
                <label htmlFor='password'>Password</label>
                <div onClick={goToForgotPass} className='fgt-pass'>
                  Forgot Password?
                </div>
              </div>
              <span className='l-icon-p'>
                <img src={passwordLogo} alt='' />
              </span>
              <input
                type={passwordType}
                id='password'
                placeholder='Password'
                value={user.password}
                onChange={(e) => handle(e)}
              />
              <br />
            </div>
            <label>
                <input type='checkbox' style = {{marginLeft: "4px"}} onClick={togglePassword}/>    Show Password
            </label>
            
            {errorMessage && (
              <div className='error-message'>{errorMessage}</div>
            )}

            <div className='submit-element'>
              <button
                className='px-3 py-3 text-xl rounded-lg bg-BlueButton text-white'
                onClick={!loading ? (e) => onSumbits(e) : null}
                style={{ width: "100%" }}
              >
                {loading ? "Loading…" : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default EmailLogin;
