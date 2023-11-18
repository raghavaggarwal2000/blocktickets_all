import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../modals.css";
// import card from "../../images/card.svg";
import axios from "axios";

const PayUsingMarket = ({
  payUsing,
  setPayUsing,
  userTicketId,
  // makePayment,
  buyNft,
  nftBuyIndex,
  ticketId,
  // rzpPayment,
  ticketMaticPrice,
  createPay,
  setPhoneNumber,
  phoneNumber,
}) => {
  const handleClose = () => setPayUsing(false);
  const handleShow = () => setPayUsing(true);

  const [maticUSD, setMaticUSD] = useState("");
  const [showPhoneEnter, setShowPhoneEnter] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=inr`
      )
      .then((res) => {
        // Matic -> Currency
        setMaticUSD(res.data["binancecoin"].inr);
      })
      .catch((err) => {
        //
      });
  }, []);
  const continuePay = () => {
    if (!phoneNumber || phoneNumber.length != 10) {
      setError("Please enter valid phone number.");
      return;
    }
    createPay();
  };

  useEffect(() => {
    setError("");
  }, [phoneNumber]);
  return (
    <div>
      <Modal show={payUsing} onHide={handleClose} keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Mode</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!showPhoneEnter && (
            <div className="pay-type-btn">
              <button
                className="pay-using-stripe"
                onClick={() => setShowPhoneEnter(true)}
              >
                {/* <img className="card-img" src={card} alt="" /> */}
                Card Payment
              </button>
            </div>
          )}

          {showPhoneEnter && (
            <div className="getPhoneNumber">
              <div>Enter Phone Number</div>
              <input
                placeholder="999 999 9999"
                className="bid-input-price"
                type="number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
              {error && <div className="error-message">{error}</div>}
              <button className="pay-using-stripe" onClick={continuePay}>
                {/* <img className="card-img" src={card} alt="" /> */}
                Pay Now
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PayUsingMarket;
