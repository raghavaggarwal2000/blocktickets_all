import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../modals.css";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const UserTicketBid = ({
    show,
    setShow,
    setUserTicketPrice,
    userTicketPrice,
    handleContinueListing,
    priceCurrency,
    setPriceCurrency,
}) => {
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleListing = async () => {
        // //console.log(userTicketPrice);
    };
    let navigate = useNavigate();

    return (
        <div className="modal__body">
            {/* <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered 
            >
                <Modal.Header closeButton>
                    <Modal.Title>Marketplace List Price</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <span>
                            Please enter the listing price of your ticket
                            <br />
                        </span>

                        <div className="bidPriceInput">
                        <select 
                        name="Currency" 
                        id="currency" 
                        className="currencySelect"
                        value={priceCurrency}
                        onChange={(e) => {setPriceCurrency(e.target.value)}}
                        >
                        <option default value="INR">INR</option>
                            <option  value="USD">USD</option>
                            <option value="AED">AED</option>
                            
                        </select>

                        <input
                            className="bid-input-price"
                            type="number"
                            placeholder={`10 ${priceCurrency}`}
                            id="userTicketPrice"
                            value={userTicketPrice}
                            onChange={(e) => {
                                setUserTicketPrice(e.target.value);
                                // //console.log(e.target.value);
                            }}
                        />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-modal" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        className="btn-modal-continue"
                        onClick={handleContinueListing}
                    > 
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal> */}

            <Dialog
                onClose={handleClose}
                open={show}
                PaperProps={{ style: { width: "400px", height: "300px" } }}
            >
                <div className="flex items-center gap-4 justify-center relative flex-col w-full h-full p-4">
                    <div
                        onClick={handleClose}
                        className="absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white"
                    >
                        <CloseIcon />
                    </div>
                    <h2 className="text-center">List on Marketplace</h2>
                    <div>
                        <span>
                            Please enter the listing price of your ticket
                        </span>

                        <div className="bidPriceInput">
                            <select
                                name="Currency"
                                id="currency"
                                className="currencySelect"
                                value={priceCurrency}
                                onChange={(e) => {
                                    setPriceCurrency(e.target.value);
                                }}
                            >
                                <option default value="INR">
                                    INR
                                </option>
                                {/* <option value="USD">USD</option>
                                <option value="AED">AED</option> */}
                            </select>

                            <input
                                className="bid-input-price"
                                type="number"
                                placeholder={`10 ${priceCurrency}`}
                                id="userTicketPrice"
                                value={userTicketPrice}
                                onChange={(e) => {
                                    setUserTicketPrice(e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <button
                            className="py-3 px-6 mr-2 bg-BlueButton text-white text-lg rounded-lg"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button
                            className="py-3 px-6 bg-BlueButton text-white text-lg rounded-lg"
                            onClick={handleContinueListing}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default UserTicketBid;
