// Constants
import {
  GET_EVENTS,
  NFT_MINT_INFO,
  USER_TICKETS,
  TICKET_EVENTS_DETAILS,
  CONNECT_WALLET,
} from "./constants.js";
// Contracts
import { ethereumCoinbase } from "./contracts.js";

export const getEvents = (data) => (dispatch) => {
  dispatch({
    type: GET_EVENTS,
    payload: data,
  });
};

export const getNftMintInfo = (data) => (dispatch) => {
  dispatch({
    type: NFT_MINT_INFO,
    payload: data,
  });
};

export const getUserTicket = (data) => (dispatch) => {
  dispatch({
    type: USER_TICKETS,
    payload: data,
  });
};

export const getTicketEventDetails = (data) => (dispatch) => {
  dispatch({
    type: TICKET_EVENTS_DETAILS,
    payload: data,
  });
};

