import React, { useEffect, useState } from "react";
import "./verify-email.css";
import { verifyEmail } from "../../api/api-client.js";
import LoadingModal from "../../Modals/Loading Modal/LoadingModal.jsx";
import MessageModal3 from "../../Modals/Message Modal/MessageModal3";

const VerifyEmail = () => {
  // let { accessToken, email } = useParams();
  const [email, setEmail] = useState([]);
  const [token, setToken] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");

  const getVerify = async (accessToken, email) => {
    setModalShow(true);
    try {
      const res = await verifyEmail(email, accessToken);
      setModalShow(false);
      setMessageModal(true);
      setMessageModalDesc("Your mail has been verified, you can login now.");
    } catch (err) {
      setModalShow(false);
      setMessageModal(true);
      setMessageModalDesc(err.response.data.msg);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    setEmail(params.get("email"));
    setToken(params.get("token"));
  }, []);
  return (
    <div className="min-h-screen bg-black">
      <LoadingModal visibility={modalShow} title={"Please wait"} />
      <MessageModal3
        show={messageModal}
        setShow={setMessageModal}
        title={"Message"}
        message={messageModalDesc}
      />
      <div className="verify-email  rounded-lg">
        <div className="verify-email-container">
          <h2>Verify Your Email</h2>
          <p>Please click the button below to verify your email</p>
          <button
            className="hover:opacity-75"
            onClick={() => getVerify(email, token)}
          >
            Verify Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
