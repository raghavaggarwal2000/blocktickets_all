import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./event-details.css";
import { Helmet } from "react-helmet";
import { tConvert } from "../../utils/timeConvert";
import { useParams } from "react-router";
import { endpoint } from "../../api/api-client.js";
import detailsImg from "../../images/details.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import MessageModal from "../../Modals/Message Modal/MessageModal";
import UserTicketBid from "../../Modals/UserTicketBid/UserTicketBid";
import {
  contractAddress,
  marketAddress,
  NFTContractAbi,
  marketContractAbi,
  switchChain,
} from "../../utils/web3/web3";
import Web3 from "web3";
import TicketBuyLoading from "../../Loading/TicketBuyLoading";
import { toast } from "react-toastify";
import { convert_in_fiat } from "../../services/web3services";
import { trimString } from "../../utils/utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import GoTo from "../../images/icons/arrow.svg";
import loadingGif from "../../images/assets/qrBorder.gif";

const ReListNft = ({ isLogin }) => {
  const [eventDetails, setEventDetails] = useState("");
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");
  const [nftLoading, setNftLoading] = useState(false);
  const [metamaskInstallShow, setMetamaskInstallShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Please Wait...");
  const [ticketTrail, setTicketTrail] = useState("");
  const [transaction, setTransaction] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [copied, setCopied] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [userBidShow, setUserBidShow] = useState(false);
  const [userTicketPrice, setUserTicketPrice] = useState("");
  const [currentMatic, setCurrentMatic] = useState("");
  const [maticUsd, setMaticUsd] = useState("");
  const web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=${priceCurrency}`
      )
      .then((res) => {
        // Matic -> Currency
        let bidPrice;
        if (priceCurrency === "USD") {
          setCurrentMatic(res.data["matic-network"].usd);
        } else if (priceCurrency === "AED") {
          setCurrentMatic(res.data["matic-network"].aed);
        } else if (priceCurrency === "INR") {
          setCurrentMatic(res.data["matic-network"].inr);
          console.log("Matic USD ", res.data["matic-network"].inr);
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  }, [priceCurrency]);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=${priceCurrency}`
      )
      .then((res) => {
        setMaticUsd(res.data["matic-network"].usd);
      })
      .catch((err) => {
        //console.log(err);
      });
  }, []);
  const getTicket = async () => {
    await axios
      .post(
        `${endpoint}/ticket/get-ticket-by-ticketId`,
        { ticketID: id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then(async (res) => {
        setEventDetails(res.data.data.TicketDetails);
        let pri = "";
        if (res.data.data?.transaction && res.data.data.transaction[0])
          pri = await convert_in_fiat(res.data.data.transaction[0].price);
        setTransaction(pri);
      })
      .catch((err) => console.log(err));
  };

  const createSaleForNFT = async () => {
    if (!window.ethereum) {
      setMetamaskInstallShow(true);
      setNftLoading(false);
      return;
    }
    setNftLoading(true);
    setLoadingMessage("Creating Sale");

    console.log(1);
    switchChain().then(() => {
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(async (res) => {
          const accounts = await web3.eth.getAccounts();
          // put on sale then
          const blockPrice = web3.utils.toWei(
            (userTicketPrice / currentMatic).toFixed(18).toString(),
            "ether"
          ); // in bnb
          let item = eventDetails;
          if (
            !(
              item.claimedWallet.toLowerCase().toString() ===
              accounts[0].toLowerCase().toString()
            )
          ) {
            setMessageModal(true);
            setMessageModalDesc(
              `Please! use this address ${item.nftRef.currentOwnerAddress.toString()}  through which you bought the ticket.`
            );
            setNftLoading(false);
            return;
          } else {
            try {
              const mintContract = new web3.eth.Contract(
                NFTContractAbi,
                contractAddress
              );
              const marketPlaceContract = new web3.eth.Contract(
                marketContractAbi,
                marketAddress
              );
              // using callback
              let approved = false;
              approved = await mintContract.methods
                .isApprovedForAll(accounts[0], marketAddress)
                .call();

              if (!approved) {
                const gasPrice = await web3.eth.getGasPrice();
                const estimated = await mintContract.methods
                  .setApprovalForAll(marketAddress, true)
                  .estimateGas({
                    from: accounts[0],
                  });
                const val = await mintContract.methods
                  .setApprovalForAll(marketAddress, true)
                  .send({
                    from: accounts[0],
                    gas: estimated,
                    gasPrice: gasPrice,
                  });
                if (val?.events.ApprovalForAll.returnValues.approved) {
                  approved = true;
                }
              }
              if (approved) {
                const gasPrice = await web3.eth.getGasPrice();
                const estimated = await marketPlaceContract.methods
                  .createSale(
                    item.nftIndex,
                    blockPrice.toString() //to be in bnb
                  )
                  .estimateGas({
                    from: accounts[0],
                    gasPrice: gasPrice,
                  });
                const res = await marketPlaceContract.methods
                  .createSale(
                    item.nftIndex,
                    blockPrice.toString() //to be in bnb
                  )
                  .send({
                    from: accounts[0],
                    gas: estimated,
                    gasPrice: gasPrice,
                  });
                if (res?.transactionHash) {
                  var data = JSON.stringify({
                    ticketID: item._id,
                    price: res.events.saleCreated.returnValues.price.toString(), // in matic
                    saleId: res.events.saleCreated.returnValues.itemId,
                  });
                  var config = {
                    method: "post",
                    url: `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/onsale`,
                    headers: {
                      Authorization: `Bearer ${isLogin}`,
                      "Content-Type": "application/json",
                    },
                    data: data,
                  };

                  axios(config)
                    .then(function () {
                      //console.log(res);
                      setNftLoading(false);
                      navigate("/marketplace");
                    })
                    .catch(function (error) {
                      console.log(error);
                      setMessageModal(true);
                      setMessageModalDesc(error.response.message);
                      setNftLoading(false);
                    });
                } else {
                  setNftLoading(false);
                }
              } else {
                setNftLoading(false);
                setMessageModal(true);
                setMessageModalDesc("Please Approve the transaction first");
              }
            } catch (error) {
              setNftLoading(false);
              // setMessageModal(true);
              setMessageModalDesc(error.response);
              toast.error("Bad Request!");
            }
          }
          return;
        })
        .catch((err) => {
          console.log(err);
          setNftLoading(false);
          setMessageModal(true);
          setMessageModalDesc(err.message);
          //console.log(err);
        });
    });
  };

  const claimYourNft = async () => {
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
        let ticketNft = eventDetails.nftIndex;
        var userTransferData = JSON.stringify({
          ticketNft,
          userWallet,
        });
        // return
        // vcictdzlxpqwsvav
        setLoadingMessage("Transferring NFT Ticket to your account...");

        var configB = {
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/nftDrop/claim`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isLogin}`,
          },
          data: userTransferData,
        };
        // axios(configA)
        //     .then(async (ticketTransferA) => {
        // console.log(ticketTransferA);
        axios(configB)
          .then(async (ticketTransferB) => {
            //update ticket by id

            setMessageModal(true);
            setMessageModalDesc(
              `NFT Has been successfully dropped in your Web3 wallet ${userWallet}. To view NFT in Web3 wallet view it from this token address ${contractAddress}.`
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
              headers: { "Content-Type": "application/json" },
              data: data,
            };

            axios(config)
              .then(function (response) {
                getTicket();
              })
              .catch(function (error) {
                console.log(error);
              });

            axios({
              method: "post",
              url: `${process.env.REACT_APP_BACKEND_URL}/ticket/create-trail`,
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                trailTransaction: [
                  {
                    buyer: accounts[0],
                  },
                ],
                ticketId: id,
                nftRef: eventDetails.nftRef._id,
                price: eventDetails.price,
              }),
            })
              .then(function (r) {
                // console.log(JSON.stringify(r.data));
              })
              .catch(function (eer) {
                console.log(eer);
              });
          })
          .catch(function (error) {
            console.log(error);
            setNftLoading(false);
            setMessageModal(true);
            setMessageModalDesc("Please Try Again!");
          });

        // minting freebies
      })
      .catch((err) => {
        console.log("err", err);
        setNftLoading(false);
        setMessageModal(true);
        setMessageModalDesc("Please Try Again!");
      });
  };
  const endSale = async (e, saleId, ticketId) => {
    e.preventDefault();
    if (!window.ethereum) {
      setMetamaskInstallShow(true);
      return;
    }
    setNftLoading(true);
    try {
      const connect = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const accounts = await web3.eth.getAccounts();
      sessionStorage.setItem("METAMASK_WALLET", accounts[0]);
      if (accounts[0]) {
        sessionStorage.setItem("isMetamaskConnected", true);
        let item = eventDetails;
        if (!(item.nftRef.currentOwnerAddress == accounts[0])) {
          setMessageModal(true);
          setMessageModalDesc(
            `Please! use this address ${item.nftRef.currentOwnerAddress.toString()}  through which you listed the ticket.`
          );
          setNftLoading(false);
          return;
        }
        // if connected
        const marketPlaceContract = new web3.eth.Contract(
          marketContractAbi,
          marketAddress
        );
        const gasPrice = await web3.eth.getGasPrice();
        const estimated = await marketPlaceContract.methods
          .EndSale(saleId)
          .estimateGas({
            from: accounts[0],
            gasPrice: gasPrice,
          });
        const res = await marketPlaceContract.methods.EndSale(saleId).send({
          from: accounts[0],
          gas: estimated,
          gasPrice: gasPrice,
        });
        if (res?.transactionHash) {
          var data = JSON.stringify({
            ticketID: ticketId,
          });

          var config = {
            method: "post",
            url: `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/removesale`,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then(function (response) {
              //console.log(response.data);
              setNftLoading(false);
              window.location.reload();
              setMessageModal(true);
              setMessageModalDesc("Ticket removed from marketplace...");
            })
            .catch(function (error) {
              //console.log(error.response);
              setNftLoading(false);
            });
        }
      }
    } catch (err) {
      //console.log(err.response);
      setNftLoading(false);
      // toast.error("Bad Request!");
      setMessageModal(true);
      setMessageModalDesc(err.message);
    }
  };

  const getTrails = async () => {
    try {
      const getTrail = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/ticket/getTrail`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          ticketId: id,
        }),
      });
      setTicketTrail(getTrail.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTicket();
    getTrails();
    document.body.scrollTop = 0;
  }, []);

  const handleContinueListing = async () => {
    if (userTicketPrice) {
      setUserBidShow(false);
      createSaleForNFT(eventDetails._id);
    }
  };
  function copyToClipboard(text) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      setCopied(true);
      return navigator.clipboard.writeText(text);
    }
  }
  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setCopied(false);
      }, 1000);
  }, [copied]);
  if (!isLogin && !sessionStorage.getItem("user-data")) {
    return <Navigate to={`/login?redirect_url=${id}`} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {eventDetails && eventDetails?.Event?.eventTitle}
          /Ticket_detail
        </title>
      </Helmet>
      {nftLoading && <TicketBuyLoading message={loadingMessage} />}

      <UserTicketBid
        show={userBidShow}
        setShow={setUserBidShow}
        setUserTicketPrice={setUserTicketPrice}
        userTicketPrice={userTicketPrice}
        handleContinueListing={handleContinueListing}
        setPriceCurrency={setPriceCurrency}
        priceCurrency={priceCurrency}
      />
      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={"Message"}
        message={messageModalDesc}
      />
      <div className="bg-black text-white grid grid-cols-2 screen7:grid-cols-1 gap-8 pb-12 pt-[78px] px-24 screen18:px-12 screen3:px-8">
        <div className="flex flex-col gap-4">
          <div
            className="md:min-h-[300px] overflow-hidden w-full rounded-3xl"
            style={{
              maxHeight: "670px",
            }}
          >
            <img
              src={
                eventDetails && eventDetails?.ticketType?.image
                  ? eventDetails?.ticketType?.image
                  : eventDetails?.Event?.eventSquareImage
                  ? eventDetails?.Event?.eventSquareImage
                  : eventDetails?.Event?.eventImageOriginal
              }
              alt="event"
              className="h-full w-full rounded-3xl object-contain"
            />
          </div>
          {/* <div className="screen7:hidden">
            <EventDescription
              data={eventDetails ? eventDetails?.ticketType?.ticketInfo : ""}
            />
          </div> */}
        </div>
        <div className="flex flex-col">
          <div className="mb-2">
            <h3>
              {eventDetails ? eventDetails?.ticketType?.ticketName : ""} NFT
              Ticket Metadata
            </h3>
            <div className="flex flex-col mb-2">
              <span className="text-xs text-silver">Event Name</span>
              <span className="font-medium">
                {eventDetails?.Event?.eventTitle}
              </span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-xs text-silver">Start Date</span>
              <span className="font-medium">
                {eventDetails
                  ? new Date(eventDetails.Event.startDate)
                      .toDateString()
                      .slice(0, 4) +
                    ", " +
                    new Date(eventDetails.Event.startDate)
                      .toDateString()
                      .slice(4)
                  : ""}
              </span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-xs text-silver">Start Time</span>
              <span className="font-medium">
                {eventDetails ? tConvert(eventDetails.Event.startTime) : ""} IST
              </span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-xs text-silver">Ticket Category</span>
              <span className="font-medium">
                {eventDetails?.ticketType?.ticketCategory}
              </span>
            </div>
            {eventDetails?.onSale && (
              <div className="flex flex-col mb-2">
                <span className="text-xs text-silver">Relist Price</span>
                <span className="font-medium">
                  ₹ {transaction && transaction?.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex flex-col mb-2">
              <span className="text-xs text-silver">Location</span>
              <span className="font-medium">
                {eventDetails ? eventDetails.Event.location : ""}
              </span>
            </div>
            <div className="flex flex-col mb-2 my-[20px]">
              {/* <span className="text-xs text-silver">Qr Code: </span> */}
              <span className="font-medium grid grid-cols-3 gap-2">
                <span className="flex items-center justify-center text-[21px] font-bold">
                  Admit
                </span>

                <div className="relative">
                  <img
                    src={eventDetails?.qrCode}
                    className="flex relative scale-[0.93] z-[11] items-center justify-center"
                  />
                  <img
                    loop="infinite"
                    src={loadingGif}
                    className="absolute z-[0] w-full h-full top-0"
                    alt="loadingGif"
                  />
                </div>

                <span className="flex items-center justify-center text-[21px] font-bold">
                  One
                </span>
              </span>
            </div>

            <EventDescription
              data={eventDetails ? eventDetails?.ticketType?.ticketInfo : ""}
            />
          </div>

          {/* Minting in progress */}
          {!(
            eventDetails &&
            eventDetails.hasOwnProperty("nftHash") &&
            eventDetails?.nftHash.length > 0
          ) && (
            <div className="mt-4 font-bold">
              Your NFT Ticket minting is processing...
            </div>
          )}
          <div className="hidden screen7:block mt-4">
            {/* <EventDescription
              data={eventDetails ? eventDetails?.ticketType?.ticketInfo : ""}
            /> */}
          </div>
          <div className="mt-[20px] md:mt-[40px] text-xl font-medium">
            Transaction History
          </div>
          <div className="border-2 border-borderMain rounded-lg p-4 py-2 mt-4 event__desc__ticket">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#B1B1B1" }}></TableCell>
                  <TableCell sx={{ color: "#B1B1B1" }}>
                    Transaction ID
                  </TableCell>
                  <TableCell sx={{ color: "#B1B1B1" }}>
                    Seller / Minter
                  </TableCell>
                  <TableCell sx={{ color: "#B1B1B1" }}>
                    Buyer / Issuer
                  </TableCell>
                  <TableCell sx={{ color: "#B1B1B1" }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    color: "white",
                  }}
                >
                  <TableCell
                    className="hover:cursor-pointer hover:opacity-75"
                    component="th"
                    scope="row"
                  >
                    {copied ? (
                      <DoneIcon fontSize="small" />
                    ) : (
                      <ContentCopyIcon
                        onClick={() => copyToClipboard(eventDetails?.nftHash)}
                        fontSize="small"
                      />
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {trimString(eventDetails?.nftHash, 5)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    Minted on Polygon
                  </TableCell>
                  <TableCell component="th" scope="row">
                    Blocktickets(
                    {trimString(contractAddress, 4)})
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {eventDetails && eventDetails?.ticketType.currency == "INR"
                      ? "₹"
                      : "AED"}
                    {eventDetails?.price?.toFixed(2)}
                  </TableCell>
                </TableRow>
                {ticketTrail.trails?.trailTransaction.length > 0 ? (
                  ticketTrail.trails?.trailTransaction.map((row) => (
                    <TableRow
                      key={row.seller}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.seller == "Blocktickets"
                          ? "Blocktickets"
                          : row.seller + "..."}
                      </TableCell>
                      <TableCell>
                        {row.buyer.toString().slice(0, 10)}
                        ...
                      </TableCell>
                      <TableCell>
                        {eventDetails &&
                        eventDetails?.ticketType.currency == "INR"
                          ? "₹"
                          : "AED"}
                        {row.price.toFixed(2).toString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </div>
          <div
            onClick={() =>
              window.open(`https://polygonscan.com/tx/${eventDetails?.nftHash}`)
            }
            className="hover:cursor-pointer hover:underline mt-[10px] flex items-center justify-start flex-row"
          >
            <img src={GoTo} alt="goto" className="mr-2 h-[16px]" />
            <spam>Check your transaction on the blockchain</spam>
          </div>
          <div>
            {eventDetails ? (
              eventDetails.specialPackageClaimed ? (
                eventDetails.onSale ? (
                  <button
                    className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                    onClick={(e) =>
                      endSale(e, eventDetails.saleId, eventDetails._id)
                    }
                  >
                    Delist from Marketplace
                  </button>
                ) : (
                  <div>
                    <span className="text-xs">
                      *Royalty of 10% is set by the organizer.
                    </span>
                    <button
                      className="w-full bg-BlueButton text-white text-lg font-medium py-3 mb-2 rounded-md"
                      onClick={() => setUserBidShow(true)}
                    >
                      Resale on Marketplace<sup>*</sup>
                    </button>
                  </div>
                )
              ) : (
                <div className="mt-[20px]">
                  <span className="text-xs">
                    *Your NFT is safe in BlockTickets but you can transfer it to
                    another web3 wallet
                  </span>
                  <button
                    className={
                      eventDetails &&
                      eventDetails.hasOwnProperty("nftHash") &&
                      eventDetails?.nftHash.length > 0
                        ? "w-full bg-orange text-white text-lg font-medium py-3 rounded-md"
                        : "w-full bg-orange/50 text-white text-lg font-medium py-3 rounded-md"
                    }
                    onClick={claimYourNft}
                    disabled={
                      eventDetails &&
                      eventDetails.hasOwnProperty("nftHash") &&
                      eventDetails?.nftHash.length > 0
                        ? false
                        : true
                    }
                  >
                    Transfer NFT
                  </button>
                </div>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const EventDescription = ({ data }) => {
  return (
    <div
      style={{ "overflow-x": "auto" }}
      className="border-2 border-LightColor rounded-lg p-4 event__desc__ticket mt-[20px]"
    >
      <div className="w-full border-b-2 border-LightColor flex gap-2 pb-2 mb-4">
        {/* <img src={detailsImg} alt="details" /> */}
        <span className="text-xl font-medium">Ticket Conditions</span>
      </div>
      {false ? (
        <p
          className="text-DarkColor whitespace-pre-line"
          dangerouslySetInnerHTML={{ _html: data }}
        ></p>
      ) : (
        <p className="text-DarkColor whitespace-pre-line text-silver">{data}</p>
      )}
    </div>
  );
};

export default ReListNft;
