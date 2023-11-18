import React, { useEffect, useState } from "react";
import { SearchIcon } from "../../icons";
import { Input } from "@windmill/react-ui";
import { useLocation } from "react-router-dom";
import { TicketServices, UserServices } from "../../services/api-client";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../../redux/userSlice";
import { setAllTickets } from "../../redux/ticketSlice";
import Loading from "./Loading";
import toast from "react-hot-toast";

const SearchBar = () => {
  const location = useLocation();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const renderPlaceHolder = () => {
    console.log("location.pathname ", location.pathname);
    if (location.pathname === "/app/tickets") {
      return "Search ticket by email";
    } else if (location.pathname === "/app/users") {
      return "Search users by email";
    }
  };

  const getUsersByEmail = async () => {
    try {
      setIsLoading(true);
      console.log("input", input);
      const userResponse = await UserServices.getUsersByEmail(input);
      dispatch(setAllUsers(userResponse.data.data));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  const filterTicketsByEmail = async () => {
    try {
      setIsLoading(true);
      const ticketsResponse = await TicketServices.getTicketsByUserEmail(input);
      const ticketsData = ticketsResponse.data.data.allTickets.filter(
        (ticket) => ticket.user !== null
      );
      dispatch(setAllTickets(ticketsData));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  useEffect(() => {
    if (input) {
      if (location.pathname === "/app/tickets") {
        filterTicketsByEmail();
      } else if (location.pathname === "/app/users") {
        getUsersByEmail();
      }
    }
  }, [input]);

  return (
    /* <!-- Search input --> */
    <>
      <div className="flex justify-center flex-1 lg:mr-32">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-orange-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder={renderPlaceHolder()}
            aria-label="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default SearchBar;
