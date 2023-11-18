import React, { useState, useEffect } from "react";
import "./event-category.css";
import { useParams } from "react-router-dom";
import { getEventData } from "../../api/api-client";
import EventCategoryBand from "../../components/EventCategory/EventCategoryBand";
import Movies from "../../images/Movies.jpg";
import Sports from "../../images/sports.jpg";
import Conference from "../../images/conf.jpeg";
import Events from "../../images/Tomorrowland.jpg";
import Plays from "../../images/plays.jpg";
import Metaverse from "../../images/metaverse.jpg";
import { Container } from "react-bootstrap";

const EventCategory = ({ screenWidth }) => {
  let { eventName } = useParams();
  const [allEvents, setAllEvents] = useState("");
  const [loading, setLoading] = useState(true);

  const getEvents = async () => {
    setLoading(true);
    const res = await getEventData();
    if (res.status === 200) {
      setAllEvents(res.data);
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    document.body.scrollTop = 0;
    getEvents();
  }, []);

  let svg;
  switch (eventName) {
    case "Movies":
      svg = Movies;
      break;
    case "Sports":
      svg = Sports;
      break;
    case "Conference":
      svg = Conference;
      break;
    case "Events":
      svg = Events;
      break;
    case "Plays":
      svg = Plays;
      break;
    default:
      svg = Metaverse;
      break;
  }
  return (
    <>
      <div className="event-category-page">
        <Container>
          <div className="event-category-top relative">
            <img
              src={svg}
              alt="event"
              className="w-full h-full object-cover object-center"
            />
            <h2 className=" text-center absolute top-8 left-8 text-white font-semibold">
              {eventName === "Events" ? "Music" : eventName}
            </h2>
          </div>
        </Container>

        <EventCategoryBand
          allEvents={allEvents}
          loading={loading}
          category={eventName}
          screenWidth={screenWidth}
          eventName={eventName}
        />
      </div>
    </>
  );
};

export default EventCategory;
