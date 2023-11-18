import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { numberWithCommas } from "../../utils/numberConvert";
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close' 
import {useNavigate} from 'react-router-dom'

const AddOnModal = ({ show, setShow, selectedTickets, ticketId }) => {
    const onClose = () => setShow(false);

    const [index, setIndex] = useState(-1);

    useEffect(() => {
        setIndex(selectedTickets.findIndex((it) => it._id == ticketId));
    }, [ticketId]);

    return (
        <React.Fragment>
            <Dialog
                onClose={onClose}
                open={show}
                PaperProps={{ style: { width: "460px", height: "auto", maxHeight: "600px" } }}
            >
                <div className="flex items-center gap-4 justify-center relative flex-col w-full h-full p-4">
                    <div
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white"
                    >
                        <CloseIcon />
                    </div>
                    <h2 className="text-center">Add-Ons NFT</h2>
                    <span className="text-center">
                        {index > -1 &&
                        selectedTickets[index]?.addon &&
                        selectedTickets[index]?.addon.length > 0 ? (
                            selectedTickets[index].addon.map((addOn) => (
                                <div key={addOn._id} id={addOn._id}>
                                    <div className="ticket-diff-types rounded-lg border-2 border-LightColor d-flex p-4 ms-2 mt-1">
                                        <div className="overflow-hidden max-w-[150px] h-[150px] mr-4 rounded-lg">
                                            <img
                                                src={
                                                    addOn?.image
                                                        ? addOn.image
                                                        : ""
                                                }
                                                alt="event"
                                                className="h-full"
                                            />
                                        
                                        </div>
                                        <div>
                                            <h4 className="font-semibold flex flex-col">
                                                {addOn.addOnName} {(addOn?.image).includes("mp4")}
                                            </h4>
                                            <h5 className="font-normal text-sm flex flex-col">
                                                {addOn.addOnInfo}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h4>No Addons Available</h4>
                        )}
                    </span>
                    <button
                        className="py-3 px-6 bg-BlueButton text-white text-lg rounded-lg"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </Dialog>
        </React.Fragment>
    );
};

export default AddOnModal;


