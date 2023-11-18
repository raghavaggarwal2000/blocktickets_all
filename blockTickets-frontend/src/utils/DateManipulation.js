// Date Formatting
export const getDay = (t) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(t);
  let day = d.getDay();
  return days[day];
};
export const getMonth = (t) => {
  const month = [
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
  const d = new Date(t);
  let name = month[d.getMonth()];
  return name;
};
export const getYear = (t) => {
  const d = new Date(t);
  let year = d.getFullYear();
  return year;
};
