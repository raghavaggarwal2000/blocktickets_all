import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useLocation } from "react-router";
import Loading from "../../Loading/Loading";
import { Helmet } from "react-helmet";
import {
  TicketServices,
  EventServices,
  setAuthToken,
} from "../../api/supplier";
import "./dashboard.css";
import PencilEdit from "../../images/icons/pencil-edit.svg";
import userImg from "../../images/defaltUser.webp";
import CollapseColored from "../../components/Collapse/CollapseColored";
import CardLoading from "../../Loading/CardLoading";
import Ticket from "../../components/Ticket/Ticket";
import { tConvert } from "../../utils/timeConvert";
import Clock from "../../images/icons/clock-removebg.png";
import Calendar2 from "../../images/icons/calendar-secondary.png";
import wallet from "../../images/icons/wallet-removebg.png";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getDate } from "../../utils/date";
import TicketWaterMark from "../../images/icons/ticketWaterMark.svg";
// images bank
import AiImage from "../../images/assets/ai_hero.png";

const AI_GENERATED_IMAGES = [AiImage];

function DashboardV2({ isLogin }) {
  const navigate = useNavigate();
  const params = useLocation();
  const ticketRef = useRef();
  const ticketsByEvent = params.search.split("=")[1] || "";
  const [loading, setLoading] = useState(true);
  const [ticketLoading, setTicketLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [allTickets, setAllTickets] = useState([]);
  const [user, setUser] = useState("");
  const [nftDrops, setNftDrops] = useState([]);
  const [events, setEvents] = useState([]);
  const [profileMetadata, setProfileMetadata] = useState("");
  const [savedEvents, setSavedEvents] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [nfts, setNfts] = useState([]);
  const getUserProfile = async () => {
    try {
      setAuthToken(isLogin);
      setLoading(true);
      const res = await TicketServices.getMyProfile();
      setUser(res.data.data.user);
      setProfileMetadata({
        futureEvents: res.data?.data?.futureEventOn,
        past: res?.data?.data?.past,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const getTickets = async () => {
    try {
      setAuthToken(isLogin);
      setTicketLoading(true);
      const res = await TicketServices.getMyTickets({
        eventId: atob(ticketsByEvent) || "",
      });

      const userTickets = res.data.data.TicketDetails;
      setAllTickets(userTickets.reverse());

      //check for past event tickets
      const addons = userTickets.map((it) => it.addon);
      setNftDrops(Array.prototype.concat.apply([], addons));

      setTicketLoading(false);
    } catch (err) {
      setTicketLoading(false);
    }
  };
  const getNfts = async () => {
    try {
      const nfts = await TicketServices.getNfts();
      setNfts(nfts.data.data.TicketDetails);
    } catch (err) {}
  };
  const getEvents = async () => {
    try {
      setAuthToken(isLogin);
      setEventLoading(true);
      const res = await EventServices.getEventByUser();
      setEvents(res?.data?.data?.eventData);
      setSavedEvents(res?.data?.data?.savedEvents);
      setEventLoading(false);
    } catch (err) {
      setEventLoading(false);
    }
  };

  const unsaveEvent = async (id) => {
    try {
      setLoadingSave(true);
      const save = await EventServices.unsaveEvent(id);

      setLoadingSave(false);
      await getEvents();
    } catch (err) {
      setLoadingSave(false);
    }
  };
  useEffect(() => {
    document.body.scrollTop = 0;
    getUserProfile();
    getEvents();
    getNfts();
  }, []);

  useEffect(() => {
    document.body.scrollTop = 0;
    ticketRef && ticketRef?.current?.scrollIntoView({ behavior: "smooth" });
    if (ticketsByEvent) getTickets();
  }, [ticketsByEvent]);
  if (!sessionStorage.getItem("token")) return <Navigate to="/" />;

  return (
    <>
      <Helmet>
        <title>
          {user?.hasOwnProperty("google")
            ? user?.google?.name?.split(" ")?.join("_")
            : user?.username?.split(" ")?.join("_")
            ? user?.username?.split(" ")?.join("_")
            : "User Dashboard"}
        </title>
      </Helmet>

      {loading ? (
        <Loading />
      ) : (
        <div className="mt-[70px] relative bg-black min-h-screen h-auto">
          <div className="border-[1px] border-borderMain xs:mx-4 md:mx-[2rem] lg:mx-[6rem] xl:[12rem] doubleXl:mx-[18rem]">
            <div className="bg-black text-white overflow-hidden relative mx-auto md:h-75">
              {user?.bgPic || AiImage ? (
                <div className="relative mx-auto h-auto lg:max-h-[60vh]">
                  <img
                    className="mx-auto max-h-[60vh] w-full inherit-position"
                    src={
                      user?.bgPic
                        ? user?.bgPic
                        : AI_GENERATED_IMAGES[
                            Math.floor(
                              Math.random() * AI_GENERATED_IMAGES.length
                            )
                          ]
                    }
                    alt="event-banner"
                  />
                  {!user?.bgPic && (
                    <span className="absolute aiImage text-[12px] lg:text-lg">
                      YOUR AI GENERATED IMAGE
                    </span>
                  )}
                </div>
              ) : (
                <div className="bg-black/75 h-[50vh] w-full "></div>
              )}
              <div className="flex flex-row justify-start gap-x-8 relative">
                <div className="h-20 w-20 z-[10000] left-[62px] screen11:left-[10px] top-[-56px] absolute rounded-full overflow-hidden m-auto border-[2px] border-white">
                  <img
                    src={user && user.profilePic ? user.profilePic : userImg}
                    alt="user"
                    className="h-full w-full object-cover m-auto"
                  />
                </div>
                <div className="flex justify-between relative top-0 screen11:top-[-4rem] mb-[1rem]   w-full">
                  <div className="screen11:pl-[0.75rem] pl-[4rem] flex flex-col items-start gap-2 relative mt-4">
                    <div className="flex flex-col">
                      <span className="text-[24px] w-full font-semibold">
                        {user?.hasOwnProperty("google")
                          ? user.google.name
                          : user?.username
                          ? user?.username
                          : "User"}{" "}
                      </span>
                      <span className="text-silver">
                        {user?.hasOwnProperty("email") ? user.email : ""}{" "}
                        {user?.hasOwnProperty("phoneNumber") &&
                          " | " + user?.phoneNumber}
                      </span>
                    </div>

                    <div className="flex text-base flex-col">
                      <span className="flex items-center mb-2">
                        {" "}
                        <img
                          className="h-[24px] mr-[14px]"
                          src={Calendar2}
                          alt={"images"}
                        />
                        {profileMetadata?.futureEvents?.startDate ? (
                          <span className="text-[14px] md:text-base">
                            Your next event is on{" "}
                            {getDate(profileMetadata?.futureEvents?.startDate)}
                          </span>
                        ) : (
                          <span className="text-[14px] md:text-base">
                            No upcoming events
                          </span>
                        )}
                      </span>
                      <span className="flex items-center mb-2">
                        {" "}
                        <img
                          className="h-[24px] mr-4"
                          src={Clock}
                          alt={"images"}
                        />
                        {profileMetadata?.past ? (
                          <span className="text-[14px] md:text-base">
                            {profileMetadata?.past} past events
                          </span>
                        ) : (
                          <span className="text-[14px] md:text-base">
                            No past events
                          </span>
                        )}
                      </span>
                      <span className="flex items-center text-white  w-full screen11:text-center">
                        <img
                          className="h-[24px]  mr-4"
                          src={wallet}
                          alt={"images"}
                        />{" "}
                        <span className="trimWord screen11:text-[12px] xs:text-[10px]">
                          {user && user.wallets.length > 0
                            ? user.wallets[0]
                            : "No wallet added"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="my-4 mr-16 screen11:mr-2"
                    onClick={() => navigate("/edit-profile")}
                  >
                    <img
                      className="h-[24px] w-[24px] hover:cursor-pointer hover:opacity-75"
                      src={PencilEdit}
                      alt="pencil-edit"
                    />
                  </div>
                </div>
              </div>
            </div>
            {ticketsByEvent ? (
              <CollapseColored
                heading={"My Tickets & Addons"}
                children={
                  <MyNfts
                    ticketLoading={ticketLoading}
                    allTickets={allTickets}
                  />
                }
                ticketRef={ticketRef}
                color={`green-collapse-gradient`}
              />
            ) : (
              <CollapseColored
                heading={"My Events"}
                children={
                  <Events eventLoading={eventLoading} events={events} />
                }
                color={`green-collapse-gradient`}
              />
            )}

            <CollapseColored
              heading={"My NFTs"}
              children={<NftSection nfts={nfts} />}
              color={`red-collapse-gradient`}
            />
            <CollapseColored
              heading={"My Saved Events"}
              children={
                savedEvents?.length > 0 ? (
                  <Events
                    eventLoading={eventLoading}
                    events={savedEvents}
                    savedTab={true}
                    unsaveEvent={unsaveEvent}
                    loadingSave={loadingSave}
                  />
                ) : (
                  <div className="font-semibold text-white text-xl">
                    You have no saved events.{" "}
                    <Link
                      to="/"
                      className="hover:underline font-sans text-yellowLight"
                    >
                      Find Some
                    </Link>
                  </div>
                )
              }
              color={`yellow-collapse-gradient`}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardV2;

const MyNfts = ({ allTickets, ticketLoading }) => {
  return (
    <>
      <Link
        to="/dashboard/v2"
        className="mb-4 font-bold text-white hover:underline"
      >
        <ArrowBackIcon /> Go Back
      </Link>

      <div className="mt-4 flex justify-between items-center">
        {!ticketLoading && allTickets.length === 0 && (
          <div className="ml-4 w-full cursor-pointer text-white  rounded-lg mt-2 py-1 font-bold text-xl">
            You have No NFTs. Check out our{" "}
            <Link to="/marketplace" className="font-sans text-yellowLight">
              NFT Marketplace
            </Link>{" "}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-x-4 gap-y-4 w-full place-items-center">
          {!ticketLoading ? (
            allTickets.map((data) => (
              <>
                {data?.Event && (
                  <Ticket
                    eventId={data._id}
                    nftHash={data?.nftHash}
                    ticketId={data?._id}
                    eId={data.Event._id}
                    eventName={data.Event.eventTitle}
                    eventDetails={data?.ticketType?.ticketInfo}
                    eventImg={
                      data?.ticketType?.image
                        ? data?.ticketType?.image
                        : data?.Event?.eventSquareImage
                        ? data?.Event?.eventSquareImage
                        : data?.Event?.eventImageOriginal
                    }
                    eventDate={data.Event.startDate}
                    eventTime={data.Event.startTime}
                    price={data.ticketType?.price}
                    qrCode={data?.qrCode}
                    notLive
                    location={data.Event.location}
                    ticketDate={
                      data.Event?.ticketEventStartDate || data.Event?.startDate
                    }
                    ticketTime={
                      data.Event?.ticketEventStartTime || data.Event?.startTime
                    }
                    currency={data.ticketType.currency}
                    ticketName={data.ticketType.ticketName}
                    ticketNft={data.nftIndex}
                    nftClaimed={data.specialPackageClaimed}
                    organizerName={data?.Event?.organizer?.organizerName}
                    ticketSponsorImage={data?.ticketType?.ticketSponsorImage}
                    // bookingId={data?.bookingId}
                  />
                )}
              </>
            ))
          ) : allTickets.length === 0 ? (
            <div className="font-semibold text-white text-xl">
              You have no saved events.{" "}
              <Link
                to="/marketplace"
                className="hover:underline font-sans text-yellowLight"
              >
                NFT Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-full place-items-center">
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const EventCard = ({ event, savedTab, loadingSave, unsaveEvent }) => {
  return (
    <div className="bg-orange grid grid-cols-1 gap-x-2 md:grid-cols-2 border-[5px] border-white rounded-lg p-1">
      <div className="overflow-hidden col-span-1 w-full h-full max-h-[300px]">
        <img
          className="h-full w-full p-1"
          src={
            event?.eventSquareImage
              ? event?.eventSquareImage
              : event?.eventImageCompress
          }
          alt="event-iamge"
        />
      </div>
      <div className="mx-2 overflow-hidden text-white text-base col-span-1 flex flex-col justify-between items-center">
        <div className="my-1 flex flex-col justify-center justify-self-start align-self-start w-[100%] h-[100%]">
          <span className="font-semibold mb-1 ml-2 text-[14px]">
            {getDate(event?.startDate)}
          </span>
          <span className="font-semibold mb-1 ml-2 text-[14px]">
            {tConvert(event?.startTime)} - {tConvert(event?.endTime)}
          </span>
          <span className="font-semibold whitespace-nowrap ml-2 text-[14px] ">
            {event?.location}
          </span>
        </div>
        {savedTab ? (
          <div
            // to={`/event/v2/${event?._id}`}
            className=" px-1 addBorder flex justify-around items-center text-[14px] md:mr-4 md:ml-4 font-semibold w-full cursor-pointer  text-black bg-offWhite rounded-lg mb-2  px-2 text-center"
          >
            <button
              onClick={() => unsaveEvent(event?._id)}
              disabled={loadingSave}
              className="py-4 w-1/2 leading-4 hover:opacity-75"
            >
              {loadingSave ? "Removing..." : "Remove"}
            </button>
            <div class="vertical_dotted_line"></div>
            <Link
              to={`/${event?.eventTitle.replace(/\s+/g, "_")}/${event?._id}`}
              className="py-4 w-1/2 leading-4 hover:opacity-75 text-black"
            >
              Book now
            </Link>
          </div>
        ) : (
          <Link
            to={`/dashboard/v2?events=${btoa(event?._id)}`}
            className=" addBorder flex justify-around items-center text-[14px] md:mr-4 md:ml-4 font-semibold w-full cursor-pointer hover:opacity-75 text-black bg-offWhite rounded-lg mb-2  px-2 text-center"
          >
            <img
              className="rotate-12 h-[64px]"
              src={TicketWaterMark}
              alt="waterMark"
            />
            <div class="vertical_dotted_line"></div>
            <span className="w-1/2 leading-4">View Tickets & add-ons</span>
          </Link>
        )}
      </div>
    </div>
  );
};

const Events = ({
  events,
  eventLoading,
  savedTab,
  loadingSave,
  unsaveEvent,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem] tripleXl:gap-[6rem] m-[0.5rem] lg:m-[1rem] xl:m-[2rem]">
      {eventLoading ? (
        <Loading />
      ) : (
        events
          ?.map((event) => {
            return (
              <EventCard
                loadingSave={loadingSave}
                unsaveEvent={unsaveEvent}
                event={event}
                savedTab={savedTab}
              />
            );
          })
          .reverse()
      )}
    </div>
  );
};

const NftSection = ({ nfts }) => {
  return (
    <>
      {nfts?.length > 0 ? (
        <div className="py-[30px] px-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-[50px] place-items-center">
          {nfts
            ?.map((nft) => {
              return (
                <div className="max-h-[560px] max-w-[360px] flex item-center justify-center">
                  <img
                    className="rounded-lg h-full w-full object-contain"
                    src={
                      nft?.Event?.eventSquareImage
                        ? nft?.Event?.eventSquareImage
                        : nft?.Event?.eventImageOriginal
                    }
                    alt="nft"
                  />
                </div>
              );
            })
            .reverse()}
        </div>
      ) : (
        <div className="font-semibold text-white text-xl">
          You have no NFTs purchased.{" "}
          <Link
            to="/marketplace"
            className="hover:underline font-sans text-yellowLight"
          >
            NFT Marketplace
          </Link>
        </div>
      )}
    </>
  );
};
