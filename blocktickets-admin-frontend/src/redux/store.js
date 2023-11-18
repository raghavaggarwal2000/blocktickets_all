import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ticketReducer from "./ticketSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    tickets: ticketReducer
  }
});

export default store;
