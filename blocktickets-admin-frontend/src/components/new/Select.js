import React from "react";
import Select from "react-select";

const CustomSelect = (props) => {
  return (
    <Select
      {...props}
      options={props.options}
      placeholder={props.placeholder}
    />
  );
};

export default CustomSelect;
