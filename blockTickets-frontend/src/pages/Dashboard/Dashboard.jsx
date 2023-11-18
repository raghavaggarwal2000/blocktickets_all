import profileBgImg from "../../images/Rectangle 393.png";
import userImg from "../../images/defaltUser.webp";
import { useState, useEffect, useRef, useContext } from "react";
import qrImg from "../../images/qr.svg";
import { useNavigate } from "react-router";
import axios from "axios";
import MessageModal from "../../Modals/Message Modal/MessageModal";
import { myTicketsData, systemLogin } from "../../api/api-client";
import twitterImg from "../../images/twitter1.svg";
import facebookImg from "../../images/facebook1.svg";
import instagramImg from "../../images/instagram1.svg";
import Ticket from "../../components/Ticket/Ticket";
import FullLoading from "../../Loading/FullLoading";
import TicketBuyLoading from "../../Loading/TicketBuyLoading";
import Web3 from "web3";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardLoading from "../../Loading/CardLoading";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

const Dashboard = (props) => {
  const [user, setUser] = useState();
  const [active, setActive] = useState("tickets");
  const [allTickets, setAllTickets] = useState([]);
  const [allNftDrops, setNftDrops] = useState([]);
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");
  const [pastEvent, setPastEvent] = useState(false);
  const [ticketLengths, setTicketLengths] = useState(0);
  const [fullLoading, setFullLoading] = useState(false);
  const [nftLoading, setNftLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please Wait...");
  const web3 = new Web3(Web3.givenProvider);
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("token");

  const userPicRef = useRef();
  const bgPicRef = useRef();
  const value = useContext(UserContext);

  const getLoginIn = async () => {
    try {
      const userD = await systemLogin(query);
      if (userD.status === 200) {
        const receiveData = userD.data.data;
        value.setUserToken(receiveData.accessToken);
        sessionStorage.setItem("token", receiveData.accessToken);
        sessionStorage.setItem("user-data", JSON.stringify(receiveData.user));
        sessionStorage.setItem(
          "METAMASK_WALLET",
          JSON.stringify(receiveData.user.wallets[0])
        );
        sessionStorage.setItem("isMetamaskConnected", false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("anything");
    }
  };

  useEffect(() => {
    if (query) {
      getLoginIn();
    }
  }, []);

  var currDate = new Date().toISOString();

  const navigate = useNavigate();

  const claimNftDrop = async (ticket) => {
    setNftLoading(true);
    setLoadingMessage("Please connect your Metamask Wallet");
    if (!window.ethereum) {
      toast.error("Install metamask");
      setNftLoading(false);
    }
    let userWallet;
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then(async (res) => {
        const accounts = await web3.eth.getAccounts();
        userWallet = accounts[0];
        let ticketNft = allTickets.filter((it) => it._id);
        var userTransferData = JSON.stringify({
          ticketNft,
          userWallet,
        });
        setLoadingMessage("Transferring NFT Ticket to your account...");

        var configB = {
          method: "post",
          url: `${process.env.REACT_APP_ADMIN_MINT}/nftDrop/claim`,
          headers: {
            "Content-Type": "application/json",
          },
          data: userTransferData,
        };
        // axios(configA)
        //     .then(async (ticketTransferA) => {
        // console.log(ticketTransferA);
        axios(configB)
          .then(async (ticketTransferB) => {
            // console.log(ticketTransferB);
            //update ticket by id

            setMessageModal(true);
            setMessageModalDesc(
              `NFT Has been successfully dropped in your Web3 wallet ${userWallet}. To view NFT in Web3 wallet view it from this token address 0x2f376c69feEC2a4cbb17a001EdB862573898E95a.`
            );
            setNftLoading(false);

            var data = JSON.stringify({
              email: JSON.parse(sessionStorage.getItem("user-data")).email,
              tokenId1: ticketNft,
              ticketNft: true,
            });

            var config = {
              method: "post",
              url: `${process.env.REACT_APP_BACKEND_URL}/ticket/sendAirdrops`,
              headers: {
                "Content-Type": "application/json",
              },
              data: data,
            };

            axios(config)
              .then(function (response) {
                // console.log(JSON.stringify(response.data));
                getNftDrops();
              })
              .catch(function (error) {
                // console.log(error);
              });
          })
          .catch(function (error) {
            // console.log(error);
            setNftLoading(false);
            setMessageModal(true);
            setMessageModalDesc("AB__T: Some error ocurred...");
          });

        // minting freebies
      })
      .catch((err) => {
        // console.log("err", err);
        setNftLoading(false);
        setMessageModal(true);
        setMessageModalDesc("AB__T: Some error ocurred...");
      });
    // })
    // .catch((err) => {
    //     console.log(err);
    //     setNftLoading(false);
    //     setMessageModal(true);
    //     setMessageModalDesc("AB_FOR_T: Some error ocurred...");
    // });
  };
  const getNftDrops = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/nftDrop/getByOwner`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      // console.log("drop res", res.data.data.data);
      setNftDrops(res.data.data.data.reverse());
    } catch (err) {
      // console.log(err);
    }
  };
  const getUserProfile = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/users/getMyProfile`,
      {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type":
            "multipart/form-data;boundary=<calculated when request is sent>",
        },
      }
    );
    setUser(res.data.data.user);
    console.log("81 data ", res.data.data.user);
  };

  const getTickets = async () => {
    try {
      const res = await myTicketsData(
        JSON.parse(sessionStorage.getItem("user-data")).userId,
        sessionStorage.getItem("token")
      );

      if (res.status === 200) {
        // console.log(res.data);
        const userTickets = res.data.data.TicketDetails;
        setAllTickets(userTickets.reverse());
        // console.log("all tickets---", userTickets);

        //check for past event tickets
        const addons = userTickets.map((it) => it.addon);
        setNftDrops(Array.prototype.concat.apply([], addons));
        for (let i = 0; i < userTickets.length; i++) {
          if (userTickets[i].Event.endDate < currDate) {
            setPastEvent(true);
          }
        }

        if (res.data.data.TicketDetails) {
          setTicketLengths(userTickets.length);
        }
      }
    } catch (err) {
      //console.log(err.response);
    }
  };
  const uploadProfilePicture = async (myImage) => {
    setFullLoading(true);
    var data = new FormData();
    data.append("image", myImage);

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/add-profilepic`,
      headers: {
        authorization: `Bearer ` + sessionStorage.getItem("token"),
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        let previousData = JSON.parse(sessionStorage.getItem("user-data"));
        previousData.profilePic = response.data.data.url;
        sessionStorage.setItem("user-data", JSON.stringify(previousData));
        setFullLoading(false);
        await getUserProfile();
      })
      .catch(function (error) {
        console.log(error);
        setFullLoading(false);
      });
  };
  const uploadBackgroundPicture = async (myImage) => {
    setFullLoading(true);
    var data = new FormData();
    data.append("image", myImage);

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/users/add-backgroundpic`,
      headers: {
        Authorization: `Bearer ` + sessionStorage.getItem("token"),
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        let previousData = JSON.parse(sessionStorage.getItem("user-data"));
        previousData.profilePic = response.data.data.url;
        sessionStorage.setItem("user-data", JSON.stringify(previousData));
        setFullLoading(false);
        await getUserProfile();
      })
      .catch(function (error) {
        console.log(error);
        setFullLoading(false);
      });
  };
  useEffect(() => {
    getUserProfile();
    getTickets();
  }, []);

  if (!props.isLogin && !sessionStorage.getItem("user-data")) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {fullLoading && <FullLoading />}
      {nftLoading && <TicketBuyLoading message={loadingMessage} />}
      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={"Message"}
        message={messageModalDesc}
      />

      <div className="w-full bg-[#E5E5E5] mt-[70px] pb-24 pt-12 screen7:pt-0 screen7:pb-0 px-24 screen18:px-12 screen3:px-8 screen7:px-0">
        <div className="relative rounded-[45px] overflow-hidden bg-white w-full screen7:rounded-none">
          <div className="w-full h-[300px] overflow-hidden">
            <img
              src={user && user.bgPic ? user.bgPic : profileBgImg}
              alt="profile banner"
              className="w-full h-full object-cover rounded-b-[45px]"
              onClick={() => bgPicRef.current.click()}
            />
          </div>
          <input
            type="file"
            className="d-none"
            ref={bgPicRef}
            onChange={(e) => uploadBackgroundPicture(e.target.files[0])}
          />
          <input
            type="file"
            className="d-none"
            ref={userPicRef}
            onChange={(e) => uploadProfilePicture(e.target.files[0])}
          />
          <div className="flex screen11:flex-col justify-start gap-x-8">
            <div className="relative felx screen11:flex-col justify-center items-center top-[-4rem] ml-16 screen11:ml-0">
              <div className="w-32 h-32 relative rounded-full overflow-hidden m-auto">
                <img
                  src={user && user.profilePic ? user.profilePic : userImg}
                  alt="user"
                  className="h-full w-full object-cover m-auto "
                  onClick={() => userPicRef.current.click()}
                />
              </div>
            </div>
            <div className="flex justify-between relative screen11:top-[-4rem] screen11:mb-[-2rem] screen11:px-8 screen11:flex-col screen11:justify-center screen11:items-center w-full">
              <div className="flex flex-col items-start gap-2 relative mt-4">
                <span className="text-lg w-full  font-semibold">
                  {user
                    ? user.username
                      ? user.username
                      : user.email
                    : "Loading..."}
                </span>
                <span className="text-DarkColor w-full ">
                  {user && user.wallets.length > 0
                    ? user.wallets[0]
                    : "No wallet added"}
                </span>
                <div className="mt-2 flex gap-4 items-center">
                  <a href={"//" + user?.twitterLink} target="_blank">
                    <img
                      src={twitterImg}
                      alt="socials"
                      className="h-6 left-0 screen11:left-auto screen11:m-auto cursor-pointer"
                    />
                  </a>
                  <a href={"//" + user?.facebookLink} target="_blank">
                    <img
                      src={facebookImg}
                      alt="socials"
                      className="h-8 left-0 screen11:left-auto screen11:m-auto cursor-pointer"
                    />
                  </a>
                  <a href={"//" + user?.instagramLink} target="_blank">
                    <img
                      src={instagramImg}
                      alt="socials"
                      className="h-8 left-0 screen11:left-auto screen11:m-auto cursor-pointer"
                    />
                  </a>
                </div>
              </div>
              <div className="my-4 mr-16 screen11:mr-0 ">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="bg-GreyButton p-2 text-sm font-semibold rounded-md mr-4"
                >
                  Edit profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-[#ffffff8f]  screen7:rounded-none screen7:mt-0 rounded-2xl flex flex-col p-8 py-12 mt-8">
          <div className="noScrollBar flex screen12:w-full overflow-scroll gap-4 bg-[#f8f8f8] rounded-full px-2 py-2 w-fit">
            <button
              onClick={() => setActive("tickets")}
              className={`${
                active === "tickets" && "bg-white rounded-full shadow-md"
              }  px-3 py-1`}
            >
              My NFT Tickets
            </button>
            {/* <button
                            onClick={() => setActive("events")}
                            className={`${
                                active === "events" &&
                                "bg-white rounded-full shadow-md"
                            }  px-3 py-1`}
                        >
                            My Events
                        </button>
                        <button
                            onClick={() => setActive("nftDrops")}
                            className={`${
                                active === "nftDrops" &&
                                "bg-white rounded-full shadow-md"
                            }  px-3 py-1`}
                        >
                            My Add Ons
                        </button> */}
            {/* <button onClick={()=>setActive('favourite')} className={`${active === 'favourite' && 'bg-white rounded-full shadow-md'}  px-3 py-1`}>My Favourite</button> */}
          </div>
          <div className="flex justify-between items-center">
            <div className="mt-8 flex flex-wrap screen7:flex-col justify-center items-center gap-4 w-full">
              {active == "nftDrops" ? (
                allNftDrops.length > 0 ? (
                  allNftDrops.map((item) => (
                    <div
                      className="d-flex flex-column justify-content-center rounded-lg"
                      style={{
                        width: "320px",
                        height: "300px",
                      }}
                    >
                      {item.addOnName.includes("Card") ? (
                        <video
                          className="rounded-lg"
                          src={item.image}
                          controls
                        />
                      ) : (
                        <img className="rounded-lg" src={item.image} alt="" />
                      )}
                      <p className="text-center font-bold text-[#042469]">
                        {item.addOnName}
                      </p>
                    </div>
                  ))
                ) : (
                  `No Nft drops found`
                )
              ) : allTickets.length > 0 ? (
                allTickets.map((data) => (
                  <>
                    {data?.Event && (
                      <Ticket
                        eventId={data._id}
                        eId={data.Event._id}
                        eventName={data.Event.eventTitle}
                        eventDetails={data?.ticketType?.ticketInfo}
                        eventImg={data?.ticketType?.image}
                        eventDate={data.Event.startDate}
                        eventTime={data.Event.startTime}
                        price={data.ticketType?.price}
                        qrCode={data?.qrCode}
                        // organizer={data.nftRef.currentOwnerAddress}
                        notLive
                        location={data.Event.location}
                        ticketDate={
                          data.Event?.ticketEventStartDate ||
                          data.Event?.startDate
                        }
                        ticketTime={
                          data.Event?.ticketEventStartTime ||
                          data.Event?.startTime
                        }
                        currency={data.ticketType.currency}
                        ticketName={data.ticketType.ticketName}
                        ticketNft={data.nftIndex}
                        nftClaimed={data.specialPackageClaimed}
                        claimNft={claimNftDrop}
                      />
                    )}
                  </>
                ))
              ) : allTickets.length === 0 ? (
                <div className="flex justify-center text-2xl font-bold items-center w-full min-h-[300px]">
                  No Tickets Found
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-full place-items-center">
                  <CardLoading />
                  <CardLoading />
                  <CardLoading />
                  <CardLoading />
                  <CardLoading />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EventCard = ({
  eventId,
  eventName,
  price,
  organizer = "BlockTickets",
  eventDate,
  location,
  eventImg,
  buy,
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-[280px] screen3:w-[240px] screen3:h-[520px] flex overflow-hidden flex-col h-[560px] relative rounded-lg border-2 border-LightColor">
      {/* <div className="absolute w-6 h-6 bg-white top-[50%] left-0"></div> */}
      <div className="rounded-lg bg-white text-[#CF1C1C] text-sm font-medium p-2 py-1 absolute top-4 right-4">
        Live
      </div>
      <div className="w-[280px] h-[160px] screen3:w-[240px] screen3:h-[120px] overflow-hidden">
        <img src={eventImg} alt="event" />
      </div>
      <div className="flex bg-[#00000010] flex-col gap-1">
        <div className="flex mx-4 mt-4 flex-col border-b-2 pb-2 font-medium">
          {eventName}
          <span className="font-medium text-xs text-LightBlue">
            <span className="text-LightColor">by</span> {organizer}
          </span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="text-sm mx-4 flex justify-between text-DarkColor font-medium pb-2 border-b-2">
            <div className="flex flex-col">
              <span className="text-LightColor">Date:</span>
              <span>
                {new Date(eventDate).toLocaleDateString("en-IN", {
                  dateStyle: "short",
                })}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-LightColor">Time:</span>
              <span>
                {new Date(eventDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="text-sm px-4 flex justify-between text-DarkColor font-medium pb-2 ">
            <div className="flex flex-col">
              <span className="text-LightColor">Location:</span>
              <span>{location}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-LightColor">Price:</span>
              <span>₹{Math.floor(price * 100) / 100}</span>
            </div>
          </div>
          <div className="flex justify-center bg-white items-center py-6 pb-2 border-t-2 border-dotted border-[#00000066]">
            <img src={qrImg} alt="qr-code" className=" w-[100px] h-[100px]" />
          </div>
        </div>
      </div>
      {/* <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {eventName}
          </span>
          <span>
            INR {price}
          </span>
        </div>
        <span className="text-sm text-DarkColor font-medium">
            {eventDate}
        </span>
        <span className="text-sm text-DarkColor font-medium">
            {location}
        </span>
    </div> */}
    </div>
  );
};

export default Dashboard;
