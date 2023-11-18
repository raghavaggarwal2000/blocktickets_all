import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Loading from "../../Loading/Loading";
import CollapseBar from "../../components/Collapse/Collapse";
import TicketBox from "../../components/TicketBox.v2/TicketBox";
import ApplyPromoCode from "../../components/ApplyPromoCode/ApplyPromoCode";
import {
  TicketServices,
  EventServices,
  UserServices,
} from "../../api/supplier";
import TicketBuyLoading from "../../Loading/TicketBuyLoading.js";
import MessageModal from "../../Modals/Message Modal/MessageModal.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useReactIpLocation from "react-ip-details";
const PurchaseTicket = ({ isLogin, setSignIn }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({});
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [showFullLoading, setShowFullLoading] = useState(false);
  const [payMessage, setPayMessage] = useState("Please Wait");
  const [renderComponent, setRenderComponent] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalDesc, setMessageModalDesc] = useState("");
  const [images, setImages] = useState({});
  const [eventName, setEventName] = useState("");
  const [fees, setFees] = useState({});
  const [event, setEvent] = useState("");
  const [promoCodeInfo, setPromoCodeInfo] = useState("");
  const [eventLayoutImage, setEventLayoutImage] = useState("");
  const { currency, ipResponse } = useReactIpLocation();
  const [ip, setIp] = useState("");
  const [ticketsID, setTicketsID] = useState([]);
  const params = useParams();

  const handleTicketIDChange = (id, quantity) => {
    const idx = id.toString();
    // ticketsID[idx] = quantity;
    setTicketsID((prev) =>({
      ...prev,
      [id]: quantity
    }));
  }
  const verifyCode = (code) => {
    const event_id = tickets[0]?.Event;
    if (!isLogin) return toast.error("Please login to apply promo code");
    if (!code) return toast.error("Please enter a valid promo code");
    TicketServices.verifyCode(code, event_id)
      .then((data) => {
        setLoading(false);
        if(ticketsID[data?.data?.info?.ticketType] === 0)
          throw new Error(`This Promo code is valid for ${data?.data?.info?.ticketName} only`);
        toast.dismiss();
        toast.success(data?.data?.msg);
        setPromoCodeInfo(data?.data?.info);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        toast.dismiss();
        toast.error(err?.response?.data || err.message);
        setPromoCodeInfo("");
      });
  };

  const getTickets = () =>
    TicketServices.ticketInfo(params.eventId)
      .then((tickets) => {
        setTickets(tickets?.data?.tickets);
        for (let i = 0; i < tickets?.data?.tickets.length; ++i) {
          handleTicketIDChange(tickets?.data?.tickets[i]._id, 0);
        }
        setImages(tickets?.data?.image);
        setEventName(tickets?.data?.eventName);
        setEvent({
          startDate: tickets?.data?.startDate,
          endDate: tickets?.data?.endDate,
        });
        setFees(tickets?.data?.fee);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });

  // const getEvent = () =>
  //   EventServices.getEventById({ eventId: params.eventId })
  //     .then((Event) => {
  //       setEventLayoutImage(Event?.eventLayoutImage);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //     });

  useEffect(() => {
    getTickets();
    // getEvent();
  }, []);
  useEffect(() => {
    setIp(ipResponse);
  }, [ipResponse]);

  const promoCodeProps = {
    register,
    errors,
    getValues,
    verifyCode,
    promoCodeInfo,
    setPromoCodeInfo,
    isLogin,
    setSignIn,
  };
  let payRef = useRef();

  return (
    <>
      <Helmet>
        <title>
          {eventName ? eventName + "/Ticket_info" : "Ticket Purchase"}
        </title>
      </Helmet>
      <div
        className={
          renderComponent
            ? "dropin-container-show flex-col"
            : "dropin-container-hide"
        }
      >
        <div className='top-[40px] bg-black/75 w-[380px] h-[21px] overflow-auto flex justify-end'>
          <CloseIcon
            className='cursor-pointer'
            fontSize='medium'
            sx={{ color: "#fa6400" }}
            onClick={() => setRenderComponent(false)}
          />
        </div>
        <div ref={payRef} className='dropin-parent' id='drop_in_container'>
          Your component will come here
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className='mt-[70px] relative bg-black min-h-screen h-auto'>
          <div className='bg-blackishGray border-2 border-borderMain xs:mx-4 md:mx-[2rem] lg:mx-[3rem] xl:mx-[6rem] doubleXl:mx-[18rem]'>
            <div className='overflow-hidden border-b-2 relative border-borderMain mx-auto'>
              <img
                className='mx-auto w-full hidden lg:block h-auto relative object-contain'
                src={images?.eventImage}
                alt='event-banner'
              />
              <img
                className='mx-auto w-full block lg:hidden max-h-[70vh] h-full inherit-position object-cover'
                src={images?.eventSquareImage}
                alt='event-banner'
              />
            </div>

            <TicketBox
              setSignIn={setSignIn}
              isLogin={isLogin}
              setMessageModal={setMessageModal}
              setMessageModalDesc={setMessageModalDesc}
              setRenderComponent={setRenderComponent}
              tickets={tickets}
              showFullLoading={showFullLoading}
              setShowFullLoading={setShowFullLoading}
              setPayMessage={setPayMessage}
              fees={fees}
              event={event}
              promoCodeInfo={promoCodeInfo}
              getValues={getValues}
              promoCode={<ApplyPromoCode {...promoCodeProps} />}
              ip={ip}
              eventId={params.eventId}
              eventLayoutImage={images?.seatingImage}
              ticketsID={ticketsID}
              setTicketsID={setTicketsID}
            // eventLayoutImage={eventLayoutImage}
            />
          </div>
          {showFullLoading && <TicketBuyLoading message={payMessage} />}
          <MessageModal
            show={messageModal}
            setShow={setMessageModal}
            message={messageModalDesc}
          />
        </div>
      )}
    </>
  );
};

export default PurchaseTicket;
