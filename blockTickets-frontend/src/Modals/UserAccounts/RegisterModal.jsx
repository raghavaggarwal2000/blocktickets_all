import React, { useEffect, useState } from "react";
import { registerUser } from "../../api/api-client.js";
import { UserServices } from "../../api/supplier.js";
import { useNavigate } from "react-router-dom";
import "./email.css";
import "../SignUpModal/sign-up-modal.css";
// modal
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
// Styling
import nameLogo from "../../images/profile/name.svg";
import emailLogo from "../../images/profile/email.svg";
import passwordLogo from "../../images/profile/password.svg";
// react phone
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import MessageModal from "../Message Modal/MessageModal";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const RegisterModal = ({ signUp, setSignUp, setSignIn }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  // notification
  const [serverMessage, setServerMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [isVerify, setIsVerify] = useState(false);
  const [checkVerification, setCheckVerification] = useState(false);
  const [isUserExist, setIsUserExist] = useState(false);
  const [editRequest, setEditRequest] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });
  const [passwordType, setPasswordType] = useState("password");
  const togglePassword =()=>{
    if(passwordType==="password")
    {
     setPasswordType("text")
     return;
    }
    setPasswordType("password")
  }

  let navigate = useNavigate();

  useEffect(() => {
    if (editRequest) getUserByEmail();
  }, [editRequest]);


  const data = {
    username: newUser.name,
    email: newUser.email,
    phoneNumber: phoneNumber,
    password: newUser.password === newUser.cpassword && newUser.password,
  };
  const getUserByEmail = async () => {
    if (!data.username && !data.email && !data.phoneNumber && !data.password) {
      setErrorMessage("Please fill the above fields");
      return;
    }
    setIsUserExist(false);
    try {
      const user = await UserServices.userByEmail(data.email);
      if (!user) {
        console.log("getUserByEmail: This email doesn't exist");
        toast.error("Please sign up first");
      }
      setUserId(user?.data?.data?._id);
      setIsVerify(user?.data?.data?.isVerified);
      setIsUserExist(true);
    } catch (error) {
      console.log("err", error?.response.data);
      // toast.error(error?.response?.data?.msg);
    }
  };

  const editUserBeforeVerify = async (event) => {
    if (!data.username && !data.email && !data.phoneNumber && !data.password) {
      setErrorMessage("Please fill the above fields");
      return;
    }
    setLoading(true);
    event.preventDefault();
    try {
      const user = await UserServices.editUserByEmail({
        userId,
        ...data,
      });
      if (!user) {
        console.log("editUserBeforeVerify: This user don't exist");
        toast.error("Please sign up first");
      }
    } catch (error) {
      console.log("err", error?.response.data);
      // toast.error(error?.response?.data?.msg);
    }
    setLoading(false);
  };

  const onSubmits = async (event) => {
    if (!data.username && !data.email && !data.phoneNumber && !data.password) {
      setErrorMessage("Please fill the above fields");
      return;
    } else if (!data.password) {
      setErrorMessage("Password doesn't match");
      event.preventDefault();

      return;
    }
    setLoading(true);
    event.preventDefault();
    try {
      const regRes = await registerUser(data);
      if (regRes.status === 201) {
        setServerMessage(regRes.data.message);
        setSignUp(false);
        setMessageModal(true);
        setCheckVerification(true);
        setMessageModalDesc(regRes.data.message);
        setEmail(data.email);
        // navigate("/");
      } else {
        if (regRes && regRes.response.data) {
          setErrorMessage(regRes.response.data.msg);
        } else {
          setErrorMessage("Something went wrong... Please try again");
        }
      }
    } catch (err) {
      console.log("err", err?.response.data);
      toast.error(err?.response?.data?.msg);
    }
    setLoading(false);
  };
  const handle = (e) => {
    const newData = { ...newUser };
    newData[e.target.id] = e.target.value;
    setNewUser(newData);
  };

  // modal open and close
  const handleOpen = () => setSignUp(true);
  const handleClose = () => {
    setSignUp(false);
    setEditRequest(false);
  };

  const handleSubmitForm = (e) => {
    if (!loading) {
      if (editRequest) {
        editUserBeforeVerify(e);
        handleClose();
      } else {
        onSubmits(e);
      }
    } else if (!isUserExist) return null;
  };

  return (
    <div>
      <Modal
        open={signUp}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className='emailStyle relative'>
          <CloseIcon
            className='absolute cursor-pointer top-[12px] right-[12px]'
            fontSize='medium'
            onClick={handleClose}
          />
          <h3 className='register-title'>
            {editRequest ? "Edit Details" : "Sign Up"}
          </h3>
          <form className='s-in-input' onSubmit={onSubmits}>
            <div className='input-element'>
              <label htmlFor='name'>
                Full Name<span className='required-field'>*</span>
              </label>
              <span className='name-icon'>
                <img src={nameLogo} alt='' />
              </span>
              <input
                type='text'
                id='name'
                placeholder='Full Name'
                onChange={(e) => handle(e)}
                value={newUser.name}
              />
            </div>
            <div className='input-element'>
              <label htmlFor='email'>
                Email<span className='required-field'>*</span>
              </label>
              <span className='mail-icon'>
                <img src={emailLogo} alt='' />
              </span>
              <input
                type='email'
                id='email'
                placeholder='Email address'
                onChange={(e) => handle(e)}
                value={newUser.email}
              />
            </div>
            <div className='input-element'>
              <label htmlFor='mobile'>
                Mobile<span className='required-field'>*</span>
              </label>
              <PhoneInput
                placeholder='Enter phone number'
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
            </div>
            {!editRequest && (
              <>
                <div className='input-element'>
                  <label htmlFor='password'>
                    Password<span className='required-field'>*</span>
                  </label>
                  <span className='pass-icon'>
                    <img src={passwordLogo} alt='' />
                  </span>
                  <input
                    type={passwordType}
                    id='password'
                    placeholder='Password'
                    onChange={(e) => handle(e)}
                    value={newUser.password}
                  />
                </div>
                <div className='input-element'>
                  <label htmlFor='cpassword'>
                    Confirm Password<span className='required-field'>*</span>
                  </label>
                  <span className='pass-icon-2'>
                    <img src={passwordLogo} alt='' />
                  </span>
                  <input
                    type={passwordType}
                    id='cpassword'
                    placeholder='Password'
                    onChange={(e) => handle(e)}
                    value={newUser.cpassword}
                  />
                </div>
                  <input type='checkbox' style = {{marginLeft: "4px"}} onClick={togglePassword}/>    Show Password
                
              </>
            )}

            {serverMessage && (
              <div className='register-message'>{serverMessage}</div>
            )}
            {errorMessage && !serverMessage && (
              <div className='error-message'>{errorMessage}</div>
            )}

            <div
              className='submit-element'
              style={{ marginTop: "42px", width: "100%" }}
            >
              <button
                className='px-3 py-3 text-xl rounded-lg bg-BlueButton text-white'
                style={{ width: "100%" }}
                onClick={handleSubmitForm}
                disabled={editRequest && !isUserExist}
              >
                {loading
                  ? "Loading…"
                  : editRequest
                  ? "Confirm Edit"
                  : "Sign Up"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={"Register Message"}
        message={messageModalDesc}
        signUp={signUp}
        setSignUp={setSignUp}
        email={email}
        setEditRequest={setEditRequest}
        getUserByEmail ={getUserByEmail}
        isVerify ={isVerify}
        checkVerification={checkVerification}
      />
    </div>
  );
};

export default RegisterModal;
