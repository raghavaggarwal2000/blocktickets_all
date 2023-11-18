import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getTicketEventDetails } from "../../Redux/action";
import { useDispatch } from "react-redux";
import { EventServices } from "../../api/supplier";
import { Helmet } from "react-helmet";
import CollapseBar from "../../components/Collapse/Collapse";
import Typography from "@mui/material/Typography";
import { tConvert } from "../../utils/timeConvert";
import Loading from "../../Loading/Loading";
// svg icons
import OrganiserLogo from "../../images/icons/Royallogo.png";
import Calendar from "../../images/icons/svg/CalendarV2.svg";
import Block from "../../images/icons//svg/BlockchainV2.svg";
import Car from "../../images/icons/car.svg";
import Clock2 from "../../images/icons/svg/Clock1V2.svg";
import Location3 from "../../images/icons/svg/LocationV2.svg";
import Person2 from "../../images/icons/svg/PersonProfileV2.svg";
import Valet from "../../images/icons/svg/valetParkingV2.svg";
import Wifi from "../../images/icons/svg/WifiV2.svg";
import Food from "../../images/icons/svg/FoodV2.svg";
import DressCode from "../../images/icons/svg/tuxedoV2.svg";
import Alcohol from "../../images/icons/svg/CocktailV2.svg";
import getSymbolFromCurrency from "currency-symbol-map";
import { getDate } from "../../utils/date";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import FullHeart from "../../images/icons/svg/PinkHeartV2.svg";
import Heart from "../../images/icons/svg/HeartV2.svg";
import ReactGA from "react-ga4";
import GoTo from "../../images/icons/arrow.svg";

const EventPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const getEventDetails = async () => {
    try {
      const userId = sessionStorage.getItem("token")
        ? JSON.parse(sessionStorage.getItem("user-data")).userId
        : "";
      const res = await EventServices.getEventById({
        eventId: id,
        userId: userId || "",
      });

      setEvent({ ...res.data.data });
      dispatch(
        getTicketEventDetails({
          EventDataDetails: res.data.data,
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const saveEvent = async () => {
    try {
      if (!sessionStorage.getItem("token")) return navigate("/login");
      setLoadingSave(true);
      const save = await EventServices.saveEvent(id);

      setLoadingSave(false);
      // toast.success("Event saved");
      setEvent((prev) => {
        return { ...prev, saved: true };
      });
    } catch (err) {
      setLoadingSave(false);
      // toast.error("Something went wrong in saving event");
    }
  };
  const unsaveEvent = async () => {
    try {
      if (!sessionStorage.getItem("token"))
        return toast.error("Please login to save this event");
      setLoadingSave(true);
      const save = await EventServices.unsaveEvent(id);

      setLoadingSave(false);
      // toast.success("Event unsaved");
      setEvent((prev) => {
        return { ...prev, saved: false };
      });
    } catch (err) {
      setLoadingSave(false);
      // toast.error("Something went wrong in saving event");
    }
  };
  const handleBuy = (id) => {
    ReactGA.event({
      category: `Event Page ${
        event?.Event?.eventTitle ? event?.Event?.eventTitle : ""
      }`,
      action: "BuyNowClick",
      label: "buyNow",
    });
    if (event?.Event?.totalBooked < event?.Event?.totalTicket) {
      navigate(
        `/${event?.Event?.eventTitle.replace(/\s+/g, "_")}/ticket/${id}`
      );
    } else {
      // setNftDialog(true);
    }
  };
  useEffect(() => {
    document.body.scrollTop = 0;
    getEventDetails();
  }, []);
  if (!Object.keys(event).length && !loading) {
    return (
      <div className='min-h-screen flex flex-col gap-y-4 bg-black justify-center items-center'>
        <h1 className='italic text-2xl text-orange'>
          Could not load data... Please refresh!
        </h1>
        <button className='btn btn-primary' onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='mt-[70px] relative bg-black min-h-screen h-auto'>
          <Helmet>
            <title>
              {event?.Event?.eventTitle
                ? event?.Event?.eventTitle
                : "Event Details"}
            </title>
          </Helmet>

          <div className='bg-blackishGray border-2 border-borderMain xs:mx-4 md:mx-[2rem] lg:mx-[6rem]  doubleXl:mx-[18rem]'>
            <div className='overflow-hidden border-b-2 relative border-borderMain mx-auto'>
              <img
                className='mx-auto w-full hidden lg:block h-auto inherit-position object-contain'
                src={event?.Event?.eventImageCompress}
                alt='event-banner'
                loading=' lazy'
              />
              <img
                className='mx-auto w-full block lg:hidden h-auto inherit-position object-contain'
                src={event?.Event?.eventSquareImage}
                alt='event-banner'
                loading=' lazy'
              />
            </div>
            <div className='py-6'>
              <div className='grid grid-cols-1 md:grid-cols-5 gap-x-6'>
                <div className='ml-6 mr-6 lg:ml-0 lg:mr-0 xl:mx-6 mb-[1.4rem] col-span-full flex justify-between items-center'>
                  <h2 className='text-[1.5rem] text-orangeDark'>
                    {event?.Event?.eventTitle}
                  </h2>
                  {event?.saved ? (
                    <button
                      onClick={unsaveEvent}
                      disabled={loadingSave}
                      className='hover:opacity-50 mr-0 lg:mr-[16px] text-orange rounded-xl flex items-center justify-center'
                    >
                      <span className='flex items-center justify-center flex-row'>
                        <img
                          className='mr-1 xl:mr-2 h-[24px] mb-[8px] md:mb-[1.4rem]'
                          src={FullHeart}
                          alt='heart'
                          loading='lazy'
                        />
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={saveEvent}
                      disabled={loadingSave}
                      className='hover:opacity-50 mr-0 lg:mr-[16px] text-orange rounded-xl flex items-center justify-center'
                    >
                      <span className='flex items-center justify-center flex-row'>
                        <img
                          className='xl:mr-2 h-[24px] mb-[8px] md:mb-[1.4rem]'
                          src={Heart}
                          alt='heart'
                          loading='lazy'
                        />
                      </span>
                    </button>
                  )}
                </div>
                <div className='ml-6 md:col-span-2'>
                  <p className='grid grid-cols-5 mb-2 text-white text-base gap-x-1'>
                    <div className='col-span-1 ml-2'>
                      <img
                        className='h-[30px]'
                        src={Calendar}
                        alt='Calendar'
                        loading=' lazy'
                      />
                    </div>{" "}
                    <p className='col-span-4 w-full flex justify-start items-center mb-0'>
                      {getDate(event?.Event?.startDate)}
                      {/* -{" "}
                      {getDate(event?.Event?.endDate)} */}
                    </p>
                  </p>
                  <p className='grid grid-cols-5 mb-2 text-white text-base gap-x-1'>
                    <div className='col-span-1 ml-2'>
                      <img
                        className='h-[30px]'
                        src={Clock2}
                        alt='Clock'
                        loading=' lazy'
                      />
                    </div>{" "}
                    <p className='col-span-4 w-full flex justify-start items-center mb-0'>
                      {tConvert(event?.Event?.startTime)}{" "}
                      {getDate(event?.Event?.startDate) ===
                        getDate(event?.Event?.endDate) && "Onwards"}
                      {/* -{" "}
                      {tConvert(event?.Event?.endTime)} */}
                    </p>
                  </p>
                  <a
                    href={event?.Event?.eventVenueLink}
                    target='_blank'
                    className='hover:cursor-pointer hover:underline grid grid-cols-5 mb-2 text-white text-base gap-x-1'
                  >
                    <div className='col-span-1 ml-2'>
                      {" "}
                      <img
                        className='h-[30px]'
                        loading=' lazy'
                        src={Location3}
                        alt='Location'
                      />
                    </div>{" "}
                    <span className='col-span-4 w-full flex flex-row justify-start items-center'>
                      <p className=' mb-0 mr-1'>{event?.Event?.location}</p>
                      <span>
                        <img src={GoTo} alt='goto' className='ml-2 h-[16px]' />
                      </span>
                    </span>
                  </a>
                </div>
                <div className='ml-6 md:col-span-2'>
                  {event?.Event?.ageRequirement && (
                    <p className='grid grid-cols-5 mb-2 text-white text-base gap-x-1'>
                      <div className='col-span-1 ml-2'>
                        <img
                          className='h-[30px] '
                          src={Person2}
                          alt='Person'
                          loading=' lazy'
                        />
                      </div>{" "}
                      <p className='col-span-4 w-full flex justify-start items-center mb-0'>
                        {event?.Event?.ageRequirement}
                      </p>
                    </p>
                  )}
                  {event?.Event?.valeParking && (
                    <p className='grid grid-cols-5 mb-2 text-white text-base gap-x-1'>
                      <div className='col-span-1 ml-2'>
                        <img
                          className='h-[30px] '
                          src={Valet}
                          alt='Car'
                          loading=' lazy'
                        />
                      </div>{" "}
                      <p className='col-span-4 w-full flex justify-start items-center mb-0'>
                        {event?.Event?.valeParking}
                      </p>
                    </p>
                  )}
                  <p className='grid grid-cols-5 mb-2 text-white text-base gap-x-1'>
                    <div className='col-span-1 ml-2'>
                      <img
                        className='h-[30px]'
                        src={Block}
                        alt='Block'
                        loading=' lazy'
                      />{" "}
                    </div>
                    <p className='col-span-4 w-full flex justify-start items-center mb-0'>
                      Blockchain minted ticket
                    </p>
                  </p>
                </div>
                <div className='mt-[20px] md:mt-0 flex items-center justify-start mx-auto  md:mx-0 flex-col gap-4'>
                  <button
                    disabled={new Date(event?.Event?.startDate) <= new Date()}
                    onClick={() => handleBuy(id)}
                    className='uppercase w-[150px] text-md text-white rounded-lg bg-orangeDark px-4 py-2 font-bold '
                  >
                    {!event?.eventExpired
                      ? event?.Event?.totalBooked < event?.Event?.totalTicket
                        ? "Buy Now"
                        : "Sold out"
                      : "Ended"}
                  </button>
                  <p className='text-orangeLight mb-0 text-[21px] font-semibold'>
                    from{" "}
                    {event?.TicketDetails[0]?.currency === "AED"
                      ? "AED"
                      : getSymbolFromCurrency(
                          event?.TicketDetails[0]?.currency
                        )}{" "}
                    {Math.round(
                      Math.min(
                        ...event?.TicketDetails.map((item) =>
                          item.price.toFixed(2)
                        )
                      )
                    )}{" "}
                  </p>
                </div>
              </div>
            </div>

            <CollapseBar
              heading={event?.Event?.eventTitle}
              children={
                <Typography
                  variant='p'
                  dangerouslySetInnerHTML={{
                    __html: event?.Event?.eventDescription,
                  }}
                >
                  {/* {event?.Event?.eventDescription} */}
                </Typography>
              }
            />
{           event?.Event?.eventVideo &&
            <video
              alt='video'
              className='px-4 py-4 max-h-[460px] w-full'
              controls
            >
              <source src={event?.Event?.eventVideo} type='video/mp4'></source>
            </video>}
            <CollapseBar
              heading={"About the Performer"}
              children={<AboutPerformer artist={event?.Event?.artist} />}
            />
            <CollapseBar
              heading={"More info"}
              children={
                <div className='grid grid-cols-1 md:grid-cols-4 gap-x-6'>
                  <div className='ml-6 md:col-span-2'>
                    {event?.Event?.valeParking && (
                      <p className='mb-2 text-white text-base flex gap-x-2 justify-start items-center'>
                        <img
                          className='h-[30px]  w-[30px]'
                          src={Car}
                          alt='Car'
                          loading=' lazy'
                        />{" "}
                        {event?.Event?.valeParking === "Yes"
                          ? "Valet parking available"
                          : "Valet parking not available"}
                      </p>
                    )}
                    <p className='mb-2 text-white text-base flex gap-x-2 justify-start items-center'>
                      <img
                        className='h-[30px]'
                        src={Food}
                        alt='Alcohol'
                        loading=' lazy'
                      />{" "}
                      {event?.Event?.foodAndBeverage === "Yes"
                        ? "Food available"
                        : "Food not available"}
                    </p>
                    <p className='mb-2 text-white text-base flex gap-x-2 justify-start items-center'>
                      <img
                        className='h-[30px] w-[30px]'
                        src={Wifi}
                        alt='Wifi'
                        loading=' lazy'
                      />{" "}
                      {event?.Event?.freeWifi === "Yes"
                        ? "Free Wifi"
                        : "No free Wifi"}
                    </p>
                  </div>
                  <div className='ml-6 md:col-span-2'>
                    <p className='mb-2 text-white text-base flex gap-x-2 justify-start items-center'>
                      <img
                        className='h-[30px]'
                        src={Alcohol}
                        alt='Food'
                        loading=' lazy'
                      />{" "}
                      {event?.Event?.alcoholicDrink === "Yes"
                        ? "Alcohol available "
                        : "Alcohol not available "}
                    </p>
                    {event?.Event?.dressCode && (
                      <p className='mb-2 text-white text-base flex gap-x-2 justify-start items-center'>
                        <img
                          className='h-[30px]'
                          src={DressCode}
                          loading=' lazy'
                          alt='DressCode'
                        />{" "}
                        {event?.Event?.dressCode}
                      </p>
                    )}
                  </div>
                </div>
              }
            />
            <CollapseBar
              heading={"About the Organizer"}
              children={<AboutOrganizer event={event} />}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EventPage;

export const AboutOrganizer = ({ event }) => {
  return (
    <div className='grid grid-cols-2 gap-x-4 md:grid-cols-6'>
      <div className='col-span-1'>
        <img
          src={
            event?.Event?.organizer?.logoOriginal?.length > 2
              ? event?.Event?.organizer?.logoOriginal
              : OrganiserLogo
          }
          alt='organiserLogo'
          loading=' lazy'
        />
      </div>
      <div className='lg:ml-6 col-span-2 flex flex-col justify-center font-bold'>
        {event?.Event?.organizer.numOfEvents && (
          <p className='mb-0 text-md md:text-xl'>
            <span className=' text-silver'>No. Events: </span>{" "}
            {event?.Event?.organizer.numOfEvents}
          </p>
        )}
        {event?.Event?.organizer?.experienceLevel && (
          <p className='mb-0 text-md md:text-xl'>
            <span className=' text-silver'>No. years active: </span>{" "}
            {event?.Event?.organizer?.experienceLevel}
          </p>
        )}
        {event?.Event?.organizer.peopleAttended && (
          <p className='mb-0 text-md md:text-xl'>
            <span className=' text-silver'>Largest Event: </span>{" "}
            {event?.Event?.organizer.peopleAttended} pax
          </p>
        )}
      </div>

      <div className='col-span-3 organiserInfo flex flex-col justify-center font-bold'>
        <p
          className='mb-0 text-base'
          dangerouslySetInnerHTML={{
            __html: event?.Event?.organizer?.aboutOrganizer,
          }}
        ></p>
      </div>
    </div>
  );
};

export const AboutPerformer = ({ artist }) => {
  return (
    <div className='grid grid-cols-2 gap-x-4 md:grid-cols-4'>
      <div className='col-span-1'>
        <img src={artist?.image} alt='artist-icon' loading=' lazy' />
      </div>
      <div className='lg:ml-6 col-span-3 flex flex-col justify-center font-bold'>
        {artist?.name && (
          <p className='mb-0 text-md md:text-xl'>{artist?.name}</p>
        )}

        <div className='col-span-3 organiserInfo'>
          <p
            className='mb-0 text-base'
            dangerouslySetInnerHTML={{
              __html: artist?.about,
            }}
          ></p>
        </div>
      </div>
    </div>
  );
};
