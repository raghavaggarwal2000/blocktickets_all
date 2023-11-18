import { useEffect, useState, useRef } from "react";
import TextInput from "../../components/TextInput/TextInput";
import WalletAdd from "../../components/Wallet/WalletAdd";
import { changePassword, updateDetails } from "../../api/api-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import userImg from "../../images/defaltUser.webp";
import Calendar2 from "../../images/icons/calendar-secondary.png";
import wallet from "../../images/icons/wallet-removebg.png";
import AiImage from "../../images/assets/ai_hero.png";
import Clock from "../../images/icons/clock-removebg.png";
import PencilEdit from "../../images/icons/pencil-edit.svg";
import { getDate } from "../../utils/date";
import { UserServices } from "../../api/supplier";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet";

let axiosConfig = {
  headers: {
    "Content-Type":
      "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
  },
};
const EditProfile = (props) => {
  const bgPicRef = useRef();
  const profilePicRef = useRef();

  const navigate = useNavigate();
  const [active, setActive] = useState("general");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [user, setUser] = useState();
  const open = Boolean(anchorEl);
  const [profileMetadata, setProfileMetadata] = useState("");
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
    setProfileMetadata({
      futureEvents: res.data?.data?.futureEventOn,
      past: res?.data?.data?.past,
    });
    setUser(res.data.data.user);
    // console.log(res.data.data.user)
  };
  const uploadImage = async (e, uploadType) => {
    try {
      if (uploadType == "bg") setLoading(true);
      else setProfileLoading(true);
      const name = e.target.files[0].name
      const image = e.target.files[0];
      let NFTFormData = new FormData();
      NFTFormData.append("name", name);
      NFTFormData.append("collection", "blocktickets");
      NFTFormData.append("nftType", "image");
      NFTFormData.append("image", image);
      NFTFormData.append("pinataUpload", true);
      const tokenHash = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/nft/upload-pinata`,
        NFTFormData,
        axiosConfig
      );
      const uploadRes = tokenHash.data;
      const tokenUri = "https://unicus.mypinata.cloud/ipfs/" + uploadRes?.pinata_hash;
      const im = await axios.get(tokenUri);
      const imageUrl = im?.data?.image;
      const pinata = {tokenUri, pin_image: imageUrl}
      // upload images
      if (uploadType == "bg") {
        await UserServices.uploadBg({ imageUrl });
        setUser((prev) => {
          return { ...prev, bgPic: imageUrl };
        });
      } else {
        await UserServices.uploadPic({ imageUrl });
        setUser((prev) => {
          return { ...prev, profilePic: imageUrl };
        });
      }
      setLoading(false);
      setProfileLoading(false);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
      setProfileLoading(false);
    }
  };
  const uploadProfilePicture = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <div className="mt-[70px] fixPadding pb-12 screen7:pt-0 bg-black">
      <Helmet>
        <title>
          {user?.hasOwnProperty("google")
            ? user?.google?.name?.split(" ")?.join("_")
            : user?.username?.split(" ")?.join("_")
            ? user?.username?.split(" ")?.join("_")
            : "User Dashboard"}
        </title>
      </Helmet>
      <div className="bg-black w-full pt-2">
        <Link
          to="/dashboard/v2"
          className="pb-4 pl-2 font-semibold cursor-pointer hover:underline underline-offset-2 text-white opacity-75"
        >
          <ArrowBackIcon /> Back
        </Link>

        <div className="pt-2 bg-black text-white overflow-hidden relative mx-auto h-75">
          {user?.bgPic || AiImage ? (
            <div className="relative mx-auto h-auto lg:max-h-[60vh]">
              <img
                className="mx-auto max-h-[60vh] w-full inherit-position"
                src={user?.bgPic ? user.bgPic : AiImage}
                alt="event-banner"
              />
              {!user?.bgPic && (
                <span className="absolute aiImage text-[12px] lg:text-lg">
                  YOUR AI GENERATED IMAGE
                </span>
              )}
              {/* <button
                disabled={loading}
                onClick={() => bgPicRef.current.click()}
                className="absolute h-full w-full bg-black/50 hover:bg-black/75 cursor-pointer  flex items-center justify-center bottom-0 z-[9999]"
              >
                {loading ? (
                  <CircularProgress
                    fontSize="medium"
                    sx={{ color: "#fa6400" }}
                  />
                ) : (
                  <img
                    className="h-[32px] w-[32px]"
                    src={PencilEdit}
                    alt="Edit"
                  />
                )}
                <input
                  type="file"
                  className="d-none"
                  ref={bgPicRef}
                  onChange={(e) => uploadImage(e, "bg")}
                />
              </button> */}
            </div>
          ) : (
            <div className="bg-black/75 h-[50vh] w-full "></div>
          )}
          <div className="flex flex-row justify-start gap-x-8 relative h-[200px]">
            <button
              disabled={loading}
              onClick={() => profilePicRef.current.click()}
              className="h-20 w-20 z-[10000] left-[62px] screen11:left-[10px] top-[-56px] absolute rounded-full overflow-hidden m-auto border-[2px] border-white"
            >
              <img
                src={user && user.profilePic ? user.profilePic : userImg}
                alt="user"
                className="h-full w-full object-cover m-auto"
              />
              <div className="absolute h-full w-full bg-black/50 hover:bg-black/75 cursor-pointer  flex items-center justify-center bottom-0 z-[9999]">
                {profileLoading ? (
                  <CircularProgress
                    fontSize="small"
                    sx={{ color: "#fa6400" }}
                  />
                ) : (
                  <img
                    className="h-[16px] w-[16px]"
                    src={PencilEdit}
                    alt="Edit"
                  />
                )}
                <input
                  type="file"
                  className="d-none"
                  ref={profilePicRef}
                  onChange={(e) => uploadImage(e, "profilePic")}
                />
              </div>
            </button>

            <div className="flex justify-between relative top-0 screen11:top-[-4rem] mb-[1rem]   w-full">
              <div className="screen11:pl-[0.75rem] pl-[4rem] flex flex-col items-start gap-2 relative mt-4">
                <div className="flex flex-col">
                  <span className="text-[24px] w-full  font-semibold">
                    {user?.hasOwnProperty("google")
                      ? user.google.name
                      : user?.username
                      ? user?.username
                      : "User"}
                  </span>
                  <span className="text-silver">
                    {user?.hasOwnProperty("email") ? user.email : ""}
                  </span>
                </div>

                <div className="flex text-base flex-col">
                  <span className="flex items-center mb-2">
                    {" "}
                    <img
                      className="h-[24px] mr-[14px]"
                      src={Calendar2}
                      alt={"images"}
                    />
                    {profileMetadata?.futureEvents?.startDate ? (
                      <span className="text-[14px] md:text-base">
                        Your next event is on{" "}
                        {getDate(profileMetadata?.futureEvents?.startDate)}
                      </span>
                    ) : (
                      <span className="text-[14px] md:text-base">
                        No upcoming events
                      </span>
                    )}
                  </span>
                  <span className="flex items-center mb-2">
                    {" "}
                    <img className="h-[24px] mr-4" src={Clock} alt={"images"} />
                    {profileMetadata?.past ? (
                      <span className="text-[14px] md:text-base">
                        {profileMetadata?.past} past events
                      </span>
                    ) : (
                      <span className="text-[14px] md:text-base">
                        No past events
                      </span>
                    )}
                  </span>
                  <span className="flex items-center text-white  w-full screen11:text-center">
                    <img
                      className="h-[24px]  mr-4"
                      src={wallet}
                      alt={"images"}
                    />{" "}
                    <span className="trimWord screen11:text-[12px] xs:text-[10px]">
                      {user && user.wallets.length > 0
                        ? user.wallets[0]
                        : "No wallet added"}
                    </span>
                  </span>
                </div>
              </div>
              <div
                className="my-4 mr-16 screen11:mr-2 hidden"
                onClick={() => navigate("/edit-profile")}
              >
                <img
                  className="h-[24px] w-[24px] hover:cursor-pointer hover:opacity-75"
                  src={PencilEdit}
                  alt="pencil-edit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-4 flex screen7:flex-col gap-12 mt-8 border-t-[1px] border-silver/50 ">
        <div className="flex screen7:flex-row screen7:whitespace-nowrap screen7:overflow-x-auto flex-col gap-4  pt-4">
          <span
            onClick={() => setActive("general")}
            className={`mb-2font-semibold cursor-pointer ${
              active === "general" ? "text-white underline" : "text-silver"
            }`}
          >
            General
          </span>
          <span
            onClick={() => setActive("password")}
            className={`font-semibold cursor-pointer ${
              active === "password" ? "text-white underline" : "text-silver"
            }`}
          >
            Password
          </span>
          <span
            onClick={() => setActive("social")}
            className={`font-semibold cursor-pointer ${
              active === "social" ? "text-white underline" : "text-silver"
            }`}
          >
            Add Social Links
          </span>
          <span
            onClick={() => setActive("walletAddress")}
            className={`font-semibold cursor-pointer ${
              active === "walletAddress"
                ? "text-white underline"
                : "text-silver"
            }`}
          >
            WalletAddress
          </span>
        </div>
        <div className="w-full pt-4">
          {active === "general" && (
            <GeneralSettings isLogin={props.isLogin} resUser={user} />
          )}
          {active === "password" && (
            <ChangePassword isLogin={props.isLogin} resUser={user} />
          )}
          {active === "social" && (
            <AddSocials isLogin={props.isLogin} resUser={user} />
          )}
          {active === "walletAddress" && (
            <WalletAdd isLogin={props.isLogin} resUser={user} />
          )}
        </div>
      </div>
    </div>
  );
};

const GeneralSettings = (isLogin, resUser) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  let navigate = useNavigate();
  const getUserProfile = async () => {
    setUserName(resUser.username);
    setEmail(resUser.email);
    setBio(resUser.bio);
  };
  const updateProfile = async () => {
    try {
      const res = await updateDetails({ username, bio }, isLogin);
      // toast.success("Profile updated Successfully", {
      //     position: "bottom-center",
      // });
      navigate("/dashboard/v2");
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, [resUser]);

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        title="Username"
        placeholder="Enter your name"
        isPass={false}
        value={username}
        setState={setUserName}
      />
      {/* <TextInput
                title="Email"
                placeholder="Enter your Email"
                isPass={false}
                value={email}
                setValue={setEmail}
                disabled={true}
            /> */}
      <TextInput
        title="Bio"
        placeholder="Enter your Bio"
        multi
        isPass={false}
        value={bio}
        setState={setBio}
      />

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/dashboard/v2")}
          className="bg-GreyButton text-blue rounded-md px-3 py-2"
        >
          Cancel
        </button>
        <button
          className="bg-BlueButton text-white rounded-md px-3 py-2"
          onClick={updateProfile}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const ChangePassword = (props, isLogin, user) => {
  console.log(props);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const changePass = async () => {
    try {
      if(!newPass)
        toast.error("Please enter new password");
      if(!oldPass)
        toast.error("Please enter old password");
          
      if(newPass !== confirmPass)
        toast.error("New and confirm password should be same");
      const res = await changePassword(oldPass, newPass, props.resUser.email, isLogin);
      toast.success(res.data.message
      // , {
      //     position: "bottom-center",
      // }
      );
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <TextInput
        title="Current Password"
        placeholder="Enter current password"
        isPass={true}
        value={oldPass}
        setState={setOldPass}
      />
      <TextInput
        title="New Password"
        placeholder="Enter new password"
        isPass={true}
        value={newPass}
        setState={setNewPass}
      />
      <TextInput
        title="Confirm Password"
        placeholder="Confirm new password"
        isPass={true}
        value={confirmPass}
        setState={setConfirmPass}
      />
      <div className="flex justify-between">
        <button className="bg-GreyButton text-blue rounded-md px-3 py-2">
          Cancel
        </button>
        <button
          className="bg-BlueButton text-white rounded-md px-3 py-2"
          onClick={changePass}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const AddSocials = ({ isLogin, resUser }) => {
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  let navigate = useNavigate();
  const getUserProfile = async () => {
    setTwitter(resUser.twitterLink);
    setFacebook(resUser.facebookLink);
    setInstagram(resUser.instagramLink);
  };
  const updateProfile = async () => {
    try {
      const res = await updateDetails(
        {
          facebookLink: facebook,
          twitterLink: twitter,
          instagramLink: instagram,
        },
        isLogin
      );
      // toast.success("Socials Updated Successfully", {
      //     position: "bottom-center",
      // });
      let d = JSON.parse(sessionStorage.getItem("user-data"));
      console.log("d: ", d);
      d.facebookLink = facebook;
      d.twitterLink = twitter;
      d.instagramLink = instagram;
      sessionStorage.setItem("user-data", JSON.stringify(d));
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [resUser]);

  return (
    <div className="flex flex-col gap-4 mt-4 screen7:mt-0">
      <span className="font-semibold text-silver">Add Twitter</span>
      <input
        type={"text"}
        onChange={(e) => setTwitter(e.target.value)}
        value={twitter}
        name="twitter"
        placeholder="Enter Twitter link"
        className="bg-white border-1 border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:border-LightColor"
      />

      <span className="font-semibold text-silver">Add Facebook</span>
      <input
        type={"text"}
        onChange={(e) => setFacebook(e.target.value)}
        value={facebook}
        name="facebook"
        placeholder="Enter Facebook link"
        className="bg-white border-1 border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:border-LightColor"
      />
      <span className="font-semibold text-silver">Add Instagram</span>
      <input
        type={"text"}
        onChange={(e) => setInstagram(e.target.value)}
        value={instagram}
        name="instagram"
        placeholder="Enter Instagram link"
        className="bg-white border-1 border-LightColor rounded-lg p-3 ring-0 focus:ring-0 focus:border-LightColor"
      />

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-GreyButton text-blue rounded-md px-3 py-2"
        >
          Cancel
        </button>
        <button
          className="bg-BlueButton text-white rounded-md px-3 py-2"
          onClick={() => updateProfile()}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
