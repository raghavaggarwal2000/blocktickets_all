const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>Thank you for creating an account on Blocktickets. <br> Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<h4> Hello ${name.charAt(0).toUpperCase() + name.slice(1)},</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
