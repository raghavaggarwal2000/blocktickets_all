import * as React from "react";
import Select from "react-select";
import InputLabel from "@mui/material/InputLabel";
import { useForm, Controller } from "react-hook-form";

export default function SelectField({
  options,
  label,
  required,
  errors,
  control,
  field,
}) {
  return (
    <div className="w-full">
      <InputLabel shrink>
        {label} {required && <sup className="text-red">*</sup>}
      </InputLabel>
      <Controller
        name={field}
        control={control}
        rules={{ required }}
        render={({ field: { onChange, value } }) => (
          <Select
            value={value}
            onChange={onChange}
            options={options}
            className="basic-single"
            classNamePrefix="select"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                text: "orangered",
                primary25: "#fa6400",
                primary: "black",
              },
            })}
          />
        )}
      />

      {errors[field]?.message && (
        <p className="mt-[2px] mb-0 text-xs text-red">
          *{errors[field]?.message}
        </p>
      )}
    </div>
  );
}
