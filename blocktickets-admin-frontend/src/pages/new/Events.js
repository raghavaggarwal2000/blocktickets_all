import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Badge,
  Button,
  Label,
  Select,
} from "@windmill/react-ui";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";
import { EventServices } from "../../services/api-client";
import Loading from "../../components/new/Loading";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterTypes, setFilterTypes] = useState("all");

  useEffect(() => {
    getAllEvents();
  }, [filterTypes]);

  const history = useHistory();

  const getAllEvents = async () => {
    try {
      setIsLoading(true);
      const response = await EventServices.getAllEvents({ filterTypes });
      setEvents(response?.data?.data?.eventData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  const ISOToNormal = (iso) => {
    let date = new Date(iso);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return dt + "-" + month + "-" + year;
  };

  const handleViewEvent = (eventId) => {
    history.push(`event/eventDetails/${eventId}`);
  };

  const handleViewStats = (eventId) => {
    history.push(`event/eventStats/${eventId}`);
  };

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <PageTitle className="w-full">All Events</PageTitle>
        <div className="w-[50px]">
          <Select
            className="w-[50px]"
            name="filterTypes"
            id="filterTypes"
            onChange={(e) => setFilterTypes(e.target.value)}
            value={filterTypes}
          >
            <option value="all">All</option>
            <option value="real">Real</option>
            <option value="dummy">Dummy</option>
          </Select>
        </div>
      </div>
      <div className="grid  grid-cols-1 lg:grid-cols-2 gap-4">
        {events.map((event) => {
          return (
            <Card
              // style={{ width: "47%" }}
              className="grid grid-cols-1 lg:grid-cols-2"
              key={event._id}
            >
              <img
                className="object-cover h-full max-h-[200px]"
                src={event.eventImageCompress}
              />
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
                  {event.eventTitle}{" "}
                  <Badge type="primary">
                    {new Date() > new Date(event?.endDate)
                      ? "Past"
                      : "Upcoming"}
                  </Badge>
                </p>
                <p
                  className="text-gray-600 dark:text-gray-400 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: event.eventDescription.substring(0, 80),
                  }}
                ></p>
                <p className="text-gray-400 dark:text-gray-400 mt-1 text-xs font-semibold">
                  <span className="text-orange-800">{event.location}</span>
                  {", "}
                  {ISOToNormal(event.startDate)}, {event.startTime}
                </p>
                <div className="mt-3 flex justify-between w-full">
                  <Button
                    className="m-2"
                    size="small"
                    onClick={() => handleViewEvent(event._id)}
                  >
                    View Event
                  </Button>
                  <Button
                    className="m-2"
                    size="small"
                    layout="outline"
                    onClick={() => handleViewStats(event._id)}
                  >
                    View Stats
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Events;
