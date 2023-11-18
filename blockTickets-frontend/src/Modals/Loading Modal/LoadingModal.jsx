import React,{useState,useEffect} from "react";
import Loading from "../../Loading/Loading.js";
import {Modal, Button} from 'react-bootstrap';
import '../modals.css';

const LoadingModal = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleVisiblity = () => setShow(props.visibility); //true or false

    useEffect(() => {
      setShow(props.visibility);
    },[props.visibility])
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
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Loading/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoadingModal;
