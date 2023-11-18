/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar,
    showTo: [1, 2], // visible to
  },
  {
    path: "/app/events",
    icon: "FormsIcon",
    name: "All Events",
    showTo: [1, 2],
  },
  {
    path: "/app/tickets",
    icon: "CardsIcon",
    name: "Tickets sale",
    showTo: [1, 2],
  },

  {
    path: "/app/users",
    icon: "UsersIcon",
    name: "All Users",
    showTo: [2],
  },
  // {
  //   path: "/app/marketplace-nft",
  //   icon: "CardsIcon",
  //   name: "MarketPlace Nfts",
  //   showTo: [1,2]
  // },
  {
    path: "/app/event-creator-requests",
    icon: "CardsIcon",
    name: "Event Creator Approval",
    showTo: [2],
  },
  {
    path: "/app/event-listing-requests",
    icon: "CardsIcon",
    name: "Event Listing Approval",
    showTo: [2],
  },
  {
    path: "/app/ignore-list",
    icon: "CardsIcon",
    name: "Ignore List",
    showTo: [2],
  },
  {
    path: "/app/promo-code",
    icon: "CardsIcon",
    name: "Promo Code",
    showTo: [2],
  },
  // {
  //   path: "/app/charts",
  //   icon: "ChartsIcon",
  //   name: "Charts"
  // },
  // {
  //   path: "/app/buttons",
  //   icon: "ButtonsIcon",
  //   name: "Buttons"
  // },
  // {
  //   path: "/app/modals",
  //   icon: "ModalsIcon",
  //   name: "Modals"
  // },
  // {
  //   path: "/app/tables",
  //   icon: "TablesIcon",
  //   name: "Tables"
  // },
  // {
  //   icon: "PagesIcon",
  //   name: "Pages",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/login",
  //       name: "Login"
  //     },
  //     {
  //       path: "/create-account",
  //       name: "Create account"
  //     },
  //     {
  //       path: "/forgot-password",
  //       name: "Forgot password"
  //     },
  //     {
  //       path: "/app/404",
  //       name: "404"
  //     },
  //     {
  //       path: "/app/blank",
  //       name: "Blank"
  //     }
  //   ]
  // }
];

export default routes;
