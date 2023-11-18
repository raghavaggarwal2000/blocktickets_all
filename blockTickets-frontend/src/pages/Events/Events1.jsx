import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Loading from "../../Loading/Loading";
import { getEventData } from "../../api/api-client";
import { tConvert } from "../../utils/timeConvert";

const Events = ({ isLogin, setSignIn }) => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState("");
  const [loading, setLoading] = useState(true);

  const getEvents = async () => {
    setLoading(true);
    const res = await getEventData();
    if (res.status === 200) {
      setAllEvents(res.data?.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.scrollTop = 0;
    getEvents();
  }, []);
  return (
    <div className="bg-[#E5E5E5] mt-[70px] pb-24 pt-8 px-24 screen18:px-12 screen3:px-8 screen7:px-0 screen7:pt-0 screen7:pb-0">
      <div className="w-full bg-white rounded-lg flex flex-col p-8 py-12 justify-center items-center">
        <span className="text-3xl screen7:text-left screen7:w-full font-semibold">
          Events
        </span>
        <div className="grid grid-cols-3 screen3:grid-cols-2 screen12:grid-cols-1 gap-4 mt-8">
          {loading && <Loading />}
          {!loading &&
            allEvents?.eventData.map((item) => (
              <div
                onClick={() =>
                  navigate(`/${item.event.eventTitle}/${item.event._id}`)
                }
              >
                <EventCard
                  key={item.event._id}
                  eventId={item.event._id}
                  eventImg={item.event.eventImageOriginal}
                  eventName={item.event.eventTitle}
                  eventDate={item.event.startDate}
                  eventStartTime={item.event.startTime}
                  eventDetails={item.event.eventDescription}
                  location={item.event.location}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const EventCard = ({
  eventId,
  eventName,
  price,
  eventDate,
  eventStartTime,
  eventDetails,
  eventImg,
  buy,
  organizer = "BlockTickets",
  location,
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/${eventName}/event/${eventId}`)}
      className="w-full max-w-[400px] screen7:w-[280px] screen7:h-[420px] cursor-pointer flex flex-col overflow-hidden relative rounded-lg border-2 border-LightColor"
    >
      <div className="rounded-lg bg-white text-[#CF1C1C] text-sm font-medium p-2 py-1 absolute top-4 right-4">
        Live
      </div>
      <div className="w-full h-[400px] overflow-hidden relative">
        <img
          src={eventImg}
          alt="event"
          className="w-full h-full object-fill object-top"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <div className="flex flex-col">
          <span className="font-medium text-center whitespace-nowrap">
            {eventName}
          </span>
          <span className="font-medium text-sm text-center text-LightBlue">
            <span className="text-LightColor">by</span> {organizer}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm text-DarkColor flex flex-col font-medium w-2/6">
            <span className="text-LightColor">Location:</span>
            {location}
          </span>
          <div className="text-sm text-right flex flex-col text-DarkColor font-medium">
            <span className="text-LightColor">Date:</span>
            <span>{new Date(eventDate).toDateString()}</span>
            <span className="text-LightColor">Time:</span>
            <span>{tConvert(eventStartTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
