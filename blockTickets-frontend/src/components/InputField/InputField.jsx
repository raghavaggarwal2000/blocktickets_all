import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const InputField = ({
  value,
  label,
  placeholder,
  type,
  register,
  errors,
  required,
  className,
  disabled,
  min,
  max,
  option,
  multiplier,
}) => {
  let options = { required };
  let range = "";

  if (typeof min == "number" && typeof max == "number") {
    options = {
      ...options,
      minLength: { value: min, message: "Min value is 0" },
      maxLength: { value: max, message: "Max value is 100" },
    };
    range = `(${min}-${max})`;
  }

  return (
    <FormControl
      className={className}
      fullWidth
      sx={{ m: 0.5 }}
      variant="standard"
    >
      {label && (
        <InputLabel shrink htmlFor="bootstrap-input">
          {label} {range} {required && <sup className="text-red">*</sup>}
        </InputLabel>
      )}
      <BootstrapInput
        className="w-full"
        type={type}
        placeholder={placeholder}
        id={value}
        disabled={disabled}
        {...register(value, options)}
      />
      {errors[value]?.message && (
        <p className="mt-[2px] mb-0 text-xs text-red">
          *{errors[value]?.message}
        </p>
      )}
    </FormControl>
  );
};

export const InfoInputField = ({
  label,
  placeholder,
  field,
  register,
  errors,
  required,
  className,
  getValues,
  setValue,
  watch,
  index,
}) => {
  console.log("field", field);
  return (
    <div className={`${className} w-full`}>
      <InputLabel shrink htmlFor="bootstrap-input">
        {label} {required && <sup className="text-red">*</sup>}
      </InputLabel>
      <textarea
        className="h-[130px] textarea"
        placeholder={placeholder}
        type="text"
        id={field}
        rows={5}
        multiline
        fullWidth
        name={field}
        value={getValues(`tickets[${index}].ticketInfo`)}
        onChange={(e) =>
          setValue(`tickets[${index}].ticketInfo`, e.target.value)
        }
      />
    </div>
  );
};

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));
export default InputField;
