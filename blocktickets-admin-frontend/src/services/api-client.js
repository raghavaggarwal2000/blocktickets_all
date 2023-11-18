import axios from "axios";
import toast from "react-hot-toast";
const backendUrl = process.env.REACT_APP_BACKEND_URL
  ? process.env.REACT_APP_BACKEND_URL
  : "https://backend.blocktickets.io";
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
    ? process.env.REACT_APP_BACKEND_URL
    : "https://backend.blocktickets.io",
});

const getUserId = () => {
  const userDetails = sessionStorage.getItem("userDetails");
  if (userDetails) {
    return JSON.parse(userDetails).userId;
  } else {
    return null;
  }
};

const getToken = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return null;
  }
};

const responseBody = (response) => response;

const requests = {
  get: (url, options) =>
    instance
      .get(url, {
        ...options,
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then(responseBody),

  post: (url, body, options) =>
    instance
      .post(url, body, {
        ...options,
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then(responseBody),

  put: (url, body, options) =>
    instance
      .put(url, body, {
        ...options,
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then(responseBody),

  delete: (url, options) =>
    instance
      .delete(url, {
        ...options,
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then(responseBody),
};

// ! Auth api services
export const AuthServices = {
  login: (loginData) => requests.post(`/auth/login`, loginData),

  forgotPassword: (email) => requests.post(`/auth/forgot-password`, { email }),

  resetPassword: (resetPasswordData) =>
    requests.post(`/auth/reset-password`, resetPasswordData),

  logout: () => requests.delete(`/auth/logout`),
};

// ! Ticket api services
export const TicketServices = {
  addTicketType: (ticketData) =>
    requests.post(`/ticket/ticket-type/${getUserId()}`, ticketData),

  editTicketType: (ticketData, ticketId) =>
    requests.put(`/ticket/ticket-type/${ticketId}/${getUserId()}`, ticketData),

  deleteTicketType: (ticketId) =>
    requests.delete(`/ticket/ticket-type/${ticketId}/${getUserId()}`),

  getTicketById: (ticketId) =>
    requests.get(`/ticket/ticket/${ticketId}/${getUserId()}`),

  getTicketsByEmailChange: (email, eventId, page = 1, limit = 10) =>
    eventId
      ? requests.get(
          `/ticket/get-ticketsBy-emailChange/${email}/${eventId}/${getUserId()}`,
          {
            params: { page, limit },
          }
        )
      : requests.get(
          `/ticket/get-ticketsBy-emailChange/${email}/${getUserId()}`,
          {
            params: { page, limit },
          }
        ),

  getAllTickets: (page = 1, limit = 10) =>
    requests.get(`/ticket/get-all-tickets/${getUserId()}`, {
      params: { page, limit },
    }),
  getTicketsSale: (page = 1, limit = 10) =>
    requests.get(`/ticket/all-tickets-sale/${getUserId()}`, {
      params: { page, limit },
    }),
  getTicketsByEventId: (eventId, page = 1, limit = 50) =>
    requests.get(`/ticket/tickets-by-event/${eventId}/${getUserId()}`, {
      params: { page, limit },
    }),

  getAllTicketsByOrganizer: (userType, filter, eventType) =>
    requests.get(
      `/ticket/get-ticket-types/${getUserId()}?userType=${userType}&filter=${filter}&eventType=${eventType}`
    ),

  getTicketsOnSale: (page = 1, limit = 10) =>
    requests.get(`/nft-transaction/tickets-on-sale/${getUserId()}`, {
      params: { page, limit },
    }),
  generateTicket: (payload) =>
    requests.post(
      `/ticket/ticket-type/generateFreeTickets/${getUserId()}`,
      payload
    ),
  getTicketByOrderId: (orderId) =>
    requests.get(`/ticket/ticketOrderId/${orderId}/${getUserId()}`),

  updatePaymentStatus: (finalPrice, order_id) =>
    requests.put(
      `/ticket/update-paid-price/${order_id}/${getUserId()}`,
      finalPrice
    ),
    verifyCode: (code, event_id) => requests.post(`/promo/verify/${code}`,{ event_id }),
};

// ! Event api services
export const EventServices = {
  getEventById: (payload, query) =>
    requests.post(
      `/event/get-event-byId?query=admin&userId=${getUserId()}`,
      payload
    ),

  getAllEvents: ({ userType, filter, eventType, filterTypes }) =>
    requests.get(
      `/event/all-events/${getUserId()}?userType=${userType}&filter=${filter}&eventType=${eventType}&filterTypes=${filterTypes}`
    ),

  updateEvent: (eventData, eventId) =>
    requests.put(`/event/event/${eventId}/${getUserId()}`, eventData),

  updateArtistData: (artistData, artistId) =>
    requests.put(`/event/updateArtist/${artistId}/${getUserId()}`, artistData),

  updateOrganizerData: (organizerData, organizerId) =>
    requests.put(
      `/event/updateOrganizer/${organizerId}/${getUserId()}`,
      organizerData
    ),

  updateEventImage: (eventId, image) =>
    requests.put(`/event/update-image/${eventId}/${getUserId()}`, image, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type":
          "multipart/form-data;boundary=<calculated when request is sent>",
      },
    }),

  updateArtistImage: (artistId, image) =>
    requests.put(
      `/event/update-artist-image/${artistId}/${getUserId()}`,
      image,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type":
            "multipart/form-data;boundary=<calculated when request is sent>",
        },
      }
    ),

  updateOrganizerImage: (organizerId, image) =>
    requests.put(
      `/event/update-organizer-image/${organizerId}/${getUserId()}`,
      image,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type":
            "multipart/form-data;boundary=<calculated when request is sent>",
        },
      }
    ),

  updateTicketSponsorImage: (ticketId, image) =>
    requests.put(
      `/event/update-sponsor-image/${ticketId}/${getUserId()}`,
      image,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type":
            "multipart/form-data;boundary=<calculated when request is sent>",
        },
      }
    ),
};

// ! Artist api services
export const ArtistServices = {};

// ! User api services
export const UserServices = {
  getUsers: (page = 1, limit = 10) =>
    requests.get(`/users/users/${getUserId()}`, {
      params: { page: page, limit: limit },
    }),

  getUserById: () => requests.get(`/event/all-events/${getUserId()}`),

  getUsersByEmail: (email, page = 1, limit = 10) =>
    requests.get(`/users/users/${getUserId()}`, {
      params: {
        email,
        page: page,
        limit: limit,
      },
    }),

  assignUserRole: (role, userId) =>
    requests.put(`/users/update-role/${getUserId()}`, { role, userId }),
  getIgnoredList: (page = 1, limit = 10) =>
    requests.post(`/users/get-user-ignore-list/${getUserId()}`, {
      params: {
        page: page,
        limit: limit,
      },
    }),
  addToIgnoreList: (payload) =>
    requests.post(`/users/add-to-ignore/${getUserId()}`, payload),
};

export const CreatorServices = {
  getEventCreators: (page) =>
    requests.get(
      `/event-creator/getEventCreatorList/${getUserId()}?page=${page}`
    ),
  verifyCreator: (id) =>
    requests.put(`/event-creator/verifyCreator/${getUserId()}/${id}`),
  verifyEvent: (id) =>
    requests.put(`/event-creator/verifyEvent/${getUserId()}/${id}`),
};

export const PromoCodeServices = {
  generate: (payload) =>
    requests.post(`/promo/generate/${getUserId()}`, payload),
  getAll: (limit, page) =>
    requests.get(`/promo/all/view/${limit}/${page}/${getUserId()}`),
  getDiscountById: (id) => requests.get(`/promo/view/${id}/${getUserId()}`),
  updateDate: (payload) => requests.post(`/promo/update/date`, payload),
  disable: (id) => requests.delete(`/promo/update/disable/${id}`),
  updateCode: (payload) => requests.put(`/promo/update/details`, payload),
};

export const uploadImage = async (e, name, info, key = "", needOriginal) => {
  let image;

  if (e?.name) {
    image = e;
  } else {
    image = e.target.files[0];
  }
  let NFTFormData = new FormData();
  NFTFormData.append("name", name);
  NFTFormData.append("description", info);
  NFTFormData.append("collection", "blocktickets");
  NFTFormData.append("nftType", "image");
  NFTFormData.append("image", image);
  NFTFormData.append("pinataUpload", needOriginal);
  const res = await axios.post(`${backendUrl}/nft/upload-pinata`, NFTFormData, {
    headers: {
      "Content-Type":
        "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    },
  });
  console.log("uploadImage", res);
  const _image = res.data;
  let tokenUri, img;
  if (needOriginal) {
    tokenUri = "https://unicus.mypinata.cloud/ipfs/" + _image?.pinata_hash;
    img = await axios.get(tokenUri);
  }

  return {
    uri: tokenUri,
    pinataImage: img?.data?.image,
    s3_upload: _image?.s3_upload,
  };
};