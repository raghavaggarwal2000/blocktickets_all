import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../modals.css";
import {useNavigate} from 'react-router-dom';
import axios from "axios";

const WalletInfo = ({
    show,
    setShow,
    profileInfo,
    setFullLoading,
    getProfile
}) => {
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let navigate = useNavigate();

    const deleteWallet = async (walletAddress) => {
        setFullLoading(true);
        var data = JSON.stringify({
            "publicAddress": walletAddress
          });
          
          var config = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/users/remove-address`,
            headers: { 
              'Authorization': sessionStorage.getItem("token"), 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(async function (response) {
            await getProfile();
            setFullLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            setFullLoading(false);
          });
    }
    return (
        <div className="modal__body">
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>All Wallet Adderess</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal__walletInfo">
                      <ol>
                        {   profileInfo && 
                          profileInfo.data && 
                          profileInfo.data.user && 
                          profileInfo.data.user.wallets &&
                          profileInfo.data.user.wallets.map((wallet) => {
                            return(
                                <li>{wallet} 
                                <span onClick={() => {deleteWallet(wallet)}} className="deleteWallet"><i class="fa-solid fa-trash"></i></span></li>)
                          })
                        }


                      </ol>
                        {profileInfo && 
                          profileInfo.data && 
                          profileInfo.data.user && 
                          profileInfo.data.user.wallets.length===0 &&
                        <div>No wallet added...</div>
                          }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-modal" onClick={() => navigate("/user-wallet-details")}>
                        Add Wallet Address
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WalletInfo;
