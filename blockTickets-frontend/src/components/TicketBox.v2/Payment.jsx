import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Cashfree
import { cashfreeProd } from "cashfree-dropjs";
import { cashfreeSandbox } from "cashfree-dropjs";
import { toast } from "react-toastify";
import "./TicketBox.css";
import axios from "axios";
import {
  TicketServices,
  setAuthToken,
  StripeServices,
} from "../../api/supplier";
import { ticketLockedIncrement } from "../../api/api-client";
import MobileNumber from "../../Modals/MobileNumber/MobileNumber";
import getSymbolFromCurrency from "currency-symbol-map";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Stripe/StripeCheckoutForm";
import FullLoading from "../../Loading/FullLoading";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Payments = ({
  selectedTickets,
  setShowFullLoading,
  setRenderComponent,
  setPayMessage,
  setMessageModal,
  setMessageModalDesc,
  isLogin,
  setSignIn,
  currency,
  event,
  promoCodeInfo,
  getValues,
  ip,
  breakupPrices,
  eventId,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [userPhoneNumber, setPhoneNumber] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const newcbs = (data) => {
    const selectedTickets = JSON.parse(localStorage.getItem("selectedTickets"));
    let finalPrices = [];
    for (let i = 0; i < selectedTickets.length; i++) {
      finalPrices.push(selectedTickets[i]?.tax_prices?.finalPrice);
    }
    if (
      (data.order && data.order.status == "PAID") ||
      data.order.status == "ACTIVE"
    ) {
      setShowFullLoading(true);
      setPayMessage(
        "Your transaction is successful. Please wait while we book your ticket"
      );
      var config = {
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/payment/cashfree-verify`,
        headers: {
          Authorization: `Bearer ${isLogin}`,
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
                method: "cashfree",
                userId: JSON.parse(sessionStorage.getItem("user-data"))?.userId,
                couponCode: promoCodeInfo.code,
                finalPrices: finalPrices,
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
              navigate(`/dashboard/v2?events=${btoa(eventId)}`);
              toast.success("You booking is confirmed");
            })
            .catch(async (err) => {
              await TicketServices.ticketLockedDecrement({ selectedTickets });
              setRenderComponent(false);
              setShowFullLoading(false);
              setMessageModal(true);
              setMessageModalDesc(
                "Could not book tickets. Contact support for refund details if any amount was debited from your account."
              );
            });
        })
        .catch(async function (error) {
          await TicketServices.ticketLockedDecrement({ selectedTickets });
          setRenderComponent(false);
          setShowFullLoading(false);
          setMessageModal(true);
          setMessageModalDesc(
            "Tickets not Booked. Contact support for refund details"
          );
        });
    } else {
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
    await TicketServices.ticketLockedDecrement({ selectedTickets });
  };
  const renderDropin = (resultOrderToken) => {
    if (resultOrderToken === "") {
      // alert("Order Token is empty");
      return;
    }
    setRenderComponent(true);

    let parent = document.getElementById("drop_in_container");
    parent.innerHTML = "";
    let cashfree;

    if (process.env.REACT_APP_CHAIN == "production") {
      cashfree = new cashfreeProd.Cashfree();
    } else {
      cashfree = new cashfreeSandbox.Cashfree();
      // toast.info("Test Environment!!");
    }

    cashfree.initialiseDropin(parent, {
      orderToken: resultOrderToken || "",
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
        minHeight: "400px",
      },
    });
  };
  const createPay = async (e) => {
    e.preventDefault();
    setAuthToken();
    setShow(false);
    localStorage.setItem("selectedTickets", JSON.stringify(selectedTickets));
console.log("createPay ", selectedTickets)
    // const headers = {
    //   method: "POST",
    //   Authorization: `Bearer ${isLogin}`,
    //   "Content-Type": "application/json",
    // };
    setPayMessage(
      "Taking you to the payment gateway, Please do not press back button"
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
    setAuthToken();
    const increaseCounter = await ticketLockedIncrement(
      {
        selectedTickets,
      },
      sessionStorage.getItem("token")
    );
    if (increaseCounter && increaseCounter.status === 200) {
    
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/payment/cashfree-get-order-token`,
          {
            selectedTickets,
            userInfo,
            breakupPrices,
            eventId,
            couponCode: promoCodeInfo?.valid ? getValues("promoCode") : null,
          },
          {
            headers: {
              Authorization: `Bearer ${isLogin}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const { status } = response;
          setShowFullLoading(false);
          return response.data;
        })
        .then((result) => {
          renderDropin(result.orderToken);
          setMessageModal(true);
          setMessageModalDesc("Your Order is created.");
        })
        .catch(async (err) => {
          await TicketServices.ticketLockedDecrement({ selectedTickets });
          setShowFullLoading(false);
          setMessageModal(true);
          setMessageModalDesc(
            err?.response?.data?.msg
              ? err?.response?.data?.msg
              : "ERR CGOT:Your Ticket was not booked some error occurred, Please Try again"
          );
        });
    } else {
      await TicketServices.ticketLockedDecrement({ selectedTickets });
      setShowFullLoading(false);
      setMessageModal(true);
      setMessageModalDesc(
        "ERR INC_C:Your Ticket was not booked some error occurred, Please Try again"
      );
    }
  };
  const onContinue = async () => {
    setAuthToken();
    let check = true;
    console.log(promoCodeInfo?.ticketType);
    if(typeof promoCodeInfo?.ticketType === "undefined"){
      check = false;
    }else{
      for(let i = 0; i< selectedTickets.length; ++i){
        if(selectedTickets[i]._id === promoCodeInfo.ticketType && selectedTickets[i].quantity >0){
          check = false;
          break;
        }
      }
    }
      console.log(check);
    if(check)
      return toast.error(`Promo code is valid for ${promoCodeInfo.ticketName} only`);
    if (selectedTickets.length === 0)
      return toast.error("Please selct a ticket to continue...");
    else setShow(true);
    // createPaymentIntent();
  };

  // stripe
  const createPaymentIntent = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await StripeServices.paymentIntent({
        selectedTickets,
        breakupPrices,
        userId: JSON.parse(sessionStorage.getItem("user-data"))?.userId,
        userEmail: JSON.parse(sessionStorage.getItem("user-data"))?.email,
        couponCode: promoCodeInfo?.valid ? getValues("promoCode") : null,
      });
      // console.log("res: ", res.data);
      setClientSecret(res.data.clientSecret);
      setIsLoading(false);
    } catch (err) {
      console.log(err?.response?.message);
      toast.error(err?.response?.message || "STRIPE: Internal Server Error");
      setIsLoading(false);
    }
  };

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#fa6400",
      },
    },
  };
  return (
    <>
      {isLoading && <FullLoading />}
      {new Date(event?.startDate) < new Date() ? (
        <button className='bg-white rounded-lg col-span-full py-2 w-full text-orange  border-2 border-orange text-[1.4rem] lg:text-[2.1rem] font-bold '>
          Available at the venue
        </button>
      ) : !isLogin ? (
        <button
          className='bg-white rounded-lg col-span-full py-2 w-full text-orange  border-2 border-orange text-[1.4rem] lg:text-[2.1rem] font-bold '
          onClick={() => setSignIn(true)}
        >
          {currency === "AED" ? currency : getSymbolFromCurrency(currency)}{" "}
          {breakupPrices["finalPrice"]
            ? Math.round(breakupPrices["finalPrice"]?.toFixed(2))
            : 0}{" "}
          Payable - Continue
        </button>
      ) : (
        <button
          onClick={onContinue}
          className='bg-white  rounded-lg col-span-full py-2 w-full text-orange  border-2 border-orange text-[2.4rem] font-bold '
        >
          {currency === "AED" ? currency : getSymbolFromCurrency(currency)}{" "}
          {breakupPrices["finalPrice"]
            ? Math.round(breakupPrices["finalPrice"]?.toFixed(2))
            : 0}{" "}
          - Continue{" "}
        </button>
      )}
      <div
        className={
          clientSecret
            ? "stripe-container-show flex-col"
            : "stripe-container-hide"
        }
      >
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              setClientSecret={setClientSecret}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </Elements>
        )}
      </div>

      <MobileNumber
        show={show}
        setShow={setShow}
        onContinue={
          // ip?.country_name === "India" ? createPay : createPaymentIntent
          createPay
        }
        setPhoneNumber={setPhoneNumber}
        phoneNumber={userPhoneNumber}
      />
    </>
  );
};
// Taking you to the payment gateway, Please do not press back button
export default Payments;
