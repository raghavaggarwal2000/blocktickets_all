import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./ticket-type2.css";
import "./ticket-buying.css";
import { getDay, getMonth, getYear } from "../../utils/DateManipulation.js";
import LoadingModal from "../../Modals/Loading Modal/LoadingModal.jsx";
import MessageModal from "../../Modals/Message Modal/MessageModal.jsx";
import { getEvents } from "../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form } from "react-bootstrap";
// import crossSvg from "../../images/crossSvg.svg";
import { numberWithCommas } from "../../utils/numberConvert";
import { tConvert } from "../../utils/timeConvert";
import AddOnModal from "../../Modals/AddOnModal/AddOnModal.jsx";

const TicketDetails = ({ ticketsData, userToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketQty, setTicketQty] = useState(1);
  const [ticketId, setTicketId] = useState(null);
  const [ticketQtyStep, setTicketQtyStep] = useState();
  const [ticketSummary, setTicketSummary] = useState(false);
  const [modalTitle, setModalTitle] = useState("Loading");
  const [modalShow, setModalShow] = useState(false);
  const [addOnModalShow, setAddOnModalShow] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");

  const eventDataDetails = useSelector(
    (state) =>
      state.ticketEventDetailsReducer.TicketEventDetails.EventDataDetails
  );

  //NFT FORM Data
  let NFTFormData = new FormData();
  useDispatch()(
    getEvents({
      ticketDetails: {
        ticketId: ticketId,
        ticketQuantity: ticketQty,
      },
      nftForm: NFTFormData,
      data: eventDataDetails,
    })
  );
  // create NFT function
  const bookMyTicket = async () => {
    localStorage.setItem("selectedTickets", JSON.stringify(selectedTickets));
    navigate("/user-pay-now");
  };
  const inputEvent = (e, itemId) => {
    setTicketQty(e.target.value);
    setTicketId(itemId);
  };

  const addToArray = (ticket) => {
    const selectedTicket = { ...ticket };
    selectedTicket.quantity = 1;
    setSelectedTickets([...selectedTickets, selectedTicket]);
  };

  const popFromArray = (ticketId) => {
    setSelectedTickets(selectedTickets.filter((item) => item._id != ticketId));
  };

  const isTicketSelected = (ticketId) => {
    const arr = selectedTickets;
    return arr.findIndex((item) => item._id == ticketId) > -1;
  };

  const changeQty = (ticketId, val) => {
    const index = selectedTickets.findIndex((it) => it._id == ticketId);
    const arr = [...selectedTickets];
    if (index > -1) {
      arr[index].quantity += val;
    }
    setSelectedTickets(arr);
  };

  useEffect(() => {
    document.body.scrollTop = 0;
  }, []);
  return (
    <>
      <LoadingModal visibility={modalShow} title={modalTitle} />
      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={"Message"}
        message={messageModalDesc}
      />
      <AddOnModal
        show={addOnModalShow}
        setShow={setAddOnModalShow}
        selectedTickets={selectedTickets}
        ticketId={ticketId}
      />

      <div className="ticket-slider !mt-[70px] pb-12 pt-12 noScrollBar !h-fit overflow-y-scroll">
        <Container className="flex justify-center items-center">
          {eventDataDetails && (
            <div className="flex flex-col w-[600px] items-center justify-center">
              <div className="ticket_type_box gap-4">
                <div className="flex justify-between items-center mb-4 rounded-lg border-2 border-LightColor">
                  <h4 className="text-leftn m-0 text-black">
                    {eventDataDetails.Event &&
                      eventDataDetails.Event.eventTitle}
                  </h4>
                  {/* <img
                    className="h-4 w-4"
                    src={crossSvg}
                    alt=""
                    onClick={() => {
                      navigate(`/${eventDataDetails.Event.eventTitle}/${id}`);
                    }}
                  /> */}
                </div>
                {/* first step */}
                {!ticketId && <h2>Please select the ticket</h2>}
                {/* second step */}
                {ticketId && ticketQtyStep && (
                  <h2>Please enter ticket quantity</h2>
                )}
                {/* third step - summary */}
                {ticketSummary && <h2>Ticket Summary</h2>}

                {eventDataDetails &&
                  eventDataDetails.TicketDetails &&
                  eventDataDetails.TicketDetails.map((ticket) => {
                    return (
                      ticket.visible == "VISIBLE" && (
                        // (currDate >= (new Date(ticket.startDate)).getTime()) &&
                        <div
                          key={ticket._id}
                          id={ticket._id}
                          style={{ justifyContent: "normal" }}
                        >
                          <Form.Check
                            type="checkbox"
                            onChange={(e) =>
                              e.target.checked
                                ? addToArray(ticket)
                                : popFromArray(ticket._id)
                            }
                            disabled={ticket.sold >= ticket.ticketQuantity}
                          />
                          <div>
                            <div className="ticket-diff-types rounded-lg border-2 border-LightColor d-flex p-4 ms-2">
                              <div className="overflow-hidden max-w-[150px] h-[150px] mr-4 rounded-lg">
                                <img
                                  src={
                                    ticket?.image
                                      ? ticket.image
                                      : eventDataDetails?.Event
                                          .eventImageOriginal
                                  }
                                  alt="event"
                                  className="h-full"
                                />
                              </div>
                              <div className="mobile-ticket-style">
                                <h4 className="font-semibold flex flex-col">
                                  {ticket.ticketName}
                                  {location.pathname ===
                                    "/event/v2/627ea2bd14a38824d673de32/addQuantity" && (
                                    <span className="ticketInfo--text">
                                      {ticket.ticketInfo}
                                    </span>
                                  )}
                                </h4>
                                <p>
                                  {getDay(ticket?.ticketEventStartDate)},{" "}
                                  {ticket.ticketEventStartDate.slice(8, 10)}{" "}
                                  {getMonth(ticket.ticketEventStartDate)},{" "}
                                  {getYear(ticket.ticketEventStartDate)},{" "}
                                  {tConvert(ticket.ticketEventStartTime)} IST
                                </p>
                                <div className="text-sm text-DarkColor">
                                  {eventDataDetails?.Event.location}
                                </div>
                                <div className="d-flex">
                                  <h5 className="font-semibold">
                                    ₹{" "}
                                    {numberWithCommas(Math.floor(ticket.price))}
                                  </h5>
                                  {ticket.sold >= ticket.ticketQuantity && (
                                    <span className="sold-out justify-between">
                                      Sold Out
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div
                                className={`text-center d-flex flex-column items-center justify-center ${
                                  isTicketSelected(ticket._id)
                                    ? "visible"
                                    : "invisible"
                                }`}
                              >
                                <p className="d-flex flex-column items-center">
                                  <span>Ticket Qty:</span>{" "}
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => changeQty(ticket._id, -1)}
                                      disabled={
                                        selectedTickets.findIndex(
                                          (it) => it._id == ticket._id
                                        ) > -1 &&
                                        selectedTickets[
                                          selectedTickets.findIndex(
                                            (it) => it._id == ticket._id
                                          )
                                        ].quantity > 1
                                          ? false
                                          : true
                                      }
                                      className={`text-white text-lg rounded-full w-6 h-6 flex items-center justify-center
                                                          ${
                                                            selectedTickets.findIndex(
                                                              (it) =>
                                                                it._id ==
                                                                ticket._id
                                                            ) > -1 &&
                                                            selectedTickets[
                                                              selectedTickets.findIndex(
                                                                (it) =>
                                                                  it._id ==
                                                                  ticket._id
                                                              )
                                                            ].quantity > 1
                                                              ? "bg-blue"
                                                              : "bg-LightColor"
                                                          }
                                                        `}
                                    >
                                      {" "}
                                      -{" "}
                                    </button>
                                    <span className="text-xl px-2">
                                      {selectedTickets.findIndex(
                                        (it) => it._id == ticket._id
                                      ) > -1
                                        ? selectedTickets[
                                            selectedTickets.findIndex(
                                              (it) => it._id == ticket._id
                                            )
                                          ].quantity
                                        : 0}
                                    </span>
                                    <button
                                      onClick={() => changeQty(ticket._id, 1)}
                                      disabled={
                                        selectedTickets.findIndex(
                                          (it) => it._id == ticket._id
                                        ) > -1 &&
                                        selectedTickets[
                                          selectedTickets.findIndex(
                                            (it) => it._id == ticket._id
                                          )
                                        ].quantity < 10
                                          ? false
                                          : true
                                      }
                                      className={`text-white text-lg rounded-full w-6 h-6 flex items-center justify-center
                                                          ${
                                                            selectedTickets.findIndex(
                                                              (it) =>
                                                                it._id ==
                                                                ticket._id
                                                            ) > -1 &&
                                                            selectedTickets[
                                                              selectedTickets.findIndex(
                                                                (it) =>
                                                                  it._id ==
                                                                  ticket._id
                                                              )
                                                            ].quantity < 10
                                                              ? "bg-blue"
                                                              : "bg-LightColor"
                                                          }
                                                        `}
                                    >
                                      +
                                    </button>
                                  </div>
                                </p>
                                <button
                                  className="bg-BlueButton w-32 text-xs text-white rounded-md px-2 py-1"
                                  onClick={() => {
                                    setTicketId(ticket._id);
                                    setAddOnModalShow(true);
                                  }}
                                >
                                  View AddOns NFT
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
              </div>
              {selectedTickets.length > 0 && (
                <button
                  className="bg-BlueButton w-full text-lg mt-4 text-white rounded-md px-5 py-3"
                  onClick={bookMyTicket}
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default TicketDetails;
