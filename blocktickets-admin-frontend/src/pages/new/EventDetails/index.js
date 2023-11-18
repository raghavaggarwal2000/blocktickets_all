import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import EventDetailsForm from "./EventDetailsForm";
import axios from "axios";
import Web3 from "web3";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Select,
  HelperText,
  Textarea,
} from "@windmill/react-ui";
import PageTitle from "../../../components/Typography/PageTitle";
import { BsPlus, BsPencil, BsTrash, BsEye } from "react-icons/bs";
import {
  EventServices,
  TicketServices,
  CreatorServices,
  uploadImage,
} from "../../../services/api-client";
import Details from "./Details";
import TableComp, { FreeTicketTableComp } from "../../../components/Table";
import Loading from "../../../components/new/Loading";
import toast from "react-hot-toast";
import useForm from "../../../hooks/useForm";
import validate from "../../../validations/ticketTypeValidationRules";
import { useHistory } from "react-router-dom";
import useQuery from "../../../hooks/useQuery";
import { v4 as uuid } from "uuid";
import { mergeDateTimeWithTimezoneOffset } from "../../../utils/demo/date";
import { abi } from "../../../utils/demo/abi";
import ArtistDetailsForm from "./ArtistDetailsForm";
import OrganizerDetailsForm from "./OrganizerDetailsForm";

const EventDetails = () => {
  const { eventId } = useParams();
  const ticketImageInputRef = useRef(null);
  const ticketSponsorImageInputRef = useRef(null);

  const history = useHistory();
  const {
    values,
    errors,
    setIsSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  } = useForm(submitForm, validate);
  const [addFromTemplate, setAddFromTemplate] = useState("");
  const [event, setEvent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState(""); // Modal type can be ADD EDIT VIEW DELETE
  const [addonModal, setAddonModal] = useState(false);
  const [updateTicket, setUpdateTicket] = useState();
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  const [updateTicketId, setUpdateTicketId] = useState();
  const [addons, setAddons] = useState([
    {
      addOnName: "",
      addOnInfo: "",
      image: "",
      uri: "",
      fileImage: "",
    },
  ]);

  const handleAddFromTemplate = (e) => {
    setAddFromTemplate(e.target.value);

    let tick = {};

    for (let i = 0; i < event?.TicketDetails?.length; i++) {
      if (event?.TicketDetails[i]?._id === e.target.value) {
        tick = event?.TicketDetails[i];
      }
    }

    setValues({
      ticketName: tick?.ticketName,
      ticketQuantity: tick?.ticketQuantity,
      basePrice: tick?.basePrice,
      price: tick?.price,
      visible: tick?.visible,
      currency: tick?.currency,
      startDate: new Date(tick?.startDate),
      endDate: new Date(tick?.endDate),
      ticketEventStartTime: tick?.ticketEventStartTime,
      ticketEventEndTime: tick?.ticketEventEndTime,
      startTime: tick?.startTime,
      endTime: tick?.endTime,
      ticketInfo: tick?.ticketInfo,
      ticketType: tick?.ticketType,
      flag: tick?.flag,
      undiscountedPrice: tick?.undiscountedPrice,
      ticketEventStartDate: tick?.ticketEventStartDate,
      ticketEventEndDate: tick?.ticketEventEndDate,
      color: tick?.color,
      ticketNftId: tick?.ticketNftId,
    });
  };
  // Used only to set form inputs to initial state after edit or add success
  let initialInputState = {
    ticketName: "",
    ticketQuantity: 0,
    basePrice: "",
    price: "",
    visible: "",
    currency: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    ticketInfo: "",
    ticketType: "",
  };

  const tableColumns = [
    {
      title: "Ticket Name",
      key: "ticketName",
    },
    {
      title: "Ticket Qty",
      key: "ticketQuantity",
    },
    {
      title: "Base Price",
      key: "basePrice",
    },
    {
      title: "Display Price",
      key: "displayPrice"
    },
    {
      title: "Visible",
      key: "visible",
    },
    {
      title: "Sold",
      key: "sold",
    },
    {
      title: "Actions",
      key: "actions",
    },
    {
      title: "Addons",
      key: "addons",
    },
  ];

  function submitForm() {
    if (modalType === "ADD") {
      addTicketToEvent();
    } else if (modalType === "EDIT") {
      editTicketType();
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setValues(initialInputState);
    setSelectedTicket("");
    setIsSubmitting(false);
    setErrors(false);
  }

  useEffect(() => {
    getEventById();
  }, []);

  // API FUNCTIONS
  const getEventById = async () => {
    try {
      setIsLoading(true);
      const response = await EventServices.getEventById({
        eventId: eventId,
      });
      setEvent(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };
  const verifyEvent = async (id) => {
    try {
      setIsLoading(true);
      const response = await CreatorServices.verifyEvent(id);
      toast.success(response.data?.msg);
      getEventById();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };
  const convertPriceToMatic = async (inrPrice) => {
    let price = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr`
    );
    price = inrPrice / price.data["matic-network"].inr;
    const web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_RPC_ENDPOINT
    );
    return web3.utils.toWei(Number(price).toFixed(18).toString());
  };
  const addTicketToEvent = async () => {
    try {
      setIsLoading(true);
      let ad = addons;

      const getMatic = await convertPriceToMatic(values.basePrice);
      const response = await TicketServices.addTicketType({
        ...values,
        Event: eventId,
        maticPrice: getMatic,
        ad,
      });
      if (response.status === 200) {
        setIsModalOpen(false);
        setValues(initialInputState);
        getEventById();
        toast.success("Ticket Added");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider);
    setWeb3(web3);
    const contract = new web3.eth.Contract(
      abi,
      process.env.REACT_APP_CONTRACT_ADDRESS
    );
    setContract(contract);
  }, []);

  const makeBlockchainStructureForTicket = async (priceInMatic) => {
    const ticketBlockchain = await contract.methods
      .idToTicketDetails(values.ticketNftId)
      .call();
    console.log(ticketBlockchain, "ticket blockchain");
    const ticket = [
      {
        totalSupply: values.ticketQuantity,
        uri: ticketBlockchain.uri,
        price: priceInMatic,
        bought: ticketBlockchain.bought,
        id: ticketBlockchain.id,
        eventId: ticketBlockchain.eventId,
      },
    ];

    const eventDetails = await contract.methods
      .idToEvent(ticketBlockchain.eventId)
      .call();
    const address = await web3.eth.getAccounts();
    await contract.methods
      .updatedEventDetais(
        eventDetails,
        ticket,
        [],
        ticketBlockchain.eventId,
        [values.ticketNftId],
        []
      )
      .send({
        from: address[0],
      });
  };

  const editTicketType = async () => {
    try {
      setIsLoading(true);

      let tick = {};

      for (let i = 0; i < event?.TicketDetails?.length; i++) {
        if (
          Number(event?.TicketDetails[i]?.ticketNftId) ===
          Number(values.ticketNftId)
        ) {
          tick = event?.TicketDetails[i];
        }
      }
      console.log(
        event?.TicketDetails,
        values.ticketNftId,
        values,
        tick,
        "info"
      );
      const getMatic = await convertPriceToMatic(values.basePrice);
      if (
        Number(values.basePrice) !== Number(tick.basePrice) ||
        Number(values.ticketQuantity) !== Number(tick.ticketQuantity)
      ) {
        await makeBlockchainStructureForTicket(getMatic);
      }
      console.log("event?.timezone:", event?.Event?.timezone);
      const response = await TicketServices.editTicketType(
        {
          ...values,
          Event: eventId,
          maticPrice: getMatic,
          basePrice: values.basePrice,
          startDate: mergeDateTimeWithTimezoneOffset(
            values?.startDate,
            values?.startTime
            // ,event?.Event?.timezone
          ),
          endDate: mergeDateTimeWithTimezoneOffset(
            values?.endDate,
            values?.endTime
            // ,event?.Event?.timezone
          ),
        },
        selectedTicket
      );
      if (response.status === 200) {
        setIsModalOpen(false);
        setValues(initialInputState);
        getEventById();
        toast.success("Ticket Updated");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error: ", error);
      setIsLoading(false);
      toast.error(
        error?.response?.data?.error
          ? error.response.data.error
          : error?.message
      );
    }
  };

  const deleteTicketType = async () => {
    try {
      setIsLoading(true);
      const response = await TicketServices.deleteTicketType(selectedTicket);
      if (response.status === 200) {
        setIsModalOpen(false);
        setValues(initialInputState);
        getEventById();
        toast.success("Ticket Deleted");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || error.response.data.error);
    }
  };

  const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  };

  const handleEditClick = (ticketDetails) => {
    setIsModalOpen(true);
    setModalType("EDIT");
    setValues(ticketDetails);
    setSelectedTicket(ticketDetails._id);
  };

  const handleAddModalClick = () => {
    setIsModalOpen(true);
    setModalType("ADD");
  };

  const handleDeleteClick = (ticketDetails) => {
    setValues(ticketDetails);
    setIsModalOpen(true);
    setModalType("DELETE");
    setSelectedTicket(ticketDetails._id);
  };

  const handlViewClick = (ticketDetails) => {
    setModalType("VIEW");
    setValues(ticketDetails);
    setIsModalOpen(true);
  };

  const handleAddonView = (ticket) => {
    setAddons(ticket?.addon);
    setAddonModal(true);
  };

  const handleAddAddonsClick = () => {
    setAddons((ad) => [
      ...ad,
      {
        addOnName: "",
        addOnInfo: "",
        image: "",
        uri: "",
        fileImage: "",
      },
    ]);
  };

  const handleAddonChange = async (e, childIndex, isImage) => {
    let newState;
    if (isImage) {
      newState = addons.map((obj, index) => {
        if (index === childIndex) {
          return {
            ...obj,
            [e.target.name]: e.target.files[0],
          };
        }
        return obj;
      });
    } else {
      newState = addons.map((obj, index) => {
        if (index === childIndex) {
          return {
            ...obj,
            [e.target.name]: isImage ? e.target.files[0] : e.target.value,
          };
        }
        return obj;
      });
    }

    setAddons(newState);
  };

  const updateTicketSponsorImage = async (e, name, info) => {
    try {
      setIsLoading(true);
      const res = await uploadImage(e, name || "", info || "");
      const formData = new FormData();
      formData.append("image", res?.s3_upload);
      const response = await EventServices.updateTicketSponsorImage(
        selectedTicket,
        formData
      );
      if (response.status === 200) {
        toast.success("Image uploaded");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data?.error
          ? error.response.data.error
          : error.message || "Bad Request!"
      );
      setIsLoading(false);
    }
  };

  // RENDER MODAL HEADER
  const renderModalHeader = () => {
    if (modalType === "ADD") {
      return "Add Ticket";
    } else if (modalType === "VIEW") {
      return "Ticket Details";
    } else if (modalType === "EDIT") {
      return "Edit Ticket Details";
    } else if (modalType === "DELETE") {
      return "Warning !!!";
    }
  };

  // MODAL FOOTER ACCORDING TO ADD EDIT DELETE VIEW
  const renderModalFooter = () => {
    if (modalType === "ADD") {
      return (
        <>
          <div className='hidden sm:block'>
            <Button layout='outline' onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className='hidden sm:block'>
            <Button onClick={submitForm}>Add</Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button block size='large' layout='outline' onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button block size='large' onClick={submitForm}>
              Add
            </Button>
          </div>
        </>
      );
    } else if (modalType === "VIEW") {
      return (
        <>
          <div className='hidden sm:block'>
            <Button layout='outline' onClick={closeModal}>
              Close
            </Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button block size='large' layout='outline' onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </>
      );
    } else if (modalType === "EDIT") {
      return (
        <>
          <div className='hidden sm:block'>
            <Button layout='outline' onClick={closeModal}>
              Close
            </Button>
          </div>
          <div className='hidden sm:block'>
            <Button onClick={editTicketType}>Save</Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button block size='large' layout='outline' onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button block size='large' onClick={editTicketType}>
              Save
            </Button>
          </div>
        </>
      );
    }
  };

  // MODAL BODY CONTENT BASED ON MODAL TYPE
  const renderModalContent = () => {
    return (
      <>
        <div className='px-4 py-3 mb-8 bg-white h-[200px] max-h-[200px] rounded-lg shadow-md dark:bg-gray-800 '>
          <Label className='mt-4'>
            <span>Add from template</span>
            <Select
              className='mt-1'
              name='addFromTemplate'
              id='addFromTemplate'
              onChange={handleAddFromTemplate}
              value={addFromTemplate}
              disabled={modalType === "VIEW" || modalType === "EDIT"}
            >
              <option value=''>Select a template</option>
              {event?.TicketDetails?.map((ticket) => {
                return (
                  <option key={ticket?._id} value={ticket?._id}>
                    {ticket?.ticketName}
                  </option>
                );
              })}
            </Select>
            <HelperText valid={!errors.visible}>{errors.visible}</HelperText>
          </Label>
          <Label className='mt-3'>
            <span>Ticket Name</span>

            <Input
              className='mt-1'
              name='ticketName'
              id='ticketName'
              placeholder='Enter Ticket Name'
              onChange={handleChange}
              value={values.ticketName}
              disabled={modalType === "VIEW"}
            />
            <HelperText valid={!errors.ticketName}>
              {errors.ticketName}
            </HelperText>
          </Label>
          <Label className='mt-3'>
            <span>Ticket Quantity</span>
            <Input
              type='number'
              className='mt-1'
              name='ticketQuantity'
              id='ticketQuantity'
              placeholder='Enter Ticket Qty'
              onChange={handleChange}
              value={values.ticketQuantity}
              disabled={modalType === "VIEW"}
            />
            <HelperText valid={!errors.ticketQuantity}>
              {errors.ticketQuantity}
            </HelperText>
          </Label>
          {modalType === "VIEW" && (
            <Label className='mt-3'>
              <span>Ticket Type</span>
              <Input
                className='mt-1'
                name='ticketType'
                id='ticketType'
                placeholder='Enter Ticket Type'
                onChange={handleChange}
                value={values.ticketType}
                // Always disabled
                disabled={modalType === "ADD" || modalType === "VIEW"}
              />
              <HelperText valid={!errors.ticketType}>
                {errors.ticketType}
              </HelperText>
            </Label>
          )}

          <Label className='mt-3'>
            <span>Base Price</span>
            <Input
              className='mt-1'
              name='basePrice'
              id='basePrice'
              placeholder='Enter Base Price'
              onChange={handleChange}
              value={values.basePrice}
              type='number'
              disabled={modalType === "VIEW"}
            />
            <HelperText valid={!errors.price}>{errors.price}</HelperText>
          </Label>

          <Label className='mt-3'>
            <span>Undiscounted Price</span>
            <Input
              className='mt-1'
              name='undiscountedPrice'
              id='undiscountedPrice'
              placeholder='Enter undiscounted ticket price'
              onChange={handleChange}
              value={values.undiscountedPrice}
              type='number'
              disabled={modalType === "VIEW"}
            />
            <HelperText valid={!errors.undiscountedPrice}>
              {errors.undiscountedPrice}
            </HelperText>
          </Label>
          <Label className='mt-4'>
            <span>Flag</span>
            <Select
              className='mt-1'
              name='flag'
              id='flag'
              onChange={handleChange}
              value={values.flag}
              disabled={modalType === "VIEW"}
            >
              <option value=''>Select a flag</option>
              <option value='Early Bird'>Early Bird</option>
              <option value='Bestseller'>Bestseller</option>
              <option value='Best Value'>Best Value</option>
              <option value='VIP'>VIP</option>
              <option value='Few left !'>Few left !</option>
              <option value='10% Off'>10% Off</option>
              <option value='20% Off'>20% Off</option>
              <option value='25% Off'>25% Off</option>
              <option value='30% Off'>30% Off</option>
              <option value='40% Off'>40% Off</option>
              <option value='50% Off'>50% Off</option>
            </Select>
            <HelperText valid={!errors.visible}>{errors.visible}</HelperText>
          </Label>

          <Label className='mt-4'>
            <span>Sold out</span>
            <Select
              className='mt-1'
              name='sold_out'
              id='sold_out'
              onChange={handleChange}
              value={values.sold_out}
              disabled={modalType === "VIEW"}
            >
              <option value='true'>True</option>
              <option value='false'>False</option>
            </Select>
            <HelperText valid={!errors.visible}>{errors.visible}</HelperText>
          </Label>

          <Label className='mt-4'>
            <span>Visible</span>
            <Select
              className='mt-1'
              name='visible'
              id='visible'
              onChange={handleChange}
              value={values.visible}
              disabled={modalType === "VIEW"}
            >
              <option value=''>Select</option>
              <option value='HIDDEN'>HIDDEN</option>
              <option value='VISIBLE'>VISIBLE</option>
            </Select>
            <HelperText valid={!errors.visible}>{errors.visible}</HelperText>
          </Label>
          {/* ['redDark','red','silver','gold','platinum','black'] */}
          <Label className='mt-4'>
            <span>Ticket color</span>
            <Select
              className='mt-1'
              name='color'
              id='color'
              onChange={handleChange}
              value={values.color}
              disabled={modalType === "VIEW"}
            >
              <option value=''>Select</option>
              <option value='redDark'>Red dark</option>
              <option value='red'>Red</option>
              <option value='silver'>Silver</option>
              <option value='gold'>Gold</option>
              <option value='platinum'>Platinum</option>
              <option value='black'>Black</option>
            </Select>
            <HelperText valid={!errors.color}>{errors.color}</HelperText>
          </Label>
          <br />
          <p className='mb-0'>Ticket sale time:</p>
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Start Date</span>
              <Input
                className='mt-1'
                type='date'
                id='startDate'
                name='startDate'
                value={values.startDate && values.startDate.split("T")[0]}
                onChange={handleChange}
                disabled={modalType === "VIEW"}
                min={new Date().toISOString().split("T")[0]}
              />
              <HelperText valid={!errors.startDate}>
                {errors.startDate}
              </HelperText>
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>End Date</span>
              <Input
                className='mt-1'
                type='date'
                id='endDate'
                name='endDate'
                value={values.endDate && values.endDate.split("T")[0]}
                onChange={handleChange}
                disabled={modalType === "VIEW"}
                min={new Date().toISOString().split("T")[0]}
              />
              <HelperText valid={!errors.endDate}>{errors.endDate}</HelperText>
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Start Time</span>
              <Input
                className='mt-1'
                type='time'
                id='startTime'
                name='startTime'
                value={values.startTime}
                onChange={handleChange}
                disabled={modalType === "VIEW"}
              />
              <HelperText valid={!errors.startTime}>
                {errors.startTime}
              </HelperText>
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>End Time</span>
              <Input
                className='mt-1'
                type='time'
                id='endTime'
                name='endTime'
                value={values.endTime}
                onChange={handleChange}
                disabled={modalType === "VIEW"}
              />
              <HelperText valid={!errors.endTime}>{errors.endTime}</HelperText>
            </Label>
          </div>

          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Event Start Date</span>
              <Input
                className='mt-1'
                type='date'
                id='ticketEventStartDate'
                name='ticketEventStartDate'
                value={
                  values.ticketEventStartDate &&
                  values.ticketEventStartDate.split("T")[0]
                }
                onChange={handleChange}
                disabled={modalType === "VIEW"}
                min={new Date().toISOString().split("T")[0]}
              />
              <HelperText valid={!errors.ticketEventStartDate}>
                {errors.ticketEventStartDate}
              </HelperText>
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>Event End Date</span>
              <Input
                className='mt-1'
                type='date'
                id='ticketEventEndDate'
                name='ticketEventEndDate'
                value={
                  values.ticketEventEndDate &&
                  values.ticketEventEndDate.split("T")[0]
                }
                onChange={handleChange}
                disabled={modalType === "VIEW"}
                min={new Date().toISOString().split("T")[0]}
              />
              <HelperText valid={!errors.ticketEventEndDate}>
                {errors.ticketEventEndDate}
              </HelperText>
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Ticket Event Start Time</span>
              <Input
                className='mt-1'
                type='time'
                id='ticketEventStartTime'
                name='ticketEventStartTime'
                value={values.ticketEventStartTime}
                onChange={handleChange}
                disabled={modalType === "VIEW"}
              />
              <HelperText valid={!errors.ticketEventStartTime}>
                {errors.ticketEventStartTime}
              </HelperText>
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>Ticket Event End Time</span>
              <Input
                className='mt-1'
                type='time'
                id='ticketEventEndTime'
                name='ticketEventEndTime'
                value={values.ticketEventEndTime}
                onChange={handleChange}
                disabled={modalType === "VIEW"}
              />
              <HelperText valid={!errors.ticketEventEndTime}>
                {errors.ticketEventEndTime}
              </HelperText>
            </Label>
          </div>

          <Label className='mt-4'>
            <span>Ticket Info</span>
            <textarea
              className='block w-full text-sm focus:outline-none dark:text-gray-300 form-input leading-5 focus:border-purple-400 dark:border-gray-600 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 mt-1'
              placeholder='Enter Ticket Info'
              id='ticketInfo'
              name='ticketInfo'
              onChange={handleChange}
              value={values.ticketInfo?.replace(/↵/g, "\n")}
              disabled={modalType === "VIEW"}
              rows={5}
              multiline
              fullWidth
            />
            <HelperText valid={!errors.ticketInfo}>
              {errors.ticketInfo}
            </HelperText>
          </Label>
          <Label className='mt-4 flex flex-col'>
            <span>Ticket Sponsor Image</span>
            <input
              ref={ticketSponsorImageInputRef}
              type='file'
              id='eventImageInput'
              name='image'
              onChange={(e) => {
                updateTicketSponsorImage(
                  e,
                  values?.ticketName,
                  values?.eventDescription
                );
              }}
              style={{ display: "none" }}
              accept='image/png, image/jpeg'
            />
            <Button
              className='mt-2'
              onClick={() => ticketSponsorImageInputRef.current.click()}
            >
              Replace ticket sponsor image
            </Button>
            <HelperText valid={!errors.ticketSponsorImage}>
              {errors.ticketSponsorImage}
            </HelperText>
          </Label>
          {modalType === "ADD" && (
            <div>
              <h2 className='mt-4 text-xl'>Addons</h2>
              {addons.map((addon, i) => {
                return (
                  <div key={uuid()}>
                    <div className='flex justify-between'>
                      <Label className='mt-4 mr-1 w-6/12'>
                        <span>Addon Name</span>
                        <Input
                          className='mt-1'
                          type='text'
                          id='addOnName'
                          name='addOnName'
                          value={addon.addOnName}
                          onChange={(e) => handleAddonChange(e, i)}
                          disabled={modalType === "VIEW"}
                        />
                        <HelperText valid={!errors.addOnName}>
                          {errors.addOnName}
                        </HelperText>
                      </Label>
                      <Label className='mt-4 ml-1 w-6/12'>
                        <span>Addon's Terms and Conditions</span>
                        <Input
                          className='mt-1'
                          type='text'
                          id='addOnInfo'
                          name='addOnInfo'
                          value={addon.addOnInfo}
                          onChange={(e) => handleAddonChange(e, i)}
                          disabled={modalType === "VIEW"}
                        />
                        <HelperText valid={!errors.addOnInfo}>
                          {errors.addOnInfo}
                        </HelperText>
                      </Label>
                    </div>
                    <div className='flex justify-between'>
                      <Label className='mt-4 ml-1 w-6/12'>
                        <span>
                          What does this addon include ? (Enter each point in a
                          separate line)
                        </span>
                        <textarea
                          className='block w-full text-sm focus:outline-none dark:text-gray-300 form-input leading-5 focus:border-purple-400 dark:border-gray-600 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 mt-1'
                          placeholder='Enter Ticket Info'
                          id='addOnInfo'
                          name='addOnInfo'
                          onChange={(e) => handleAddonChange(e, i)}
                          value={addon.addOnInfo?.replace(/↵/g, "\n")}
                          disabled={modalType === "VIEW"}
                          rows={5}
                          multiline
                          fullWidth
                        />

                        <HelperText valid={!errors.addOnInfo}>
                          {errors.addOnInfo}
                        </HelperText>
                      </Label>
                    </div>
                  </div>
                );
              })}
              <Button
                type='button'
                className='bg-BlueButton text-sm text-white rounded-md px-2 py-2 mr-2 mt-2'
                onClick={() => handleAddAddonsClick()}
              >
                Add Addons
              </Button>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderAddonModalContent = () => {
    return (
      <>
        <div className='px-4 py-3 mb-8 bg-white h-[200px] max-h-[200px] rounded-lg shadow-md dark:bg-gray-800 '>
          {addons &&
            addons?.map((addon, index) => {
              return (
                <div key={uuid()}>
                  <Label className='mt-3 flex flex-col'>
                    <span className='mb-2 mr-2 text-xl font-bold'>
                      {index + 1}. Addon Image
                    </span>
                    <img
                      src={addon?.image}
                      className='p-1 bg-white border rounded max-w-sm'
                    />
                  </Label>
                  <Label className='mt-2'>
                    <span className=' mr-2 text-xl font-bold'>Addon Name</span>
                    <span className=' mr-2 text-xl text-white'>
                      {addon?.addOnName}
                    </span>
                  </Label>
                  <Label className='mt-2'>
                    <span className=' mr-2 text-xl font-bold'>Addon Info</span>
                    <span className=' mr-2 text-xl text-white'>
                      {addon?.addOnName}
                    </span>
                  </Label>
                </div>
              );
            })}
        </div>
      </>
    );
  };
  let query = useQuery();
  const view = Boolean(query.get("view"));
  // Loading screen
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  const errorMessage = (message) => {
    return (
      <>
        <HelperText valid={!message}>{message}</HelperText>
      </>
    );
  };
  return (
    <>
      <Details
        getEventById={getEventById}
        setIsLoading={setIsLoading}
        eventDetails={event}
        verifyEvent={verifyEvent}
      />
      <hr className='my-8' />

      <div className="flex flex-col gap-3">
        <EventDetailsForm
          eventDetails={event}
          getEventById={getEventById}
          errorMessage={errorMessage}
        />
        <ArtistDetailsForm
          eventDetails={event}
          errorMessage={errorMessage}
          getEventById={getEventById}
        />
        <OrganizerDetailsForm
          eventDetails={event}
          errorMessage={errorMessage}
          getEventById={getEventById}
        />
      </div>

      <hr className='my-8' />

      {/* ========= Ticket Types table ========== */}
      <div className='flex flex-row justify-between align-middle mx-2'>
        <PageTitle>Event Tickets</PageTitle>
        <div className='flex flex-row items-center justify-center'>
          <Button
            className='my-5 mx-2'
            color='#fff'
            layout='outline'
            onClick={() => history.push(`/app/event/eventStats/${eventId}`)}
          >
            View Stats
          </Button>
          {!view && (
            <Button className='my-5' size='small' onClick={handleAddModalClick}>
              Add Ticket
              <BsPlus size={25} />
            </Button>
          )}
        </div>
      </div>

      <TableComp
        columns={tableColumns}
        tableData={event?.TicketDetails?.map((ticket) => {
          return {
            title: ticket.ticketName,
            ticketQuantity: ticket.ticketQuantity,
            basePrice: "₹ " + ticket.basePrice,
            displayPrice: "₹ " + ticket.price,
            visible: (
              <Badge
                type={ticket.visible === "VISIBLE" ? "success" : "neutral"}
              >
                {ticket.visible}
              </Badge>
            ),
            sold: ticket.sold,
            actions: (
              <>
                <Button
                  className='mx-1'
                  layout='outline'
                  size='small'
                  onClick={() => handlViewClick(ticket)}
                >
                  <BsEye fontWeight={"bolder"} size={16} color='#49A844' />
                </Button>
                {!view && (
                  <Button
                    className='mx-2'
                    layout='outline'
                    size='small'
                    onClick={() => handleEditClick(ticket)}
                  >
                    <BsPencil size={15} color='' />
                  </Button>
                )}
                {/* <Button
                  className="mx-2"
                  layout="outline"
                  size="small"
                  onClick={() => deleteTicketType(ticket)}
                >
                  deleteTicketType
                </Button> */}
              </>
            ),
            addons: (
              <Button
                className='mx-2'
                layout='outline'
                size='small'
                // onClick={() => handleAddonView(ticket)}
                onClick={() => handleAddonView(ticket)}
              >
                View Addons
              </Button>
            ),
          };
        })}
      />

      {/* ====== Modal Start ========= */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className='mt-2'>{renderModalHeader()}</ModalHeader>

        <ModalBody
          style={{ height: modalType === "DELETE" ? "" : "25rem" }}
          className='overflow-y-auto '
        >
          {renderModalContent(view)}
        </ModalBody>
        <ModalFooter>{renderModalFooter()}</ModalFooter>
      </Modal>

      {/* ====== Modal 2 Start ========= */}
      <Modal isOpen={addonModal} onClose={() => setAddonModal(false)}>
        <ModalHeader className='mt-2'>{renderModalHeader()}</ModalHeader>

        <ModalBody
          style={{ height: modalType === "DELETE" ? "" : "25rem" }}
          className='overflow-y-auto '
        >
          {renderAddonModalContent(view)}
        </ModalBody>
        <ModalFooter>{renderModalFooter()}</ModalFooter>
      </Modal>
      {/* ====== Modal End ========= */}

      <div className='flex flex-row justify-between align-middle mx-2'>
        <PageTitle>On the spot tickets</PageTitle>
        <div className='flex flex-row items-center justify-center'></div>
      </div>
      <GenerateFreeTickets
        freeTickets={event?.freeTickets}
        tickets={event?.TicketDetails}
        getEventById={getEventById}
        eventId={eventId}
      />
    </>
  );
};

export default EventDetails;

const GenerateFreeTickets = ({
  tickets,
  freeTickets,
  getEventById,
  eventId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const tableColumns = [
    {
      title: "S.No",
      key: "serialNo",
    },
    {
      title: "Ticket Type",
      key: "ticketType",
    },
    // {
    //   title: "Coupon code",
    //   key: "couponCode",
    // },
    {
      title: "Final Price",
      key: "finalPrice",
    },
    // {
    //   title: "Base Price",
    //   key: "basePrice",
    // },
    {
      title: "Count",
      key: "numFreeTickets",
    },
    {
      title: "Send To",
      key: "sendTo",
    },
    // {
    //   title: "First Name",
    //   key: "firstName",
    // },
    // {
    //   title: "Last Name",
    //   key: "lastName",
    // },
    // {
    //   title: "Reason",
    //   key: "reason",
    // },
    // {
    //   title: "Approved By",
    //   key: "approvedBy",
    // },

    // {
    //   title: "Generate",
    //   key: "generate",
    // },
    {
      title: "Created At",
      key: "timestamp",
    },
  ];
  const submitForm = async () => {
    console.log("values", values);
    try {
      if (!values.ticketType) {
        toast.dismiss();
        return toast.error("Please select a ticket");
      }
      if (!values.numFreeTicket) {
        toast.dismiss();
        return toast.error("Please enter number of tickets");
      }
      if (!values.sendToEmail) {
        toast.dismiss();
        return toast.error("Please enter an email to send the tickets to");
      }
      if (!values.reason) {
        toast.dismiss();
        return toast.error("Please state a reason");
      }

      setIsLoading(true);
      const sendTickets = await TicketServices.generateTicket({
        ...values,
        adminEmail: JSON.parse(sessionStorage.getItem("userDetails"))?.email,
        eventId,
      });
      console.log(sendTickets?.data);
      setIsLoading(false);
      toast.dismiss();
      toast.success("Tickets generated");
      await getEventById();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.dismiss();
      toast.error(err?.response?.data ? err?.response?.data : err.message);
    }
  };
  const {
    values,
    errors,
    setIsSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  } = useForm(submitForm, validate);
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  return (
    <FreeTicketTableComp
      handleChange={handleChange}
      columns={tableColumns}
      tickets={tickets}
      values={values}
      submitForm={submitForm}
      freeTickets={freeTickets}
    />
  );
};
