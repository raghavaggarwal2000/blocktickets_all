import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import useCollapse from "react-collapsed";
import { useEffect } from "react";
import Dot from "../../images/assets/dot.svg";

const CollapseInfoBar = ({ list, optionalText }) => {
  const [listItem, setListItem] = useState([]);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
  function removeSpecialChars(string) {
    // Use the replace() method to remove the forward slash '/'
    var newString = string?.replace(/\\/g, "");

    // Use the replace() method to remove the double quote '"'
    newString = newString?.replace(/"/g, "");
    return newString;
  }
  const splitTextByNewLine = (text) => {
    let updatedStr = JSON.stringify(text)?.split("\\n");
    updatedStr = updatedStr?.map(function (string) {
      if (string?.trim()?.endsWith("/")) {
        return string.slice(0, -1);
      }
      return string;
    });
    setListItem(updatedStr);
  };
  // const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
  //   // defaultExpanded: true,
  // });

  useEffect(() => {
    splitTextByNewLine(list);
  }, []);
  return (
    <div className="collapsible ">
      <div
        className={
          (isExpanded ? "" : "") +
          `header font-bold text-sm lg:text-lg px-4 pt-2 lg:pt-4 pb-2 flex items-center justify-start`
        }
        {...getToggleProps({
          onClick: () => setExpanded((prevExpanded) => !prevExpanded),
        })}
      >
        <span className="mr-1">
          {isExpanded ? "Ticket Includes" : "Ticket Includes"}{" "}
        </span>
        {isExpanded ? (
          // <KeyboardArrowDownIcon fontSize="large" />
          <span className="text-xl mt-[-2px]">-</span>
        ) : (
          // <ChevronRightIcon fontSize="large" />
          <span className="text-xl">+</span>
        )}
      </div>
      <div className="px-4 pb-4" {...getCollapseProps()}>
        {!(listItem?.length > 100) &&
          listItem?.map((lis) => {
            return (
              <div
                key={uuid()}
                className="mb-0 font-medium text-[14px] flex flew-row items-center capitalize"
              >
                <img className="mr-2 h-[4px] mt-1" src={Dot} alt="listbox" />{" "}
                {removeSpecialChars(lis)}
              </div>
            );
          })}

        {optionalText && (
          <div className="mb-0 font-medium text-[14px] flex flew-row items-start ">
            <img className="mr-2 h-[4px] mt-2" src={Dot} alt="listbox" />{" "}
            {optionalText}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapseInfoBar;
