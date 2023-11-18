const sendEmail = require("./sendEmail");

const airdropNftMail = async ({ email, ticketNft, redirect }) => {
    if (ticketNft) {
        return sendEmail({
            to: email,
            subject: "Additional NFT's",
            html: `<h4>Hi! <br> You have successfully claimed your NFT. <a href=${redirect}>Click here to view your NFT. </a><br>
      
      <br>For more information reach out to us at info@blocktickets.io</h4>
      <p><strong>Warm Regards,
      Team Blocktickets</strong></p>
      `,
        });
    } else {
        return sendEmail({
            to: email,
            subject: "Additional NFT's",
            html: `<h4>Dear Patron, <br>
      You have successfully claimed your additional Special Package NFTs. NFTs has been airdropped to your Web 3 wallet.</h4>
      <a href=${redirect}>Click here to view your additional special package NFTs.</a>`,
        });
    }
};

module.exports = airdropNftMail;
