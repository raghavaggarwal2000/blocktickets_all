import React from "react";
import "./loading.css";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return (
    <div className="loading bg-black" style={{ color: "#fa6400" }}>
      <CircularProgress color="inherit" size={80} />
    </div>
  );
};

export default Loading;
