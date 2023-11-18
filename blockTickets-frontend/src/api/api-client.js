import axios from "axios";

export const endpoint = process.env.REACT_APP_BACKEND_URL;

const UserServices = {};
const TicketServices = {};
const PaymentServices = {};
const MarketplaceServices = {};

const ThirdPartyServices = {
  getMaticPrice: "",
};

export const getEventData = async (query) => {
  return await axios.get(`${endpoint}/event/get-all-event?filter=${query}`);
};

export const getEventById = async (payload) => {
  return await axios.post(`${endpoint}/event/get-event-byId`, payload);
};
export const registerUser = async (data) => {
  return await axios.post(`${endpoint}/auth/register`, data);
};
export const resendVerificationEmail = async (payload) => {
  return await axios.post(`${endpoint}/auth/resendVerificationEmail`, payload);
};
export const socialLoginUser = async (token) => {
  return await axios
    .post(
      `${endpoint}/auth/social-login`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((res) => {
      // window.alert(res.data.message);
      // console.log(res);
      return res.data;
    })
    .catch((err) => {
      //   console.log(err);
      // window.alert("Please retry");
      return err;
    });
};

export const phoneLoginUser = async (token) => {
  return await axios
    .post(
      `${endpoint}/auth/phone-login`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const LoginUser = async (data) => {
  return await axios.post(`${endpoint}/auth/login`, data);
};

export const systemLogin = async (systemToken) => {
  return await axios.post(`${endpoint}/auth/system-login`, { systemToken });
};

export const LogoutUser = async (token) => {
  return await axios.delete(`${endpoint}/auth/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserProfile = async (token) => {
  var config = {
    method: "Get",
    url: `${endpoint}/users/getMyProfile`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return await axios(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};
export const changePassword = async (oldPassword, newPassword,email, token) => {
  return await axios.put(
    `${endpoint}/users/updateUserPassword`,
    { oldPassword, newPassword, email },
    {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
  );
};
//update username or phone number
export const updateDetails = async (data, token) => {
  return await axios.patch(`${endpoint}/users/updateUser`, data, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  });
};
// Search
export const searchApi = async (inputKey) => {
  return await axios.get(`${endpoint}/search/search?key=${inputKey}`);
};
// wallet address update
export const updateWalletAddress = async (data, token) => {
  return await axios.post(`${endpoint}/users/add-address`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// login with metamask
export const metamaskLogin = async (data) => {
  return await axios.post(`${endpoint}/users/get-nonce`, {
    publicAddress: data,
  });
};

// login using coinbase
export const coinBaseLogin = async (data) => {
  return await axios.post(`${endpoint}/users/get-nonce`, {
    publicAddress: data,
  });
};

// wallet connector
export const walletConnectorLogin = async (data) => {
  return await axios.post(`${endpoint}/users/get-nonce`, {
    publicAddress: data,
  });
};

//submit organizer form
export const organizerFormSubmit = async (data, token) => {
  return await axios.post(`${endpoint}/event/create-event`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        "multipart/form-data;boundary=<calculated when request is sent>",
    },
  });
};
export const forgotPasswordSend = async (email) => {
  try {
    const res = axios.post(`${endpoint}/auth/forgot-password`, {
      email: email,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
//increment ticket counter
export const ticketLockedIncrement = async (selectedTickets, token) => {
  try {
    const res = axios.post(
      `${endpoint}/ticketlocked/ticket-locked-increment`,
      selectedTickets,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return res;
  } catch (err) {
    return err.response;
  }
};
//decrementing ticket counter
export const ticketLockedDecrement = async (selectedTickets, token) => {
  return await axios.post(
    `${endpoint}/ticketlocked/ticket-locked-decrement`,
    {
      selectedTickets: selectedTickets,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
};

//booking the tickets
export const ticketBookingApi = async (data, token) => {
  try {
    const res = await axios.post(`${endpoint}/ticket/book-ticket`, data, {
      headers: {
        Authorization: `${token}`,
        Accept: "application/json",
      },
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

//create NFT
export const sendNFTDetails = async (data, token) => {
  try {
    const res = await axios.post(`${endpoint}/nft`, data, {
      headers: {
        Authorization: `${token}`,
        Accept: "application/json",
        "Content-Type":
          "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

//Top searches
export const topSearch = async () => {
  return await axios.get(`${endpoint}/search/top-search`);
};

export const myTicketsData = async (userId, token) => {
  return await axios.post(
    `${endpoint}/ticket/get-ticket-by-userId`,
    {
      userID: userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
};

export const getMaticPrice = async () => {
  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=INR"
    );
    return res;
  } catch (err) {
    return err.response;
  }
};

export const verifyEmail = async (accessToken, email) => {
  return await axios.post(
    `${endpoint}/auth/verify-email`,
    {
      verificationToken: accessToken,
      email: email,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

export const resetPassword = async (accessToken, email, password) => {
  return await axios.post(
    `${endpoint}/auth/reset-password`,
    {
      token: accessToken,
      email: email,
      password: password,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};
export const profileInfoForm = async (data, accessToken) => {
  var data = JSON.stringify({
    username: "kartik2",
    phoneNumber: "",
    dob: "",
    gender: "",
    address: "",
    landmark: "",
    country: "",
    state: "",
    city: "",
    pcode: "",
  });

  var config = {
    method: "patch",
    url: `${process.env.REACT_APP_BACKEND_URL}/users/updateUser`,
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};
