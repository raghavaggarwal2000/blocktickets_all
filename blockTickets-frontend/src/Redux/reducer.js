import {
  GET_EVENTS,
  NFT_MINT_INFO,
  USER_TICKETS,
  TICKET_EVENTS_DETAILS,
  CONNECT_WALLET,
} from "./constants.js";

const blockTicketState = {
  getEvents: {},
};

export const eventReducer = (state = blockTicketState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        getEvents: action.payload,
      };
    default:
      return state;
  }
};

export const nftMintReducer = (state = blockTicketState, action) => {
  switch (action.type) {
    case NFT_MINT_INFO:
      return {
        ...state,
        nftMintInfo: action.payload,
      };

    default:
      return state;
  }
};

export const ticketReducer = (state = blockTicketState, action) => {
  switch (action.type) {
    case USER_TICKETS:
      return {
        ...state,
        userProfile: action.payload,
      };
    default:
      return state;
  }
};

export const ticketEventDetailsReducer = (state = blockTicketState, action) => {
  switch (action.type) {
    case TICKET_EVENTS_DETAILS:
      return {
        ...state,
        TicketEventDetails: action.payload,
      };
    default:
      return state;
  }
};