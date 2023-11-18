const sendEmail = require("./sendEmail");

const sendResetPassswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;
  console.log({user: process.env.SMTP_EMAIL, 
    pass: process.env.SMTP_PASS})
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello ${email},</h4>
   ${message}
   `,
  });
};

module.exports = sendResetPassswordEmail;
