import React, { useState, useRef, useEffect } from "react";
import "./TicketBox.css";
import { twoWords, sumProperty, getStrings } from "../../utils/utils";
import Dash from "../../images/icons/dash.svg";
import CollapseInfoBar from "../../components/Collapse/CollapseInfo";
import Plus from "../../images/icons/plus.svg";
import Minus from "../../images/icons/Minus.svg";
import TicketWaterMark from "../../images/icons/ticketWaterMark.svg";
import getSymbolFromCurrency from "currency-symbol-map";
import { v4 as uuid } from "uuid";
import Payments from "./Payment.jsx";
import { tConvert } from "../../utils/timeConvert";
import { getDate } from "../../utils/date";
import { calculateTicketPrice } from "../../utils/utils";
import FlagBg from "../../images/assets/ticket_flag.svg";
import CollapseBar from "../../components/Collapse/Collapse";
import commaNumber from "comma-number";
import { toast } from "react-toastify";
import ImgPop from "../../Modals/mediaPopModal/imgPop";

const TicketBox = ({
  setSignIn,
  userPhoneNumber,
  isLogin,
  tickets,
  setMessageModal,
  setMessageModalDesc,
  setShowFullLoading,
  showFullLoading,
  setPayMessage,
  setRenderComponent,
  fees,
  event,
  promoCodeInfo,
  getValues,
  promoCode,
  ip,
  eventId,
  eventLayoutImage,
  ticketsID,
  setTicketsID,

}) => {
  const [quantity, setQuantity] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [breakupPrices, setBreakupPrices] = useState({});
  const [imgPopState, setImgPopState] = useState(false);

  const MessagePrint = () => {
    var message = "*A non-refundable";
    let check = 0;
    for (let i = 0; i < tickets.length; ++i) {
      if (tickets[i].undiscountedPrice !== 100) {
        message +=
          " " +
          tickets[i].undiscountedPrice +
          "% advance on " +
          tickets[i].ticketName +
          ",";
        check = 1;
      }
    }
    message = message.substring(0, message.length - 1);
    message += " is payable now, rest payable at the venue.";
    if (check)
      return <p className='mt-0 mb-0 italic col-span-full'>{message}</p>;
    else return "";
  };

  const boxGrid = `grid grid-cols-1 xl:grid-cols-2 justify-center  doubleXl:grid-cols-2 gap-x-4 gap-y-[2rem] lg:p-4`;

  const intialiseQuantity = () => {
    tickets.map((tick) => {
      return setQuantity((prev) => [...prev, { id: tick?._id, quantity: 0 }]);
    });
  };

  const addToArray = (ticket) => {
    const selectedTicket = { ...ticket };
    selectedTicket.quantity = 1;
    const tax_prices = calculateTicketPrice(
      selectedTicket,
      selectedTicket.basePrice,
      // selectedTicket?.undiscountedPrice !== 0
      //   ? (selectedTicket.basePrice * selectedTicket?.undiscountedPrice) / 100
      //   : selectedTicket.basePrice,
      fees,
      promoCodeInfo
    );
    selectedTicket["tax_prices"] = tax_prices;
    setSelectedTickets((prevTickets) => [...prevTickets, selectedTicket]);
  };
  const popFromArray = (ticketId) => {
    setSelectedTickets((prevTickets) =>
      prevTickets.filter((item) => item._id != ticketId)
    );
  };
  const changeQty = (ticketId, val, type) => {
    const index = selectedTickets.findIndex((it) => it._id == ticketId);
    const arr = [...selectedTickets];
    if (index > -1) {
      setTicketsID({
        ...ticketsID,
        [ticketId.toString()]: val,
      });
      if (type === "change") arr[index].quantity = val;

      const tax_prices = calculateTicketPrice(
        arr[index],
        arr[index]?.basePrice,
        // arr[index]?.undiscountedPrice !== 0
        //   ? (arr[index].basePrice * arr[index]?.undiscountedPrice) / 100
        //   : arr[index].basePrice,
        fees,
        promoCodeInfo
      );
      arr[index]["tax_prices"] = tax_prices;
    }

    setSelectedTickets(arr);
  };

  const handleQty = (newValue, type, id) => {
    if (parseInt(newValue) < 0) {
      return;
    } else
      setQuantity((prevQuantity) => {
        const index = selectedTickets.findIndex((it) => it._id == id);
        // const arr = [...selectedTickets];
        if (index > -1) {
          changeQty(id, parseInt(newValue), type);
        } else {
          const addTicket = tickets.find((obj) => obj._id === id);
          addToArray(addTicket);
        }

        const updatedQuantity = prevQuantity.map((qty) => {
          if (qty.id === id) {
            return {
              ...qty,
              quantity: parseInt(newValue),
            };
          }
          return qty;
        });
        return updatedQuantity;
      });
  };
  const updateSelectedTickets = () => {
    const updatedTickets = [...selectedTickets];
    const updatedTicketPrices = updatedTickets.map((ticket) =>
      calculateTicketPrice(
        ticket,
        ticket?.basePrice,
        // ticket?.undiscountedPrice !== 0
        //   ? (ticket.basePrice * ticket?.undiscountedPrice) / 100
        //   : ticket.basePrice,
        fees,
        promoCodeInfo
      )
    );
    updatedTickets.forEach((ticket, index) => {
      ticket.tax_prices = updatedTicketPrices[index];
    });

    setSelectedTickets(updatedTickets);
    setBreakupPrices(sumProperty(updatedTickets));
  };

  useEffect(() => {
    setBreakupPrices(sumProperty(selectedTickets));
  }, [quantity, promoCodeInfo]);
  useEffect(() => {
    updateSelectedTickets();
  }, [promoCodeInfo]);
  useEffect(() => {
    intialiseQuantity();
  }, []);
  useEffect(() => {
    let x = 0;

    quantity.map((y) => {
      x += y?.quantity;
      setTotalTickets(x);
    });
  }, [selectedTickets]);

  return (
    <div>
      {imgPopState && (
        <ImgPop
          imgPopState={imgPopState}
          setImgPopState={setImgPopState}
          layoutImg={eventLayoutImage}
        />
      )}
      {tickets?.length > 0 ? (
        <div>
          {
            <div>
{             eventLayoutImage &&
              <CollapseBar
                heading={"Venue Layout"}
                children={
                  
                  <div className='flex justify-center items-center'>
                    <img
                      className='h-[300px]'
                      src={eventLayoutImage}
                      alt='Blurr-8-Table-Layout'
                      border='0'
                      onClick={() => setImgPopState(true)}
                    />
                  </div>
                }
              />}
            </div>
          }

          <CollapseBar
            heading={"Ticket Info"}
            children={
              <div className={boxGrid}>
                {tickets?.map((ticket, index) => {
                  return (
                    <TicketItemV2
                      key={ticket.id}
                      ticket={ticket}
                      handleQty={handleQty}
                      quantity={quantity.filter(
                        (qty) => qty?.id == ticket?._id
                      )}
                      gradient={
                        ticket?.hasOwnProperty("color")
                          ? ticket?.color
                          : "black"
                      }
                      ticketsID={ticketsID}
                      setTicketsID={setTicketsID}
                    />
                  );
                })}
                {/* *For Table bookings a Non-Refundable 15% advance is payable now, balance amount is payable at the Venue */}
                <p className='mt-0 mb-0 italic col-span-full'>
                  *Total includes all local taxes and fees
                </p>
                <MessagePrint />
              </div>
            }
          />
          <CollapseBar
            heading={"Promo code"}
            children={<div className='w-full col-span-full'>{promoCode}</div>}
          />
          <CollapseBar
            heading={"Taxes and Fees"}
            children={
              <BreakupPrices
                breakupPrices={breakupPrices}
                currency={tickets[0]?.currency ? tickets[0].currency : "INR"}
                totalTickets={totalTickets}
              />
            }
          />
          <div className='p-4'>
            <Payments
              selectedTickets={selectedTickets}
              setShowFullLoading={setShowFullLoading}
              showFullLoading={showFullLoading}
              setPayMessage={setPayMessage}
              setRenderComponent={setRenderComponent}
              setMessageModal={setMessageModal}
              setMessageModalDesc={setMessageModalDesc}
              isLogin={isLogin}
              userPhoneNumber={userPhoneNumber}
              setSignIn={setSignIn}
              currency={tickets[0]?.currency ? tickets[0].currency : "INR"}
              fees={fees}
              quantity={quantity}
              event={event}
              promoCodeInfo={promoCodeInfo}
              getValues={getValues}
              breakupPrices={breakupPrices}
              ip={ip}
              eventId={eventId}
            />
          </div>
        </div>
      ) : (
        <h2 className='text-center w-full text-lg text-white'>
          There no tickets for sale now...
        </h2>
      )}
    </div>
  );
};

const TicketItemV2 = ({
  handleQty,
  quantity,
  gradient,
  ticket,
  ticketsID,
  setTicketsID,
}) => {
  const ref = useRef(null);

  const incrementTicekt = (id) => {
    const inputField = ref.current;
    const inputFieldValue = parseInt(inputField.value);

    if (inputFieldValue + 1 > ticket.ticketQuantity - ticket.sold) {
      toast.error(inputFieldValue + 1 + " seats are not available");
    } else {
      setTicketsID({
        ...ticketsID,
        [id.toString()]: Number(ticketsID[id]) + 1,
      });
      inputField.value = inputFieldValue + 1;
      handleQty(inputField.value, "change", id);
    }
  };

  const decrementTicekt = (id) => {
    const inputField = ref.current;
    const inputFieldValue = parseInt(inputField.value);

    if (inputFieldValue > 0) {
      setTicketsID({
        ...ticketsID,
        [id.toString()]: Number(ticketsID[id]) - 1,
      });
      inputField.value = inputFieldValue - 1;
      handleQty(inputField.value, "change", id);
    }
  };
  const ticketLeft = () => {
    const leftTickets = ticket.ticketQuantity - ticket.sold;
    if (
      leftTickets <= Math.floor(ticket.ticketQuantity * 0.25) &&
      leftTickets >= 0
    )
      return `Few tickets left!!`;
    else return "";
  };

  return (
    <div
      className={`${gradientColor[gradient]} grid grid-cols-6 h-fit rounded-3xl`}
    >
      <div className='col-span-4 border-dashed border-r-[3px] border-borderMain relative'>
        <img
          src={FlagBg}
          alt='flag-bg'
          className='absolute h-[70px] lg:h-[80px] top-0 left-0'
        />
        {ticket?.flag && (
          <p className='w-[48px] h-[48px] lg:w-[82px] lg:h-[75px] text-[8px] lg:text-[15px] text-center font-black rotate-[315deg] capitalize mb-0 absolute top-[15px] left-[8px] lg:top-[16px] lg:left-[10px]'>
            {ticket?.flag?.toLowerCase()}
          </p>
        )}
        <p className='flex justify-start items-center mb-0 h-[54px] lg:h-[75px] ml-[2.4rem] lg:ml-[3.4rem] mt-[1rem]'>
          <span className='font-bold text-center lg:text-left text-lg lg:text-3xl'>
            {ticket?.ticketName}
          </span>
        </p>
        <div>
          <img className='w-full' src={Dash} alt='dashed line' />
          <div className='ml-[1rem] lg:ml-[2rem]'>
            <CollapseInfoBar
              heading={"Ticket Details"}
              list={ticket?.ticketInfo}
              optionalText={
                Number(ticket?.undiscountedPrice) !== 0
                  ? Number(ticket?.undiscountedPrice) == 100
                    ? `${ticket?.undiscountedPrice}% Advance payable now.`
                    : `${ticket?.undiscountedPrice}% Advance payable now. Balance payable at the venue.`
                  : ""
              }
            />
          </div>
        </div>
      </div>
      {/* <div className="verticalBorder"></div> */}

      {/* Sold out Feature added */}
      {ticket.ticketQuantity - ticket.sold && !ticket.sold_out ? (
        <>
          <div className='col-span-2 flex flex-col justify-between items-center'>
            <div className='relative mt-1 font-black text-[1.45rem] lg:text-[2.1rem] flex justify-center items-center flex-col w-full'>
              <p className='text-white mb-1 '>
                {ticket?.currency && ticket?.currency !== "AED"
                  ? getSymbolFromCurrency(ticket?.currency)
                  : ticket?.currency
                  ? ticket?.currency
                  : "₹"}{" "}
                <span>{commaNumber(Math.round(ticket?.price.toFixed(2)))}</span>
              </p>
            </div>
            <div className='mb-3 flex flex-row items-center justify-center'>
              <button
                className=' p-1 bg-zinc-800 m-2 text-white w-6 rounded-md text-xl'
                onClick={() => {
                  decrementTicekt(ticket?._id);
                }}
              >
                -
              </button>
              <input
                type='number'
                id='ticket-quantity'
                pattern='[0-9]*'
                ref={ref}
                autoFocus=''
                value={quantity[0]?.quantity}
                className='peer block min-h-[auto] rounded border-2 sm:w-16 md:w-20 w-14 sm:text-lg md:text-2xl text-center border-white bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 appearance-none'
                onChange={(e) => {
                  e.preventDefault();
                  if (e.target.value > ticket.ticketQuantity - ticket.sold) {
                    toast.error(e.target.value + " seats are not available");
                  } else {
                    handleQty(e.target.value, "change", ticket?._id);
                  }
                }}
              />
              <button
                className=' p-1 bg-zinc-800 m-2 text-white w-6 rounded-md text-xl'
                onClick={() => {
                  incrementTicekt(ticket?._id);
                }}
              >
                +
              </button>
            </div>
            <p className=' font-bold'>{ticketLeft()} </p>
          </div>
        </>
      ) : (
        <>
          <div className='col-span-2 flex flex-col justify-between items-center'>
            <div className=' w-full h-full flex justify-center items-center'>
              <img src='/sold_out.png' className='h-[5.5rem]' />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const BreakupPrices = ({ breakupPrices, currency, totalTickets }) => {
  return (
    <div className='ml-10 col-span-full flex items-start flex-col'>
      <div className='w-fit'>
        {/* <p className="font-black mb-2">Full Cost Breakup</p> */}
        <p className='mb-0 grid grid-cols-2 gap-x-2'>
        {/* <span className='text-borderMain'>Base price: </span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["base_price"] ? breakupPrices["base_price"] : 0}
          </span>

          {breakupPrices["totalDiscount"] > 0 &&
            <>
              <span className='text-borderMain'>Discount:</span>{" "}
              <span className='font-black'>
                {currency}{" "}
                {breakupPrices["totalDiscount"] ? breakupPrices["totalDiscount"].toFixed(2) : 0}
              </span>

              <span className='text-borderMain'>Base Price after promo code: </span>{" "}
              <span className='font-black'>
                {currency}{" "}
                {breakupPrices["total_price_after_discount"] ? breakupPrices["total_price_after_discount"].toFixed(2) : 0}
              </span>
            </>
          }


          <span className='text-borderMain'>GST on base Price(18%):</span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["total_gst_on_base"] ? breakupPrices["total_gst_on_base"].toFixed(2) : 0}
          </span>

          <span className='text-borderMain'>BT FEE(5%):</span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["total_bt_fee"] ? breakupPrices["total_bt_fee"]?.toFixed(2) : 0}
          </span>

          <span className='text-borderMain'>GST on BT FEE(18%):</span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["total_gst_bt_fee"] ? breakupPrices["total_gst_bt_fee"]?.toFixed(2) : 0}
          </span> */}

          <span className='text-borderMain'>Num Tickets: </span>{" "}
          <span className='font-black'>{totalTickets}</span>

          <span className='text-borderMain'>Ticket price: </span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["ticket_price"] ? Math.round(breakupPrices["ticket_price"]) : 0}
          </span>
          {/* {Number(breakupPrices["total_gst_on_base"]) > 0 && (
            <span className="text-borderMain">GST: </span>
          )}
          {Number(breakupPrices["total_gst_on_base"]) > 0 && (
            <span className="font-black">
              {currency}{" "}
              {(Number(breakupPrices["total_gst_on_base"])
                ? Number(breakupPrices["total_gst_on_base"])
                : 0
              )?.toFixed(2)}
            </span>
          )} */}
          <span className='text-borderMain'>Convenience Fee: </span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["total_convenience_fee"]
              ? breakupPrices["total_convenience_fee"]?.toFixed(2)
              : 0}
          </span>
          <span className='text-borderMain'>GST: </span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["total_gst_convenience_fee"]
              ? breakupPrices["total_gst_convenience_fee"]?.toFixed(2)
              : 0}
          </span>

          {/* <span className='text-borderMain'>Total Amount to be paid: </span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["totalPrice"]
              ? breakupPrices["totalPrice"]?.toFixed(2)
              : 0}
          </span> */}

          <span className='text-borderMain'>Payable Now </span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["finalPrice"]
              ? breakupPrices["finalPrice"]?.toFixed(2)
              : 0}
          </span>

          {/* <span className='text-borderMain'>Balance Payable on Event(excl. conv fee): </span>{" "}
          <span className='font-black'>
            {currency}{" "}
            {breakupPrices["dueAmount"]
              ? breakupPrices["dueAmount"]?.toFixed(2)
              : 0}
          </span> */}
        </p>
      </div>
    </div>
  );
};

const gradientColor = {
  redDark: "dark-red-linear-gradient",
  red: "red-linear-gradient",
  silver: "gray-linear-gradient",
  gold: "gold-linear-gradient",
  platinum: "platinum-linear-gradient",
  black: "bg-black",
};

export default TicketBox;
