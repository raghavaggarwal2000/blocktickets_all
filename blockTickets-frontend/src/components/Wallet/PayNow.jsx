import React, { useState, useEffect, useRef } from "react";
import "./pay-now.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

import { cashfreeProd } from "cashfree-dropjs";
import { cashfreeSandbox } from "cashfree-dropjs";
// API CALL
import {
  ticketLockedIncrement,
  ticketLockedDecrement,
  getMaticPrice,
} from "../../api/api-client.js";

import LoadingModal from "../../Modals/Loading Modal/LoadingModal.jsx";
import MessageModal from "../../Modals/Message Modal/MessageModal.jsx";
import MessageModal2 from "../../Modals/Message Modal/MessageModal2.jsx";

// redux
import { useDispatch } from "react-redux";
import TicketBuyLoading from "../../Loading/TicketBuyLoading.js";
import { toast } from "react-toastify";

const PayNow = ({ isLogin, setSignIn }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [renderComponent, setRenderComponent] = useState(false);
  const [showFullLoading, setShowFullLoading] = useState(false);
  const [payTab, setPayTab] = useState(2);
  const [payMessage, setPayMessage] = useState("Please Wait");
  const [showWalletAdded, setShowWalletAdded] = useState(false);

  const [metamaskWallet, setMetamaskWallet] = useState("");

  const [modalTitle, setModalTitle] = useState("Message");

  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");

  const [messageModal2, setMessageModal2] = useState(false);
  const [messageModalDesc2, setMessageModalDesc2] = useState(
    "You have successfully booked your ticket"
  );
  const selectedTickets = JSON.parse(localStorage.getItem("selectedTickets"));

  const eventData = useSelector((state) => state.eventReducer.getEvents);

  const newcbs = (data) => {
    const selectedTickets = JSON.parse(localStorage.getItem("selectedTickets"));
    if (
      (data.order && data.order.status == "PAID") ||
      data.order.status == "ACTIVE"
    ) {
      setShowFullLoading(true);
      setPayMessage(
        "Your transaction is successful. Please wait while we book your ticket"
      );
      //if event is Vikrant Rona
      var config = {
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/payment/cashfree-verify`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          orderId: data.order.orderId,
        }),
      };

      axios(config)
        .then(function (response) {
          axios
            .post(
              `${process.env.REACT_APP_BACKEND_URL}/ticket/book-ticket`,
              JSON.stringify({
                orderId: data.order.orderId,
              }),
              {
                headers: {
                  Authorization: `Bearer ${isLogin}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((val) => {
              setRenderComponent(false);
              setShowFullLoading(false);
              setMessageModal2(true);
              setMessageModalDesc2(
                "You have successfully booked your NFT Ticket. Once minted your NFT ticket will be visible in My Tickets section."
              );
            })
            .catch((err) => {
              const decreaseCounter = ticketLockedDecrement(
                selectedTickets,
                isLogin
              );
              setRenderComponent(false);
              setShowFullLoading(false);
              setMessageModal(true);
              setMessageModalDesc(
                "You have successfully booked your NFT Ticket. Once minted your NFT ticket will be visible in My Tickets section."
              );
            });
        })
        .catch(function (error) {
          const decreaseCounter = ticketLockedDecrement(
            selectedTickets,
            isLogin
          );
          setRenderComponent(false);
          setShowFullLoading(false);
          setMessageModal(true);
          setMessageModalDesc(
            "Tickets not Booked. Contact support for refund details"
          );
        });
    } else {
      //order is still active and payment has failed
      setRenderComponent(false);
      setMessageModal(true);
      setShowFullLoading(false);
      setMessageModalDesc("Payment Error 110: Payment Failed...");
    }
  };
  const cbf = async (data) => {
    const selectedTickets = JSON.parse(localStorage.getItem("selectedTickets"));
    setRenderComponent(false);
    setMessageModal(true);
    setShowFullLoading(false);
    setMessageModalDesc("Payment Error 109: Payment Failed...");
    const decreaseCounter = await ticketLockedDecrement(
      selectedTickets,
      isLogin
    );
  };
  const renderDropin = (resultOrderToken) => {
    if (resultOrderToken === "") {
      alert("Order Token is empty");
      return;
    }
    setRenderComponent(true);

    let parent = document.getElementById("drop_in_container");
    parent.innerHTML = "";
    let cashfree;
    if (process.env.REACT_APP_CHAIN == "MAINNET") {
      cashfree = new cashfreeProd.Cashfree();
    } else {
      cashfree = new cashfreeSandbox.Cashfree();
      toast.info("Test Environment!!");
    }

    cashfree.initialiseDropin(parent, {
      orderToken: resultOrderToken,
      onSuccess: newcbs,
      onFailure: cbf,
      components: ["order-details", "card", "netbanking", "upi"],
      style: {
        //to be replaced by the desired values
        backgroundColor: "#ffffff",
        color: "#042469",
        fontFamily: "Lato",
        fontSize: "14px",
        errorColor: "#ff0000",
        theme: "light", //(or dark)
      },
    });
  };
  const createPay = async () => {
    const selectedTickets = JSON.parse(localStorage.getItem("selectedTickets"));
    const headers = {
      method: "POST",
      "Content-Type": "application/json",
    };
    setPayMessage(
      "Your special NFT Ticket & Airdrops is being minted on Blockchain"
    );
    setShowFullLoading(true);
    if (!userPhoneNumber && userPhoneNumber.length !== 10) {
      setMessageModal(true);
      setShowFullLoading(false);
      setMessageModalDesc("Please enter your 10 digit phone number");
      return;
    }
    const userInfo = {
      email: JSON.parse(sessionStorage.getItem("user-data")).email,
      userId: JSON.parse(sessionStorage.getItem("user-data")).userId,
      phone: userPhoneNumber,
    };
    const increaseCounter = await ticketLockedIncrement(
      selectedTickets,
      isLogin
    );
    if (increaseCounter && increaseCounter.status === 200) {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/payment/cashfree-get-order-token`,
          {
            selectedTickets,
            type: "event",
            userInfo,
            network: 56,
          },
          headers
        )
        .then((response) => {
          const { status } = response;
          setShowFullLoading(false);
          return response.data;
        })
        .then((result) => {
          renderDropin(result.orderToken);
        })
        .catch(async (err) => {
          console.log(err);
          const decreaseCounter = await ticketLockedDecrement(
            selectedTickets,
            isLogin
          );
          setShowFullLoading(false);
          setMessageModal(true);
          setMessageModalDesc(
            "ERR CGOT:Your Ticket was not booked some error occurred, Please Try again"
          );
        });
    } else {
      const decreaseCounter = await ticketLockedDecrement(
        selectedTickets,
        isLogin
      );
      setShowFullLoading(false);
      setMessageModal(true);
      setMessageModalDesc(
        "ERR INC_C:Your Ticket was not booked some error occurred, Please Try again"
      );
    }
  };

  const payToggleTab = (index) => {
    setPayTab(index);
  };
  const cancelPayment = async () => {
    navigate(
      `/${eventData?.data?.Event?.eventTitle}/${eventData.data.Event._id}`
    );
    window.location.reload();
  };
  useEffect(() => {
    document.body.scrollTop = 0;
    if (
      JSON.parse(sessionStorage.getItem("user-data")) &&
      JSON.parse(sessionStorage.getItem("user-data")).phoneNumber
    ) {
      setUserPhoneNumber(
        JSON.parse(sessionStorage.getItem("user-data")).phoneNumber
      );
    }
  }, []);

  let payRef = useRef();
  useEffect(() => {
    let handler = async (event) => {
      if (payRef && payRef.current && !payRef.current.contains(event.target)) {
        setRenderComponent(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div className="pay-now-details">
      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={modalTitle}
        message={messageModalDesc}
      />
      <MessageModal2
        show={messageModal2}
        setShow={setMessageModal2}
        title="Payment Success"
        message={messageModalDesc2}
      />
      <div
        className={
          renderComponent ? "dropin-container-show" : "dropin-container-hide"
        }
      >
        <div
          ref={payRef}
          className="dropin-parent"
          id="drop_in_container"
          style={{ minHeight: "570px" }}
        >
          Your component will come here
        </div>
      </div>
      {showFullLoading && <TicketBuyLoading message={payMessage} />}
      <div className="pay-now-container">
        <div className="pay-now-tabs">
          <div
            className={
              payTab === 2 ? "pay-fiat active-tab" : "pay-fiat active-tab"
            }
            onClick={() => payToggleTab(2)}
            style={{ width: "100%" }}
          >
            Payment Details
          </div>
        </div>

        <div className="pay-now-tab-content">
          <div
            className={
              payTab === 1 ? "content-crypto active-content" : "content-crypto"
            }
          >
            {/* Your wallet address */}
            <div className="p-wallet-address-items-input">
              <label htmlFor="wallet-address">
                Your Wallet Address
                <span className="wallet-asterik">*</span>
              </label>
              <input
                type="text"
                placeholder={
                  metamaskWallet && metamaskWallet.length > 0
                    ? metamaskWallet
                    : "Connect your wallet"
                }
                id="wallet-address"
                name="wallet-address"
                disabled={true}
              />
              <i className="far fa-copy copy-icon"></i>
            </div>

            <div className="p-wallet-address-items-get-token">
              <div className="get-token-coin">
                <label htmlFor="wallet-token">
                  Currency
                  <span className="wallet-asterik">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MATIC"
                  id="wallet-token"
                  name="wallet-token"
                  disabled={true}
                />
              </div>
            </div>
            {isLogin ? (
              <div>
                <button className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md">
                  Pay Now
                </button>
                <button
                  className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                  onClick={() => cancelPayment()}
                >
                  Cancel
                </button>
                {showWalletAdded && (
                  <p className="wallet_added">
                    *Wallet added successfully to your account...
                  </p>
                )}
              </div>
            ) : (
              <div>
                <button
                  className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                  onClick={() => setSignIn(true)}
                >
                  Login to Buy Ticket
                </button>
                <button
                  className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                  onClick={() => cancelPayment()}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* fiat currency tab */}
          <div
            className={
              payTab === 2 ? "content-crypto active-content" : "content-crypto"
            }
          >
            {/* Your wallet address */}

            <div className="fiat-pay">
              <form>
                <div className="fiat-pay-input-a">
                  <label htmlFor="ename">
                    Event name<span>*</span>
                  </label>
                  <input
                    type="text"
                    id="ename"
                    name="ename"
                    placeholder={eventData.data.Event.eventTitle}
                    disabled={true}
                  />
                </div>
                <div className="fiat-pay-input-a">
                  <label htmlFor="tickname">
                    Ticket Name & Number<span>*</span>
                  </label>
                  <input
                    type="text"
                    id="tickname"
                    name="tickname"
                    placeholder={selectedTickets[0].ticketName}
                    disabled={true}
                  />
                </div>
                <div className="fiat-pay-input-a" style={{ width: "100%" }}>
                  <label htmlFor="cardname">
                    Quantity<span>*</span>
                  </label>
                  <input
                    type="number"
                    className="special-placeholder"
                    id="cardname"
                    name="cardname"
                    placeholder={selectedTickets
                      .map((item) => item.quantity)
                      .reduce((prev, next) => prev + next)}
                    disabled={true}
                  />
                </div>
                <div className="fiat-pay-input-a">
                  <label htmlFor="cardname">
                    Phone Number(10 digit)<span>*</span>
                  </label>
                  <input
                    type="tel"
                    className="special-placeholder"
                    id="cardname"
                    name="cardname"
                    placeholder="Please enter you phone number"
                    disabled={false}
                    onChange={(e) => setUserPhoneNumber(e.target.value)}
                    value={userPhoneNumber}
                  />
                </div>
              </form>
            </div>
            <div>
              <div
                className={
                  payTab === 2
                    ? "content-crypto active-content"
                    : "content-crypto"
                }
              >
                {/* multiplied by 100 for rupees */}
                {isLogin ? (
                  <button
                    className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                    style={{
                      width: "100%",
                      margin: "20px 0 5px 0",
                    }}
                    onClick={createPay}
                  >
                    Buy Ticket ₹{" "}
                    {(
                      selectedTickets
                        .map((item) => item.quantity * item.price)
                        .reduce((prev, next) => (prev + next).toFixed(2)) * 1.02
                    ).toFixed(2)}
                  </button>
                ) : (
                  <div>
                    <button
                      className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                      onClick={() => setSignIn(true)}
                    >
                      Login to Buy Ticket
                    </button>
                    <button
                      className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                      onClick={() => cancelPayment()}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNow;
