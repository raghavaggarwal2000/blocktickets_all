import React from "react";

import "./loading.css";
import CircularProgress from "@mui/material/CircularProgress";

const FullLoading = () => {
  return (
    <div className="full-loading" style={{ color: "#fa6400" }}>
      <CircularProgress color="inherit" size={80} />
    </div>
  );
};

export default FullLoading;
