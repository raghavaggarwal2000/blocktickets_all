import React from "react";
import classNames from "classnames";

function RoundIcon({
  icon: Icon,
  iconColorClass = "text-orange-600 dark:text-orange-100",
  bgColorClass = "bg-orange-100 dark:bg-orange-600",
  className,
}) {
  const baseStyle = "p-3 rounded-full";

  const cls = classNames(baseStyle, iconColorClass, bgColorClass, className);
  return (
    <div className={cls}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

export default RoundIcon;
