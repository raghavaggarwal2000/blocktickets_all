import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import "./ticket.css";
import { getDate } from "../../utils/date";
import { tConvert } from "../../utils/timeConvert";
import getSymbolFromCurrency from "currency-symbol-map";
import { trimString } from "../../utils/utils";
import DoneIcon from "@mui/icons-material/Done";
import GoTo from "../../images/icons/arrow.svg";
import copySymbol from "../../images/icons/copySymbol.png";
import loadingGif from "../../images/assets/qrBorder.gif";

const Ticket = (props) => {
  const navigate = useNavigate();
  const clocation = useLocation();
  const currDate = new Date();
  const {
    eventId,
    eId,
    price,
    organizer = "Blocktickets",
    location,
    eventImg,
    qrCode,
    ticketDate,
    ticketTime,
    ticketName,
    endDate,
    currency,
    organizerName,
    bookingId,
    nftHash,
    ticketId,
    eventName,
    ticketSponsorImage,
  } = props;
  return (
    <>
      {clocation &&
      (clocation.pathname == "/marketplace" || clocation.pathname == "/") ? (
        <div
          onClick={() => clocation.pathname == "/" && navigate("/marketplace")}
          className="mx-auto cursor-pointer w-[320px] rounded-t-xl screen3:w-[240px] flex overflow-hidden flex-col h-fit relative ticket"
        >
          <div className="ticket-top min-h-fit">
            {currDate < new Date(endDate) ? (
              <div className="rounded-lg text-[#CF1C1C] text-sm font-medium p-2 py-1 absolute top-4 right-4">
                Live
              </div>
            ) : (
              <div className="rounded-lg text-[#CF1C1C] text-sm font-medium p-2 py-1 absolute top-4 right-4">
                Valid
              </div>
            )}
            <div className="w-[320px] h-[320px] screen3:w-[240px] screen3:h-[240px] overflow-hidden">
              <img
                src={eventImg}
                alt="event"
                className="h-full object-contain w-full"
              />
            </div>
            {
              <div className="flex flex-col gap-1">
                <div>
                  <div className="text-[18px] flex text-orange mx-4 mt-4 flex-col border-b-2 pb-2 font-semibold">
                    {ticketName}
                    <span className="font-medium text-xs text-LightColor">
                      <span className="!text-LightColor">by</span>{" "}
                      <span className="font-semibold">
                        {organizerName ? organizerName : organizer}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col  gap-2 mt-2">
                  <div className="text-xs mx-4 flex justify-between text-DarkColor font-medium pb-2 border-b-2">
                    <div className="flex flex-col ">
                      <span className="text-LightColor">Start Date:</span>
                      <span>
                        {new Date(ticketDate)
                          .toDateString()
                          .toString()
                          .slice(0, 4) +
                          ", " +
                          new Date(ticketDate)
                            .toDateString()
                            .toString()
                            .slice(4)}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-LightColor">Start Time:</span>
                      <span>{tConvert(ticketTime)} IST</span>
                    </div>
                  </div>
                  <div className="text-xs px-4 flex justify-between text-DarkColor font-medium pb-2 ">
                    <div className="flex flex-col">
                      <span className="text-LightColor">Location:</span>
                      <span>{location}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-LightColor">Price:</span>
                      <span>
                        {currency && currency !== "AED"
                          ? getSymbolFromCurrency(currency)
                          : currency === "AED"
                          ? currency
                          : "₹ "}{" "}
                        {Math.ceil(price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
          {eventId !== "630e04a64c25268040d19ebe" &&
            qrCode(
              <div className="flex justify-center h-full items-center py-6 ticket-bottom">
                <img
                  src={qrCode}
                  alt="qr-code"
                  className="w-[100px] h-[100px]"
                />
              </div>
            )}
        </div>
      ) : (
        <NewTicket {...props} />
      )}
    </>
  );
};

export default Ticket;

const NewTicket = (props) => {
  const {
    eventId,
    eId,
    price,
    organizer = "Blocktickets",
    location,
    eventImg,
    qrCode,
    ticketDate,
    ticketTime,
    ticketName,
    nftHash,
    eventName,
    ticketId,
    ticketSponsorImage,
    bookingId,
  } = props;
  const clocation = useLocation();
  const navigate = useNavigate();
  return (
    <div
      className={`max-w-[360px] ticket-gradient border-orange border-[4px] rounded-[10px] flex items-center justify-center flex-col`}
    >
      <p className="py-2 whitespace-nowrap overflow-hidden w-full text-center text-[#C3B8B8]   text-[18px] lg:text-[22px] border-b-2 border-dashed border-[#C3B8B8]">
        {eventName}
      </p>

      <div className="w-full max-h-[275px] grid grid-cols-2 relative gap-2 lg:gap-4">
        <img
          className="mt-2 mb-1 overflow-hidden col-span-1 h-full max-h-[160px] px-0 xs:px-2  ml-[14px] md:ml-[25px]"
          src={eventImg}
          alt="eventImage"
        />
        <div className="grid grid-rows-2 h-full text-[12px] ml-2">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-0 font-medium text-white whitespace-nowrap overflow-hidden">
              {getDate(ticketDate)}
            </p>
            <p className="mb-0 font-medium text-white whitespace-nowrap overflow-hidden">
              {tConvert(ticketTime)}
            </p>
            <p className="mb-2 mr-2 xs:mr-0 text-[9px] lg:text-[12px] font-medium text-center text-white  overflow-hidden">
              {location}
            </p>
          </div>
          <div
            onClick={() =>
              navigate(
                true
                  ? `/${eventName.replace(
                      /\s+/g,
                      "_"
                    )}/ticket-detail/${eventId}`
                  : clocation.pathname + clocation.search
              )
            }
            className="hover:cursor-pointer relative max-h-[160px] flex flex-col max-h-[60px] md:max-h-[80px] items-center justify-center w-full"
          >
            <img
              className="absolute z-[11] scale-[0.99] md:scale-[0.95] max-w-[76px] md:max-w-[80px] top-[-8px] md:top-[1px]"
              src={qrCode}
              alt="qrCode"
            />
            <img
              loop="infinite"
              src={loadingGif}
              className="absolute z-[10] max-w:[76px] md:max-w:[80px] xs:top-[-8px]"
              alt="loadingGif"
            />
          </div>
        </div>

        <p className="overflow-hidden text-ltr mt-1 mb-0 max-h-[50px] flex items-center justify-center whitespace-pre-line leading-6 col-span-full text-center font-bold text-white bg-orange xs:!py-0 py-2 xs:text-[16px] text-[20px] border-dashed border-y-2">
          {ticketName}
        </p>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 xs:mt-1 mt-2">
        <div className="col-span-full mx-auto mt-4">
          <p className="mt-2 flex font-medium mb-0 text-white xl:text-base whitespace-nowrap overflow-hidden">
            <span className="text-bold  xs:text-[9px] text-[12px]">
              Blockchain trans ID:{" "}
            </span>
            <span className=" ml-2  xs:text-[9px] text-[12px]">
              {nftHash ? <BlockchainHash nftHash={nftHash} /> : "Processing..."}
            </span>
          </p>
          <p className="font-medium mb-0 text-white text-[12px] xl:text-base whitespace-nowrap overflow-hidden">
            <span className="text-bold  xs:text-[9px] text-[12px] ">
              Blocktickets conf ID:
            </span>{" "}
            <span className=" xs:text-[9px] text-[12px] ">
              {bookingId ? bookingId : ticketId}
            </span>
          </p>
        </div>
        {ticketSponsorImage && (
          <div className="h-[75px] col-span-full border-2 mx-4 overflow-hidden">
            <img
              src={ticketSponsorImage}
              alt="ticketSponsorImage"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <Link
          to={
            true
              ? `/${eventName.replace(/\s+/g, "_")}/ticket-detail/${eventId}`
              : clocation.pathname + clocation.search
          }
          className="forcedMarginZero xs:text-[10px] text-[14px] col-span-full border-dashed border-t-2 text-center text-black font-semibold pt-1 mb-1 hover:underline cursor-pointer underline-offset-2"
        >
          Detailed Terms and Conditions{" "}
        </Link>
      </div>
    </div>
  );
};

const BlockchainHash = ({ nftHash }) => {
  const [copied, setCopied] = useState("");
  function copyToClipboard(text) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      setCopied(true);
      return navigator.clipboard.writeText(text);
    }
  }
  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setCopied(false);
      }, 1000);
  }, [copied]);
  return (
    <div className="flex items-center justify-end">
      <span className=" xs:text-[9px] text-[12px] ">
        {trimString(nftHash, 15)}{" "}
      </span>
      {copied ? (
        <DoneIcon
          fontSize="small"
          className="cursor-pointer hover:opacity-75"
        />
      ) : (
        <img
          className="cursor-pointer hover:opacity-75 xs:h-[12px] h-[15px] xs:ml-1 ml-4 md:ml-2"
          onClick={() => copyToClipboard(nftHash)}
          src={copySymbol}
          alt="copy-icon"
        />
      )}
      <img
        onClick={() => window.open(`https://polygonscan.com/tx/${nftHash}`)}
        className="xs:h-[12px] h-[15px] xs:ml-1 ml-4 md:ml-2 cursor-pointer hover:opacity-75"
        src={GoTo}
        alt="goTo"
      />
    </div>
  );
};
