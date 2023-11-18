import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HorizontalEventCard } from "../../components/EventCard/EventCard1";
import CardLoading from "../../Loading/CardLoading";
import { v4 as uuid } from "uuid";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, A11y } from "swiper";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import axios from "axios";
import Ticket from "../../components/Ticket/Ticket";
import Web3 from "web3";
import "./home.css";
// images
import FeaturedImage from "../../images/assets/bsamd.jpg";
import "swiper/css";
import "swiper/css/pagination";
import Carousel from "react-material-ui-carousel";
import { EventServices } from "../../api/supplier";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const past_events = [
    {
      eventSquareImage:
        "https://unicus.mypinata.cloud/ipfs/QmVSkiwDyQSVexSyYRoLNddbzjuQaWBsFzxAsAoA8e6nmu",
      id: "62d6c455bdb6962417f832d8",
    },
    {
      eventSquareImage:
        "https://unicus.mypinata.cloud/ipfs/QmRXojjjXbhP2vmAWaNXYUBc61MmYsYEqrGM7rriK6pw2v",
      id: "628f429fcc9c7119dab26dae",
    },
    {
      eventSquareImage:
        "https://unicus.mypinata.cloud/ipfs/QmSX7E8hsTx61nZvfksJFxAW4hnCpZa2CUfgR57P2eGQKb",
      id: "630e04a64c25268040d19ebe",
    },
  ];

  const web3 = new Web3(Web3.givenProvider);

  const [allEvents, setAllEvents] = useState("");
  const [pastEvents, setPastEvents] = useState([...past_events]);
  const [bannerImages, setBannerImages] = useState();
  const [loading, setLoading] = useState(true);
  const [marketplaceLoadinng, setMarketplaceLoading] = useState(false);
  const [marketplaceTicket, setMarketPlaceTicket] = useState([]);
  const [maticUSD, setMaticUSD] = useState("");
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span className="' + className + '">' + (index + 1) + "</span>";
    },
  };
  const getEvents = async () => {
    try {
      setLoading(true);
      const res = await EventServices.getAllEvents("latest");
      setAllEvents(res.data?.data);
      setPastEvents(res?.data?.data?.pastEvents);
      setBannerImages(res?.data?.data?.bannerImages);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllTicket = async () => {
    try {
      setMarketplaceLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/get-all-ticket-on-sale?&limit=3`
      );
      setMarketPlaceTicket(response.data?.data[0]?.data);
      setMarketplaceLoading(false);
    } catch (err) {
      console.log(err);
      setMarketplaceLoading(false);
    }
  };

  useEffect(() => {
    document.body.scrollTop = 0;
    getEvents();
    getAllTicket();
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr`
      )
      .then((res) => {
        setMaticUSD(res.data["matic-network"].inr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const loc = new URLSearchParams(window.location.search);
    const clientSecret = loc.get("payment_intent_client_secret");

    if (!clientSecret) {
      return;
    }
    if (loc.get("redirect_status") == "succeeded") {
      toast.success("You booking is confirmed");
      navigate("/dashboard/v2");
    }
  }, []);
  return (
    // margin left and right 96*2 px
    <div className="mt-[46px] relative bg-black min-h-screen h-auto">
      <Helmet>
        <title>Homepage</title>
      </Helmet>
      <div className="lg:mx-[6rem] xl:[12rem] doubleXl:mx-[18rem] screen18:mx-4 pb-6">
        <Swiper
          pagination={true}
          navigation={{
            prevEl: "#prevItemEvents",
            nextEl: "#nextItemEvents",
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          <div
            className="bg-black/50 cursor-pointer transition-all flex justify-center items-center h-16 w-12 bg-mainAccent absolute left-0 top-0 bottom-0 m-auto z-50 rounded-r-lg"
            id="prevItemEvents"
          >
            <KeyboardArrowLeftIcon fontSize="large" className="text-white" />
          </div>

          {bannerImages &&
            bannerImages.map((item) => {
              return (
                <SwiperSlide
                  key={uuid()}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/${item.eventTitle?.replace(/\s+/g, "_")}/${item._id}`
                    )
                  }
                >
                  <img
                    className="mx-auto w-full h-auto inherit-position object-contain"
                    src={item.eventImageCompress}
                    alt="a"
                    loading=" lazy"
                  />
                </SwiperSlide>
              );
            })}

          <div
            className="bg-black/50 cursor-pointer transition-all flex justify-center items-center h-16 w-12 bg-mainAccent absolute right-0 top-0 bottom-0 m-auto z-50 rounded-l-lg"
            id="nextItemEvents"
          >
            <KeyboardArrowRightIcon fontSize="large" className="text-white" />
          </div>
        </Swiper>
        <div className="pagination-container"></div>
        <div className="mt-[55px] md:mt-[150px] ">
          <h2 className="text-white text-[1.4rem] lg:text-[2rem] mb-[0] lg:mb-[40px]  ">
            Upcoming Events
          </h2>
          <TrendingEvents events={allEvents?.eventData} />
        </div>

        <div className="mt-[75px] md:mt-[150px]  w-full">
          <h2 className="text-white text-[1.4rem] lg:text-[2rem] mb-[20px] lg:mb-[40px] ">
            Secure Tickets and Enhanced Experiences
          </h2>
          <p className="text-[12px] font-semibold md:text-base text-white ">
            See how blockchain makes tickets safer and helps all participants in
            the events industry
          </p>

          <div className="w-full">
            <iframe
              id="youtube"
              className="youtubeIframe"
              src="https://www.youtube.com/embed/gD28XV6D2wY"
              title="Blocktickets"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-[75px] md:mt-[150px] w-full ">
          <h2 className="text-left text-white text-[1.4rem] lg:text-[2rem] mb-[20px] lg:mb-[40px] screen18:mx-2 ">
            Some of our past events (yes we're going for FOMO)
          </h2>
          <div className="screen18:mx-2 screen-18:grid-cols-1 gap-8">
            <Swiper
              slidesPerView={"auto"}
              loop={false}
              spaceBetween={20}
              navigation={{
                prevEl: "#prevItemTrending",
                nextEl: "#nextItemTrending",
              }}
              modules={[Navigation, Pagination]}
              pagination={true}
              className=""
            >
              <div
                className="bg-black/75 cursor-pointer transition-all hidden md:flex justify-center items-center h-16 w-12 bg-mainAccent absolute left-0 top-0 bottom-0 m-auto z-50 rounded-r-lg"
                id="prevItemTrending"
              >
                <KeyboardArrowLeftIcon
                  fontSize="large"
                  className="text-white"
                />
              </div>
              {pastEvents.map((pe) => {
                return (
                  <SwiperSlide
                    key={uuid()}
                    className="rounded-2xl flex flex-col gap-2 w-full min-w-full lg:min-w-[380px] max-w-[400px]"
                  >
                    <div
                      onClick={() =>
                        navigate(
                          `/${pe.eventTitle?.replace(/\s+/g, "_")}/${pe._id}`
                        )
                      }
                      className="rounded-lg w-full h-full max-h-[400px] max-w-[400px]"
                    >
                      <img
                        className="w-full h-full object-contain max-h-[400px] mt-[-32px] lg:mt-0 rounded-2xl"
                        src={pe.eventSquareImage}
                        alt={pe.id}
                        loading="lazy"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}

              <div
                className="bg-black/75 cursor-pointer transition-all hidden md:flex justify-center items-center h-16 w-12 bg-mainAccent absolute right-0 top-0 bottom-0 m-auto z-50 rounded-l-lg"
                id="nextItemTrending"
              >
                <KeyboardArrowRightIcon
                  fontSize="large"
                  className="text-white"
                />
              </div>
            </Swiper>
            <div className="pagination-container"></div>
          </div>
        </div>
        <div className="mt-[75px] md:mt-[150px]  w-full">
          <h2 className=" text-white text-[1.4rem] lg:text-[2rem] mb-[20px] lg:mb-[40px] screen18:mx-2 ">
            Buy and Sell NFTs and tickets in our Marketplace
          </h2>

          <div className="mobileHide grid grid-cols-1 screen18:mx-2 sm:grid-cols-1 lg:grid-cols-2 gap-8 place-items-center">
            {marketplaceTicket.map((event) => {
              return (
                <SwiperSlide key={uuid()}>
                  <Ticket
                    key={uuid()}
                    eventId={event.Event}
                    eId={event.ticketType[0].Event}
                    eventImg={
                      event.ticketType[0].hasOwnProperty("image")
                        ? event.ticketType[0].image
                        : event.EventDetails[0].eventImageOriginal
                    }
                    eventName={event.EventDetails[0].eventTitle}
                    eventDate={event.EventDetails[0].startDate}
                    endDate={event.EventDetails[0].endDate}
                    eventTime={event.EventDetails[0].startTime}
                    price={(
                      web3.utils.fromWei(event.transaction[0].price, "ether") *
                      maticUSD
                    ).toFixed(6)}
                    location={event.EventDetails[0].location}
                    qrCode={false}
                    ticketDate={event.ticketType[0].startDate}
                    ticketTime={event.ticketType[0].startTime}
                    ticketName={event.ticketType[0].ticketName}
                    ticketUser={event.user}
                    currency={event.ticketType[0]?.currency}
                    organizerName={event?.event?.organizerName}
                  />
                </SwiperSlide>
              );
            })}
          </div>
          <Swiper
            // slidesPerView={2}
            spaceBetween={20}
            navigation={{
              prevEl: "#prevItemTrending",
              nextEl: "#nextItemTrending",
            }}
            modules={[Navigation, Pagination]}
            pagination={true}
            className="desktopHide"
          >
            <div
              className="lg:hidden bg-black/75 cursor-pointer transition-all hidden md:flex justify-center items-center h-16 w-12 bg-mainAccent absolute left-0 top-0 bottom-0 m-auto z-50 rounded-r-lg"
              id="prevItemTrending"
            >
              <KeyboardArrowLeftIcon fontSize="large" className="text-white" />
            </div>
            {marketplaceTicket.map((event) => {
              return (
                <SwiperSlide key={uuid()}>
                  <Ticket
                    key={uuid()}
                    eventId={event.Event}
                    eId={event.ticketType[0].Event}
                    eventImg={
                      event.ticketType[0].hasOwnProperty("image")
                        ? event.ticketType[0].image
                        : event.EventDetails[0].eventImageOriginal
                    }
                    eventName={event.EventDetails[0].eventTitle}
                    eventDate={event.EventDetails[0].startDate}
                    endDate={event.EventDetails[0].endDate}
                    eventTime={event.EventDetails[0].startTime}
                    price={(
                      web3.utils.fromWei(event.transaction[0].price, "ether") *
                      maticUSD
                    ).toFixed(6)}
                    location={event.EventDetails[0].location}
                    qrCode={false}
                    ticketDate={event.ticketType[0].startDate}
                    ticketTime={event.ticketType[0].startTime}
                    ticketName={event.ticketType[0].ticketName}
                    ticketUser={event.user}
                    currency={event.ticketType[0]?.currency}
                    organizerName={event?.EventDetails[0]?.organizerName}
                  />
                </SwiperSlide>
              );
            })}
            <div
              className="bg-black/75 cursor-pointer transition-all hidden md:flex justify-center items-center h-16 w-12 bg-mainAccent absolute right-0 top-0 bottom-0 m-auto z-50 rounded-l-lg"
              id="nextItemTrending"
            >
              <KeyboardArrowRightIcon fontSize="large" className="text-white" />
            </div>
          </Swiper>
          <div className="pagination-container"></div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

const TrendingEvents = ({ events }) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div className="flex justify-between screen7:flex-col gap-4 items-center w-full">
        <Swiper
          slidesPerView={"auto"}
          loop={false}
          spaceBetween={20}
          navigation={{
            prevEl: "#prevItemTrending",
            nextEl: "#nextItemTrending",
          }}
          modules={[Navigation, Pagination]}
          pagination={true}
          className="mySwiper relative"
        >
          <div
            className="bg-black/75 cursor-pointer transition-all hidden md:flex justify-center items-center h-16 w-12 bg-mainAccent absolute left-0 top-0 bottom-0 m-auto z-50 rounded-r-lg"
            id="prevItemTrending"
          >
            <KeyboardArrowLeftIcon fontSize="large" className="text-white" />
          </div>
          {events ? (
            events
              .map(
                (item, index) =>
                  item.event.eventStatus !== "PAST" && (
                    <SwiperSlide
                      key={uuid()}
                      className="rounded-lg flex flex-col gap-2 w-full min-w-full lg:min-w-[390px] max-w-[400px]"
                    >
                      <HorizontalEventCard
                        eventId={item.event._id}
                        eventName={item.event.eventTitle}
                        eventDetails={item.event.eventDescription}
                        image={
                          item?.event?.hasOwnProperty("eventSquareImage")
                            ? item.event["eventSquareImage"]
                            : item.event["eventImageOriginal"]
                        }
                        location={item.event.location}
                        startDate={item.event.startDate}
                        startTime={item.event.startTime}
                        endTime={item.event.endTime}
                        endDate={item.event.endDate}
                        eventType={item.event.eventType}
                      />
                    </SwiperSlide>
                  )
              )
              .reverse()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-full">
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </div>
          )}
          <div
            className="bg-black/75 cursor-pointer transition-all hidden md:flex justify-center items-center h-16 w-12 bg-mainAccent absolute right-0 top-0 bottom-0 m-auto z-50 rounded-l-lg"
            id="nextItemTrending"
          >
            <KeyboardArrowRightIcon fontSize="large" className="text-white" />
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
