import React from "react";
import { Link } from "react-router-dom";
import "./event-card.css";
import fifaEvent from "../../images/fifa_event.svg";
import yugHoliBanner from "../../images/ticketImage.png";

const EventCard = (props) => {
  // console.log(props.eventStatus);
  return props.eventId ? (
    <Link
      to={
        props.eventStatus === "UPCOMING"
          ? `/${props.eventTitle}/${props.eventId}`
          : "/"
      }
      key={props.eventId}
    >
      <div
        className="event-poster"
        style={{ backgroundImage: `url(${yugHoliBanner})` }}
      >
        <div fluid="true">
          <div>
            <div className="event-poster-top-left">
              <p>{props.eventType}</p>
            </div>
            <div className="event-poster-top-right">
              <p>
                {props.location && props.location.length > 0
                  ? props.location
                  : "Metaverse"}
              </p>
            </div>
          </div>
          <div>
            <div className="event-poster-bottom">
              <div>
                <h3 style={{ textAlign: "center" }}>{props.eventTitle}</h3>
                <p>
                  {props.startDate} {props.startTime}
                </p>
                {props.eventStatus === "UPCOMING" && (
                  <h4 className="eventPrice">From ₹ {props.minPrice}</h4>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  ) : (
    <div
      className="event-poster"
      style={{ backgroundImage: `url(${fifaEvent})` }}
    >
      <div fluid="true">
        <div>
          <div className="event-poster-top-left">
            <p>Entertainment</p>
          </div>
          <div className="event-poster-top-right">
            <p>Party</p>
          </div>
        </div>
        <div>
          <div className="event-poster-bottom">
            <div>
              <h3>Title</h3>
              <p>18Dev 9281:</p>
            </div>
            {/* <p>$ 1.0 - 5.0</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
