import React, { useEffect } from "react";
import "./infromation.css";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";

const ContactUs = () => {
  useEffect(() => {
    document.body.scrollTop = 0;
  }, []);
  return (
    <div className="informationPage">
      <Helmet>
        <title>Blocktickets | Contact Us</title>
      </Helmet>
      <Container className="aboutUsPage-container">
        <h2>
          <strong>Contact Us</strong>
        </h2>
        <p>
          USA
          <br />
          Blocktickets Inc.
          <br />
          42641 Freistadt Sq
          <br />
          Sterling VA 20166-2606
          <br />
          <br />
          Mail: info@blocktickets.io
          <br />
          Website: www.blocktickets.io
          <br />
        </p>
      </Container>
    </div>
  );
};

export default ContactUs;
