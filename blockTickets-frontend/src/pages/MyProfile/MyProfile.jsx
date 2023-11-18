import React, { useEffect, useState} from "react";
import { Container, Row, Col} from "react-bootstrap";
import "./my-profile.css";

//api to get userinfo
import { getUserProfile} from "../../api/api-client.js";

import Loading from "../../Loading/Loading";
import FullLoading from "../../Loading/FullLoading";

// background designs
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import nameLogo from "../../images/profile/name.svg";
import WalletInfo from "../../Modals/WalletInfo/WalletInfo";
import profilePhoto from "../../images/profile-photo.svg";
// react phone
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import axios from "axios";

const MyProfile = (props) => {
    const [profileInfo, setProfileInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [fullLoading, setFullLoading] = useState(false);

    const [birthDate, setBirthDate] = useState(new Date());
    const [gender, setGender] = useState();
    const [phoneInput, setPhoneInput] = useState();
    const [profileImage, setProfileImage] = useState(false);
    const [username, setUsername] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [walletInfoModal, setWalletInfoModal] = useState("");

    const [userAddress, setUserAddress] = useState({
        address: "",
        landmark: "",
        country: "",
        stateLives: "",
        city: "",
        pcode: "",
    });

    const getProfile = async () => {
        setLoading(true);
        try {
            const res = await getUserProfile(sessionStorage.getItem("token"));

            if (res.status === 200) {
                setProfileInfo(res.data);
                //console.log("data", res.data);

                if (
                    res.data &&
                    res.data.data.user &&
                    res.data.data.user &&
                    res.data.data.user.dob
                ) {
                    // //console.log("AA",res.data.data.user.dob)
                    setBirthDate(res.data.data.user.dob);
                }

                if (
                    res.data &&
                    res.data.data.user &&
                    res.data.data.user &&
                    res.data.data.user.gender
                ) {
                    //console.log("AA", res.data.data.user.gender);
                    setGender(res.data.data.user.gender);
                }
            }
            setLoading(false);
        } catch (err) {
            //console.log(err.response);
            setLoading(false);
        }
    };

    const uploadProfilePicture = async (myImage) => {
        // console.log(process.env.REACT_APP_CHECK);
        setFullLoading(true);
        var data = new FormData();
        data.append("image", myImage);

        var config = {
            method: "post",
            url: `${process.env.REACT_APP_BACKEND_URL}/users/add-profilepic`,
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            data: data,
        };

        axios(config)
            .then(async function (response) {
                // console.log(JSON.stringify(response.data));
                let previousData = JSON.parse(sessionStorage.getItem('user-data'));
                previousData.profilePic = response.data.data.url;
                sessionStorage.setItem('user-data',JSON.stringify(previousData));
                // await getProfile();
                window.location.reload();
                setFullLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setFullLoading(false);
            });
    };

    const sendUserProfileInfo = async () => {
        var data = {
            username: username,
            phoneNumber: phoneInput,
            dob: birthDate,
            gender: gender,
            address: userAddress.address,
            landmark: userAddress.landmark,
            country: userAddress.country,
            state: userAddress.stateLives,
            city: userAddress.city,
            pcode: userAddress.pcode,
        };

        if (!data.username) {
            setError("Please enter username to update");
            return;
        } else {
            setError("");
        }
        setFullLoading(true);
        var config = {
            method: "patch",
            url: `${process.env.REACT_APP_BACKEND_URL}/users/updateUser`,
            headers: {
                Authorization: "Bearer "+ sessionStorage.getItem('token'),
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        };

        axios(config)
            .then(function (response) {
                //console.log(response.data);
                setFullLoading(false);
                if (response.data.status === 200) {
                    setSuccess("User updated successfully...");
                }
            })
            .catch(function (error) {
                //console.log(error.response);
                setFullLoading(false);
                setError("Some error Occurred");
            });
    };
    const handleBirth = (d) => {
        //console.log(d);
        setBirthDate(d);
    };
    const handleAddress = (e) => {
        // //console.log(e.target.value);
        setUserAddress({
            ...userAddress,
            [e.target.id]: e.target.value,
        });
    };
    useEffect(() => {
        document.body.scrollTop = 0;
        getProfile();
    }, []);


    return (
        <>
            {fullLoading && <FullLoading />}
            {loading ? (
                <Loading />
            ) : (
                <Container className="my-profile designAddMargin h-auto d-flex justify-content-center ">
                    <Row className="my-profile-title">
                        <Col>Personal Information</Col>
                    </Row>
                    <Row>
                        <Col md={4} className="profile-photo">
                            {!profileImage && (
                                <img src={profilePhoto} alt="imageProfile" />
                            )}
                            {profileImage && profileImage.name.length > 0 && (
                                <img
                                    className="profile-image"
                                    src={URL.createObjectURL(profileImage)}
                                    alt="2-showProfileImage2"
                                />
                            )}

                            {profileInfo &&
                                profileInfo.data &&
                                profileInfo.data.user &&
                                profileInfo.data.user.profilePic && (
                                    <img
                                    className="profile-image"
                                        src={profileInfo.data.user.profilePic}
                                        alt="userProfilePicGet"
                                    />
                                )}

                            <input
                                type="file"
                                onChange={(e) => {
                                    setProfileImage(e.target.files[0]);
                                    uploadProfilePicture(e.target.files[0]);
                                }}
                                className="edit-profile-image"
                            />
                        </Col>
                        <Col md={8}>
                            <Row>
                                <div className="profile-input">
                                    <div>
                                        <label htmlFor="name">Name</label>
                                    </div>

                                    <img src={nameLogo} alt="" />

                                    <input
                                        type="text"
                                        id="name"
                                        placeholder={
                                            profileInfo &&
                                            profileInfo.data &&
                                            profileInfo.data.user &&
                                            profileInfo.data.user.username
                                                ? profileInfo.data.user.username
                                                : "Your Name"
                                        }
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                </div>
                            </Row>

                            <Row style={{ marginBottom: "10px" }}>
                                <div className="l-input-element">
                                    <div>
                                        <label htmlFor="email">Mobile</label>
                                    </div>
                                    <span className="l-icon">
                                        {/* <img src={emailLogo} alt="" /> */}
                                    </span>
                                    <PhoneInput
                                        placeholder={
                                            profileInfo &&
                                            profileInfo.data &&
                                            profileInfo.data.user &&
                                            profileInfo.data.user.phoneNumber
                                                ? profileInfo.data.user
                                                      .phoneNumber
                                                : "0987 6253 2374"
                                        }
                                        value={phoneInput}
                                        onChange={setPhoneInput}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className="l-input-element">
                                        <div>
                                            <label htmlFor="email">DOB</label>
                                        </div>
                                        <span className="l-icon">
                                            {/* <img src={emailLogo} alt="" /> */}
                                        </span>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDateFns}
                                        >
                                            <DesktopDatePicker
                                                label=""
                                                inputFormat="MM/dd/yyyy"
                                                id="birthDate"
                                                value={birthDate}
                                                onChange={handleBirth}
                                                renderInput={(params) => (
                                                    <TextField {...params} />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="l-input-element">
                                        <div>
                                            <label htmlFor="email">
                                                Gender
                                            </label>
                                        </div>
                                        <span className="l-icon">
                                            {/* <img src={emailLogo} alt="" /> */}
                                        </span>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={gender ? gender : "Male"}
                                            label="Gender"
                                            onChange={(e) => {
                                                setGender(e.target.value);
                                                //console.log(e.target.value);
                                            }}
                                            defaultValue="Male"
                                        >
                                            <MenuItem value="Male">
                                                Male
                                            </MenuItem>
                                            <MenuItem value="Female">
                                                Female
                                            </MenuItem>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="my-profile-title">
                            Address(Optional)
                        </Col>
                        <Row>
                            <div className="profile-input">
                                <div>
                                    <label htmlFor="address">Address</label>
                                </div>
                                {/* <span className="l-icon"> */}
                                {/* <img src={emailLogo} alt="" /> */}
                                <i className="far fa-address-card"></i>
                                {/* </span> */}
                                <input
                                    type="text"
                                    id="address"
                                    placeholder={
                                        profileInfo &&
                                        profileInfo.data &&
                                        profileInfo.data.user &&
                                        profileInfo.data.user.address
                                            ? profileInfo.data.user.address
                                            : "Your Address"
                                    }
                                    value={userAddress.address}
                                    onChange={(e) => handleAddress(e)}
                                />
                            </div>
                        </Row>
                        <Row>
                            <div className="profile-input">
                                <div>
                                    <label htmlFor="land">Landmark</label>
                                </div>
                                <i className="fas fa-monument"></i>
                                <input
                                    type="text"
                                    id="landmark"
                                    placeholder={
                                        profileInfo &&
                                        profileInfo.data &&
                                        profileInfo.data.user &&
                                        profileInfo.data.user.landmark
                                            ? profileInfo.data.user.landmark
                                            : "Enter Landmark"
                                    }
                                    value={userAddress.landmark}
                                    onChange={(e) => handleAddress(e)}
                                />
                            </div>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <div className="profile-input">
                                    <div>
                                        <label htmlFor="postalCode">City</label>
                                    </div>
                                    <i className="far fa-building"></i>
                                    <input
                                        type="text"
                                        id="city"
                                        // placeholder="Enter your City"
                                        value={userAddress.city}
                                        onChange={(e) => handleAddress(e)}
                                        placeholder={
                                            profileInfo &&
                                            profileInfo.data &&
                                            profileInfo.data.user &&
                                            profileInfo.data.user.city
                                                ? profileInfo.data.user.city
                                                : "Enter City"
                                        }
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="profile-input">
                                    <div>
                                        <label htmlFor="stateLives">
                                            State
                                        </label>
                                    </div>
                                    <i className="fas fa-city"></i>
                                    <input
                                        type="text"
                                        id="stateLives"
                                        // placeholder="Enter your State"
                                        value={userAddress.stateLives}
                                        onChange={(e) => handleAddress(e)}
                                        placeholder={
                                            profileInfo &&
                                            profileInfo.data &&
                                            profileInfo.data.user &&
                                            profileInfo.data.user.state
                                                ? profileInfo.data.user.state
                                                : "Enter your State"
                                        }
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <div className="profile-input">
                                    <div>
                                        <label htmlFor="postalCode">
                                            Postal Code
                                        </label>
                                    </div>
                                    <i className="far fa-envelope"></i>
                                    <input
                                        type="number"
                                        id="pcode"
                                        // placeholder="Postal Code"
                                        value={userAddress.pcode}
                                        onChange={(e) => handleAddress(e)}
                                        placeholder={
                                            profileInfo &&
                                            profileInfo.data &&
                                            profileInfo.data.user &&
                                            profileInfo.data.user.pcode
                                                ? profileInfo.data.user.pcode
                                                : "Postal Code"
                                        }
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="profile-input">
                                    <div>
                                        <label htmlFor="postalCode">
                                            Country
                                        </label>
                                    </div>
                                    <i className="fas fa-city"></i>
                                    <input
                                        type="text"
                                        id="country"
                                        // placeholder="Enter your Country"
                                        value={userAddress.country}
                                        onChange={(e) => handleAddress(e)}
                                        placeholder={
                                            profileInfo &&
                                            profileInfo.data &&
                                            profileInfo.data.user &&
                                            profileInfo.data.user.country
                                                ? profileInfo.data.user.country
                                                : "Your Country"
                                        }
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Row>

                    <div className="profile-btns">
                        <button
                            className="submit-btn"
                            onClick={
                                !loading
                                    ? (e) => {
                                          sendUserProfileInfo(e);
                                      }
                                    : null
                            }
                        >
                            Submit
                        </button>
                        <button
                            className="profile-wallet-btn"
                            onClick={() => setWalletInfoModal(true)}
                        >
                            Wallet Info
                        </button>
                    </div>

                    {error && <div className="error-message">*{error}</div>}
                    {success && (
                        <div className="success-message">*{success}</div>
                    )}
                    <WalletInfo
                        show={walletInfoModal}
                        setShow={setWalletInfoModal}
                        profileInfo={profileInfo}
                        setFullLoading={setFullLoading}
                        getProfile={getProfile}
                    />
                </Container>
            )}
        </>
    );
};

export default MyProfile;
