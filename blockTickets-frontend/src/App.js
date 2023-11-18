import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Web3 from "web3";
import { setAuthToken } from "./api/supplier";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
// Pages
import Home from "./pages/Homepage/Home";

import OrganizeForm from "./pages/OrganizeForm/OrganizeForm.jsx";
import CreateEventV2 from "./pages/CreateEventV2/CreateEventV2.jsx";
import DashboardV2 from "./pages/Dashboard/Dashboard.V2.jsx";
import MyProfile from "./pages/MyProfile/MyProfile.jsx";
import LoginPage from "./pages/SPage/SPage.jsx";
import EventCategory from "./pages/EventCategory/EventCategory";
import Marketplace from "./pages/Marketplace/Marketplace";
import SearchEvents from "./pages/SearchEvents/SearchEvents";
import TicketDetails from "./components/Event-details/TicketDetails";
import AboutUs from "./pages/Information/AboutUs";
import Refund from "./pages/Information/Refund";
import PrivacyPolicy from "./pages/Information/PrivacyPolicy";
import Terms from "./pages/Information/Terms";
import ContactUs from "./pages/Information/ContactUs";
// Components
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import WalletAdd from "./components/Wallet/WalletAdd.jsx";
import PayNow from "./components/Wallet/PayNow.jsx";
import VerifyEmail from "./pages/Profile/VerifyEmail.jsx";
import UserAccounts from "./Modals/UserAccounts/UserAccounts";
import RegisterModal from "./Modals/UserAccounts/RegisterModal";
import { UserContext } from "./Context/UserContext.js";
import ForgotPassword from "./pages/Profile/Password/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Profile/Password/Reset Password/ResetPassword";
import ChangePassword from "./pages/Profile/Password/ChangePassword/ChangePassword";
import axios from "axios";
import Faq from "./pages/FAQ/Faq";
import ListEventForm from "./pages/ListEventForm/ListEventForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditProfile from "./pages/EditProfile/EditProfile";
import ReListNft from "./pages/ReListNft/ReListNft";
import TicketInfo from "./pages/TicketInfo/TicketInfo";
import EventPage from "./pages/EventPage/EventPage";
import PurchaseTicket from "./pages/PurchaseTicket/PurchaseTicket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventCreator from "./pages/EventCreator/EventCreator.jsx";
import ReactGA from "react-ga4";
const TRACKING_ID = "G-3QGR1J4V50"; // OUR_TRACKING_ID

ReactGA.initialize(TRACKING_ID);
const App = () => {
  const [userToken, setUserToken] = useState(null);
  // sign in modal
  const [signIn, setSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [city, setCity] = useState("Dubai");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isAdmin, setIsAdmin] = useState(false);

  const [coordinate, setCoordinate] = useState({
    latitude: "",
    longitude: "",
  });
  const web3 = new Web3(Web3.givenProvider);
  function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async function (accounts) {
      const accountsNEW = await web3.eth.getAccounts();
      sessionStorage.setItem("METAMASK_WALLET", accountsNEW[0]);
      if (!accounts[0]) {
        sessionStorage.removeItem("METAMASK_WALLET");
        sessionStorage.setItem("isMetamaskConnected", false);
      }
    });
  }

  useEffect(() => {
    if (sessionStorage.getItem("token") !== null) {
      setUserToken(sessionStorage.getItem("token"));
      setAuthToken(sessionStorage.getItem("token"));
    }
  }, [userToken]);
  useEffect(() => {
    if (
      JSON.parse(sessionStorage.getItem("user-data")) &&
      (JSON.parse(sessionStorage.getItem("user-data")).isAdmin ||
        JSON.parse(sessionStorage.getItem("user-date"))?.role === 1 ||
        JSON.parse(sessionStorage.getItem("user-date"))?.role === 2)
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [sessionStorage.getItem("user-data"), userToken]);

  const getGeoCoordinates = async () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    var latitude, longitude;
    function success(pos) {
      var crd = pos.coords;
      latitude = crd.latitude;
      longitude = crd.longitude;
      setCoordinate({
        latitude: latitude,
        longitude: longitude,
      });
    }
    function error(err) {}
    navigator.geolocation.getCurrentPosition(success, error, options);
  };
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", changeWidth);
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  useEffect(() => {
    getGeoCoordinates();
  }, [signIn, signUp]);
  useEffect(
    () => {
      if (
        sessionStorage.getItem("userData") === "undefined" ||
        sessionStorage.getItem("token") === "undefined"
      ) {
        sessionStorage.clear();
      }
    },
    sessionStorage.getItem("userData"),
    sessionStorage.getItem("token")
  );

  useEffect(() => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinate.longitude},${coordinate.latitude}.json?access_token=pk.eyJ1Ijoia2FydGlrMjgiLCJhIjoiY2t6MDJtOHB1MTg4ZjJvbXhmYzd5M2h4cCJ9.9PStBt16SOfzoLJ-vtKwaA`
      )
      .then((res) => {
        if (res && res.data && res.data.features) {
          for (let i = 0; i < res.data.features.length; i++) {
            if (res.data.features[i]["place_type"][0] === "place") {
              sessionStorage.setItem("city_name", res.data.features[i].text);
              setCity(res.data.features[i].text);
            }
            if (res.data.features[i]["place_type"][0] === "region") {
              sessionStorage.setItem(
                "state_name",
                res.data.features[i].place_name
              );
            }
          }
        }
      })
      .catch((err) => {});
  }, [coordinate]);

  useEffect(() => {
    if (sessionStorage.getItem("city_name")) {
      setCity(sessionStorage.getItem("city_name"));
    } else {
      sessionStorage.setItem("city_name", city);
    }
  }, [sessionStorage.getItem("city_name"), city]);
  console.log("v1.3.6");

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      <ToastContainer />
      <Navbar isLogin={userToken} isAdmin={isAdmin} />

      <UserAccounts
        signIn={signIn}
        signUp={signUp}
        setSignIn={setSignIn}
        setSignUp={setSignUp}
        setIsAdmin={setIsAdmin}
      />
      <RegisterModal
        signUp={signUp}
        setSignIn={setSignIn}
        setSignUp={setSignUp}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <LoginPage
              setIsAdmin={setIsAdmin}
              setSignIn={setSignIn}
              setSignUp={setSignUp}
            />
          }
        />
        <Route path="/search/:searchKeyWord" element={<SearchEvents />} />
        <Route path="/user/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/my-profile" element={<MyProfile isLogin={userToken} />} />
        <Route
          exact
          path="/edit-profile"
          element={<EditProfile isLogin={userToken} />}
        />

        <Route path="/event-creator" element={<EventCreator />} />

        <Route path="/:eventName/:id" element={<EventPage />} />
        {/* /ticket/:eventName/:eventId */}
        <Route
          path="/:eventName/ticket/:eventId"
          element={<PurchaseTicket setSignIn={setSignIn} isLogin={userToken} />}
        />
        <Route path="/event/:id/addQuantity" element={<TicketDetails />} />

        <Route path="/ticket/:id/addQuantity" element={<TicketDetails />} />
        <Route path="/list-event" element={<ListEventForm />} />

        <Route path="/frequently-asked-questions" element={<Faq />} />

        <Route
          path="/event-category/:eventName"
          element={<EventCategory screenWidth={screenWidth} />}
        />
        <Route
          path="/user-pay-now"
          element={<PayNow isLogin={userToken} setSignIn={setSignIn} />}
        />
        <Route
          path="/organizer-form"
          element={<OrganizeForm isAdmin={isAdmin} isLogin={userToken} />}
        />
        <Route
          path="/create/event/form"
          element={<CreateEventV2 isAdmin={isAdmin} isLogin={userToken} />}
        />
        <Route
          path="/marketplace"
          element={<Marketplace setSignIn={setSignIn} isLogin={userToken} />}
        />
        <Route path="/dashboard" element={<Dashboard isLogin={userToken} />} />

        <Route
          path="/dashboard/v2"
          element={<DashboardV2 />}
          isLogin={userToken}
        />

        <Route
          path="/:eventName/ticket-detail/:id"
          element={<ReListNft isLogin={userToken} />}
        />

        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/refund-and-exchange" element={<Refund />} />
        <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-condition" element={<Terms />} />
      </Routes>
      {/* Scan Your Wallet Page */}
      <Web3ReactProvider getLibrary={getLibrary}>
        <Routes>
          <Route
            path="/user-wallet-details"
            element={<WalletAdd isLogin={userToken} />}
          />
        </Routes>
      </Web3ReactProvider>
      <Footer isLogin={userToken} setSignUp={setSignUp} setSignIn={setSignIn} />
    </UserContext.Provider>
  );
};

export default App;
