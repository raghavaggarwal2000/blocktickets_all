import React from "react";

function Chart({children, titleLeft, titleRight}) {
  return (
    <div className=" min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <div className="flex flex-row justify-between">
        <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
          {titleLeft}
        </p>
        <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
          {titleRight}
        </p>
      </div>
      {children}
    </div>
  );
}

export default Chart;
