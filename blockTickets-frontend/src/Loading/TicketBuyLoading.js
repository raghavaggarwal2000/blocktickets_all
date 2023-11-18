import React from 'react';

import './loading.css';
import CircularProgress from "@mui/material/CircularProgress";

const TicketBuyLoading = ({ message }) => {

  return <div className="full-loading-2">
    <div>
      <CircularProgress color="inherit" size={60} />
      <p className="payNow" style={{ textAlign: "center" }}>{`${message}`}<br />
        <span>This may take upto 30 seconds...</span>
      </p>
    </div>
  </div>;
};

export default TicketBuyLoading;