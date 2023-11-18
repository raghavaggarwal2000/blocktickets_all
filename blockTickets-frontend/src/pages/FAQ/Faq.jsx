import React, { useEffect } from 'react';
import "./faq.css";
import { Container, Row, Col } from "react-bootstrap";
import { contractAddress } from "../../utils/web3/web3"

const Faq = () => {

  useEffect(() => {
    document.body.scrollTop = 0;
  }, []);
  return (
    <div className="faq-section">
      <Container>
        <Row>
          <Col className="faq-title">How to claim your NFT to your web 3.0 Wallet</Col>
        </Row>
        <Row>
          <Col className="faqsCol">
            <p>In order to transfer your NFT ticket to Metamask wallet you will have to download the Metamask wallet and make an account on Metamask. The preferred mode to transfer your NFT is through desktop. Alternatively, you can also transfer the NFT through mobile by browsing from Metamask app which can be downloaded from Google Playstore or App store. Please note, that Metamask will not work in mobile version accessed through chrome or safari</p>

            <p>
              <strong>Download web 3.0 wallet from desktop:</strong><br /><br />
              <strong>Step 1:</strong> Download Metamask from their https://metamask.io/download/. They offer support for the browsers Chrome, Firefox, Brave and Edge, as well as both iOS and Android.<br /><br />
              <strong>Step 2:</strong> Create a wallet by following the instructions. Once you get to the backup seed phrase, make sure to write it down on a piece of paper rather than storing it on your computer or phone.<br />
              Congratulations! You’ve just created a Metamask account.<br /><br />

            </p>

            <p>
              <strong>Connecting your web 3.0 wallet with Binance smart chain</strong> <br /><br />

              <strong>Step 1:</strong> As you can see on the extension of your browser, the default network on Metamask is set to the Ethereum Mainnet (top right). Let’s now add Binance chain to the list.<br /><br />

              <strong>Step 2:</strong> Click on Networks and click on Add Network. A pop-up window will open-up:<br /><br />
              Input the following info in the boxes:<br /><br />

              Network Name: Binance Smart Chain <br />
              New RPC URL: https://bsc-dataseed.binance.org/<br />
              ChainID: 56<br />
              Symbol: BNB<br />
              Block Explorer URL: https://bscscan.com<br />
              Click “Save”<br /><br />

              <strong>Step 3:</strong> Once you have the Binance network added to your wallet, under your profile, in My tickets click on “Claim your NFT in your Web 3 Wallet”. <br /><br />
              <strong>Step 5:</strong> You will be prompted with a confirmation message stating that “NFT has been dropped in your Web 3.0 Wallet”. The drop can be confirmed on https://bscscan.com.<br /><br />
              <strong>Step 6:</strong> To view your NFT on your Web 3.0 Extension wallet, Open your web 3.0 wallet on your browser extension. Scroll down and click on “Import tokens”. <br /><br />
              Input the following details: <br /><br />
              Contract address: {contractAddress}<br />
              Token Symbol: Automatically appear as “UNICUS”<br />
              Token Decimal: 0 <br />
              Then click on “Add Custom Token”<br />

              Step 7: Click on “Import Tokens” and now you will be able to see your NFT mentioned as “UNICUS”

            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Faq;