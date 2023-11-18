import React, { useState, useEffect } from "react";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const DateTimeInput = ({
  label,
  required,
  register,
  setValue,
  value,
  watch,
}) => {
  const watchDate = watch([value]);
  const currDate = new Date().toISOString();
  const [dateWithInitialValue, setDateWithInitialValue] = React.useState(
    dayjs(watchDate[0])
  );

  return (
    <div className="w-full">
      <InputLabel shrink htmlFor="time-input">
        {label} {required && <sup className="text-red">*</sup>}
      </InputLabel>
      <LocalizationProvider sx={{ width: "100%" }} dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          className="bg-[#2b2b2b] rounded-lg h-[49px] border-1 border-white"
          value={dateWithInitialValue}
          onChange={(newValue) => {
            console.log("newValue: ", dayjs(newValue["$d"]).toISOString());
            setDateWithInitialValue(newValue);
            setValue(value, dayjs(newValue["$d"]).toISOString());
          }}
          //   label="Start"
          onError={console.log}
          minDate={dayjs(currDate)}
          inputFormat="YYYY/MM/DD hh:mm a"
          mask="____/__/__ __:__ _M"
          renderInput={(params) => (
            <TextField
              sx={{ width: "100%" }}
              onChange={(e) => console.log(e)}
              // {...register(value, { required: required })}
              {...params}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DateTimeInput;
