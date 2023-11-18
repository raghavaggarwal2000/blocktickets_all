import React, { useEffect, useState } from "react";
import { EventServices } from "../../services/api-client";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/Typography/PageTitle";
import Loading from "../../components/new/Loading";
import ChartCard from "../../components/Chart/ChartCard";
import ChartLegend from "../../components/Chart/ChartLegend";
import { Doughnut } from "react-chartjs-2";
import { useHistory } from "react-router-dom";
import { Button } from "@windmill/react-ui";

const EventStats = () => {
  const { eventId } = useParams();
  const history = useHistory();
  const [eventDetails, setEventDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [ticketLegengds, setTicketLegengds] = useState([]);

  //   TODO: ADD FUNCTION TO UTILS
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const generateTotalsold = () => {
    let totalSold = 0;
    eventDetails.TicketDetails &&
      eventDetails.TicketDetails.forEach((ticket) => {
        totalSold += ticket.sold;
      });
    return totalSold;
  };

  const generateTotalQuantity = () => {
    let ticketQuantity = 0;
    eventDetails.TicketDetails &&
      eventDetails.TicketDetails.forEach((ticket) => {
        ticketQuantity += ticket.ticketQuantity;
      });
    return ticketQuantity;
  };

  //   const doughnutLegends = [
  //     {title: "Shirts", color: "bg-blue-500"},
  //     {title: "Shoes", color: "bg-teal-600"},
  //     {title: "Bags", color: "bg-purple-600"}
  //   ];

  const ticketQuantityOptions = {
    data: {
      datasets: [
        {
          //   data: [33, 33, 33],
          data:
            eventDetails.TicketDetails &&
            eventDetails.TicketDetails.map((ticket) => ticket.ticketQuantity),
          /**
           * These colors come from Tailwind CSS palette
           * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
           */
          //   backgroundColor: ["#0694a2", "#1c64f2", "#7e3af2"],
          backgroundColor: ticketLegengds.map((legend) => legend.color),
          label: "Dataset 1",
        },
      ],
      //   labels: ["Shoes", "Shirts", "Bags"]
      labels:
        eventDetails.TicketDetails &&
        eventDetails.TicketDetails.map((ticket) => ticket.ticketName),
    },
    options: {
      responsive: true,
      cutoutPercentage: 80,
    },
    legend: {
      display: false,
    },
  };
  const soldTicketsOptions = {
    data: {
      datasets: [
        {
          //   data: [33, 33, 33],
          data:
            eventDetails.TicketDetails &&
            eventDetails.TicketDetails.map((ticket) => ticket.sold),
          /**
           * These colors come from Tailwind CSS palette
           * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
           */
          //   backgroundColor: ["#0694a2", "#1c64f2", "#7e3af2"],
          backgroundColor: ticketLegengds.map((legend) => legend.color),
          label: "Dataset 1",
        },
      ],
      //   labels: ["Shoes", "Shirts", "Bags"]
      labels:
        eventDetails.TicketDetails &&
        eventDetails.TicketDetails.map((ticket) => ticket.ticketName),
    },
    options: {
      responsive: true,
      cutoutPercentage: 80,
    },
    legend: {
      display: false,
    },
  };
  useEffect(() => {
    getEventById();
  }, []);

  const getEventById = async () => {
    let ticketLegends;
    try {
      setIsLoading(true);
      const response = await EventServices.getEventById({
        eventId: eventId,
      });
      setEventDetails(response.data.data);
      ticketLegends = response.data.data.TicketDetails.map((ticket) => {
        return {
          title: ticket.ticketName,
          color: getRandomColor(),
        };
      });
      setTicketLegengds(ticketLegends);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <>
      <div className="flex flex-row justify-between align-middle mx-2">
        <PageTitle>{eventDetails?.Event?.eventTitle} Statistics</PageTitle>
        <div className="flex flex-row items-center justify-center">
          <Button
            className="my-5 mx-2"
            onClick={() => history.push(`/app/event/eventDetails/${eventId}`)}
          >
            Go To Details
          </Button>
        </div>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard
          titleLeft="Sales per ticket"
          titleRight={`Total Sold: ${generateTotalsold()}`}
        >
          <Doughnut {...soldTicketsOptions} />
          <ChartLegend legends={ticketLegengds} />
        </ChartCard>
        <ChartCard
          titleLeft="Quantity per ticket"
          titleRight={`Total Qty Available: ${generateTotalQuantity()}`}
        >
          <Doughnut {...ticketQuantityOptions} />
          <ChartLegend legends={ticketLegengds} />
        </ChartCard>
      </div>
    </>
  );
};

export default EventStats;
