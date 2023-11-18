import { combineReducers, applyMiddleware } from "redux";
import { createStore } from "redux";
import {
  eventReducer,
  ticketReducer,
  nftMintReducer,
  ticketEventDetailsReducer,
  coinBaseWalletReducer,
} from "./reducer.js";
import thunk from "redux-thunk";
const thunkMiddleware = [thunk];

// remove composeWithDevTools in production
const composeWithDevTools = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const rootReducer = combineReducers({
  eventReducer: eventReducer,
  nftMintReducer: nftMintReducer,
  ticketReducer: ticketReducer,
  ticketEventDetailsReducer: ticketEventDetailsReducer
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(thunkMiddleware)
);
