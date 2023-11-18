import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Forms = lazy(() => import("../pages/Forms"));
const Cards = lazy(() => import("../pages/Cards"));
const Charts = lazy(() => import("../pages/Charts"));
const Buttons = lazy(() => import("../pages/Buttons"));
const Modals = lazy(() => import("../pages/Modals"));
const Tables = lazy(() => import("../pages/Tables"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const EventDetails = lazy(() => import("../pages/new/EventDetails"));
const Events = lazy(() => import("../pages/new/Events"));
const EventStats = lazy(() => import("../pages/new/EventStats"));
const TicketDetails = lazy(() => import("../pages/new/TicketDetails"));
const Tickets = lazy(() => import("../pages/new/TicketList"));
const UsersList = lazy(() => import("../pages/new/UsersList"));
const MarketplaceNft = lazy(() => import("../pages/new/MarketplaceNft"));
const PromoCode = lazy(() => import("../pages/new/PromoCode"));
const ViewPromoCode = lazy(() => import("../pages/new/ViewPromoCode"));
const EventCreatorRequests = lazy(() =>
  import("../pages/new/EventCreatorRequests")
);
const EventListingRequests = lazy(() =>
  import("../pages/new/EventListingRequests.js")
);
const IgnoreList = lazy(() => import("../pages/new/IgnoreList"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  // ! New routes start
  {
    path: "/events",
    component: Events,
  },
  {
    path: "/tickets",
    component: Tickets,
  },
  {
    path: "/event/eventDetails/:eventId",
    component: EventDetails,
  },
  {
    path: "/ticket/:orderId",
    component: TicketDetails,
  },
  {
    path: "/users",
    component: UsersList,
  },
  {
    path: "/marketplace-nft",
    component: MarketplaceNft,
  },
  {
    path: "/event/eventStats/:eventId",
    component: EventStats,
  },
  {
    path: "/event-creator-requests",
    component: EventCreatorRequests,
  },
  {
    path: "/event-listing-requests",
    component: EventListingRequests,
  },

  // ! new routes end
  {
    path: "/forms",
    component: Forms,
  },
  {
    path: "/cards",
    component: Cards,
  },
  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/buttons",
    component: Buttons,
  },
  {
    path: "/modals",
    component: Modals,
  },
  {
    path: "/tables",
    component: Tables,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/ignore-list",
    component: IgnoreList,
  },
  {
    path: "/promo-code",
    component: PromoCode,
  },
  {
    path: "/promo-code/info/:id",
    component: ViewPromoCode,
  },
];

export default routes;
