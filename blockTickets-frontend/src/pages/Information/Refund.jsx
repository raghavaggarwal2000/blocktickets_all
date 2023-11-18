import React, { useEffect } from "react";

import "./infromation.css";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";

const Refund = () => {
  useEffect(() => {
    document.body.scrollTop = 0;
  }, []);
  return (
    <div className="informationPage">
      <Helmet>
        <title>Blocktickets | Privacy Policy</title>
      </Helmet>
      <Container className="informationPage-container">
        <h2>
          <strong>Refunds and Exchanges</strong>
        </h2>
        <p>
          Before purchasing tickets, carefully review your booking details.
          Blocktickets will be unable to process exchanges or refunds after a
          ticket has been purchased or for lost, stolen, damaged or destroyed
          tickets
        </p>
      </Container>
    </div>
  );
};

export default Refund;
