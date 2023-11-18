import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import "./styles/input.css";
import App from "./App";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { Web3Context, Web3Provider } from "./Context/Web3Context";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
ReactDOM.render(
  <>
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Provider store={store}>
          <Web3Provider>
            <App />
          </Web3Provider>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </>,
  document.getElementById("root")
);
