import React, { useState, useEffect } from "react";
import CTA from "../components/CTA";
import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
import response from "../utils/demo/tableData";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Label,
  Select,
} from "@windmill/react-ui";
import { EventServices } from "../services/api-client";
import Loading from "../components/new/Loading";
import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";
import { TicketServices } from "../services/api-client";
import toast from "react-hot-toast";

function Dashboard() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [colors, setColors] = useState([]);
  const [userType, setUserType] = useState("realUsers");
  const [filter, setFilter] = useState("allTime");
  const [eventType, setEventType] = useState("eventsByRevenue");

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const barOptions = {
    data: {
      labels:
        ticketTypes && ticketTypes?.events?.length > 0
          ? ticketTypes?.events
              .sort((a, b) => {
                const date1 = new Date(a.event.startDate);
                const date2 = new Date(b.event.startDate);
                return date1 - date2;
              })
              .map((event) => event?.event?.eventTitle)
          : [],
      datasets: [
        {
          // label: "Shoes",
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          borderWidth: 1,
          data:
            ticketTypes?.events?.length > 0
              ? ticketTypes?.events
                  .sort((a, b) => {
                    const date1 = new Date(a.event.startDate);
                    const date2 = new Date(b.event.startDate);
                    return date1 - date2;
                  })
                  .map((event) => {
                    const total = getTotalTicketsSoldByEvent(
                      ticketTypes,
                      event.event._id
                    );
                    return total;
                  })
              : [],
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  };
  const barOptionsCheckedIn = {
    data: {
      labels:
        ticketTypes && ticketTypes?.events?.length > 0
          ? ticketTypes?.events
              .sort((a, b) => {
                const date1 = new Date(a.event.startDate);
                const date2 = new Date(b.event.startDate);
                return date1 - date2;
              })
              .map((event) => event?.event?.eventTitle)
          : [],
      datasets: [
        {
          // label: "Shoes",
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          borderWidth: 1,
          data:
            ticketTypes?.events?.length > 0
              ? ticketTypes?.events
                  .sort((a, b) => {
                    const date1 = new Date(a.event.startDate);
                    const date2 = new Date(b.event.startDate);
                    return date1 - date2;
                  })
                  .map((event) => {
                    const checkedIn = getTotalTicketCheckedIn(
                      ticketTypes,
                      event.event._id
                    );
                    console.log(checkedIn);

                    return checkedIn;
                  })
              : [],
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  };

  const barLegends =
    events.length > 0
      ? events.map((event, index) => {
          return {
            title: event.eventTitle,
            color: colors.length > 0 && colors[index],
          };
        })
      : [];

  const barOptionsRevenue = {
    data: {
      labels:
        ticketTypes && ticketTypes?.events?.length > 0
          ? ticketTypes?.events
              .sort((a, b) => {
                const date1 = new Date(a.event.startDate);
                const date2 = new Date(b.event.startDate);
                return date1 - date2;
              })
              .map((event) => event?.event?.eventTitle)
          : [],
      datasets: [
        {
          // label: "Shoes",
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          borderWidth: 1,
          data:
            ticketTypes?.events?.length > 0
              ? ticketTypes?.events
                  .sort((a, b) => {
                    const date1 = new Date(a.event.startDate);
                    const date2 = new Date(b.event.startDate);
                    return date1 - date2;
                  })
                  .map((event) => {
                    const total = getRevenueByEvent(
                      ticketTypes,
                      event.event._id
                    );
                    return total;
                  })
              : [],
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  };
  const barOptionsPreviousRevenue = {
    data: {
      labels:
        ticketTypes && ticketTypes?.events?.length > 0
          ? ticketTypes?.events
              .sort((a, b) => {
                const date1 = new Date(a.event.startDate);
                const date2 = new Date(b.event.startDate);
                return date1 - date2;
              })
              .map((event) => event?.event?.eventTitle)
          : [],
      datasets: [
        {
          // label: "Shoes",
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          borderWidth: 1,
          data:
            ticketTypes?.events?.length > 0
              ? ticketTypes?.events
                  .sort((a, b) => {
                    const date1 = new Date(a.event.startDate);
                    const date2 = new Date(b.event.startDate);
                    return date1 - date2;
                  })
                  .map((event) => {
                    const total = getPreviousRevenueByEvent(
                      ticketTypes,
                      event.event._id
                    );
                    return total;
                  })
              : [],
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  };
  
  const barLegendsOptions =
    events.length > 0
      ? events.map((event, index) => {
          return {
            title: event.eventTitle,
            color: colors.length > 0 && colors[index],
          };
        })
      : [];

  function generateColorsArray() {
    for (let i = 0; i <= totalEvents; i++) {
      setColors([...colors, getRandomColor()]);
    }
  }

  useEffect(() => {
    generateColorsArray();
  }, [totalEvents]);

  const getTotalTicketsSold = (ticketsArray) => {
    console.log("ticket", ticketsArray);

    return ticketsArray?.totalCount;
  };

  // fucntions for charts

  function getTotalTicketsSoldByEvent(event, eventId) {
    const ev = event?.events.filter((eve) => eve?.event?._id === eventId);
    return ev[0]?.count;
  }
  function getTotalTicketCheckedIn(event, eventId) {
    const ev = event?.events.filter((eve) => eve?.event?._id === eventId);
    return ev[0]?.ticketCheckedIn;
  }
  function getRevenueByEvent(event, eventId) {
    const ev = event?.events.filter((eve) => eve?.event?._id === eventId);
    return ev[0]?.overallTotalAmount;
  }
  function getPreviousRevenueByEvent(event, eventId) {
    const ev = event?.events.filter((eve) => eve?.event?._id === eventId);
    return ev[0]?.previousTotalAmount;
  }

  const getTotalAmount = (ticketsArray) => {
    return ticketsArray?.overallTotalAmount;
  };

  // ticket data
  const getAllTicketsByOrganizer = async () => {
    try {
      setIsLoading(true);
      const response = await TicketServices.getAllTicketsByOrganizer(
        userType,
        filter,
        eventType
      );
      console.log(response);
      setTicketTypes(response?.data?.data?.info);
      setTotalEvents(response?.data?.data?.info?.events?.length);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.error || error?.message);
    }
  };

  useEffect(() => {
    getAllTicketsByOrganizer();
  }, [userType, eventType, filter]);
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <!-- Cards --> */}
      <div className='grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3'>
        <InfoCard title='Total Events' value={totalEvents ? totalEvents : 0}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass='text-orange-500 dark:text-orange-100'
            bgColorClass='bg-orange-100 dark:bg-orange-500'
            className='mr-4'
          />
        </InfoCard>

        <InfoCard
          title='Total Amount'
          value={`₹ ${
            getTotalAmount(ticketTypes) ? getTotalAmount(ticketTypes) : 0
          }`}
        >
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass='text-green-500 dark:text-green-100'
            bgColorClass='bg-green-100 dark:bg-green-500'
            className='mr-4'
          />
        </InfoCard>
        <InfoCard
          title='Total Tickets Sold'
          value={`${
            getTotalTicketsSold(ticketTypes)
              ? getTotalTicketsSold(ticketTypes)
              : 0
          }`}
        >
          <RoundIcon
            icon={CartIcon}
            iconColorClass='text-blue-500 dark:text-blue-100'
            bgColorClass='bg-blue-100 dark:bg-blue-500'
            className='mr-4'
          />
        </InfoCard>

        <div className=' w-fullflex flex-row min-w-0 rounded-lg shadow-xs bg-white dark:bg-gray-800'>
          <div className='p-4 flex items-center w-full'>
            <Label className='w-full'>
              <span>User Type</span>
              <Select
                className='mt-1 w-full'
                name='userType'
                id='userType'
                onChange={(e) => setUserType(e.target.value)}
                value={userType}
              >
                <option value='realUsers'>Real Users</option>
                <option value='allUsers'>All Users</option>
              </Select>
            </Label>
          </div>
        </div>
        <div className='w-full flex flex-row min-w-0 rounded-lg shadow-xs bg-white dark:bg-gray-800'>
          <div className='w-full p-4 flex items-center'>
            <Label className='w-full'>
              <span>Time Period</span>
              <Select
                className='mt-1 w-full'
                name='filter'
                id='filter'
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
              >
                <option value='allTime'>All time</option>
                <option value='upcoming'>Upcoming</option>
                <option value='thisMonth'>This month</option>
                <option value='thirtyDays'>30 days</option>
                <option value='ninetyDays'>90 days</option>
              </Select>
            </Label>
          </div>
        </div>
        <div className='w-full flex flex-row min-w-0 rounded-lg shadow-xs bg-white dark:bg-gray-800'>
          <div className='p-4 flex items-center w-full'>
            <Label className='w-full'>
              <span>Event types</span>
              <Select
                className='mt-1 w-full'
                name='eventType'
                id='eventType'
                onChange={(e) => setEventType(e.target.value)}
                value={eventType}
              >
                <option value='allEvents'>All Events</option>
                <option value='eventsByRevenue'>
                  Only events with revenue
                </option>
              </Select>
            </Label>
          </div>
        </div>
      </div>

      <PageTitle>Tickets Checked In</PageTitle>
      <ChartCard title='Bars'>
        <Bar {...barOptionsCheckedIn} />
        <ChartLegend legends={barLegends} />
      </ChartCard>

      <PageTitle>Tickets Sold Per Event</PageTitle>
      <ChartCard title='Bars'>
        <Bar {...barOptions} />
        <ChartLegend legends={barLegends} />
      </ChartCard>

      <PageTitle>Revenue Per Event</PageTitle>
      <ChartCard title='Bars'>
        <Bar {...barOptionsRevenue} />
        <ChartLegend legends={barLegendsOptions} />
      </ChartCard>

      <PageTitle>Past Revenue Per Event</PageTitle>
      <ChartCard title='Bars'>
        <Bar {...barOptionsPreviousRevenue} />
        <ChartLegend legends={barLegendsOptions} />
      </ChartCard>
    </>
  );
}

export default Dashboard;
