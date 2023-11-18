const sendEmail = require("./sendEmail");
const getDate = require("./date");

const sendUserEmail = async ({
  email,
  token,
  origin,
  password,
  firstName,
  lastName,
  eventImage,
  ticketName,
  bookingId,
  numFreeTickets,
  eventDate,
  eventStartTime,
  eventEndTime,
  eventLocation,
  ticketPrice,
  eventName,
  fees,
  qrCode,
  eventDescription,
  ticketNamePointThree,
  ticketNamePointOne,
  currency
}) => {
    const point_one = `<li>
    If you have purchased ${ticketNamePointOne}, the above price detail is advanced towards your booking. Balance amount(if any) is payable at the Blocktickets Box Office at the venue.
    </li>`;
    const point_three = `<li>  
    In case you have purchased a ${ticketNamePointThree} the above price detail represents that you have paid 100% amount towards your booking. 
    </li>`;
  const loginURL = password
    ? `${origin}/login?location=${btoa("sign-up-popup")}&redirect_url="ticket"`
    : `${origin}/login?redirect_url="ticket`;
  const message = password
    ? `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8"> <!-- utf-8 works for most cases -->
        <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <title>Block Ticket</title> <!-- The title tag shows in email notifications, like Android 4.4. -->
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
    <style>
    
    @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
    
            /* What it does: Remove spaces around the email design added by some email clients. */
            /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
            html,
    body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        background: #f1f1f1;
        font-size: 13px; 
        color: #000; 
        font-family: 'Montserrat', sans-serif; 
        line-height: 1.6;
    }
    img{
        width: 100%;
    }
    /* What it does: Stops email clients resizing small text. */
    * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
    }
    
    /* What it does: Centers email on Android 4.4 */
    div[style*="margin: 16px 0"] {
        margin: 0 !important;
    }
    
    /* What it does: Stops Outlook from adding extra spacing to tables. */
    table,
    td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
    }
    
    /* What it does: Fixes webkit padding issue. */
    table {
        border-spacing: 0 !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
    }
    
    /* What it does: Uses a better rendering method when resizing images in IE. */
    img {
        -ms-interpolation-mode:bicubic;
    }
    
    /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
    a {
        text-decoration: none;
    }
    
    /* What it does: A work-around for email clients meddling in triggered links. */
    *[x-apple-data-detectors],  /* iOS */
    .unstyle-auto-detected-links *,
    .aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }
    
    /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
    .a6S {
        display: none !important;
        opacity: 0.01 !important;
    }
    
    /* What it does: Prevents Gmail from changing the text color in conversation threads. */
    .im {
        color: inherit !important;
    }
    
    /* If the above doesn't work, add a .g-img class to any image in question. */
    img.g-img + div {
        display: none !important;
    }
    
    /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
    /* Create one of these media queries for each additional viewport size you'd like to fix */
    
    /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
        u ~ div .email-container {
            min-width: 320px !important;
        }
    }
    /* iPhone 6, 6S, 7, 8, and X */
    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
        u ~ div .email-container {
            min-width: 375px !important;
        }
    }
    /* iPhone 6+, 7+, and 8+ */
    @media only screen and (min-device-width: 414px) {
        u ~ div .email-container {
            min-width: 414px !important;
        }
    }
    .social-media{
        font-size: 22px;
        color: #fff;
        padding: 4px 2px;
        display: inline-block;
     }
     .social-media img {
        height: 20px;
    }
     a{
     text-decoration: unset;
     }
     img.footer-logos {
        height: 60px;
        object-fit: contain;
    }
    strong{
        font-weight: 600;
    }
    table.ticket-table td {
        text-align: center;
    }
    table.booking-details-table {
        border: 1px solid #cccccc;
        border-radius: 16px;
        padding: 20px 40px;
    }
    table.booking-details-table table.details td {
        border: 1px solid #cccccc;
        padding: 2px 6px;
    }
    table.details tr td:first-child{
        width: 150px;
    }
    
    .details-bar-btn
    {
    text-align: center;
    font-size: 14px;
    background-color: #003fa0;
    margin: 0 auto;
    width: 60%;
    border: 1px solid #003fa0;
    color: #fff;
    position: relative;
    top: 32px;
    padding:5px 10px;
    }
       
    </style>
    </head>
    
    
    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
        <center style="width: 100%; background-color: #f1f1f1;">
        
        <div style="max-width: 600px; margin: 0 auto; background: #fff;" class="email-container">
    
    
            <!-- BEGIN BODY -->
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
    <tbody>
    
    <tr>
    <td style="border-top: 0px solid #333333; border-bottom: 0px solid #FFFFFF;" align="left" valign="middle"><a href="#"><img src="https://user-images.githubusercontent.com/84133887/226176872-2706f037-0ca9-4390-8fe6-7e22b9011496.jpg" border="0" alt="Header" align="center" /></a></td>
    </tr>
    </tbody>
    </table>
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
    <td align="center" style="border-top: 0px solid #000000; text-align: left; height: 50px;"><p style="margin-bottom: 0px; margin-top: 40px; margin-left: 60px; margin-right: 60px; font-size: 14px; color: #000; font-family: 'Montserrat', sans-serif; line-height: 1.6;">
    Dear <strong>${firstName?firstName:email},</strong><br>
    Your ticket is confirmed for an ${eventDescription}

    <br><br>

    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="80%" class="details">
    <tr>
        <td  align="center" style="border: 0;"><img src=${eventImage}  class="img-fluid" style="margin-bottom: 0px; margin-top: 0px; border: 0;"></td>
    </tr>
</table>

    <br><br>
    <table width="90%" class="booking-details-table" cellpadding="0" cellspacing="0">
        <tr>
            <td>
    <strong style="padding-bottom: 6px; float: left;">Ticket Details</strong>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td>Full Name</td>
            <td><STRONG>${firstName+" "+ lastName}</STRONG></td>
        </tr>
         <tr>
            <td>Confirmation Code</td>
            <td><STRONG>${bookingId}</STRONG></td>
        </tr>
         <tr>
            <td>Number of tickets</td>
            <td><STRONG>${numFreeTickets}</STRONG></td>
        </tr>
         <tr>
            <td>Ticket Category</td>
            <td><STRONG>${ticketName}</STRONG></td>
        </tr>
    </table>
    <br/>
    <!-- detail section table  start-->
    
    <strong style="padding-bottom: 6px; float: left;">Event Information</strong>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td>Event Name</td>
            <td><STRONG>${eventName}</STRONG></td>
        </tr>
         <tr>
            <td>Event Date</td>
            <td><STRONG>${getDate(eventDate)}</STRONG></td>
        </tr>
         <tr>
            <td>Event Time</td>
            <td><STRONG>${eventStartTime} - ${eventEndTime}</STRONG></td>
        </tr>
         <tr>
            <td>Event Venue</td>
            <td><STRONG>${eventLocation}</STRONG></td>
        </tr>
    </table>
    <br/>
    
    <strong style="padding-bottom: 6px; float: left;">Blocktickets Account Detail</strong>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td>Username</td>
            <td><STRONG>${email}</STRONG></td>
        </tr>
         <tr>
            <td>Password </td>
            <td><STRONG>${password}</STRONG></td>
        </tr>
          
    </table>
    
    
    <br/>
    
    <strong style="padding-bottom: 6px; float: left;">Price Detail</strong><br/>

    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
    <tr>
        <td>Ticket Price</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["ticket_price"])?.toFixed(2)}</STRONG></td>
    </tr>
     <tr>
        <td>Convenience Fee</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["convenience_fee"])?.toFixed(2)}</STRONG></td>
    </tr>
     <tr>
        <td>GST on Conv Fee</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["gst_convenience_fee"])?.toFixed(2)}</STRONG></td>
    </tr>
    <tr>
        <td>Total Price Paid</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["finalPrice"]).toFixed(2)}</STRONG></td>
    </tr>
    </table><br>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td  align="center" style="border: 0;">For entry, please use <STRONG>QR CODE BELOW</STRONG><img src="cid:qr_code@blocktickets.io"  class="img-size"style="margin-bottom: 0px; margin-top: 0px; font-size:12px; border: 0;"><h2 class="details-bar-btn">NOT VALID WITHOUT PHOTO ID</h2></td>
        </tr>
    </table>
    <!-- detail section table end -->
    </td>
        </tr>
    
    </table>
     
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="85%" style="margin: auto; ">
    <div style="margin: 30px; padding: 0px; "><p style="font-size: 14px; color: #000; font-family: 'Montserrat', sans-serif; line-height: 1.6;margin-bottom: 0;">
    <strong>Note:</strong>
    <ul style="margin: 0;padding: 0 16px;">
    ${ticketNamePointOne.length != 0? point_one:""}
    <li>
    In case you have purchased any table at the venue on the day of event, then the above price represents that you have paid 100% amount towards your booking.
    </li>
    ${ticketNamePointThree.length != 0? point_three:""}
    <li>For the customers who have bought the tickets at the venue, can access their Blocktickets account through the username and password provided in the email.
    </li>
    </ul> 
    </div>
    </table>
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
    <tbody>
    
    <tr>
    <td><img src="https://user-images.githubusercontent.com/84133887/226176881-6b8b6a5b-0bb5-4b34-a85e-3ecd5169b80b.jpg" style="margin-bottom: -10px; margin-top: 40px;"></td>
    </tr>
    </tbody>
    </table>
    </div>
      </center>
    </body>
    </html>`
    : `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8"> <!-- utf-8 works for most cases -->
        <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <title>Block Ticket</title> <!-- The title tag shows in email notifications, like Android 4.4. -->
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
    <style>
    
    @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
    
            /* What it does: Remove spaces around the email design added by some email clients. */
            /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
            html,
    body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        background: #f1f1f1;
        font-size: 13px; 
        color: #000; 
        font-family: 'Montserrat', sans-serif; 
        line-height: 1.6;
    }
    img{
        width: 100%;
    }
    /* What it does: Stops email clients resizing small text. */
    * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
    }
    
    /* What it does: Centers email on Android 4.4 */
    div[style*="margin: 16px 0"] {
        margin: 0 !important;
    }
    
    /* What it does: Stops Outlook from adding extra spacing to tables. */
    table,
    td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
    }
    
    /* What it does: Fixes webkit padding issue. */
    table {
        border-spacing: 0 !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
    }
    
    /* What it does: Uses a better rendering method when resizing images in IE. */
    img {
        -ms-interpolation-mode:bicubic;
    }
    
    /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
    a {
        text-decoration: none;
    }
    
    /* What it does: A work-around for email clients meddling in triggered links. */
    *[x-apple-data-detectors],  /* iOS */
    .unstyle-auto-detected-links *,
    .aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }
    
    /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
    .a6S {
        display: none !important;
        opacity: 0.01 !important;
    }
    
    /* What it does: Prevents Gmail from changing the text color in conversation threads. */
    .im {
        color: inherit !important;
    }
    
    /* If the above doesn't work, add a .g-img class to any image in question. */
    img.g-img + div {
        display: none !important;
    }
    
    /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
    /* Create one of these media queries for each additional viewport size you'd like to fix */
    
    /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
        u ~ div .email-container {
            min-width: 320px !important;
        }
    }
    /* iPhone 6, 6S, 7, 8, and X */
    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
        u ~ div .email-container {
            min-width: 375px !important;
        }
    }
    /* iPhone 6+, 7+, and 8+ */
    @media only screen and (min-device-width: 414px) {
        u ~ div .email-container {
            min-width: 414px !important;
        }
    }
    .social-media{
        font-size: 22px;
        color: #fff;
        padding: 4px 2px;
        display: inline-block;
     }
     .social-media img {
        height: 20px;
    }
     a{
     text-decoration: unset;
     }
     img.footer-logos {
        height: 60px;
        object-fit: contain;
    }
    strong{
        font-weight: 600;
    }
    table.ticket-table td {
        text-align: center;
    }
    table.booking-details-table {
        border: 1px solid #cccccc;
        border-radius: 16px;
        padding: 20px 40px;
    }
    table.booking-details-table table.details td {
        border: 1px solid #cccccc;
        padding: 2px 6px;
    }
    table.details tr td:first-child{
        width: 150px;
    }
    
    .details-bar-btn
    {
    text-align: center;
    font-size: 14px;
    background-color: #003fa0;
    margin: 0 auto;
    width: 60%;
    border: 1px solid #003fa0;
    color: #fff;
    position: relative;
    top: 32px;
    padding:5px 10px;
    }
       
    </style>
    </head>
    
    
    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
        <center style="width: 100%; background-color: #f1f1f1;">
        
        <div style="max-width: 600px; margin: 0 auto; background: #fff;" class="email-container">
    
    
            <!-- BEGIN BODY -->
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
    <tbody>
    
    <tr>
    <td style="border-top: 0px solid #333333; border-bottom: 0px solid #FFFFFF;" align="left" valign="middle"><a href="#"><img src="https://user-images.githubusercontent.com/84133887/226176872-2706f037-0ca9-4390-8fe6-7e22b9011496.jpg" border="0" alt="Header" align="center" /></a></td>
    </tr>
    </tbody>
    </table>
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
    <td align="center" style="border-top: 0px solid #000000; text-align: left; height: 50px;"><p style="margin-bottom: 0px; margin-top: 40px; margin-left: 60px; margin-right: 60px; font-size: 14px; color: #000; font-family: 'Montserrat', sans-serif; line-height: 1.6;">
    Dear <strong>${firstName?firstName:email},</strong><br>
    Your ticket is confirmed for an ${eventDescription}

    <br><br>

    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="80%" class="details">
    <tr>
        <td  align="center" style="border: 0;"><img src=${eventImage}  class="img-fluid" style="margin-bottom: 0px; margin-top: 0px; border: 0;"></td>
    </tr>
    </table>
    
    <br><br>
    <table width="90%" class="booking-details-table" cellpadding="0" cellspacing="0">
        <tr>
            <td>
    <strong style="padding-bottom: 6px; float: left;">Ticket Details</strong>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td>Full Name</td>
            <td><STRONG>${firstName+" "+ lastName}</STRONG></td>
        </tr>
         <tr>
            <td>Confirmation Code</td>
            <td><STRONG>${bookingId}</STRONG></td>
        </tr>
         <tr>
            <td>Number of tickets</td>
            <td><STRONG>${numFreeTickets}</STRONG></td>
        </tr>
         <tr>
            <td>Ticket Category</td>
            <td><STRONG>${ticketName}</STRONG></td>
        </tr>
    </table>
    <br/>
    <!-- detail section table  start-->
    
    <strong style="padding-bottom: 6px; float: left;">Event Information</strong>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td>Event Name</td>
            <td><STRONG>${eventName}</STRONG></td>
        </tr>
         <tr>
            <td>Event Date</td>
            <td><STRONG>${getDate(eventDate)}</STRONG></td>
        </tr>
         <tr>
            <td>Event Time</td>
            <td><STRONG>${eventStartTime} - ${eventEndTime}</STRONG></td>
        </tr>
         <tr>
            <td>Event Venue</td>
            <td><STRONG>${eventLocation}</STRONG></td>
        </tr>
    </table>
    <br/>
    
    <strong style="padding-bottom: 6px; float: left;">Blocktickets Account Detail</strong>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td>Username</td>
            <td><STRONG>${email}</STRONG></td>
        </tr>
    </table>
    
    
    <br/>
    
    <strong style="padding-bottom: 6px; float: left;">Price Detail</strong><br/>
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
    <tr>
        <td>Ticket Price</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["ticket_price"])?.toFixed(2)}</STRONG></td>
    </tr>
     <tr>
        <td>Convenience Fee</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["convenience_fee"])?.toFixed(2)}</STRONG></td>
    </tr>
     <tr>
        <td>GST on Conv Fee</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["gst_convenience_fee"])?.toFixed(2)}</STRONG></td>
    </tr>
    <tr>
        <td>Total Price Paid</td>
        <td><STRONG>${currency + " " + Number(ticketPrice["finalPrice"]).toFixed(2)}</STRONG></td>
    </tr>
    </table><br>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" class="details">
        <tr>
            <td  align="center" style="border: 0;">For entry, please use <STRONG>QR CODE BELOW</STRONG><img src="cid:qr_code@blocktickets.io"  class="img-size"style="margin-bottom: 0px; margin-top: 0px; font-size:12px; border: 0;"><h2 class="details-bar-btn">NOT VALID WITHOUT PHOTO ID</h2></td>
        </tr>
    </table>
    <!-- detail section table end -->
    </td>
        </tr>
    
    </table>
     
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="85%" style="margin: auto; ">
    <div style="margin: 30px; padding: 0px; "><p style="font-size: 14px; color: #000; font-family: 'Montserrat', sans-serif; line-height: 1.6;margin-bottom: 0;">
    <strong>Note:</strong>
    <ul style="margin: 0;padding: 0 16px;">
    ${ticketNamePointOne.length != 0? point_one:""}
    <li>
    In case you have purchased any table at the venue on the day of event, then the above price represents that you have paid 100% amount towards your booking.
    </li>
    
    ${ticketNamePointThree.length != 0? point_three:""}
    <li>For the customers who have bought the tickets at the venue, can access their Blocktickets account through the username and password provided in the email.
    </li>
    </ul> 
    </div>
    </table>
    
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
    <tbody>
    
    <tr>
    <td><img src="https://user-images.githubusercontent.com/84133887/226176881-6b8b6a5b-0bb5-4b34-a85e-3ecd5169b80b.jpg" style="margin-bottom: -10px; margin-top: 40px;"></td>
    </tr>
    </tbody>
    </table>
    </div>
      </center>
    </body>
    </html>`;
  return sendEmail({
    to: email,
    subject: `Ticket Confirmation - ${eventName}`,
    html: `${message}`,
    attachments: [
      {
        filename: "qr-code.png",
        path: qrCode,
        cid: "qr_code@blocktickets.io", //same cid value as in the html img src
      },
    ],
  });
};

module.exports = sendUserEmail;
