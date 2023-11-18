import React from "react";
import "../modals.css";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

const MessageModal2 = ({ show, setShow, title, message }) => {
  let navigate = useNavigate();
  const onClose = () => setShow(false);

  return (
    <React.Fragment>
      <Dialog
        onClose={onClose}
        open={show}
        PaperProps={{ style: { width: "400px", height: "300px" } }}
      >
        <div className="flex items-center gap-4 justify-center relative flex-col w-full h-full p-4">
          <div
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white"
          >
            <CloseIcon />
          </div>
          <h2 className="text-center">{title}</h2>
          <span className="text-center">{message}</span>
          <button
            className="py-3 px-6 bg-BlueButton text-white text-lg rounded-lg"
            onClick={() => {
              navigate("/dashboard/v2");
            }}
          >
            Go to My Tickets
          </button>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default MessageModal2;
