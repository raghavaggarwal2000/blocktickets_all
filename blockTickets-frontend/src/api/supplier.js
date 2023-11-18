import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
});

export const setAuthToken = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    //applying token
    instance.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    //deleting the token from header
    delete instance.defaults.headers.common["Authorization"];
  }
};

const responseBody = (response) => response;

const requests = {
  get: (url, options) => instance.get(url, options).then(responseBody),

  post: (url, body, options) =>
    instance.post(url, body, options).then(responseBody),

  put: (url, body, options) =>
    instance.put(url, body, options).then(responseBody),

  delete: (url, options) => instance.delete(url, options).then(responseBody),
};

export const EventCreatorServices = {
  register: (registerData) =>
    requests.post(`/event-creator/register`, registerData),
  createEvent: (payload) => requests.post(`/event/create-event`, payload),
};

export const TicketServices = {
  ticketInfo: (eventId) => requests.get(`/ticket/event-ticket/info/${eventId}`),
  getMyProfile: () => requests.get(`/users/getMyProfile`),
  getMyTickets: (payload) =>
    requests.post(`/ticket/get-ticket-by-userId`, payload),
  ticketLockedDecrement: (payload) =>
    requests.post(`/ticketlocked/ticket-locked-decrement`, payload),
  ticketLockedIncrement: (payload) =>
    requests.post(`/ticketlocked/ticket-locked-increment`, payload),
  getNfts: () => requests.post(`/ticket/getNfts`),
  verifyCode: (code, event_id) => requests.post(`/promo/verify/${code}`,{ event_id }),
};
export const UserServices = {
  subscribe: (email) => requests.post(`/users/subscribe/email`, { email }),
  uploadBg: (payload) => requests.post(`/users/add-backgroundpic`, payload),
  uploadPic: (payload) => requests.post(`/users/add-profilepic`, payload),
  updateUserPassword: (payload) =>
    requests.post(`/users/updateUserPassword`, payload),
  userLocation: (ip) => requests.get(`/users/get-user-location/${ip}`),
  userByEmail: (email) => requests.get(`/users/userByEmail/${email}`),
  editUserByEmail: (payload) => requests.put(`/users/editUser`, payload),
};

export const EventServices = {
  getEventByUser: () => requests.post(`/event/get-event-user-has-tickets-for`),
  saveEvent: (eventId) => requests.post(`/event/save-event/${eventId}`),
  unsaveEvent: (eventId) => requests.post(`/event/unsave-event/${eventId}`),
  getEventById: (payload) => requests.post(`/event/get-event-byId`, payload),
  getAllEvents: (query) => requests.get(`/event/get-all-event?filter=${query}`),
};

export const StripeServices = {
  paymentIntent: (payload) =>
    requests.post(`/payment/create-payment-intent`, payload),
};

export const getUserDetails = () => {
  const userDetails = sessionStorage.getItem("user-data");
  if (userDetails) {
    return JSON.parse(userDetails);
  }
};
export const getToken = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    return token;
  }
  return null;
};
export const storeInformation = (userData) => {
  sessionStorage.setItem("user-data", JSON.stringify(userData));
};

export const priceServices = {
  maticPrice: () =>
    requests.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr`
    ),
};
