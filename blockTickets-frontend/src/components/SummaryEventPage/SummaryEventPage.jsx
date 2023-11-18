import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getTicketEventDetails } from "../../Redux/action";
import { useDispatch } from "react-redux";
import { EventServices } from "../../api/supplier";
import { Helmet } from "react-helmet";
import CollapseBar from "../Collapse/Collapse";
import Typography from "@mui/material/Typography";
import { tConvert } from "../../utils/timeConvert";
import Loading from "../../Loading/Loading";
// svg icons
import OrganiserLogo from "../../images/icons/Royallogo.png";
import Calendar from "../../images/icons/svg/CalendarV2.svg";
import Block from "../../images/icons//svg/BlockchainV2.svg";
import Car from "../../images/icons/car.svg";
import Clock2 from "../../images/icons/svg/Clock1V2.svg";
import Location3 from "../../images/icons/svg/LocationV2.svg";
import Person2 from "../../images/icons/svg/PersonProfileV2.svg";
import Valet from "../../images/icons/svg/valetParkingV2.svg";
import Wifi from "../../images/icons/svg/WifiV2.svg";
import Food from "../../images/icons/svg/FoodV2.svg";
import DressCode from "../../images/icons/svg/tuxedoV2.svg";
import Alcohol from "../../images/icons/svg/CocktailV2.svg";
import getSymbolFromCurrency from "currency-symbol-map";
import { getDate } from "../../utils/date";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import FullHeart from "../../images/icons/svg/PinkHeartV2.svg";
import Heart from "../../images/icons/svg/HeartV2.svg";

const SummaryEventPage = ({ data }) => {
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="col-span-full mt-[10px] w-[inherit] relative bg-black min-h-screen h-auto">
          <div className="bg-blackishGray border-2">
            <div className="overflow-hidden border-b-2 relative border-borderMain mx-auto min-h-[30vh]">
              {data["Event Banner Image"]?.s3 ? (
                <img
                  className="mx-auto w-full hidden lg:block h-auto inherit-position object-contain"
                  src={data["Event Banner Image"]?.s3}
                  alt="event-banner"
                  loading=" lazy"
                />
              ) : (
                <div className=" flex items-center justify-center text-white font-bold h-full w-full hidden lg:block  inherit-position object-contain">
                  {" "}
                  No image uploaded
                </div>
              )}
              {data["Event Banner Image"]?.s3 ? (
                <img
                  className="mx-auto w-full block lg:hidden h-auto inherit-position object-contain"
                  src={data["Event Square Banner Image"]?.s3}
                  alt="event-banner"
                  loading=" lazy"
                />
              ) : (
                <div className=" flex items-center justify-center text-white font-bold lg:hidden   h-full w-full w-full hidden   inherit-position object-contain">
                  No image uploaded
                </div>
              )}
            </div>
            <div className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-x-6">
                <div className="ml-6 mr-1 lg:ml-0 lg:mr-0 xl:mx-6 mb-[1.4rem] col-span-full flex justify-between items-center">
                  <h2 className=" text-[1.5rem] text-orangeDark">
                    {data?.eventTitle}
                  </h2>
                </div>
                <div className="ml-6 md:col-span-2">
                  <p className="grid grid-cols-5 mb-2 text-white text-base gap-x-1">
                    <div className="col-span-1 ml-2">
                      <img
                        className="h-[30px]"
                        src={Calendar}
                        alt="Calendar"
                        loading=" lazy"
                      />
                    </div>{" "}
                    {data?.startDateTime && (
                      <p className="col-span-4 w-full flex justify-start items-center mb-0">
                        {getDate(data?.startDateTime)}
                      </p>
                    )}
                  </p>
                  <p className="grid grid-cols-5 mb-2 text-white text-base gap-x-1">
                    <div className="col-span-1 ml-2">
                      <img
                        className="h-[30px]"
                        src={Clock2}
                        alt="Clock"
                        loading=" lazy"
                      />
                    </div>{" "}
                    {data?.startDateTime && (
                      <p className="col-span-4 w-full flex justify-start items-center mb-0">
                        {tConvert(data?.startDateTime)}
                      </p>
                    )}
                  </p>
                  <a
                    href={data?.eventVenueLink}
                    target="_blank"
                    className="hover:cursor-pointer hover:underline grid grid-cols-5 mb-2 text-white text-base gap-x-1"
                  >
                    <div className="col-span-1 ml-2">
                      {" "}
                      <img
                        className="h-[30px]"
                        loading=" lazy"
                        src={Location3}
                        alt="Location"
                      />
                    </div>{" "}
                    <p className="col-span-4 w-full flex justify-start items-center mb-0">
                      {data?.eventVenueLink}
                    </p>
                  </a>
                </div>
                <div className="ml-6 md:col-span-2">
                  {data?.ageRequirement?.value && (
                    <p className="grid grid-cols-5 mb-2 text-white text-base gap-x-1">
                      <div className="col-span-1 ml-2">
                        <img
                          className="h-[30px] "
                          src={Person2}
                          alt="Person"
                          loading=" lazy"
                        />
                      </div>{" "}
                      <p className="col-span-4 w-full flex justify-start items-center mb-0">
                        {data?.ageRequirement?.value}
                      </p>
                    </p>
                  )}
                  {data?.valeParking?.value && (
                    <p className="grid grid-cols-5 mb-2 text-white text-base gap-x-1">
                      <div className="col-span-1 ml-2">
                        <img
                          className="h-[30px] "
                          src={Valet}
                          alt="Car"
                          loading=" lazy"
                        />
                      </div>{" "}
                      <p className="col-span-4 w-full flex justify-start items-center mb-0">
                        {data?.valeParking?.value}
                      </p>
                    </p>
                  )}
                  <p className="grid grid-cols-5 mb-2 text-white text-base gap-x-1">
                    <div className="col-span-1 ml-2">
                      <img
                        className="h-[30px]"
                        src={Block}
                        alt="Block"
                        loading=" lazy"
                      />{" "}
                    </div>
                    <p className="col-span-4 w-full flex justify-start items-center mb-0">
                      Blockchain minted ticket
                    </p>
                  </p>
                </div>
                <div className="mt-[20px] md:mt-0 flex items-center justify-start mx-auto  md:mx-0 flex-col gap-4">
                  <p className="text-orangeLight mb-0 text-[21px] font-semibold">
                    from{" "}
                    {data?.currency?.value === "AED"
                      ? "AED"
                      : getSymbolFromCurrency(data?.currency?.value)}{" "}
                    {Math.min(...data?.tickets.map((item) => item.ticketPrice))}{" "}
                  </p>
                </div>
              </div>
            </div>

            <CollapseBar
              heading={data?.eventTitle}
              children={
                <Typography
                  variant="p"
                  dangerouslySetInnerHTML={{
                    __html: data?.eventDescription,
                  }}
                >
                  {/* {event?.Event?.eventDescription} */}
                </Typography>
              }
            />
            <CollapseBar
              heading={"About the Performer"}
              children={<AboutPerformer artist={data} />}
            />
            <CollapseBar
              heading={"More info"}
              children={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6">
                  <div className="ml-6 md:col-span-2">
                    {data?.valeParking?.value && (
                      <p className="mb-2 text-white text-base flex gap-x-2 justify-start items-center">
                        <img
                          className="h-[30px]  w-[30px]"
                          src={Car}
                          alt="Car"
                          loading=" lazy"
                        />{" "}
                        {data?.valeParking?.value === "Yes"
                          ? "Valet parking available"
                          : "Valet parking not available"}
                      </p>
                    )}
                    <p className="mb-2 text-white text-base flex gap-x-2 justify-start items-center">
                      <img
                        className="h-[30px]"
                        src={Food}
                        alt="Alcohol"
                        loading=" lazy"
                      />{" "}
                      {data?.foodAndBeverage?.value === "Yes"
                        ? "Food available"
                        : "Food not available"}
                    </p>
                    <p className="mb-2 text-white text-base flex gap-x-2 justify-start items-center">
                      <img
                        className="h-[30px] w-[30px]"
                        src={Wifi}
                        alt="Wifi"
                        loading=" lazy"
                      />{" "}
                      {data?.freeWifi?.value === "Yes"
                        ? "Free Wifi"
                        : "No free Wifi"}
                    </p>
                  </div>
                  <div className="ml-6 md:col-span-2">
                    <p className="mb-2 text-white text-base flex gap-x-2 justify-start items-center">
                      <img
                        className="h-[30px]"
                        src={Alcohol}
                        alt="Food"
                        loading=" lazy"
                      />{" "}
                      {data?.alcoholicDrink?.value === "Yes"
                        ? "Alcohol available "
                        : "Alcohol not available "}
                    </p>
                    {data?.dressCode?.value && (
                      <p className="mb-2 text-white text-base flex gap-x-2 justify-start items-center">
                        <img
                          className="h-[30px]"
                          src={DressCode}
                          loading=" lazy"
                          alt="DressCode"
                        />{" "}
                        {data?.dressCode?.value}
                      </p>
                    )}
                  </div>
                </div>
              }
            />
            <CollapseBar
              heading={"About the Organizer"}
              children={<AboutOrganizer data={data} />}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryEventPage;

export const AboutOrganizer = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 md:grid-cols-6">
      <div className="col-span-1">
        {data && data["Logo"]?.s3 ? (
          <img src={data["Logo"]?.s3} alt="organiserLogo" loading=" lazy" />
        ) : (
          <div className="bg-silver rounded-lg h-full w-full flex items-center justify-center">
            No image uploaded
          </div>
        )}
      </div>
      <div className="lg:ml-6 col-span-2 flex flex-col justify-start font-bold">
        {data?.numOfEvents?.value && (
          <p className="mb-0 text-md md:text-xl">
            <span className=" text-silver">No. Events: </span>{" "}
            {data?.numOfEvents?.value}
          </p>
        )}
        {data?.experienceLevel?.value && (
          <p className="mb-0 text-md md:text-xl">
            <span className=" text-silver">No. years active: </span>{" "}
            {data?.experienceLevel?.value}
          </p>
        )}
        {data?.peopleAttended && (
          <p className="mb-0 text-md md:text-xl">
            <span className=" text-silver">Largest Event: </span>{" "}
            {data?.peopleAttended} pax
          </p>
        )}
      </div>

      <div className="col-span-3 organiserInfo">
        <p
          className="mb-0 text-base"
          dangerouslySetInnerHTML={{
            __html: data?.organiserDescription,
          }}
        ></p>
      </div>
    </div>
  );
};

export const AboutPerformer = ({ artist }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 md:grid-cols-4">
      <div className="col-span-1">
        {artist["Artist image"]?.s3 && (
          <img
            src={artist["Artist image"]?.s3}
            alt="artist-icon"
            loading=" lazy"
          />
        )}
      </div>
      <div className="lg:ml-6 col-span-3 flex flex-col justify-start font-bold flex justify-center items-start">
        {artist?.artistName && (
          <p className="mb-0 text-md md:text-xl">{artist?.artistName}</p>
        )}

        <div className="col-span-3 organiserInfo">
          <p
            className="mb-0 text-base"
            dangerouslySetInnerHTML={{
              __html: artist?.aboutPerformer,
            }}
          ></p>
        </div>
      </div>
    </div>
  );
};
