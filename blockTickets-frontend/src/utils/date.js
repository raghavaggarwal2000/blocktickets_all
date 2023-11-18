import moment from "moment";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getDate = (newDate) => {
  console.log(newDate);
  return (
    weekday[new Date(newDate).getDay()] +
    ", " +
    new Date(newDate).getDate() +
    " " +
    monthNames[new Date(newDate).getMonth()] +
    " " +
    getYear(newDate)
  );
};
export const getDay = (newDate) => {
  return new Date(newDate).getDate();
};
export const getMonth = (newDate) => {
  return new Date(newDate).getMonth();
};
export const getYear = (newDate) => {
  return new Date(newDate).getFullYear();
};

export const getCompleteDate = (newDate) => {
  console.log("newDate: ", newDate);
  // let d = newDate.toISOString();
  return moment(new Date(newDate.substr(0, 16))).format("dddd, MMMM Do YYYY");
};

export const getTime = (newDate) => {
  return new Date(newDate).getHours() + ":" + new Date(newDate).getMinutes();
};

export const humanDate = (newDate) => {
  return (
    new Date(newDate).getDate() + " " + monthNames[new Date(newDate).getMonth()]
  );
};
