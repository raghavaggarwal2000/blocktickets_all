import React,{useState} from 'react';
import "./forgot-password.css";
import "../password.css";
import {Link} from "react-router-dom";
import {forgotPasswordSend} from "../../../../api/api-client";
import FullLoading from "../../../../Loading/FullLoading";

const ForgotPassword = (email) => {

  const [userEmail,setUserEmail] = useState([]);
  const [successMessage,setSuccessMessage] = useState([]);
  const [failureMessage,setFailureMessage] = useState([]);
  const [loading,setLoading] = useState(false);
  const sendForgotPassword = async (email) => {
    setLoading(true);
    try{const res = await forgotPasswordSend(email);

    //console.log(res);
    if(res && res.data) {
      setSuccessMessage(res.data.message)
    }
    setLoading(false);
  }
  catch(err) {
    //console.log(err.response);
    setFailureMessage(err.response.data.msg);
    setLoading(false);
  }
  }
  return (
    <>
    <div className="profile-password-container">
      {loading && <FullLoading />}

      <div className="profile-password">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive your reset password link</p>

          <div>
            <input 
            className="register-email"
            type="email" 
            id="userEmail" 
            name="register-email" 
            placeholder="Please enter your registered email for recover your password"

            onChange={(e)=>{
              setUserEmail(e.target.value)
            }}
            value={userEmail}/><br/>
            
          </div>
          {
            successMessage && <p className="success-msg">{successMessage}</p>
          }
          {
            failureMessage && <p className="failure-msg">{failureMessage}</p>
          }
          <div className="profile-password-buttons">
            <button onClick={()=>sendForgotPassword(userEmail)} className="px-3 py-3 text-xl rounded-lg bg-BlueButton text-white">Confirm Email Address</button>
            <Link to="/" className="cancel-email ">Cancel</Link>
          </div>
      </div>
    </div>
    </>
  )
};

export default ForgotPassword;
