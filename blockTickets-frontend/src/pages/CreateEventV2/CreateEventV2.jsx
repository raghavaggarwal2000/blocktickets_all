import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { Helmet } from "react-helmet";
import Loading from "../../Loading/Loading";
import Steps from "../../components/CreateEventFormV2/Steps";
import { useForm, useFieldArray } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import dayjs from "dayjs";
import FullLoading from "../../Loading/FullLoading";
import { priceServices, EventCreatorServices } from "../../api/supplier";
import { toast } from "react-toastify";
import {
  NFTContractAbi,
  contractAddress,
  switchChain,
} from "../../utils/web3/web3.js";

const CreateEventV2 = ({ isLogin }) => {
  const navigate = useNavigate();
  const web3 = new Web3(
    Web3.givenProvider || process.env.REACT_APP_RPC_ENDPOINT
  );
  const currDate = new Date().toISOString();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  // default values
  const tickets = {
    ticketName: "",
    ticketQuantity: 100,
    ticketPrice: 100,
    undiscountedPrice: "",
    currency: "INR",
    flag: "",
    ticketInfo: "",
    saleStartDateTime: dayjs(currDate),
    saleEndDateTime: dayjs(currDate),
    ticketStartDateTime: dayjs(currDate),
    ticketEndDateTime: dayjs(currDate),
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tickets: [tickets],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tickets",
    control,
  });
  const addTicket = () => {
    append(tickets);
  };
  const deleteTicket = (idx) => {
    remove(idx);
  };
  useFormPersist("form", {
    watch,
    setValue,
    storage: window.localStorage, // default window.sessionStorage
  });

  const handleNext = async (data) => {
    if (activeStep === 4) {
      if (!window?.ethereum?.isMetaMask)
        return toast.error("Metamask not found! Please install metamask");
      try {
        setPageLoading(true);
        await createNow();
        setPageLoading(false);
      } catch (err) {
        toast.error(
          err?.message
            ? err?.message
            : err?.reponse?.data?.err
            ? err?.reponse?.data?.err
            : "Event creation error..."
        );
        setPageLoading(false);
      }
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
    );
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const stepsProps = {
    activeStep,
    setActiveStep,
    register,
    errors,
    steps,
    control,
    fields,
    append,
    remove,
    addTicket,
    deleteTicket,
    setValue,
    getValues,
    setLoading,
    setPageLoading,
    watch,
  };

  // web3

  const convertPriceToMatic = async (inrPrice) => {
    let price = await priceServices.maticPrice();
    price = inrPrice / price.data["matic-network"].inr;
    return web3.utils.toWei(Number(price).toFixed(18).toString());
  };
  const web3CreateEvent = async () => {
    await switchChain();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const sensitiveAccounts = await web3.eth.getAccounts();
    // newformData.append("organizerWalletAddress", sensitiveAccounts[0]);
    setValue("organizerWalletAddress", sensitiveAccounts[0]);
    const contract = new web3.eth.Contract(NFTContractAbi, contractAddress);
    // const gasPrice = await web3.eth.getGasPrice();
    const data = getValues();
    const eventObj = [
      "abc",
      (new Date(data.startDateTime).getTime() / 1000).toFixed(0),
      (new Date(data.endDateTime).getTime() / 1000).toFixed(0),
      0,
      accounts[0],
      0,
      5,
      false,
    ];
    let ticketObjArr = [];
    let addonObjArr = [];
    const tickets = data?.tickets;
    let idx = 0;
    for await (let ticket of tickets) {
      const maticPrice = await convertPriceToMatic(ticket?.ticketPrice);
      setValue(`tickets[${idx}].maticPrice`, maticPrice);
      // setValue(
      //   `tickets[${idx}].ticketPrice`,
      //   (ticket?.ticketPrice * 1.05).toFixed(2)
      // );

      ticketObjArr.push([
        ticket.ticketQuantity,
        ticket?.uri ? ticket?.uri : "",
        maticPrice.toString(),
        0,
        0,
        0,
      ]);
      for (let j = 0; j < ticket?.addOns?.length; j++) {
        const addon = ticket?.addOns[j];
        if (addon.addOnName !== "" && addon.uri !== "") {
          const addOn = [ticket.addOns[j].uri, 0, idx];
          addonObjArr.push(addOn);
        }
      }
      idx += 1;
    }
    const estimatedGas = await contract.methods
      .createEvent(eventObj, ticketObjArr, addonObjArr)
      .estimateGas({ from: accounts[0] }, function (error) {
        if (error) {
        }
      });

    const result = await contract.methods
      .createEvent(eventObj, ticketObjArr, addonObjArr)
      .send({
        from: accounts[0],
        gas: estimatedGas,
      });

    const val = await result.events.EventCreated.returnValues;
    const eventId = val.eventId;

    // setValue("eventId", val.eventId);
    // newformData.append("nftId", formData.nftId);
    for (let i = 0; i < tickets?.length; i++) {
      // ticketFieldInputList[i].nftId = val.ticketIds[i];
      setValue(`tickets[${i}].nftId`, val.ticketIds[i]);
    }

    // newformData.set("tickets", JSON.stringify(ticketFieldInputList));
    return { eventId };
  };
  // FINAL CREATION OF EVENT function
  const createNow = async () => {
    const val = await web3CreateEvent();
    const data = { ...getValues(), eventId: val.eventId };

    const res = await EventCreatorServices.createEvent(data, isLogin);

    toast.success("Event Created Successfully");
    navigate(
      res?.data?.data?.Event._id
        ? `/${res?.data?.data?.Event.eventTitle}/${res?.data?.data?.Event._id}`
        : "/"
    );
  };

  useEffect(() => {
    if (fields.length < 1) {
      return addTicket();
    }
    return () => {};
  }, []);

  return (
    <div className='min-h-screen bg-black pt-[100px] w-full   xs:px-4 md:px-[2rem] lg:px-[6rem] xl:[12rem] doubleXl:px-[18rem] '>
      <Helmet>
        <title>Create event form</title>
      </Helmet>
      {pageLoading && <FullLoading />}
      {activeStep !== 0 && (
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className='my-2 text-white text-sm font-bold border-orange bg-orange rounded-lg pb-1 px-3 py-2 hover:opacity-75'
        >
          Go back
        </button>
      )}
      <form
        onSubmit={handleSubmit(handleNext)}
        className='flex px-4 items-center justify-center flex-col border-[1px] border-borderMain'
      >
        <h2 className=' text-[1.75rem] text-silver ml-6 mr-1 mt-4 lg:ml-0 lg:mr-0 xl:mx-6 mb-[1.4rem]'>
          Create Event Form
        </h2>
        {loading ? <Loading /> : <Steps {...stepsProps} />}
        <div className='flex flex-row justify-between w-full md:w-1/4 items-center justify-center gap-2 py-4'>
          <button
            type='submit'
            className='w-full text-white border-orange bg-orange rounded-lg px-4 py-2 hover:opacity-75'
          >
            {activeStep === steps.length - 1
              ? activeStep === 3
                ? "Verify"
                : "Create event"
              : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventV2;
const steps = [
  "Organiser details",
  "Event information",
  "About performer",
  "Ticket information",
  "Summary",
];
