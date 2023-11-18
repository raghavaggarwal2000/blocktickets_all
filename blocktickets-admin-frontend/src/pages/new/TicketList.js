import React, { useEffect, useState, useRef } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@windmill/react-ui";
import { SearchIcon } from "../../icons";
import { BsEye, BsXCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { TicketServices } from "../../services/api-client";
import TableComp from "../../components/Table";
import CsvButton from "../../components/new/CSVButton";
import Select from "../../components/new/Select";
import { setAllTickets } from "../../redux/ticketSlice";
import Loading from "../../components/new/Loading";
import toast from "react-hot-toast";
import { EventServices } from "../../services/api-client";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const ticketsState = useSelector((state) => state.tickets);
  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [email, setEmail] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  const setCurrentPage = (page) => {
    setPagination({ ...pagination, page: page });
  };
  // console.log(ticketsState);
  const tableColumns = [
    {
      title: "Sr. No.",
      key: "serialNumber",
    },
    {
      title: "Generated from",
      key: "onTheSpot",
    },
    {
      title: "Event Name",
      key: "eventTitle",
    },
    {
      title: "No. of tickets",
      key: "ticketsNo",
    },

    {
      title: "Email",
      key: "email",
    },

    {
      title: "Details",
      key: "actions",
    },
  ];

  const handleViewClick = (orderId) => {
    history.push(`/app/ticket/${orderId}`);
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent && email?.length == 0) getAllTickets();
  }, [pagination.page]);

  useEffect(() => {
    if (selectedEvent && email?.length == 0) getTicketByEventId();
  }, [selectedEvent, pagination.page]);

  useEffect(() => {
    if (email?.length >= 3) {
      getTicketsByEmailChange();
    }
  }, [email, pagination.page]);

  const getTicketsByEmailChange = async () => {
    // if (email.length >=3) return;
    try {
      setIsLoading(true);
      // const response = await TicketServices.getAllTickets(
      //   pagination.page,
      //   pagination.limit
      // );
      const response = await TicketServices.getTicketsByEmailChange(
        email,
        selectedEvent.id,
        pagination.page,
        pagination.limit
      );
      setPagination({
        ...pagination,
        total: response?.data?.data?.meta?.total,
      });

      setTickets(response?.data?.data?.tickets);
      // console.log("getAllTickets ", response?.data?.data?.tickets);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error?.response?.data ? error.response.data.error : error?.message
      );
    }
  };
  const getTicketByEventId = async () => {
    try {
      setIsLoading(true);
      const response = await TicketServices.getTicketsByEventId(
        selectedEvent.id,
        pagination.page,
        pagination.limit
      );
      setTickets(response?.data?.data?.tickets);
      // console.log("getTicketByEventId ", response?.data?.data?.tickets);
      setPagination({
        ...pagination,
        total: response?.data?.data?.meta?.total,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
      console.log(error);
    }
  };

  const getAllTickets = async () => {
    try {
      setIsLoading(true);
      // const response = await TicketServices.getAllTickets(
      //   pagination.page,
      //   pagination.limit
      // );
      const response = await TicketServices.getTicketsSale(
        pagination.page,
        pagination.limit
      );
      setPagination({
        ...pagination,
        total: response?.data?.data?.meta?.total,
      });

      setTickets(response?.data?.data?.tickets);
      console.log("getAllTickets ", response?.data?.data?.tickets);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error?.response?.data ? error.response.data.error : error?.message
      );
    }
  };

  const getAllEvents = async () => {
    try {
      setIsLoading(true);
      const response = await EventServices.getAllEvents({});
      setEventOptions(response?.data?.data?.eventData);
      // console.log("getAllEvents ", response?.data?.data?.eventData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error?.response?.data ? error.response.data.error : error?.message
      );
      console.log(error);
    }
  };
  const onTheSpotGenerater = (onTheSpot) => {
    return (
      <span className={onTheSpot ? `text-green-400` : `text-red-600`}>
        {onTheSpot ? "On The Spot" : "User Purchase"}
      </span>
    );
  };
  // console.log("tickets", tickets);
  return (
    <>
      <div className='flex flex-row justify-between align-middle mx-2'>
        <PageTitle>Tickets Sale</PageTitle>

        <div className='flex flex-row items-center'>
          <div className='flex relative w-full max-w-xl mr-6 focus-within:text-orange-500'>
            <div className='absolute inset-y-0 flex items-center pl-2'>
              <SearchIcon className='w-4 h-4' aria-hidden='true' />
            </div>
            <Input
              className='pl-8 text-gray-700'
              placeholder='Search tickets by email'
              aria-label='Search'
              minlength='3'
              value={email}
              autoFocus={true}
              onChange={(e) => {
                setEmail(e.target.value.trim());
              }}
            />
            <Button
              icon={BsXCircleFill}
              layout='link'
              aria-label='clear search'
              onClick={(e) => {
                setEmail("");
                getAllTickets();
                setSelectedEvent("");
              }}
            />
          </div>

          <div style={{ width: "18rem" }}>
            <Select
              className='h-9 rounded-lg mr-3 '
              placeholder='Select Event'
              value={selectedEvent}
              onChange={setSelectedEvent}
              options={eventOptions.map((opt) => {
                return {
                  value: opt.eventTitle,
                  label: opt.eventTitle,
                  id: opt._id,
                };
              })}
            />
          </div>

          <CsvButton
            style={{ width: "14rem" }}
            data={tickets?.map((ticket, index) => {
              return {
                serialNumber: index + 1,
                eventTitle:
                  ticket?.event?.eventTitle || ticket?.Event?.eventTitle,
                ticketName: ticket?.ticketType?.ticketName,
                ticketId: ticket._id,
                email: ticket?.customerEmail || ticket?.user?.email,
                price: `$ ${ticket.totalPrice}`,
              };
            })}
            columns={tableColumns?.map((col) => {
              return {
                id: col.key,
                displayName: col.title,
              };
            })}
            filename={"TicketList"}
          />
        </div>
      </div>
      <div>
        {tickets.length > 0 && !isLoading ? (
          <TableComp
            pagination={pagination}
            setCurrentPage={setCurrentPage}
            columns={tableColumns}
            tableData={tickets?.map((ticket, index) => {
              return {
                serialNumber:
                  (pagination.page - 1) * pagination.limit + (index + 1),
                onTheSpot: onTheSpotGenerater(
                  ticket?.onTheSpot || ticket?.tickets[0]?.onTheSpot || false
                ),
                eventName: ticket?.event?.eventTitle,
                ticketsNo:
                  ticket?.totalTicketQuantity ||
                  ticket?.tickets?.length ||
                  "unkown",
                email: ticket?.customerEmail || ticket?.user?.email,
                actions: (
                  <Button
                    className='mx-1'
                    layout='outline'
                    size='small'
                    onClick={() =>
                      handleViewClick(
                        ticket?.orderId || ticket?.tickets[0]?.orderId
                      )
                    }
                  >
                    <BsEye fontWeight={"bolder"} size={20} color='#49A844' />
                  </Button>
                ),
              };
            })}
            // .filter((ticket) => ticket?.email?.includes(email))}
          />
        ) : (
          <Loading loading={isLoading} />
        )}
      </div>
    </>
  );
};

export default Tickets;
