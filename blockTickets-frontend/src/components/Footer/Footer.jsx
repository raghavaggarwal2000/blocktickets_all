import React, { useState } from "react";
import { Link } from "react-router-dom";
import blockTicketLogoMono from "../../images/block-tickets-mono.svg"
import unicus from "../../images/unicusOne.png"
import discordImg from "../../images/Discord.svg";
import facebookImg from "../../images/Facebook.svg";
import twitterImg from "../../images/Twitter.svg";
import linkedinImg from "../../images/Linkedin.svg";
import youtubeImg from "../../images/youtube.png";
import instaramImg from "../../images/Instagram.svg";
import blockTicketsLogo from "../../images/blockticketlogo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { UserServices } from "../../api/supplier";

const Footer = (props) => {
    const [email, setEmail] = useState('')
    const subscribeEmail = async () => {
        try {
            if(!email) return toast.error("Please enter email")
            const s = await UserServices.subscribe(email);
            toast.dismiss()
            toast.success("Thank you for registering !");

        }
        catch (err) {
            toast.dismiss()
            console.log("err",err?.response?.data);
            toast.error(err?.response?.data)
        }
    }
    return (
        <footer className="footer bg-blackishGray font-medium flex flex-col px-24 py-4 md:py-6 lg:py-16 gap-8 justify-between screen18:px-12 screen3:px-8">
            <FootBox subscribeEmail={subscribeEmail} email={email} setEmail={setEmail} />
            <div className="flex screen7:flex-col gap-x-20 gap-y-6 justify-between">
                <div className="text-LightColor font-medium max-w-[440px]">
                    <img className="w-[220px] mb-2" src={blockTicketsLogo} alt="block tickets" />
                    <div>
                        World's first transparaent and decentralised NFT ticketing market place.
                        Create, explore, buy and sell experiential NFT Tickets
                    </div>
                </div>
                <div className="flex flex-col font-medium">
                    <div className="text-textBlakishGray mb-2">Resources</div>
                    <Link to='/privacy-and-policy' className="text-white">Privacy Policy</Link>
                    <Link to='/refund-and-exchange' className="text-white">Funds & Exchange</Link>
                    <Link to='/terms-and-condition' className="text-white">Terms & Conditions</Link>
                </div>
                <div className="flex flex-col font-medium">
                    <div className="text-textBlakishGray mb-2">Company</div>
                    <a href='https://about.blocktickets.io' className="text-white">About Us</a>
                    <Link to='/contact-us' className="text-white">Contact Us</Link>
                </div>
                <div className="nav__buttons unicusOne text-center">
                    <a className="text-white" href="https://unicus.one" target="_blank">
                        Web 3.0 Powered by <img src={unicus} alt="unicus" />
                    </a>
                </div>
            </div>
            <div className="text-LightColor flex items-center gap-1 h-fit"><span className="text-xl">©</span> Create all rights reserved.</div>
        </footer>
    );
};
const FootBox = ({ email, setEmail, subscribeEmail }) => {
    return (
        <div className="flex gap-4 screen3:flex-col justify-between mb-4">
            <div className="flex flex-col gap-4">
                <span className="text-[24px] md:text-[32px] lg:text-[64px] font-semibold text-LightColor">
                    Stay in the loop
                </span>
                <span className="text-LightColor">
                    Join our mailing list to stay connected with our upcoming
                    releases,
                    <br />
                    trending events in marketplace, exclusive NFTs and tips on
                    blocktickets.
                </span>
                <div className="flex gap-4 screen7:flex-col font-medium">
                    <input
                        type="text"
                        className="border-2 border-[#2E4B8B] bg-[#0D2F79] ring-0 focus:ring-0 p-4 py-3 rounded-md text-white"
                        placeholder="Enter your email here"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={subscribeEmail} className="bg-white hover:opacity-75 text-blue p-4 py-3 rounded-md font-medium">
                        Subscribe
                    </button>
                </div>
            </div>
            <div className="flex flex-col text-LightColor">
                <span className="text-3xl font-semibold">
                    Join the community
                </span>
                <div className="flex gap-2 items-center mt-8">
                    <a href="https://www.instagram.com/blocktickets/">
                        <img src={instaramImg} alt="" />
                    </a>
                    <a href="https://twitter.com/blocktickets">
                        <img src={twitterImg} alt="" />
                    </a>
                    <a href="https://www.facebook.com/blocktickets.io">
                        <img src={facebookImg} alt="" />
                    </a>
                    <a href="https://www.linkedin.com/company/blocktickets">
                        <img src={linkedinImg} alt="" />
                    </a>
                    <a href="https://discord.gg/28DR9FEhXn">
                        <img src={discordImg} alt="" />
                    </a>
                    <a href="https://www.youtube.com/channel/UCzKzFES2qFtRGZGfMSb9PYA">
                        <img
                            src={youtubeImg}
                            alt=""
                            className="w-[40px] h-[40px] ml-1"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};
export default Footer;
