import moment from "moment";
import momentTz from "moment-timezone";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const getDate = (newDate) => {
  return (
    new Date(newDate).getDate() + " " + monthNames[new Date(newDate).getMonth()]
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
export const getDateFormat = (newDate) => {
  return (
    getYear(newDate) + "-" + (getMonth(newDate) + 1) + "-" + getDay(newDate)
  );
};
export const getCompleteDate = (newDate) => {
  return moment(new Date(newDate.substr(0, 16))).format("LL");
};
export function parseDate(date) {
  if (!date) return;
  return moment(new Date(date.toString()?.substr(0, 16))).format("MM/DD/YYYY");
}
export const countDays = (date_1, date_2) => {
  date_1 = new Date(parseDate(date_1)).getTime();
  date_2 = new Date(parseDate(date_2)).getTime();
  const days = (date_1, date_2) => {
    let difference = date_1 - date_2;
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  let counted_days = days(date_1, date_2);
  if (
    new Date(date_1).getDate() == new Date(date_2).getDate() &&
    new Date(date_1).getMonth() == new Date(date_2).getMonth()
  ) {
    counted_days = 1;
  }
  return counted_days;
};

export const decreaseDays = (fromR) => {
  var date = new Date();
  var twoDay = date - 1000 * 60 * 60 * 24; // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
  twoDay = new Date(twoDay);

  return getDateFormat(twoDay).toString();
};
export const inLast48Hours = (fromR) => {
  const hour = 1000 * 60 * 60;
  const FourtyEigthHourago = Math.floor((new Date(fromR) - hour * 48) / 1000);
  const currDate = Math.floor(Date.now() / 1000); // in seconds
  return Math.abs(currDate - FourtyEigthHourago) < 172800;
};
export const inLast24Hours = (fromR) => {
  const hour = 1000 * 60 * 60;
  const FourtyEigthHourago = Math.floor((new Date(fromR) - hour * 24) / 1000);
  const currDate = Math.floor(Date.now() / 1000); // in seconds
  return Math.abs(currDate - FourtyEigthHourago) < 86400;
};

export function convert(str) {
  if (!str) return;
  var mnths = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    },
    date = str?.split(" ");

  return [date[3], mnths[date[1]], date[2]].join("-");
}
export const timezoneAdjust = (timezone, date) => {
  const tz_value = timezone?.value ? timezone.value : "Asia/Kolkata";
  let adjustedDate = momentTz(date).tz(tz_value).format();

  const adjustedMinutes = moment(adjustedDate).minutes();
  const adjustedHours = moment(adjustedDate).hours();
  adjustedDate = adjustedDate.toLocaleString("en-US", {
    timeZone: tz_value,
  });
  return { date: adjustedDate, time: adjustedHours + ":" + adjustedMinutes };
};
// export function mergeDateTimeWithTimezoneOffset(
//   dateString,
//   timeString,
//   timezone
// ) {
//   const [year, month, day] = dateString.split("-");
//   const [hours, minutes] = timeString.split(":");

//   const date = moment({
//     year: year,
//     month: month - 1,
//     day: day,
//     hour: hours,
//     minute: minutes,
//   });

//   const adjustedDate = timezoneAdjust(timezone, date);

//   return adjustedDate.date;
// }
export function mergeDateTimeWithTimezoneOffset(dateString, timeString) {
  dateString = new Date(dateString);
  dateString =
    dateString.getFullYear() +
    "-" +
    dateString.getMonth() +
    "-" +
    dateString.getDate();

  const timezoneOffset = new Date(dateString).getTimezoneOffset();

  // Parse the date and time strings
  const [year, month, day] = dateString.split("-");
  const [hours, minutes] = timeString.split(":");

  // Create a new Date object with the date and time, adjusted for the timezone offset
  const newDate = new Date(year, month, day, Number(hours), Number(minutes), 0);
  console.log("newDate: ", newDate);

  // newDate.setMinutes(newDate.getMinutes() + timezoneOffset);
  console.log("newDate: ", newDate);

  return newDate;
}
