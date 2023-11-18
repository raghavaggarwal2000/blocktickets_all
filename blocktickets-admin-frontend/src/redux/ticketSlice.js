import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allTickets: [],
  loading: {
    isLoading: false,
    message: "",
  },
};
const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setAllTickets: (state, action) => {
      return {
        ...state,
        allTickets: action.payload,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: {
          isLoading: action.payload.loading,
          message: action.payload.message,
        },
      };
    },
  },
});

export const { setAllTickets } = ticketSlice.actions;

export default ticketSlice.reducer;
