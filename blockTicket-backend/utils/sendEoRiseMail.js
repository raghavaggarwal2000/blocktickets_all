const sendEmail = require("./sendEmail");

const sendEoRiseMail = async ({
    email,
    origin,
    redirectUrl,
}) => {
    return sendEmail({
        to: email,
        subject: "Email Confirmation",
        html: `<!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
                integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
                crossorigin="anonymous"
                referrerpolicy="no-referrer"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet"
            />
            <title>Ticket Booking</title>
            <style>
                body {
                    background-color: #000;
                    padding: 0;
                    margin: 0;
                    font-family: "Montserrat", sans-serif;
                    color: #fff;
                    font-weight: 500;
                    font-size: 14px;
                    width: -webkit-fit-content;
                    width: -moz-fit-content;
                    width: fit-content;
                    height: 972px;
                    height: -webkit-fit-content;
                    height: -moz-fit-content;
                    height: fit-content;
                }

                .header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 500px;
                    padding: 2rem;
                }
                .header .topImgLogo {
                    display: flex;
                    justify-content: end;
                    width: 100%;
                    position: relative;
                    height: 1rem;
                }
                .header .topImgLogo img {
                    position: absolute;
                }
                .header .largeBanner {
                    width: 128%;
                    -o-object-fit: cover;
                    object-fit: cover;
                }
                .header .topImgRise {
                    position: relative;
                }
                .header .topImgRise img {
                    position: relative;
                    top: -20px;
                }

                .mainBody {
                    width: 500px;
                    padding: 0 3rem;
                }
                .mainBody .paraContainer {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.75rem;
                    text-align: justify;
                }
                .mainBody .paraContainer img {
                    height: 4.5rem;
                }
                .mainBody .steps {
                    margin-top: 2.5rem;
                    margin-bottom: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .mainBody .steps .step {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }
                .mainBody .steps .step img {
                    width: 100px;
                }
                .mainBody .steps .step .link {
                    text-decoration: none;
                    border: none;
                    background-color: #c4ff00;
                    border-radius: 9999999px;
                    font-family: "Montserrat", sans-serif;
                    font-weight: 600 !important;
                    cursor: pointer;
                    margin-left: 0.5rem;
                    color: #000;
                    padding: 0.25rem 0.5rem;
                }

                .footer {
                    display: flex;
                    margin-top: 3rem;
                    flex-direction: column;
                    align-items: center;
                    width: 500px;
                    padding: 2rem 2rem 4rem;
                }
                .footer .socials {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 8px;
                }
                .footer .socials a {
                    text-decoration: none;
                    color: #fff;
                    font-size: 22px;
                }
                .footer .footText {
                    font-size: 10px;
                }

                .bottomLogo {
                    position: absolute;
                    width: 100px;
                    bottom: 3.5rem;
                    right: 2rem;
                }

                .themeImage {
                    position: absolute;
                    width: 80%;
                    bottom: -40px;
                    left: -40px;
                    overflow: hidden;
                }

                .container {
                    height: 972px;
                    position: relative;
                    overflow: hidden;
                } /*# sourceMappingURL=style.css.map */
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="topImgLogo">
                        <img
                            src="https://user-images.githubusercontent.com/68837361/207305337-cb0e5a8a-e3f7-4644-8a23-d1bb9ac974d2.png"
                            alt="logo"
                        />
                    </div>
                    <img
                        src="https://user-images.githubusercontent.com/68837361/207402676-a5c860e2-dd48-4b51-8e62-d20fa06decd8.jpg"
                        alt=""
                        class="largeBanner"
                    />
                    <div class="topImgRise">
                        <img
                            src="https://user-images.githubusercontent.com/68837361/207305342-21406c7f-dcb8-4d1e-b7c7-a4f0d682bebe.png"
                            alt=""
                        />
                    </div>
                </div>
                <div class="mainBody">
                    <i>Dear attendee,</i>
                    <div class="paraContainer">
                        <img
                            src="https://user-images.githubusercontent.com/68837361/207390954-67394870-b30e-419e-8186-5fbb2eb104ac.png"
                            alt=""
                        />
                        <div>
                            The ‘S’ in Rise is the entrepreneurial spirit that seeks
                            out change. We have created a web 3.0 experience just
                            for you. We have minted exclusive NFTs that will entitle
                            you to special discounts and experiences.
                        </div>
                    </div>
                    <div class="steps">
                        <div class="step">
                            <img
                                src="https://user-images.githubusercontent.com/68837361/207390934-59deae7d-da60-49dd-a988-6ad10f3dc2b8.png"
                                alt=""
                            />
                            <div>
                                Over 1 lakh worth of redeemable value and priceless
                                experinece.
                            </div>
                        </div>
                        <div class="step">
                            <img
                                src="https://user-images.githubusercontent.com/68837361/207392347-cbb3273e-11c9-4fbf-9467-1946559a927e.png"
                                alt=""
                            />
                            <div>
                                Click here to
                                <a href="${redirectUrl}" class="link">sign up</a>
                            </div>
                        </div>
                        <div class="step">
                            <img
                                src="https://user-images.githubusercontent.com/68837361/207392361-587b424c-55c2-45b7-aa3d-683a8e7f02db.png"
                                alt=""
                            />
                            <div>To redeem your offer scan QR code at venue.</div>
                        </div>
                    </div>
                    <div>
                        Enjoy your journey into web 3 and take advantage of your
                        NFTs today.
                    </div>
                </div>
                <div class="footer">
                    <div class="socials">
                        <a href="https://www.facebook.com/blocktickets.io">
                            <i class="fa-brands fa-square-facebook"></i>
                        </a>
                        <a href="https://www.instagram.com/blocktickets/">
                            <i class="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com/company/blocktickets/">
                            <i class="fa-brands fa-linkedin"></i>
                        </a>
                    </div>
                    <div class="footText">
                        Want to change how you receive these emails?
                    </div>
                    <div class="footText">
                        You can update your preferences or unsubscribe or delete
                        wallet
                    </div>
                </div>
                <img
                    src="https://user-images.githubusercontent.com/68837361/207390963-e0fe44f8-7368-4d9d-ae8f-1b6e68739911.png"
                    alt=""
                    class="bottomLogo"
                />
                <img
                    src="https://user-images.githubusercontent.com/68837361/207399591-28c6d9a6-773a-4630-a2fb-99111d796488.png"
                    alt=""
                    class="themeImage"
                />
            </div>
        </body>
    </html>
   `,
    });
};

module.exports = sendEoRiseMail;

