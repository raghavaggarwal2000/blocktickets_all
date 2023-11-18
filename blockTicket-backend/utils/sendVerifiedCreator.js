const sendEmail = require("./sendEmail");

const sendVerifiedCreator = async ({
  name,
  email
}) => {
 

  const message = `<p>Hi, You have been verified as an event creator on Blocktickets.io. Now, you can successfully create and apply for listing your events on Blocktickets.io.</p>`;

  return sendEmail({
    to: email,
    subject: "Event Creator Confirmation",
    html: `<h4> Hello ${name.charAt(0).toUpperCase() + name.slice(1)},</h4>
    ${message}
    `,
  });
};

module.exports = sendVerifiedCreator;
