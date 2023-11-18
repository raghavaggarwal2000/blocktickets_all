import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./event-details.css";
import { Helmet } from "react-helmet";
//images
// import edTop from "../../images/event-details/ed-top.png";
import { useParams } from "react-router";
import { getEventById } from "../../api/api-client.js";
import Loading from "../../Loading/Loading";
import { useDispatch } from "react-redux";
import { getTicketEventDetails } from "../../Redux/action";
import detailsImg from "../../images/details.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
//deprecated now this page

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

const EventDetails = ({ isLogin, screenWidth }) => {
  const [eventDetails, setEventDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenSession, setTokenSession] = useState(null);
  var currDate = new Date().toISOString();
  const [eventBackImg, setEventBackImg] = useState();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { id } = useParams();
  console.log("id", id)
  const getEventDetails = async () => {
    const res = await getEventById({
      eventId: id,
    });
    setEventDetails(res);
    dispatch(
      getTicketEventDetails({
        EventDataDetails: res.data.data,
      })
    );
    setLoading(false);
    // //console.log(eventDetails.data.data.Event.eventImageOriginal);
  };

  useEffect(() => {
    setTokenSession(sessionStorage.getItem("token"));
  }, [tokenSession]);
  useEffect(() => {
    getEventDetails();
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
  }, []);

  return (
    <>
      <Helmet>
        <title>Event Details</title>
      </Helmet>

      {loading ? (
        <Loading />
      ) : (
        eventDetails &&
        eventDetails.data &&
        eventDetails.data.data && (
          <div className="grid grid-cols-2 gap-8 mb-12 mt-[90px] px-24">
            <div className="flex flex-col gap-4">
              <img
                src={eventDetails.data.data.Event.eventImageOriginal}
                alt="event"
                className="w-full min-h-[400px]  h-auto rounded-3xl max-h-[640px]"
              />
              <div className="border-2 screen7:hidden border-LightColor rounded-lg p-4">
                <div className="w-full border-b-2 border-LightColor flex gap-2 pb-2 mb-4">
                  <img src={detailsImg} alt="details" />
                  <span className="text-xl font-medium">Event Description</span>
                </div>
                <span className="font-medium">By Kyle garrick</span>
                <p className="text-DarkColor">
                  {eventDetails.data.data.Event.eventDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-2">
                <h2>{eventDetails.data.data.Event.eventTitle}</h2>
                <div className=""></div>
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-DarkColor">Date</span>
                  <span className="font-medium">
                    18th March 2022, 6:00 AM IST
                  </span>
                </div>
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-DarkColor">Price</span>
                  <span className="font-medium">$30-$110</span>
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
              {currDate <= eventDetails.data.data.Event.endDate ? (
                <button
                  className="w-full bg-BlueButton text-white text-lg font-medium py-3 rounded-md"
                  onClick={() => navigate(`/event/${id}/addQuantity`)}
                  disabled={
                    eventDetails.data.data.Event.totalBooked >=
                    eventDetails.data.data.Event.totalTicket
                      ? true
                      : false
                  }
                >
                  {eventDetails.data.data.Event.totalBooked <=
                  eventDetails.data.data.Event.totalTicket
                    ? "Buy Now"
                    : "Sold out"}
                </button>
              ) : (
                <button
                  className="w-full bg-BlueButton text-white text-lg font-medium py-3 rounded-md"
                  onClick={() => navigate(`/event/${id}/addQuantity`)}
                  disabled={
                    eventDetails.data.data.Event.totalBooked >=
                    eventDetails.data.data.Event.totalTicket
                      ? true
                      : false
                  }
                >
                  {eventDetails.data.data.Event.totalBooked <=
                  eventDetails.data.data.Event.totalTicket
                    ? "Buy Now"
                    : "Sold out"}
                </button>
              )}
              <div className="border-2 border-LightColor rounded-lg p-4 py-2 mt-4 event__desc__ticket">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Seller</TableCell>
                      <TableCell>Buyer</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell> </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.seller}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.seller == "Blocktickets"
                            ? "Blocktickets"
                            : row.seller}
                        </TableCell>
                        <TableCell>{row.buyer}</TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell>Buy Now</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default EventDetails;
