const timezoneIST = (d) =>{
    // const istTime = new Date(date).toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
    d = new Date(d);
    d.setHours(d.getHours() + 5);
    d.setMinutes(d.getMinutes() + 30);

    return d;
}

module.exports = {timezoneIST};