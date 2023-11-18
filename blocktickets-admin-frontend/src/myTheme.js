export default {
  button: {
    // base: " bg-red-100 border border-transparent",
    primary: {
      base: "text-white bg-orange-600 border border-transparent",
      active:
        "active:bg-orange-600 hover:bg-orange-700 focus:ring focus:ring-orange-300",
      disabled: "opacity-50 cursor-not-allowed",
    },
  },
  badge: {
    base: "inline-flex px-2 text-xs font-medium leading-5 rounded-full",
    success:
      "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
    danger: "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700",
    warning: "text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600",
    neutral: "text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700",
    primary: "text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600",
  },
};
