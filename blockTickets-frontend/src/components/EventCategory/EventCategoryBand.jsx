import React, { useState, useEffect } from "react";
import "./EventCategory.css";
import Loading from "../../Loading/Loading.js";
import EventCard from "../EventCard/EventCard1";
import Carousel from "react-elastic-carousel";
import { breakPoints } from "../Carousel/eventsCarouselSetting";
import { Container } from "react-bootstrap";

const EventCategoryBand = ({
    allEvents,
    loading,
    category,
    screenWidth,
    eventName,
}) => {
    var currDate = new Date();
    const [showMore, setShowMore] = useState(false);
    const [dataLength, setDataLength] = useState("");
    // //console.log(screenWidth);
    useEffect(() => {
        // console.log(allEvents);
        if (allEvents && allEvents.data && allEvents.data.eventData) {
            let x = 0;
            for (let i = 0; i < allEvents.data.eventData.length; i++) {
                if (
                    allEvents.data.eventData[i].event &&
                    new Date().toISOString() <
                        allEvents.data.eventData[i].event.endDate
                ) {
                    x = x + 1;
                }
            }
            setDataLength(x);
        }
    }, [allEvents]);
    return (
        <>
            {loading == true ? (
                <Loading />
            ) : (
                <div>
                    <div>
                        <div className="featured-events mt-4 text-center">
                            <h2>
                                {category === "Events" ? "Music" : category}{" "}
                            </h2>
                        </div>
                    </div>
                    <Container className="section-relative">
                        {screenWidth > 580 ? (
                            true ? (
                                <Carousel breakPoints={breakPoints}>
                                    {allEvents &&
                                        allEvents.data &&
                                        allEvents.data.eventData
                                            .map((item) => {
                                                return !(
                                                    item.event &&
                                                    currDate >
                                                        item.event.endDate
                                                )
                                                    ? item.event &&
                                                          item.event
                                                              .eventType ===
                                                              eventName && (
                                                              <div className="mx-2">
                                                                  <EventCard
                                                                      key={
                                                                          item._id
                                                                      }
                                                                      eventId={
                                                                          item
                                                                              .event
                                                                              ._id
                                                                      }
                                                                      img={
                                                                          item
                                                                              .event
                                                                              .eventImageOriginal
                                                                      }
                                                                      eventTitle={
                                                                          item
                                                                              .event
                                                                              .eventTitle
                                                                      }
                                                                      location={
                                                                          item
                                                                              .event
                                                                              .location
                                                                      }
                                                                      eventDate={
                                                                          item
                                                                              .event
                                                                              .startDate
                                                                      }
                                                                      endDate={
                                                                          item
                                                                              .event
                                                                              .endDate
                                                                      }
                                                                  />
                                                              </div>
                                                          )
                                                    : "";
                                            })
                                            .reverse()}
                                </Carousel>
                            ) : (
                                <div className="eventCategoryLess centerMe">
                                    {allEvents &&
                                        allEvents.data &&
                                        allEvents.data.eventData
                                            .map((item) => {
                                                return !(
                                                    item.event &&
                                                    currDate >
                                                        item.event.endDate
                                                )
                                                    ? item.event &&
                                                          item.event
                                                              .eventType ===
                                                              eventName && (
                                                              <EventCard
                                                                  key={item._id}
                                                                  eventId={
                                                                      item.event
                                                                          ._id
                                                                  }
                                                                  eventStatus={
                                                                      item.event
                                                                          .eventStatus
                                                                  }
                                                                  eventImage={
                                                                      item.event
                                                                          .eventImageOriginal
                                                                  }
                                                                  eventTitle={
                                                                      item.event
                                                                          .eventTitle
                                                                  }
                                                                  eventType={
                                                                      item.event
                                                                          .eventType
                                                                  }
                                                                  minPrice={Math.min(
                                                                      ...item.ticketType.map(
                                                                          (
                                                                              item
                                                                          ) =>
                                                                              item.price
                                                                      )
                                                                  )}
                                                                  maxPrice={Math.max(
                                                                      ...item.ticketType.map(
                                                                          (
                                                                              item
                                                                          ) =>
                                                                              item.price
                                                                      )
                                                                  )}
                                                                  startDate={item.event.startDate.slice(
                                                                      0,
                                                                      10
                                                                  )}
                                                                  startTime={
                                                                      item.event
                                                                          .startTime
                                                                  }
                                                                  endDate={
                                                                      item.event
                                                                          .endDate
                                                                  }
                                                              />
                                                          )
                                                    : "";
                                            })
                                            .reverse()}
                                </div>
                            )
                        ) : (
                            <div className="events-mobile-vw">
                                {allEvents &&
                                    allEvents.data &&
                                    allEvents.data.eventData
                                        .slice(-2)
                                        .map((item) => {
                                            return item.event &&
                                                !(
                                                    currDate >
                                                    item.event.endDate
                                                ) &&
                                                item.event.eventType ===
                                                    eventName ? (
                                                <EventCard
                                                    key={item._id}
                                                    eventId={item.event._id}
                                                    eventName={
                                                        item.event.eventTitle
                                                    }
                                                    eventDetails={
                                                        item.event
                                                            .eventDescription
                                                    }
                                                    img={
                                                        item.event
                                                            .eventImageOriginal
                                                    }
                                                    uri={item.event._id}
                                                    eventDate={
                                                        item.event.startDate
                                                    }
                                                    eventTime={
                                                        item.event.startTime
                                                    }
                                                    location={
                                                        item.event.location
                                                    }
                                                    endDate={item.event.endDate}
                                                />
                                            ) : (
                                                ""
                                            );
                                        })
                                        .reverse()}

                                {/* 3-rest */}
                                {showMore &&
                                    allEvents &&
                                    allEvents.data &&
                                    allEvents.data.eventData
                                        .slice(
                                            0,
                                            allEvents.data.eventData.length - 2
                                        )
                                        .map((item) => {
                                            return item.event &&
                                                !(
                                                    currDate >
                                                    item.event.endDate
                                                ) ? (
                                                <EventCard
                                                    key={item._id}
                                                    eventId={item.event._id}
                                                    eventName={
                                                        item.event.eventTitle
                                                    }
                                                    eventDetails={
                                                        item.event
                                                            .eventDescription
                                                    }
                                                    img={
                                                        item.event
                                                            .eventImageOriginal
                                                    }
                                                    uri={item.event._id}
                                                    eventDate={
                                                        item.event.startDate
                                                    }
                                                    eventTime={
                                                        item.event.startTime
                                                    }
                                                    location={
                                                        item.event.location
                                                    }
                                                    endDate={item.event.endDate}
                                                />
                                            ) : (
                                                ""
                                            );
                                        })
                                        .reverse()}

                                {/* Show More */}
                                {!showMore && (
                                    <p
                                        className="show-more"
                                        onClick={() => setShowMore(true)}
                                    >
                                        Show More{" "}
                                        <i className="fa-solid fa-angles-down"></i>
                                    </p>
                                )}
                                {/* Show Less */}
                                {showMore && (
                                    <p
                                        className="show-more"
                                        onClick={() => setShowMore(false)}
                                    >
                                        Show Less{" "}
                                        <i className="fa-solid fa-angles-up"></i>
                                    </p>
                                )}
                            </div>
                        )}
                    </Container>
                </div>
            )}
        </>
    );
};

export default EventCategoryBand;
