import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/UserContext.js";
import "./SPage.css";
import SignPageComponent from "../../components/SignPageComponent/SignPageComponent";
import LoginOtpComponent from "../../components/LoginOtpComponent/LoginOtpComponent";
import VerifyMobileNumberComponent from "../../components/VerifyMobileNumberComponent/VerifyMobileNumberComponent";
import PhoneLogin from "../../Modals/UserAccounts/PhoneLogin";

const SPage = (props) => {
  const [loginPhone, setLoginPhone] = useState(false);
  const [loginEmail, setLoginEmail] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const value = useContext(UserContext);

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    if (params.get("location")) {
      setShowEmail(true);
    }
  }, []);

  return (
    <div className="flex justify-center items-center bg-black">
      <div className="w-1/2 px-2 screen7:w-full ">
        <SignPageComponent
          setIsAdmin={props.setIsAdmin}
          setSignUp={props.setSignUp}
          setSignIn={props.setSignIn}
          showEmail={showEmail}
          setShowEmail={setShowEmail}
          setLoginPhone={setLoginPhone}
        />

        {loginPhone && (
          <PhoneLogin
            setShowPhone={setLoginPhone}
            showPhone={loginPhone}
            value={value}
            setShowEmail={setShowEmail}
            showEmail={showEmail}
            setSignUp={props.setSignUp}
            setSignIn={props.setSignIn}
            signIn={props.signIn}
            signUp={props.signUp}
            setIsAdmin={props.setIsAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default SPage;
