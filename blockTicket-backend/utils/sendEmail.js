const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);
  console.log(nodemailerConfig);
  return transporter.sendMail({
    from: '"BlockTickets" <noreply@blocktickekts.io>', // sender address
    to,
    subject,
    html,
    attachments,
  });
};

module.exports = sendEmail;
