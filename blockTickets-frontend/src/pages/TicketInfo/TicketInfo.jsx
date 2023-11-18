//this page has been deprectaed now

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./event-details.css";
import { Helmet } from "react-helmet";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

//components
//images
import { useParams } from "react-router";
import { endpoint, getEventById } from "../../api/api-client.js";
import Loading from "../../Loading/Loading";
import { useDispatch } from "react-redux";
import { getTicketEventDetails } from "../../Redux/action";

import Web3 from "web3";
import RedirectLocation from "../../Modals/RedirectLocation/RedirectLocation";
import NotLive from "../../Modals/NotLive/NotLive";
import detailsImg from "../../images/details.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import PayUsingMarket from "../../Modals/PayUsing/PayUsingMarket";
import MessageModal from "../../Modals/Message Modal/MessageModal";
import FullLoading from "../../Loading/FullLoading";
import { tConvert } from "../../utils/timeConvert";
import { numberWithCommas } from "../../utils/numberConvert";
import { getCompleteDate } from "../../utils/date";

function createData(seller, ticketType, buyer, price) {
  return { seller, ticketType, buyer, price };
}

const rows = [
  createData("John Doe", "Ticket 1.0", "Bruce wayne", 24),
  createData("Kyle Garrick", "Ticket 1.0", "John Doe", 37),
  createData("Soap Mactavish", "Ticket 1.0", "Steve Rogers", 24),
  createData("Simon Riley", "Ticket 1.0", "Peter Parker", 67),
  createData("John Doe", "Ticket 1.0", "Matt Murdock", 3.9),
];

const TicketInfo = ({ isLogin, setSignIn }) => {
  const [resale, setResale] = useState([]);
  const [eventDetails, setEventDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenSession, setTokenSession] = useState(null);
  var currDate = new Date().toISOString();
  const [eventBackImg, setEventBackImg] = useState();
  const web3 = new Web3(Web3.givenProvider);
  const [maticUSD, setMaticUSD] = useState("");
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");
  const [nftDialog, setNftDialog] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [renderComponent, setRenderComponent] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [isLive, setIsLive] = useState(true);

  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { id } = useParams();
  const getEventDetails = async () => {
    const res = await getEventById({
      eventID: id,
    });
    setEventDetails(res);
    dispatch(
      getTicketEventDetails({
        EventDataDetails: res.data.data,
      })
    );
    if (new Date() > new Date(res.data.data?.Event.endDate)) setIsLive(false);
    setLoading(false);
  };
  const getTicketOnResale = async () => {
    const res = await axios.post(
      `${endpoint}/ticket/get-ticket-onsale-for-event`,
      { eventId: id }
    );
    setResale(res.data.data.TicketDetails);
  };

  const handleBuy = (id) => {
    if (
      eventDetails.data.data.Event.totalBooked <
      eventDetails.data.data.Event.totalTicket
    ) {
      navigate(
        `/${eventDetails.data.data.Event?.eventTitle}/${id}/addQuantity`
      );
    } else {
      setNftDialog(true);
    }
  };

  const handleClickOpen = () => {
    setNftDialog(true);
  };

  const handleClose = () => {
    setNftDialog(false);
  };

  useEffect(() => {
    setTokenSession(sessionStorage.getItem("token"));
  }, [tokenSession]);
  useEffect(() => {
    getEventDetails();
    getTicketOnResale();
  }, [id]);
  useEffect(() => {
    if (
      eventDetails &&
      eventDetails.data &&
      eventDetails.data.data &&
      eventDetails.data.data.Event
    ) {
      setEventBackImg(eventDetails.data.data.Event.eventImageOriginal);
    }
  }, [eventDetails]);
  useEffect(() => {
    document.body.scrollTop = 0;
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=inr`
      )
      .then((res) => {
        setMaticUSD(res.data["binancecoin"].inr);
      })
      .catch((err) => {});
    console.log();
  }, []);

  return (
    <>
      <Helmet>
        <title>Event Details</title>
      </Helmet>
      <RedirectLocation
        open={showLocation}
        setOpen={setShowLocation}
        handleBuy={handleBuy}
        id={id}
      />

      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={"Message"}
        message={messageModalDesc}
      />
      <BuyNftModal onClose={handleClose} open={nftDialog} />
      {buyLoading && <FullLoading />}
      <div
        className={
          renderComponent ? "dropin-container-show" : "dropin-container-hide"
        }
      >
        <div
          className="dropin-parent"
          id="drop_in_container"
          style={{ minHeight: "600px" }}
        >
          Your component will come here
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        eventDetails &&
        eventDetails.data &&
        eventDetails.data.data && (
          <div className="grid grid-cols-2 screen7:grid-cols-1 gap-8 mb-12 mt-[70px] px-24 screen18:px-12 screen3:px-8">
            <div className="flex flex-col gap-4 relative">
              {isLive && (
                <div className="rounded-lg bg-[#00000033] z-10 text-[#fff] border-2 border-white text-sm px-2 py-1 font-semibold absolute top-4 right-4">
                  Live
                </div>
              )}
              <img
                src={eventDetails.data.data?.Event?.eventImageCompress}
                alt="event"
                className="w-full min-h-[400px] max-h-[670px]  h-full rounded-3xl object-fill"
              />
              <div className="screen7:hidden">
                <EventDescription
                  data={eventDetails.data.data?.Event?.eventDescription}
                  id={id}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-2">
                <h2>{eventDetails.data.data.Event.eventTitle}</h2>
                <div className=""></div>
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-DarkColor">Date</span>
                  <span className="font-medium">
                    {eventDetails.data.data.Event.startDate
                      ? getCompleteDate(eventDetails.data.data.Event.startDate)
                      : ""}
                  </span>
                  {eventDetails.data.data.Event._id ==
                    "629a03ea8cbbcf6c9e323581" && (
                    <span className="font-medium">Sat Jun 25 2022</span>
                  )}
                  <span className="font-medium">
                    {id !== "630e04a64c25268040d19ebe" &&
                    eventDetails.data.data.Event.endDate &&
                    eventDetails.data.data.Event.startDate !==
                      eventDetails.data.data.Event.endDate
                      ? new Date(
                          eventDetails.data.data.Event.endDate
                        ).toDateString()
                      : ""}
                  </span>
                </div>
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-DarkColor">Time Onward</span>
                  {id == "62d6c455bdb6962417f832d8" ||
                  id == "630e04a64c25268040d19ebe" ? (
                    <span className="font-medium">
                      {id == "630e04a64c25268040d19ebe"
                        ? tConvert(eventDetails.data.data.Event.startTime)
                        : "6:30 PM "}{" "}
                      IST
                    </span>
                  ) : (
                    <span className="font-medium">
                      {eventDetails.data.data.Event.startDate
                        ? tConvert(eventDetails.data.data.Event.startTime)
                        : ""}{" "}
                      IST
                    </span>
                  )}
                </div>
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-DarkColor">Price</span>
                  <span className="font-medium">PAID</span>
                </div>
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-DarkColor">Location</span>
                  <span className="font-medium">
                    {eventDetails.data.data.Event &&
                      eventDetails.data.data.Event.location &&
                      eventDetails.data.data.Event.location.length > 0 &&
                      eventDetails.data.data.Event.location}
                  </span>
                </div>
              </div>
              {id == "630e04a64c25268040d19ebe" && !isLogin ? (
                <button
                  className="w-full bg-BlueButton text-white text-lg font-medium py-3 rounded-md"
                  onClick={() => setSignIn(true)}
                >
                  Sign In
                </button>
              ) : isLogin ? (
                currDate <= eventDetails.data.data.Event.endDate ? (
                  <button
                    target="_blank"
                    className="w-full bg-BlueButton text-white text-lg font-medium py-3 rounded-md text-center"
                    onClick={() => {
                      handleBuy(id);
                    }}
                    disabled={
                      eventDetails.data.data.Event.totalBooked >=
                      eventDetails.data.data.Event.totalTicket
                        ? true
                        : false
                    }
                  >
                    {eventDetails.data.data.Event.totalBooked <
                    eventDetails.data.data.Event.totalTicket
                      ? "Buy Now"
                      : "Sold out"}
                  </button>
                ) : (
                  <button
                    className="w-full bg-BlueButton text-white text-lg font-medium py-3 rounded-md"
                    target="_blank"
                    disabled={true}
                  >
                    Sold out
                  </button>
                )
              ) : (
                <button
                  className="w-full bg-BlueButton text-white text-lg font-medium py-3 rounded-md"
                  onClick={() => setSignIn(true)}
                >
                  Login
                </button>
              )}
              <div className="hidden screen7:block mt-4">
                <EventDescription
                  data={eventDetails.data.data.Event.eventDescription}
                  id={id}
                />
              </div>
              <div className="border-2 border-LightColor rounded-lg overflow-x-scroll p-4 py-2 mt-4">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Seller</TableCell>
                      <TableCell>Buyer</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resale.map((row) => (
                      <TableRow
                        key={row.transaction._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.transaction[0].previousOwner.username
                            ? row.transaction[0].previousOwner.username
                            : "Anon Seller"}
                        </TableCell>
                        {/* <TableCell
                                                    style={{
                                                        display: "inline-block",
                                                        textOverflow:
                                                            "ellipsis",
                                                        wordWrap: "break-word",
                                                        overflow: "hidden",
                                                        maxHeight: "5.6em",
                                                        lineHeight: "1.8em",
                                                    }}
                                                >
                                                    {row.ticketType.ticketType
                                                        ? row.ticketType
                                                              .ticketType
                                                        : row.ticketType
                                                              .ticketInfo}
                                                </TableCell> */}
                        <TableCell>
                          {row.transaction[0].currentOwner
                            ? row.transaction[0].currentOwner.username
                              ? row.transaction[0].currentOwner.username
                              : "Anon Buyer"
                            : "Not sold"}
                        </TableCell>
                        <TableCell>
                          {web3.utils.fromWei(
                            row.transaction[0].price,
                            "ether"
                          ) * maticUSD}
                        </TableCell>
                        {/* <Button onClick={() => handleBuy(row)}>Buy Now</Button> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )
      )}
      {id == "62d6c455bdb6962417f832d8" && (
        <div>
          <div className="text-3xl font-semibold px-24 screen18:px-12">
            Movie Trailer
          </div>

          <div className="flex flex-wrap -mx-3 overflow-hidden xl:-mx-3 px-24 screen18:px-12">
            <div className="my-3 px-3 w-full overflow-hidden sm:w-full lg:w-full xl:my-3 xl:px-3 xl:w-1/2">
              <div className="text-3xl font-semibold mb-2">In Kannada</div>
              <iframe
                className="movie-trailerIframe"
                src="https://www.youtube.com/embed/-0ldvhBlL-k"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen="allowfullscreen"
              ></iframe>
            </div>

            <div className="my-3 px-3 w-full overflow-hidden sm:w-full lg:w-full xl:my-3 xl:px-3 xl:w-1/2">
              <div className="text-3xl font-semibold mb-2">In Tamil</div>
              <iframe
                className="movie-trailerIframe"
                src="https://www.youtube.com/embed/CEu2IMLTPTg"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div className="my-3 px-3 w-full overflow-hidden sm:w-full lg:w-full xl:my-3 xl:px-3 xl:w-1/2">
              <div className="text-3xl font-semibold mb-2">In Hindi</div>
              <iframe
                className="movie-trailerIframe"
                src="https://www.youtube.com/embed/VV9SfpGRVFw"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div className="my-3 px-3 w-full overflow-hidden sm:w-full lg:w-full xl:my-3 xl:px-3 xl:w-1/2">
              <div className="text-3xl font-semibold mb-2">In English</div>
              <iframe
                className="movie-trailerIframe"
                src="https://www.youtube.com/embed/Ylte9v30UcY"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const EventDescription = ({ data, id }) => {
  return (
    <div className="border-2 border-LightColor rounded-lg p-4">
      <div className="w-full border-b-2 border-LightColor flex gap-2 pb-2 mb-4">
        <img src={detailsImg} alt="details" />
        <span className="text-xl font-medium">Event Description</span>
      </div>
      <span className="font-medium"></span>
      <p className="text-DarkColor">
        {id === "62d6c455bdb6962417f832d8" ? (
          <div>
            Come and be a part of The World’s First NFT Movie membership
            Premiere of Vikrant Rona. <br />
            <br />
            As a member of the NFT Membership you will get an exclusive red
            carpet access to the Movie Premiere on 27th July’22 at Vox cinema,
            Deira City Centre Mall, Dubai. <br />
            <br />
            Depending on the category of the Membership you choose, you will get
            a once in a life time opportunity to own a NFT Membership of Kichcha
            creations wherein the member will be able to meet and interact with
            Sudeepa Kichcha, own autographed Merchandise of Vikrant Rona, access
            to success parties, access to future Premiere movies and much more.
          </div>
        ) : (
          data
        )}
      </p>
    </div>
  );
};

const BuyNftModal = ({ onClose, open }) => {
  const navigate = useNavigate();
  return (
    <>
      <Dialog
        onClose={() => onClose()}
        open={open}
        PaperProps={{ style: { width: "400px", height: "300px" } }}
      >
        <div className="flex items-center gap-4 justify-center relative flex-col w-full h-full p-4">
          <div
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white"
          >
            <CloseIcon />
          </div>
          <h2 className="text-center">Sold out</h2>
          <span className="text-center">
            The event has been sold out, to buy tickets as NFTs please go to
            marketplace.
          </span>
          <button
            className="py-3 px-6 bg-BlueButton text-white text-lg rounded-lg"
            onClick={() => navigate("/marketplace")}
          >
            Go to Marketplace
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default TicketInfo;
