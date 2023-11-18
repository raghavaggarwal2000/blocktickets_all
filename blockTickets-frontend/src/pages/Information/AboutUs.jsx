import React, { useEffect } from "react";
import "./infromation.css";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";

const AboutUs = () => {
  useEffect(() => {
    document.body.scrollTop = 0;
  }, []);
  return (
    <div className="informationPage">
      <Helmet>
        <title>Blocktickets | About Us</title>
      </Helmet>
      <Container className="aboutUsPage-container">
        <h2>
          <strong>Summary Introduction</strong>
        </h2>
        <p>
          Blocktickets creates transparent and decentralized system for creation
          and sale of smart tickets using blockchain technology. Blocktickets
          supports in managing the entire life of tickets by integrating all
          stakeholders from artists, event- organizers, financers, initial
          tickets buyers, secondary ticket buyers, fans and advertisers.
        </p>
      </Container>
    </div>
  );
};

export default AboutUs;
