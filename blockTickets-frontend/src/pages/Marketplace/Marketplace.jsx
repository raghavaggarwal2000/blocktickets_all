import React, { useEffect, useState, useRef } from "react";
import "./marketplace.css";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

import { Helmet } from "react-helmet";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Web3 from "web3";
import axios from "axios";
import FullLoading from "../../Loading/FullLoading";
import MessageModal from "../../Modals/Message Modal/MessageModal";
import PayUsingMarket from "../../Modals/PayUsing/PayUsingMarket";
// import { cashfreeSandbox } from "cashfree-dropjs";
import { cashfreeProd } from "cashfree-dropjs";
import { useNavigate } from "react-router";
import { marketAddress, marketContractAbi } from "../../utils/web3/web3";
import Ticket from "../../components/Ticket/Ticket";
import EventDetails from "../EventDetails/EventDetails";

const Marketplace = ({ isLogin, setSignIn }) => {
  let navigate = useNavigate();
  const [orderToken, setOrderToken] = useState("");
  const [renderComponent, setRenderComponent] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [marketPlaceTicket, setMarketPlaceTicket] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);
  const [allTicketLength, setAllTicketLength] = useState();
  const [nftDialog, setNftDialog] = useState(false);
  const [events, setEvents] = useState(1);
  const [buyLoading, setBuyLoading] = useState(false);
  const [nftBuyIndex, setBuyNftIndex] = useState("");

  const [noFiltered, setNoFiltered] = useState(false);

  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");

  const [maticUSD, setMaticUSD] = useState("");

  const [payUsing, setPayUsing] = useState(false);
  const [tickId, setTickId] = useState(false);
  const [nftTransId, setNftTransId] = useState("");
  const [ticketSaleId, setTicketSaleId] = useState("");
  const [ticketMaticPrice, setTicketMaticPrice] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleChange1 = (event) => {
    setPrice(event.target.value);
  };
  const handleChange2 = (event) => {
    setLocation(event.target.value);
  };
  const handleBuy = (event) => {
    buyNft(event.saleId, event._id, event.nftRef, event.transaction[0].price);
  };
  // web3 instance
  const web3 = new Web3(Web3.givenProvider);
  var items;
  // pagination
  const getMarketplaceTicket = async (eventType) => {
    setLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/list-all-ticket-sale?type=${eventType}&category=${category}&location=${location}&limit=9&page=${currentPage}`,
      headers: {
        Authorization: `Bearer ${isLogin}`,
      },
    })
      .then((response) => {
        if (response && response.data && response.data?.data) {
          setAllEvents(response.data?.data[0]?.data);
          setMarketPlaceTicket(response.data?.data[0]?.data);
          setAllTicketLength(response.data?.data[0]?.data.length);

          setLoading(false);
        } else {
          setAllEvents([]);
          setMarketPlaceTicket("");
          setAllTicketLength(0);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  //metamask buy nft
  const buyNft = async (nftId, ticketId, nftRefId, price) => {
    setBuyLoading(true);
    setPayUsing(false);

    if (!window.ethereum) {
      setBuyLoading(false);
      window.alert("Please install metamask first or use card payment...");
      return;
    }
    if (!sessionStorage.getItem("token")) {
      setBuyLoading(false);
      setNftDialog(true);
      return;
    }

    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then(async (res) => {
        const walletAccount = await web3.eth.getAccounts();
        const gasPrice = await web3.eth.getGasPrice();

        const marketPlaceContract = new web3.eth.Contract(
          marketContractAbi,
          marketAddress
        );

        items = await marketPlaceContract.methods.idToMarketItem(nftId).call();
        // console.log(items, walletAccount);
        const es = await marketPlaceContract.methods
          .buyItem(items.itemId)
          .estimateGas({
            gas: 500000,
            from: walletAccount[0],
            value: items.price.toString(),
          });
        // console.log(es,'est');
        marketPlaceContract.methods
          .buyItem(items.itemId)
          .send({
            from: walletAccount[0],
            gas: es + 2 * 10 ** 5,
            value: items.price.toString(),
            gasPrice: gasPrice,
          })
          .then((res) => {
            //console.log(res);
            if (res?.transactionHash) {
              axios({
                method: "post",
                url: `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/buyNft`,
                headers: {
                  Authorization: `Bearer ${isLogin}`,
                  "Content-Type": "application/json",
                },
                data: JSON.stringify({
                  ticketID: ticketId,
                  txHash: res.transactionHash,
                }),
              })
                .then(function (response) {
                  //console.log(JSON.stringify(response.data));
                  // console.log("nftRefId ", nftRefId);
                  axios({
                    method: "post",
                    url: `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/update-nft-owner`,
                    headers: {
                      Authorization: `Bearer ${isLogin}`,
                      "Content-Type": "application/json",
                    },
                    data: JSON.stringify({
                      currentOwnerAddress: walletAccount[0],
                      id: nftRefId,
                      ticketId: ticketId,
                    }),
                  })
                    .then(function (response) {
                      // console.log(
                      //     JSON.stringify(response.data)
                      // );
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
                          buyer: walletAccount[0],
                        },
                      ],
                      ticketId: ticketId,
                      nftRef: nftRefId,
                      price: (
                        web3.utils.fromWei(price, "ether") * maticUSD
                      ).toFixed(6),
                    }),
                  })
                    .then(function (r) {
                      // console.log(JSON.stringify(r.data));
                    })
                    .catch(function (eer) {
                      console.log(eer);
                    });
                  setBuyLoading(false);
                  setMessageModalDesc("NFT Ticket Bought Successfully!");
                  setMessageModal(true);
                })
                .catch(function (error) {
                  //console.log(error);
                  setBuyLoading(false);
                  setMessageModal(true);
                  setMessageModalDesc("error");
                });
            }
          })
          .catch((err) => {
            //console.log(err);
            setBuyLoading(false);
            setMessageModal(true);
            setMessageModalDesc(err.message);
          });
      })
      .catch((err) => {
        console.log(err);
        setBuyLoading(false);
        setMessageModal(true);
        setMessageModalDesc(err.message);
      });

    // setBuyLoading(false);
  };

  const cbs = (data) => {
    if (data.order && data.order.status == "PAID") {
      //order is paid
      //verify order status by making an API call to your server
      // using data.order.orderId
      setBuyLoading(true);
      // console.log("Success");
      axios
        .post(`${process.env.REACT_APP_ADMIN_MINT}/buyitem`, {
          amount: ticketMaticPrice.toString(),
          // id: itemId, from blockchain
          id: ticketSaleId,
          network: 56,
        })
        .then((res) => {
          //console.log("createSale response--",res);
          if (res.data?.transactionHash) {
            var data = JSON.stringify({
              ticketID: tickId,
              txHash: res.transactionHash,
            });

            var config = {
              method: "post",
              url: `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/buyNft`,
              headers: {
                Authorization: isLogin,
                "Content-Type": "application/json",
              },
              data: data,
            };

            axios(config)
              .then(function (result) {
                //console.log(JSON.stringify(response.data));

                var dataA = JSON.stringify({
                  orderId: data.order.orderId,
                });

                var config = {
                  method: "post",
                  url: `${process.env.REACT_APP_BACKEND_URL}/payment/cashfree-verify`,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: dataA,
                };

                axios(config)
                  .then(function (response) {
                    setBuyLoading(false);

                    setMessageModalDesc(result.data.message);
                    setMessageModal(true);
                    setRenderComponent(false);
                  })
                  .catch(function (error) {
                    console.log(error);
                    setBuyLoading(false);
                  });
              })
              .catch(function (error) {
                //console.log(error);
                setBuyLoading(false);
                setMessageModal(true);
                setMessageModalDesc("error");
                setRenderComponent(false);
              });
          } else {
            setBuyLoading(false);
            setRenderComponent(false);
          }
        })
        .catch((err) => {
          // error 508 insufficient funds in wallet admin
          //console.log(err.response);
          setBuyLoading(false);
          setMessageModal(true);
          setMessageModalDesc("Error:508 Servor Error...");
          setRenderComponent(false);
        });
    } else {
      //order is still active and payment has failed
      console.log("failure");
      setRenderComponent(false);
      setMessageModal(true);
      setBuyLoading(false);
      setMessageModalDesc("Payment Error 110: Payment Failed...");
    }
  };
  const cbf = (data) => {
    setRenderComponent(false);
    setMessageModal(true);
    setBuyLoading(false);
    setMessageModalDesc("Payment Error 109: Payment Failed...");
  };
  const renderDropin = (resultOrderToken) => {
    if (resultOrderToken === "") {
      alert("Order Token is empty");
      return;
    }
    setRenderComponent(true);
    let parent = document.getElementById("drop_in_container");
    parent.innerHTML = "";
    // let cashfree = new cashfreeProd.Cashfree();
    let cashfree = new cashfreeProd.Cashfree();
    cashfree.initialiseDropin(parent, {
      orderToken: resultOrderToken,
      onSuccess: cbs,
      onFailure: cbf,
      components: ["order-details", "card", "netbanking", "upi"],
      style: {
        //to be replaced by the desired values
        backgroundColor: "#ffffff",
        color: "#f15a22",
        fontFamily: "Lato",
        fontSize: "14px",
        errorColor: "#ff0000",
        theme: "light", //(or dark)
      },
    });
  };
  const handleClose = () => {
    setNftDialog(false);
  };
  const createPay = async () => {
    const headers = {
      method: "POST",
      "Content-Type": "application/json",
    };
    setBuyLoading(true);
    let phone;
    if (phoneNumber) {
      phone = phoneNumber;
    } else if (JSON.parse(sessionStorage.getItem("user-data")).phoneNumber) {
      phone = JSON.parse(sessionStorage.getItem("user-data")).phoneNumber;
    }
    const userInfo = {
      email: JSON.parse(sessionStorage.getItem("user-data")).email,
      userId: JSON.parse(sessionStorage.getItem("user-data")).userId,
      phone: phone,
    };
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/payment/cashfree-get-order-token`,
        {
          ticketId: tickId,
          nftTransactionId: nftTransId,
          type: "marketplace",
          userInfo,
          saleId: ticketSaleId,
          network: 56,
        },
        headers
      )
      .then((response) => {
        setBuyLoading(false);
        return response.data;
      })
      .then((result) => {
        // console.log("result ", result);
        setOrderToken(result.orderToken);
        renderDropin(result.orderToken);
      })
      .catch((err) => {
        console.log(err);
        setBuyLoading(false);
        setMessageModal(true);
        setMessageModalDesc(
          "Your Ticket was not booked some error occurred, Please Try again"
        );
      });
  };
  const getAllTicket = async () => {
    try {
      setNoFiltered(false);
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/nft-transaction/get-all-ticket-on-sale?&limit=9&page=${currentPage}&location=${location}&category=${category}`
      );
      setAllEvents(response.data?.data[0]?.data);
      setMarketPlaceTicket(response.data?.data[0]?.data);
      setAllTicketLength(response.data?.data[0]?.data.length);
      setLoading(false);
      if (response.data?.data[0]?.data.length === 0) {
        setNoFiltered(true);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTicket();
  }, [currentPage, category, location]);

  useEffect(() => {
    if (events === 0) {
      setCurrentPage(1);
    } else if (events === 1) {
      setCurrentPage(1);
    }
  }, [events]);

  useEffect(() => {
    document.body.scrollTop = 0;
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr`
      )
      .then((res) => {
        setMaticUSD(res.data["matic-network"].inr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  let payRef2 = useRef();
  useEffect(() => {
    let handler = (event) => {
      if (
        payRef2 &&
        payRef2.current &&
        !payRef2.current.contains(event.target)
      ) {
        setRenderComponent(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  return (
    <div className="bg-[#E5E5E5] mt-[70px] pb-24 pt-8 px-24 screen18:px-12 screen3:px-8 screen7:px-0 screen7:pt-0 screen7:pb-0">
      <Helmet>
        <title>Marketplace</title>
      </Helmet>
      <MessageModal
        show={messageModal}
        setShow={setMessageModal}
        title={"Message"}
        message={messageModalDesc}
      />
      <PayUsingMarket
        payUsing={payUsing}
        setPayUsing={setPayUsing}
        // userTicketId={userTicketId}
        ticketId={tickId}
        nftBuyIndex={nftBuyIndex}
        buyNft={buyNft}
        ticketMaticPrice={ticketMaticPrice}
        createPay={createPay}
        setPhoneNumber={setPhoneNumber}
        phoneNumber={phoneNumber}
      />
      <BuyNftModal onClose={handleClose} open={nftDialog} />
      <div
        className={
          renderComponent ? "dropin-container-show" : "dropin-container-hide"
        }
      >
        <div
          ref={payRef2}
          className="dropin-parent"
          id="drop_in_container"
          style={{ minHeight: "600px" }}
        >
          Your component will come here
        </div>
      </div>
      {buyLoading && <FullLoading />}

      <div className="">
        <div className="w-full bg-[#ffffff8f] rounded-lg flex flex-col p-8 py-12 justify-center items-center">
          <span className="text-3xl screen7:text-left screen7:w-full font-semibold">
            Current Tickets & NFTs
          </span>
          <div className="flex gap-4 flex-wrap mt-8">
            <FormControl sx={{ width: "110px" }}>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={handleChange}>
                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={"Events"}>Events</MenuItem>
                <MenuItem value={"Movies"}>Movies</MenuItem>
                <MenuItem value={"Sports"}>Sports</MenuItem>
                <MenuItem value={"Plays"}>Plays</MenuItem>
                <MenuItem value={"Metaverse"}>Metaverse</MenuItem>
                <MenuItem value={"Conference"}>Conference</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "110px" }}>
              <InputLabel>Price</InputLabel>
              <Select value={price} label="Sort By" onChange={handleChange1}>
                <MenuItem value={"lowToHigh"}>Low to High</MenuItem>
                <MenuItem value={"highToLow"}>High to Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "110px" }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                label="Location"
                onChange={handleChange2}
              >
                <MenuItem value={"Dubai"}>Dubai</MenuItem>
                <MenuItem value={"Delhi"}>Delhi</MenuItem>
                <MenuItem value={"Bangalore"}>Bangalore</MenuItem>
                <MenuItem value={"Metaverse"}>Metaverse</MenuItem>
                <MenuItem value={"Current Location"}>Current Location</MenuItem>
              </Select>
            </FormControl>
          </div>
          {noFiltered ? (
            <div className="h-[300px] font-bold text-blue flex justify-center items-center">
              No results found...
            </div>
          ) : (
            <div className="grid grid-cols-3 screen3:grid-cols-2 screen12:grid-cols-1 gap-4 mt-8">
              {allEvents?.map((event) => (
                <div
                  onClick={() => {
                    if (
                      JSON.parse(sessionStorage.getItem("user-data")) &&
                      event.user !==
                        JSON.parse(sessionStorage.getItem("user-data")).userId
                    ) {
                      handleBuy(event);
                    } else {
                      if (JSON.parse(sessionStorage.getItem("user-data"))) {
                        navigate(
                          `/${event?.eventTitle}/ticket-detail/${event._id}`
                        );
                      } else {
                        setSignIn(true);
                      }
                    }
                  }}
                >
                  {event && event.EventDetails[0] && (
                    <Ticket
                      key={event.Event}
                      eventId={event.EventDetails[0]._id}
                      eventImg={
                        event.ticketType[0].hasOwnProperty("image")
                          ? event.ticketType[0].image
                          : event.EventDetails[0].eventImageOriginal
                      }
                      eventName={event.EventDetails[0].eventTitle}
                      eventDate={event.EventDetails[0].startDate}
                      endDate={event.EventDetails[0].endDate}
                      eventTime={event.EventDetails[0].startTime}
                      price={(
                        web3.utils.fromWei(
                          event.transaction[0].price,
                          "ether"
                        ) * maticUSD
                      ).toFixed(6)}
                      location={event.EventDetails[0].location}
                      qrCode={event.qrCode}
                      // organizer={event.}
                      ticketDate={event.ticketType[0].startDate}
                      ticketTime={event.ticketType[0].startTime}
                      ticketName={event.ticketType[0].ticketName}
                      ticketUser={event.user}
                      currency={event.ticketType[0]?.currency}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BuyNftModal = ({ onClose, open }) => {
  const navigate = useNavigate();
  return (
    <>
      <Dialog
        onClose={() => onClose()}
        open={open}
        PaperProps={{ style: { width: "400px", height: "300px" } }}
      >
        <div className="flex items-center gap-4 justify-center relative flex-col w-full h-full p-4">
          <div
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white"
          >
            <CloseIcon />
          </div>
          <h2 className="text-center">Login</h2>
          <span className="text-center">Please login to buy the ticket.</span>
          <button
            className="py-3 px-6 bg-BlueButton text-white text-lg rounded-lg"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default Marketplace;
