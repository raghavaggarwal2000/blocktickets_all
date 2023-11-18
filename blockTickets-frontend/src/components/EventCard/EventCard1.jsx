import { useNavigate } from "react-router";
import { tConvert } from "../../utils/timeConvert";
import { useState } from "react";
import { trimString } from "../../utils/utils";
import { getDate } from "../../utils/date";

const EventCard = ({
  eventName,
  organizer = "Blocktickets",
  location,
  eventDate,
  img,
  eventId,
  eventTime = "00:00",
  endDate,
}) => {
  const navigate = useNavigate();
  const [end, setEnd] = useState(new Date(endDate).getTime());
  const [currDate, setCurrDate] = useState(new Date().getTime());
  return (
    <div
      onClick={() => navigate(`/${eventName}/${eventId}`)}
      className="w-full h-fit cursor-pointer flex flex-col overflow-hidden relative rounded-lg border-2 border-LightColor"
    >
      {end > currDate ? (
        <div className="blur-lg rounded-lg bg-[#00000033] z-10 text-[#fff] border-2 border-white text-sm px-2 py-1 font-semibold absolute top-4 right-4">
          Live
        </div>
      ) : (
        <div className="blur-lg rounded-lg bg-[#00000033] z-10 text-[#fff] border-2 border-white text-sm px-2 py-1 font-semibold absolute top-4 right-4">
          Ended
        </div>
      )}

      <div className="w-full h-[400px] overflow-hidden relative">
        <img
          src={img}
          alt="event"
          className="h-full object-fill object-center w-full"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <div className="flex flex-col">
          <span className="font-medium text-center whitespace-nowrap overflow-hidden">
            {eventName}
          </span>
          <span className="font-medium text-sm text-center text-LightBlue">
            <span className="text-LightColor">by</span> {organizer}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm text-DarkColor flex flex-col font-medium w-1/2">
            <span className="text-LightColor">Location:</span>
            {location}
          </span>
          <div className="text-sm text-right flex flex-col w-1/2 text-DarkColor font-medium">
            <span className="text-LightColor">Date:</span>
            <span>{new Date(eventDate).toDateString()}</span>
            <span className="text-LightColor">Time:</span>
            {eventId == "62d6c455bdb6962417f832d8" ? (
              <span>6:30 PM GST</span>
            ) : (
              <span>{tConvert(eventTime)} IST</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HorizontalEventCard = ({
  eventName,
  eventType,
  location,
  image,
  eventDetails,
  eventId,
  startDate,
  endDate,
  startTime,
  endTime,
}) => {
  const navigate = useNavigate();
  const [end, setEnd] = useState(new Date(endDate).getTime());
  const [currDate, setCurrDate] = useState(new Date().getTime());

  return (
    <div
      onClick={() => navigate(`/${eventName.replace(/\s+/g, "_")}/${eventId}`)}
      className="mb-[5px] lg:mb-0 w-full h-fit cursor-pointer max-w-sm flex flex-col overflow-hidden relative rounded-t-3xl border-2 border-LightColor"
    >
      {end > currDate ? (
        <div className="rounded-lg bg-[#00000033] z-10 text-[#fff] border-2 border-white text-sm px-2 py-1 font-semibold absolute top-4 right-4">
          <span className="relative blur-lg w-full h-full"></span>
          Live
        </div>
      ) : (
        <div className="rounded-lg bg-[#00000033] z-10 text-[#fff] border-2 border-white text-sm px-2 py-1 font-semibold absolute top-4 right-4">
          Ended
        </div>
      )}
      <div className="">
        <div className="rounded-lg shadow-lg  w-full">
          <img
            className="rounded-t-3xl max-h-[340px] w-full"
            src={image}
            alt={eventId}
          />
          <div className="grid grid-cols-3 pl-3 pt-2 pb-0 border-t-2 mb-1">
            <div className="col-span-full mr-3">
              <h5 className="text-[#FA6400] text-[18px] md:text-[20px] text-center !mb-1 whitespace-nowrap overflow-hidden">
                {eventName}
              </h5>
            </div>
            <div className="col-span-2 flex items-between flex-col  border-LightColor">
              <p className="text-white text-xs mb-0">{eventType}</p>
              <p className="mb-0 text-white text-xs whitespace-nowrap overflow-hidden one-line mr-2">
                {location}
              </p>
            </div>
            <div className="flex items-end justify-between mr-2 flex-col ">
              <p className="mb-0 text-white text-xs">{getDate(startDate)}</p>
              <p className="mb-0 text-white text-xs one-line">
                {tConvert(startTime)}-{tConvert(endTime)}
              </p>
              <button className="uppercase text-md text-white rounded-[4px] bg-orange px-4 ">
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
