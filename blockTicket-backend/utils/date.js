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

const getDate = (newDate) => {
  return (
    weekday[new Date(newDate).getDay()] +
    " " +
    new Date(newDate).getDate() +
    " " +
    monthNames[new Date(newDate).getMonth()] +
    " " +
    new Date(new Date()).getFullYear()
  );
};

module.exports = getDate;
