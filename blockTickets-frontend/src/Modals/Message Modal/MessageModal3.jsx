import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../modals.css";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const MessageModal = ({
  show,
  setShow,
  title,
  message,

}) => {
  // const onClose = () => setShow(false);
  let navigate = useNavigate();

  const onClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setShow(false);
    }
  };
 

  return (
    <React.Fragment>
      <Dialog
        onClose={onClose}
        open={show}
        PaperProps={{ style: { width: "500px", height: "400px" } }}
      >
        <div className='flex items-center gap-4 justify-center relative flex-col w-full h-full p-4'>
          <div
            onClick={onClose}
            className='absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white'
          >
            <CloseIcon />
          </div>
          <h2 className='text-center'>Message</h2>
          <span className='text-center'>{message}</span>
          {sessionStorage.getItem("token") ? (
            <button
              className='py-3 px-6 bg-BlueButton text-white text-lg rounded-lg'
              onClick={onClose}
            >
              Close
            </button>
          ) : (
            <div className='flex w-full justify-around'>
             
              <button
                className='py-3 px-6 bg-BlueButton text-white text-lg rounded-lg'
                onClick={() => {
                  onClose();
                  navigate("/login");
                }}
              >
                Go to login
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default MessageModal;
