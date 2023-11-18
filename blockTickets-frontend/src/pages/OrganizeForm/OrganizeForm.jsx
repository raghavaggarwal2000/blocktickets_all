import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

import "./organize-form.css";

import LoadingModal from "../../Modals/Loading Modal/LoadingModal.jsx";
import MessageModal from "../../Modals/Message Modal/MessageModal.jsx";
//api
import { organizerFormSubmit } from "../../api/api-client.js";
import {priceServices} from "../../api/supplier";
import Web3 from "web3";
import {
    NFTContractAbi,
    contractAddress,
    switchChain,
} from "../../utils/web3/web3.js";
import { toast } from "react-toastify";
import FullLoading from "../../Loading/FullLoading"
//MODAL
const OrganizeForm = (props) => {
    let navigate = useNavigate();
    // document.body.scrollTop = 0;

    const [priceType, setPriceType] = useState(1);
    const [publishStatus, setPublishStatus] = useState(1);
    const [logoImage, setLogoImage] = useState("");
    const [modalTitle, setModalTitle] = useState("Loading");
    const [modalShow, setModalShow] = useState(false);
    const [messageModal, setMessageModal] = useState(false);
    const [messageModalDesc, setMessageModalDesc] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, seIsSubmit] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const web3 = new Web3(Web3.givenProvider);
    const [maticPrice,setMaticPrice] = useState(0);

    let axiosConfig = {
        headers: {
            "Content-Type":
                "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
    };

    const [formData, setFormData] = useState({
        experienceLevel: "",
        referral: "",
        teamSize: "",
        frequency: "",
        eventType: "",
        category: "",
        organizerName: "",
        aboutOrganizer: "",
        // event information
        eventTitle: "Event",
        startDate: new Date(),
        startTime: "12:00",
        endDate: new Date(),
        endTime: "05:00",
        nftId: "",
        eventDescription: "I am an Event",
        location: "Moon",
        image: "",
        uri: "",
        organizerWalletAddress: ''
        // ticket information
    });
    const [ticketFieldInputList, setTicketFieldInputList] = useState([
        {
            ticketName: "Ticket 1",
            ticketQuantity: "5000",
            price: "1",
            maticPrice: "",
            currency: "INR",
            ticketstartDate: new Date(),
            ticketstartTime: "05:00",
            ticketendDate: new Date(),
            ticketendTime: "07:00",
            ticketInfo: "I am an ticket",
            ticketCategory: "PAID",
            image: "",
            uri: "",
            nftId: "",
            addOns: [
                {
                    addOnName: "",
                    addOnInfo: "",
                    image: "",
                    uri: "",
                },
            ],
        },
    ]);

    const handleInputChange =  async (e, index) => {
        const { name, value } = e.target;
        const list = [...ticketFieldInputList];
        list[index][name] = value;

        if(name == 'price') {
            let inrPrice = Number(list[index][name])
            console.log("inrPrice ",inrPrice)
            list[index]['maticPrice'] = await convertPriceToMatic(inrPrice);
        }
        setTicketFieldInputList(list);
    };
    const handleRemoveClick = (index) => {
        const list = [...ticketFieldInputList];
        list.splice(index, 1);
        setTicketFieldInputList(list);
    };
    useEffect(() => {
        console.log("ticketFieldInputList ",ticketFieldInputList)
    },[ticketFieldInputList])
    const handleAddClick = () => {
        setTicketFieldInputList([
            ...ticketFieldInputList,
            {
                ticketName: "",
                ticketQuantity: "",
                price: "",
                maticPrice: "",
                currency: "",
                ticketstartDate: "",
                ticketstartTime: "",
                ticketendDate: "",
                ticketendTime: "",
                ticketEventStartDate:"",
                ticketEventStartTime:"",
                ticketEventEndDate:"",
                ticketEventEndTime:"",
                ticketInfo: "",
                ticketCategory: "PAID",
                image: "",
                uri: "",
                addOns: [
                    {
                        addOnName: "",
                        addOnInfo: "",
                        image: "",
                        uri: "",
                    },
                ],
            },
        ]);
    };
    const handleAddAddonsClick = (parentIndex) => {
        const newState = ticketFieldInputList.map((obj, index) => {
            if (index === parentIndex) {
                const newAddons = obj.addOns;
                newAddons.push({
                    addOnName: "",
                    addOnInfo: "",
                    image: "",
                    uri: "",
                });

                return { ...obj, addOns: newAddons };
            }

            return obj;
        });

        setTicketFieldInputList(newState);
    };
    const handleRemoveAddonsClick = (parentIndex, childIndex) => {
        const newState = ticketFieldInputList.map((obj, index) => {
            if (index === parentIndex) {
                const newAddons = obj.addOns;
                if (newAddons.length === 1) return obj;
                newAddons.splice(childIndex, 1);
                return { ...obj, addOns: newAddons };
            }

            return obj;
        });

        setTicketFieldInputList(newState);
    };
    const handleAddonChange = (e, parentIndex, childIndex) => {
        const newState = ticketFieldInputList.map((obj, index) => {
            if (index === parentIndex) {
                const newAddons = obj.addOns.map((addOn, i) => {
                    if (i === childIndex) {
                        return { ...addOn, [e.target.name]: e.target.value };
                    }
                    return addOn;
                });
                return { ...obj, addOns: newAddons };
            }

            return obj;
        });

        setTicketFieldInputList(newState);
    };

    // ------------

    const activePrice = (type) => {
        setPriceType(type);
    };
    const activeStatus = (status) => {
        setPublishStatus(status);
    };

    const handle = (e) => {
        const newData = { ...formData };
        newData[e.target.id] = e.target.value;
        setFormData(newData);
    };

    let newformData = new FormData();
    newformData.append("experienceLevel", formData.experienceLevel);
    newformData.append("referral", formData.referral);
    newformData.append("teamSize", formData.teamSize);
    newformData.append("frequency", formData.frequency);
    newformData.append("eventType", formData.eventType);
    newformData.append("category", formData.category);
    newformData.append("organizerName", formData.organizerName);
    newformData.append("aboutOrganizer", formData.aboutOrganizer);
    newformData.append("logo", logoImage);
    // event information
    newformData.append("eventTitle", formData.eventTitle);
    newformData.append("startDate", formData.startDate);
    newformData.append("startTime", formData.startTime);
    newformData.append("endDate", formData.endDate);
    newformData.append("endTime", formData.endTime);
    newformData.append("image", formData.image);
    newformData.append("location", formData.location);
    newformData.append("uri", formData.uri);
    newformData.append("eventDescription", formData.eventDescription);
    newformData.append("tickets", JSON.stringify(ticketFieldInputList));
    

    //setting the logo and event image in formdata
    const uploadLogo = (e) => {
        const image = e.target.files;
        setLogoImage(image[0]);
    };
    const uploadImage = async (e, name, info, item) => {
        try {
            setModalShow(true);
            setModalTitle("Uploading Image");
            const image = e.target.files[0];
            let NFTFormData = new FormData();
            NFTFormData.append("name", name);
            NFTFormData.append("description", info);
            NFTFormData.append("collection", "blocktickets");
            NFTFormData.append("nftType", "image");
            NFTFormData.append("image", image);
            await axios
                .post(
                    "https://backend.unicus.one/pinata_upload",
                    NFTFormData,
                    axiosConfig
                )
                .then(async (res) => {
                    console.log("res", res, NFTFormData);
                    const tokenHash = res.data;
                    const tokenUri =
                        "https://unicus.mypinata.cloud/ipfs/" + tokenHash;
                    item.uri = tokenUri;
                    await axios.get(tokenUri).then((val) => {
                        item.image = val.data.image;
                        console.log("imaged add", item);
                    });
                    setModalShow(false);
                })
                .catch(async (err) => {
                    console.log("err", err);
                    setFormErrors(true);
                    setModalShow(false);
                });
            setModalShow(false);
        } catch (err) {
            console.log("uploaderr", err);
            setModalShow(false);
        }
    };
    const validate = (validateData, validateTicketData) => {
        var errors = {};
        // const ticketError = [{}]
        // location: "",
        if (!validateData.experienceLevel) {
            errors.experienceLevel = "Experience Level is required";
        }
        if (!validateData.referral) {
            errors.referral = "Referral Level is required";
        }
        if (!validateData.frequency) {
            errors.frequency = "Frequency is required";
        }
        if (!validateData.eventType) {
            errors.eventType = "Event type is required";
        }
        if (!validateData.category) {
            errors.category = "Category is required";
        }
        if (!validateData.aboutOrganizer) {
            errors.aboutOrganizer = "About Organizer is required";
        }
        if (!validateData.eventTitle) {
            errors.eventTitle = "Event Title is required";
        }
        if (!validateData.organizerName) {
            errors.organizerName = "Organizer name is required";
        }
        if (!validateData.startDate) {
            errors.startDate = "Start Date and time is required";
        }
        if (!validateData.startTime) {
            errors.startTime = "Start time is required";
        }
        if (!validateData.endDate) {
            errors.endDate = "End Date and time is required";
        }
        if (!validateData.endTime) {
            errors.endTime = "End Time is required";
        }
        if (!validateData.eventDescription) {
            errors.eventDescription = "Event Description is required";
        }
        if (!validateData.location) {
            errors.location = "Event Location is required";
        }
        // if (!validateData.teamsize) {
        //     errors.teamSize = "Team size is required";
        // }

        if (!logoImage) {
            errors.logoImage = "Logo image is required";
        }
        let ticketErrorArr = [];
        //ticket validation

        for (let i = 0; i < 1; i++) {
            if (!ticketFieldInputList[i].ticketName) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].ticketQuantity) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].price) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].currency) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].ticketstartDate) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].ticketstartTime) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].ticketendDate) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].ticketendTime) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].ticketInfo) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
            if (!ticketFieldInputList[i].ticketCategory) {
                ticketErrorArr[i] = "Please fill all the details for ticket ";
            }
        }

        errors["ticketError"] = [...ticketErrorArr];
        errors = {};
        errors["ticketError"] = [];

        return errors;
    };

    const onSubmits = async (e) => {
        // validation of the form fields
        e.preventDefault();
        setFormErrors(validate(formData, ticketFieldInputList));
        seIsSubmit(true);
    };

    // //console.log(newformData);
    const web3CreateEvent = async () => {
        try {
            if (!window.ethereum) {
                toast.error("Install metamask");
            }
            await switchChain();
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const sensitiveAccounts = await web3.eth.getAccounts();
            console.log(accounts[0],"contractAddress",contractAddress);
            newformData.append("organizerWalletAddress", sensitiveAccounts[0]);
            const contract = new web3.eth.Contract(
                NFTContractAbi,
                contractAddress
            );
            const gasPrice = await web3.eth.getGasPrice();
            const data = formData;
            const eventObj = [
                "abc",
                (
                    new Date(data.startDate + " " + data.startTime).getTime() /
                    1000
                ).toFixed(0),
                (
                    new Date(data.endDate + " " + data.endTime).getTime() / 1000
                ).toFixed(0),
                0,
                accounts[0],
                0,
                5,
                false,
            ];
            console.log(" eventObj ",eventObj)
            let ticketObjArr = [];
            let addonObjArr = [];
            const tickets = ticketFieldInputList;
            for (let i = 0; i < tickets.length; i++) {
                const ticket = tickets[i];
                console.log("while ticket", ticket);
                ticketObjArr.push([
                    ticket.ticketQuantity,
                    ticket.uri,
                    (ticket.maticPrice.toString()),
                    0,
                    0,
                    0,
                ]);

                for (let j = 0; j < ticket.addOns.length; j++) {
                    const addon = ticket.addOns[j];
                    if (addon.addOnName != "" && addon.uri != "") {
                        const addOn = [ticket.addOns[j].uri, 0, i];
                        addonObjArr.push(addOn);
                    }
                }
            }
            console.log("tickeObj", eventObj, ticketObjArr, addonObjArr);

            // const estimatedGas = await contract.methods
            //     .createEvent(eventObj, ticketObjArr, addonObjArr)
            //     .estimateGas(
            //         { gas: 3000000, from: accounts[0], gasPrice: gasPrice },
            //         function (error) {
            //             if (error) {
            //                 console.log(error);
            //             }
            //         }
            //     );
            // console.log(estimatedGas);
            const result = await contract.methods
                .createEvent(eventObj, ticketObjArr, addonObjArr)
                .send({
                    from: accounts[0],
                    gas: 8*10**6,
                    gasPrice: gasPrice,
                });
            console.log("results", result);
            const val = result.events.EventCreated.returnValues;
            formData.nftId = val.eventId;
            console.log("nftid", formData.nftId);
            newformData.append("nftId", formData.nftId);
            // setFormData({...form})
            for (let i = 0; i < tickets.length; i++) {
                ticketFieldInputList[i].nftId = val.ticketIds[i];
            }
            console.log("ticketsNftId", ticketFieldInputList);
            newformData.set("tickets", JSON.stringify(ticketFieldInputList));
            return result.events.EventCreated.returnValues;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const getMaticPrice = async () => {
        try {
            const res = await priceServices.maticPrice();
            console.log("res ",res.data['matic-network'].inr);
            setMaticPrice(res.data['matic-network'].inr)
        }
        catch(err) {
            console.log(err);
        }
    }

     const convertPriceToMatic = async (inrPrice) => {
        let price = await priceServices.maticPrice();
        price = inrPrice / price.data["matic-network"].inr;
        const web3 = new Web3(
            Web3.givenProvider || process.env.REACT_APP_RPC_ENDPOINT
        );
        console.log("0200292 ",price)
        return web3.utils.toWei((Number(price).toFixed(18)).toString());
    };
    useEffect(async () => {
        console.log(formErrors);
        //console.log(isSubmit);
        if (
            formErrors["ticketError"]?.length === 0 &&
            Object.keys(formErrors)?.length === 1 &&
            isSubmit
        ) {
            setSubmitError(false);
            //console.log("SUBMITTING...");
            setModalShow(true);
            setModalTitle("Creating Event");

            await web3CreateEvent()
                .then(async (val) => {
                    console.log("val", val, val == null);
                    if (val != null) {
                        for (var pair of newformData.entries()) {
                            console.log(pair[0] + ", " + pair[1]);
                        }
                        const res = await organizerFormSubmit(
                            newformData,
                            props.isLogin
                        );
                        if (res.status === 200) {
                            setMessageModalDesc("Event Created Successfully");
                            setMessageModal(true);
                        }
                    } else {
                        setMessageModalDesc("Some Error Occured...");
                        setMessageModal(true);
                        return;
                    }
                })
                .catch((err) => {
                    setMessageModalDesc("Some Error Occured...");
                    setMessageModal(true);
                    return;
                });

            setModalShow(false);
        } else if (isSubmit) {
            setSubmitError(true);
        }
    }, [formErrors]);

    useEffect(() => {
        document.body.scrollTop = 0;
        getMaticPrice();
    }, []);

    if (
        !props.isLogin &&
        !sessionStorage.getItem("user-data") &&
        (!sessionStorage.getItem("user-data")?.userType !== 1 ||
            !sessionStorage.getItem("user-data")?.userType !== 2)
    ) {
        toast.error("Please register as event creator to access this page!");
        return <Navigate to="/" />;
    }
    return (
        // if (!props.isLogin && !sessionStorage.getItem("user-data")) {
        //     return <Navigate to="/" />;
        // }
        <>
            <Helmet>
                <title>BlockTickets | Organizer Form</title>
            </Helmet>
            {/* <LoadingModal visibility={modalShow} title={modalTitle} /> */}
            {
              modalShow && <FullLoading />
            }
            <MessageModal
                show={messageModal}
                setShow={setMessageModal}
                title={"Message"}
                message={messageModalDesc}
            />

            {/* <img src={hexaOrange} alt="" className="org-hexa-orange" />
            <img src={blueTriangle} alt="" className="org-blue-triangle" />
            <img src={hexaYellow} alt="" className="org-hexa-yellow" />
            <img src={hexaGrey} alt="" className="org-hexa-grey" />
            <img src={hexaYellow} alt="" className="org-hexa-yellow-2" />
            <img src={starGrey} alt="" className="org-star-grey" /> */}

            <div className="mt-[70px] mb-12 flex justify-center">
                {/* <div className="organize-form-heading">
                    <h2>Add new event</h2>
                    <p>Add new event and manage there ticket selling</p>
                </div> */}
                <div className="max-w-[800px]">
                    <div className="px-8">
                        <h1 className="mt-8 font-semibold">Add New Event</h1>
                        <span className="font-medium text-xs text-[#707a83]">
                            <span className="text-[#dc4437]">*</span> Required
                            fields
                        </span>
                        <form onSubmit={(e) => onSubmits(e)} className="">
                            {/* Basic Info Container */}
                            <div className="fc-basic-info">
                                <h2 className="text-blue mb-4 text-xl font-semibold">
                                    Basic Info about Organizer
                                </h2>
                                <div className="form-container-input">
                                    <div className="fci-t-a">
                                        <label htmlFor="experienceLevel">
                                            What's your level of experience
                                            hosting events?
                                            <span>*</span>
                                        </label>
                                        <select
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            value={formData.experienceLevel}
                                            onChange={handle}
                                            name="experience"
                                            id="experienceLevel"
                                        >
                                            <option value="">
                                                Select your experience
                                            </option>
                                            <option value="1">One Years</option>
                                            <option value="2">Two Years</option>
                                            <option value="3">
                                                Three Years
                                            </option>
                                        </select>
                                        {formErrors &&
                                            formErrors.experienceLevel && (
                                                <p className="field-error">
                                                    *
                                                    {formErrors.experienceLevel}
                                                </p>
                                            )}
                                    </div>

                                    <div className="fci-t-a">
                                        <label htmlFor="referral">
                                            How did you first hear about
                                            Blocktickets?
                                            <span>*</span>
                                        </label>
                                        <select
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            value={formData.referral}
                                            onChange={handle}
                                            name="referral"
                                            id="referral"
                                        >
                                            <option value="">
                                                Select an option
                                            </option>
                                            <option value="friend">
                                                Friend
                                            </option>
                                            <option value="Social Media">
                                                Social Media
                                            </option>
                                            <option value="Advertisement">
                                                Advertisement
                                            </option>
                                        </select>
                                        {formErrors && formErrors.referral && (
                                            <p className="field-error">
                                                *{formErrors.referral}
                                            </p>
                                        )}
                                    </div>
                                    <div className="fci-t-a">
                                        <label htmlFor="teamSize">
                                            How many people help plan your
                                            events online?
                                            <span>*</span>
                                        </label>
                                        <select
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            value={formData.teamSize}
                                            onChange={handle}
                                            name="teamSize"
                                            id="teamSize"
                                        >
                                            <option value="">
                                                Select Team Size
                                            </option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                            <option value="4">Four</option>
                                            <option value="More than 4">
                                                More than 4
                                            </option>
                                        </select>
                                        {formErrors && formErrors.teamSize && (
                                            <p className="field-error">
                                                *{formErrors.teamSize}
                                            </p>
                                        )}
                                    </div>
                                    <div className="fci-t-a">
                                        <label htmlFor="frequency">
                                            How often do you plan to host
                                            events?
                                            <span>*</span>
                                        </label>
                                        <select
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            value={formData.frequency}
                                            onChange={handle}
                                            name="frequency"
                                            id="frequency"
                                        >
                                            <option value="">
                                                Select frequency
                                            </option>
                                            <option value="1">One </option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                        {formErrors && formErrors.frequency && (
                                            <p className="field-error">
                                                *{formErrors.frequency}
                                            </p>
                                        )}
                                    </div>
                                    <div className="fci-t-a">
                                        <label htmlFor="eventType">
                                            What type of event are you hosting
                                            today?
                                            <span>*</span>
                                        </label>
                                        <select
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            value={formData.eventType}
                                            onChange={handle}
                                            name="eventType"
                                            id="eventType"
                                        >
                                            <option value="">
                                                Select type
                                            </option>

                                            <option value="Movies">
                                                Movies
                                            </option>
                                            <option value="Events">
                                                Events
                                            </option>
                                            <option value="Sports">
                                                Sports
                                            </option>
                                            <option value="Plays">Plays</option>
                                            <option value="Metaverse">
                                                Metaverse
                                            </option>
                                            <option value="Conference">
                                                Conference
                                            </option>
                                        </select>
                                        {formErrors && formErrors.eventType && (
                                            <p className="field-error">
                                                *{formErrors.eventType}
                                            </p>
                                        )}
                                    </div>
                                    <div className="fci-t-a">
                                        <label htmlFor="category">
                                            How would you categorize this event?{" "}
                                            <span>*</span>
                                        </label>
                                        <select
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            value={formData.category}
                                            onChange={handle}
                                            name="category"
                                            id="category"
                                        >
                                            <option value="">
                                                Select your category
                                            </option>
                                            <option value="Sports">
                                                Sports
                                            </option>
                                            <option value="Movies">
                                                Movies
                                            </option>
                                            <option value="Events">
                                                Theatre
                                            </option>
                                            <option value="Activities">
                                                Activities
                                            </option>
                                            <option value="Metaverse">
                                                Metaverse
                                            </option>
                                            <option value="Conference">
                                                Conference
                                            </option>
                                        </select>
                                        {formErrors && formErrors.category && (
                                            <p className="field-error">
                                                *{formErrors.category}
                                            </p>
                                        )}
                                    </div>

                                    <div className="fci-t-b">
                                        <label htmlFor="organizerName">
                                            Organizer Name<span>*</span>
                                        </label>
                                        <input
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            placeholder="Your Name"
                                            type="text"
                                            id="organizerName"
                                            name="organizerName"
                                            value={formData.organizerName}
                                            onChange={handle}
                                        />
                                        {/* <TextInput title={'Organizer Name'} placeholder={'Your Name'} required /> */}
                                        {formErrors &&
                                            formErrors.organizerName && (
                                                <p className="field-error">
                                                    *{formErrors.organizerName}
                                                </p>
                                            )}
                                    </div>

                                    <div className="fci-t-b">
                                        <label htmlFor="logo">
                                            Logo<span>*</span>
                                        </label>
                                        <input
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            placeholder="Upload organizer logo"
                                            type="file"
                                            id="logo"
                                            name="logo"
                                            onChange={(e) => {
                                                uploadLogo(e);
                                            }}
                                        />
                                        {formErrors && formErrors.logoImage && (
                                            <p className="field-error">
                                                *{formErrors.logoImage}
                                            </p>
                                        )}
                                    </div>

                                    <div className="fci-t-b about-organizer">
                                        <label htmlFor="aboutOrganizer">
                                            About Organizer<span>*</span>
                                        </label>
                                        <input
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            placeholder="Enter about organizer"
                                            type="text"
                                            id="aboutOrganizer"
                                            name="aboutOrganizer"
                                            value={formData.aboutOrganizer}
                                            onChange={handle}
                                        />
                                        {formErrors &&
                                            formErrors.aboutOrganizer && (
                                                <p className="field-error">
                                                    *{formErrors.aboutOrganizer}
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Event info */}
                            <div className="fc-event-info">
                                <h2 className="text-blue pt-4 mb-4 text-xl font-semibold">
                                    Event Info
                                </h2>
                                <div className="fc-ei-container">
                                    <div className="eic-1 eic-basic">
                                        <label htmlFor="eventTitle">
                                            Event Title<span>*</span>
                                        </label>
                                        <input
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            placeholder="Enter about organizer"
                                            type="text"
                                            id="eventTitle"
                                            name="eventTitle"
                                            value={formData.eventTitle}
                                            onChange={handle}
                                        />
                                        {formErrors &&
                                            formErrors.eventTitle && (
                                                <p className="field-error">
                                                    *{formErrors.eventTitle}
                                                </p>
                                            )}
                                    </div>
                                    <div className="eic-2 eic-basic">
                                        <label htmlFor="startDate">
                                            Date and time<span>*</span>
                                        </label>

                                        {formErrors && formErrors.startDate && (
                                            <p className="field-error">
                                                *{formErrors.startDate}
                                            </p>
                                        )}
                                        <div>
                                            <input
                                                className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                type="date"
                                                id="startDate"
                                                placeholder="Start Date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handle}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <input
                                                className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                type="time"
                                                id="startTime"
                                                name="startTime"
                                                placeholder="Start Time"
                                                value={formData.startTime}
                                                onChange={handle}
                                            />
                                        </div>
                                        {formErrors && formErrors.endDate && (
                                            <p className="field-error">
                                                *{formErrors.endDate}
                                            </p>
                                        )}
                                        <div>
                                            <input
                                                className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                placeholder="End Date"
                                                value={formData.endDate}
                                                onChange={handle}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <input
                                                className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                type="time"
                                                id="endTime"
                                                name="endTime"
                                                placeholder="End Time"
                                                value={formData.endTime}
                                                onChange={handle}
                                            />
                                        </div>
                                    </div>
                                    <div className="eic-3 eic-basic">
                                        <label>
                                            Event Cover Image<span>*</span>
                                        </label>
                                        <p>
                                            This is the first image attendees
                                            will see at the top of your listing.
                                            Use a high quality image:
                                            2160x1080px (2:1 ratio).
                                        </p>
                                        <div className="relative h-fit">
                                            <input
                                                className="bg-white border-1 mt-2 !border-LightColor w-full rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                placeholder="Drag & drop or click to add Event cover
                                    image"
                                                type="file"
                                                id="eventImage"
                                                name="eventImage"
                                                onChange={(e) => {
                                                    uploadImage(
                                                        e,
                                                        formData.eventTitle,
                                                        formData.eventDescription,
                                                        formData
                                                    );
                                                }}
                                            />
                                            {/* <img className="event-image" src="https://images.unsplash.com/photo-1643144890122-a5b454d64681?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Event image"/> */}
                                            {formErrors &&
                                                formErrors.eventImage && (
                                                    <p className="field-error">
                                                        *{formErrors.eventImage}
                                                    </p>
                                                )}
                                            {/* https */}
                                        </div>
                                    </div>
                                    <div className="eic-4 eic-basic">
                                        <label htmlFor="eventDescription">
                                            Event description<span>*</span>
                                        </label>
                                        <input
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            placeholder="Enter event description and highlights"
                                            type="text"
                                            id="eventDescription"
                                            name="eventDescription"
                                            value={formData.eventDescription}
                                            onChange={handle}
                                        />
                                        {formErrors &&
                                            formErrors.eventDescription && (
                                                <p className="field-error">
                                                    *
                                                    {
                                                        formErrors.eventDescription
                                                    }
                                                </p>
                                            )}
                                    </div>
                                    <div className="eic-5 eic-basic">
                                        <label htmlFor="eventDescription">
                                            Event Location<span>*</span>
                                        </label>
                                        <input
                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                            placeholder="Enter event city"
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handle}
                                        />
                                        {formErrors && formErrors.location && (
                                            <p className="field-error">
                                                *{formErrors.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Info */}
                            <div className="fc-ticket-info">
                                <h2 className="text-blue pt-4 mb-4 text-xl font-semibold">
                                    Ticket Info
                                </h2>
                                <div className="flex gap-2 mb-2">
                                    <div
                                        className={
                                            priceType === 1
                                                ? "bg-BlueButton text-white rounded-md px-3 py-2 cursor-pointer"
                                                : "bg-GreyButton text-blue rounded-md px-3 py-2 cursor-pointer"
                                        }
                                        onClick={() => activePrice(1)}
                                    >
                                        Paid
                                    </div>
                                    <div
                                        className={
                                            priceType === 2
                                                ? "bg-BlueButton text-white rounded-md px-3 py-2 cursor-pointer"
                                                : "bg-GreyButton text-blue rounded-md px-3 py-2 cursor-pointer"
                                        }
                                        onClick={() => activePrice(2)}
                                    >
                                        Free
                                    </div>
                                    <div
                                        className={
                                            priceType === 3
                                                ? "bg-BlueButton text-white rounded-md px-3 py-2 cursor-pointer"
                                                : "bg-GreyButton text-blue rounded-md px-3 py-2 cursor-pointer"
                                        }
                                        onClick={() => activePrice(3)}
                                    >
                                        Donation
                                    </div>
                                </div>
                                {ticketFieldInputList &&
                                    ticketFieldInputList.map((x, i) => {
                                        return (
                                            <div
                                                className="fc-ti-container mb-2"
                                                key={i + "ticketinputfield"}
                                            >
                                                <div className="fc-tic-2 eic-basic">
                                                    <label htmlFor="ticketName">
                                                        Ticket Title
                                                        <span>*</span>
                                                    </label>
                                                    <input
                                                        className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                        placeholder="Enter ticket name"
                                                        type="text"
                                                        id="ticketName"
                                                        name="ticketName"
                                                        value={x.ticketName}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="fc-tic-3 eic-basic">
                                                    <label htmlFor="ticketQuantity">
                                                        Ticket quantity
                                                        <span>*</span>
                                                    </label>
                                                    <input
                                                        className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                        placeholder="Enter ticket quantity"
                                                        type="text"
                                                        id="ticketQuantity"
                                                        name="ticketQuantity"
                                                        value={x.ticketQuantity}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="fc-tic-4 eic-basic">
                                                    <label htmlFor="price">
                                                        Per ticket price
                                                        <span>*</span>
                                                    </label>
                                                    <input
                                                        className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                        placeholder="Per ticket price"
                                                        type="text"
                                                        id="price"
                                                        name="price"
                                                        value={x.price}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="fc-tic-5 ">
                                                    <label htmlFor="currency">
                                                        Select currency
                                                        <span>*</span>
                                                    </label>
                                                    <select
                                                        className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                        value={x.currency}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        name="currency"
                                                        id="currency"
                                                    >
                                                        <option value="">
                                                            Select currency
                                                        </option>
                                                        <option value="INR">
                                                            INR
                                                        </option>
                                                        {/* <option value="EUR">EUR</option>
                                            <option value="INR">INR</option> */}
                                                    </select>
                                                </div>
                                                <div className="fc-tic-6">
                                                    <label htmlFor="ticketstartDate">
                                                        Sale Date and time
                                                        <span>*</span>
                                                    </label>
                                                    <div>
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="date"
                                                            id="ticketstartDate"
                                                            placeholder="Start Date"
                                                            name="ticketstartDate"
                                                            value={
                                                                x.ticketstartDate
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="time"
                                                            id="ticketstartTime"
                                                            name="ticketstartTime"
                                                            value={
                                                                x.ticketstartTime
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="date"
                                                            id="ticketendDate"
                                                            name="ticketendDate"
                                                            value={
                                                                x.ticketendDate
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="time"
                                                            id="ticketendTime"
                                                            name="ticketendTime"
                                                            value={
                                                                x.ticketendTime
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="fc-tic-7">
                                                    <label htmlFor="ticketstartDate">
                                                        Ticket Date and time
                                                        <span>*</span>
                                                    </label>
                                                    <div>
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="date"
                                                            id="ticketEventStartDate"
                                                            placeholder="Start Date"
                                                            name="ticketEventStartDate"
                                                            value={
                                                                x.ticketEventStartDate
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="time"
                                                            id="ticketEventStartTime"
                                                            name="ticketEventStartTime"
                                                            value={
                                                                x.ticketEventStartTime
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="date"
                                                            id="ticketEventEndDate"
                                                            name="ticketEventEndDate"
                                                            value={
                                                                x.ticketEventEndDate
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            type="time"
                                                            id="ticketEventEndTime"
                                                            name="ticketEventEndTime"
                                                            value={
                                                                x.ticketEventEndTime
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="fc-tic-10 eic-basic">
                                                    <label htmlFor="ticketInfo">
                                                        About this ticket
                                                        <span>*</span>
                                                    </label>
                                                    <textarea
                                                        className="bg-white border-1 mt-2 !border-LightColor resize-none rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                        placeholder="Enter information about this ticket"
                                                        type="text"
                                                        id="ticketInfo"
                                                        rows="3"
                                                        name="ticketInfo"
                                                        value={x.ticketInfo}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="imgInput eic-basic mb-6">
                                                    <label>
                                                        Ticket image
                                                        <span>*</span>
                                                    </label>
                                                    <div className="relative h-fit">
                                                        <input
                                                            className="bg-white border-1 mt-2 !border-LightColor w-full rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                            placeholder="Drag & drop or click to add Ticket cover image"
                                                            type="file"
                                                            id="ticketImage"
                                                            name="ticketImage"
                                                            onChange={(e) =>
                                                                uploadImage(
                                                                    e,
                                                                    x.ticketName,
                                                                    x.ticketInfo,
                                                                    x
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="addOnBox flex flex-col gap-6">
                                                    <h2 className="text-blue pt-4 m-0 text-lg font-semibold">
                                                        Addons Nft
                                                    </h2>

                                                    {x.addOns.map(
                                                        (addon, index) => (
                                                            <div
                                                                key={
                                                                    index +
                                                                    "addonsMap"
                                                                }
                                                                className="grid grid-cols-2 gap-x-4 gap-y-2"
                                                            >
                                                                <div className="eic-basic">
                                                                    <label htmlFor="">
                                                                        Addon
                                                                        name
                                                                        <span>
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                                        placeholder="Enter Addon name"
                                                                        type="text"
                                                                        id="addOnName"
                                                                        name="addOnName"
                                                                        value={
                                                                            addon.addOnName
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAddonChange(
                                                                                e,
                                                                                i,
                                                                                index
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="eic-basic">
                                                                    <label>
                                                                        Addon
                                                                        image
                                                                        <span>
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <div className="relative h-fit">
                                                                        <input
                                                                            className="bg-white border-1 mt-2 !border-LightColor w-full rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                                            placeholder="Drag & drop or click to add addon image"
                                                                            type="file"
                                                                            id="addOnImage"
                                                                            name="addOnImage"
                                                                            value={
                                                                                addon.addOnImage
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                uploadImage(
                                                                                    e,
                                                                                    addon.addOnName,
                                                                                    addon.addOnInfo,
                                                                                    addon
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="eic-basic">
                                                                        <label htmlFor="">
                                                                            Addon
                                                                            info
                                                                            <span>
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                                                                            placeholder="Enter Add on info"
                                                                            type="text"
                                                                            id="addOnInfo"
                                                                            name="addOnInfo"
                                                                            value={
                                                                                addon.addOnInfo
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleAddonChange(
                                                                                    e,
                                                                                    i,
                                                                                    index
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="mt-3">
                                                                        <button
                                                                            type="button"
                                                                            className="bg-BlueButton text-sm text-white rounded-md px-2 py-2 mr-2"
                                                                            onClick={() =>
                                                                                handleAddAddonsClick(
                                                                                    i
                                                                                )
                                                                            }
                                                                        >
                                                                            Add
                                                                            Addons
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="bg-BlueButton text-sm text-white rounded-md px-2 py-2 mr-2"
                                                                            onClick={() =>
                                                                                handleRemoveAddonsClick(
                                                                                    i,
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                            Addons
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                <div className="btn-box">
                                                    {ticketFieldInputList.length !==
                                                        1 && (
                                                        <button
                                                            className="bg-BlueButton mb-2 text-white rounded-md px-3 py-2 mr-2"
                                                            onClick={() =>
                                                                handleRemoveClick(
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            Remove Ticket
                                                        </button>
                                                    )}
                                                    {ticketFieldInputList.length -
                                                        1 ===
                                                        i && (
                                                        <button
                                                            className="bg-BlueButton text-white rounded-md px-3 py-2"
                                                            onClick={
                                                                handleAddClick
                                                            }
                                                        >
                                                            Add Ticket
                                                        </button>
                                                    )}

                                                    {formErrors &&
                                                        formErrors.ticketError && (
                                                            <p className="field-error">
                                                                *
                                                                {
                                                                    formErrors.ticketError
                                                                }
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Publish Info */}
                            {/* <div className="fc-publish-info">
                <h2 className="text-blue pt-4 mb-4 text-xl font-semibold">
                  Publish Info
                </h2>
                <div className="fc-pi-container">
                  <div
                    className={
                      !publishStatus
                        ? "fc-pi-toggle"
                        : "fc-pi-toggle disable-status"
                    }
                  >
                    <div
                      style={{
                        justifySelf: "flex-end",
                        display: "flex",
                        "align-items": "flex-end",
                        "flex-direction": "column",
                      }}
                    >
                      <h3>
                        Private
                        <br />
                      </h3>
                      <p>Only available to a selected audience</p>
                    </div>
                  </div>

                  <div>
                    <Switch
                      isOn={publishStatus}
                      handleToggle={() => activeStatus(!publishStatus)}
                    />
                  </div>
                  <div
                    className={
                      publishStatus
                        ? "fc-pi-toggle"
                        : "fc-pi-toggle disable-status"
                    }
                    style={{ justifySelf: "flex-start" }}
                  >
                    <div>
                      <h3>
                        Public
                        <br />
                      </h3>
                      <p>Shared on Blocktickets and search engines</p>
                    </div>
                  </div>
                  <div className="eic-basic publish-status">
                    <label htmlFor="ticketCategory">
                      Price Category<span>*</span>
                    </label>
                    <select
                      className="bg-white border-1 mt-2 !border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:!border-LightColor"
                      name="ticketCategory"
                      id="ticketCategory"
                      value={ticketFieldInputList.ticketCategory}
                      onChange={handle}
                    >
                      <option value="">Select Price Category</option>
                      <option value="PAID">PAID</option>
                      <option value="UNPAID">UNPAID</option>
                    </select>
                  </div>
                </div>
              </div> */}

                            <div className="flex justify-center items-center gap-4">
                                <button className="bg-BlueButton text-white rounded-md px-3 py-2 text-lg">
                                    Add Event
                                </button>
                                <button
                                    onClick={() => navigate("/")}
                                    className="bg-GreyButton text-blue rounded-md px-3 py-2 text-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                            {submitError && (
                                <p className="field-error">
                                    *Please fill all the fields
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrganizeForm;
