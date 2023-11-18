import React, { useState, useRef } from "react";
import { Button, Badge } from "@windmill/react-ui";
import { EventServices, uploadImage } from "../../../services/api-client";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useQuery from "../../../hooks/useQuery";
import ImagEditHelper from "./imageEditHelper";

const Details = ({ eventDetails, verifyEvent, setIsLoading, getEventById }) => {
  const [toggleBanner, setToggleBanner] = useState(false);
  const [toggleOrganizer, setToggleOrganizer] = useState(false);
  const [toggleArtist, setToggleArtist] = useState(false);
  const { eventId } = useParams();
  let query = useQuery();
  const view = Boolean(query.get("view"));

  const toggleEditImageSection = (e, sectionName) => {
    if (e) e.preventDefault();

    switch (sectionName) {
      case "banner":
        setToggleBanner(!toggleBanner);
        break;
      case "organizer":
        setToggleOrganizer(!toggleOrganizer);
        break;
      case "artist":
        setToggleArtist(!toggleArtist);
        break;
      default:
        break;
    }
  };
  return (
    <section className='text-gray-600 body-font'>
      <div className='container py-8 mx-auto'>
        <div className='flex flex-col gap-5 justify-center items-center text-center w-full mb-10'>
          <h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 dark:text-gray-200'>
            {eventDetails?.Event?.eventTitle}
          </h1>

          {/* Edit Banner Images */}

          <Button
            layout='outline'
            className='mb-2 w-4/12'
            onClick={(e) => toggleEditImageSection(e, "banner")}
          >
            Edit Banner Images
          </Button>

          {/* Edit banner images */}
          {toggleBanner && (
            <div className='flex flex-row gap-3'>
              <ImagEditHelper
                id={eventId}
                setIsLoading={setIsLoading}
                getEventById={getEventById}
                displayImage={eventDetails?.Event?.eventImageCompress}
                name={eventDetails?.Event?.eventTitle}
                info={eventDetails?.Event?.eventDescription}
                imageType={`eventImageOriginal`}
                btnTitle={`Replace Banner Image`}
                collectionType={"event"}
                needOriginal={true}
              />
              <ImagEditHelper
                id={eventId}
                setIsLoading={setIsLoading}
                getEventById={getEventById}
                displayImage={eventDetails?.Event?.eventSquareImage}
                name={eventDetails?.Event?.eventTitle}
                info={eventDetails?.Event?.eventDescription}
                imageType={`eventSquareImage`}
                btnTitle={`Replace Square Banner`}
                collectionType={"event"}
                needOriginal={false}
              />
              <ImagEditHelper
                id={eventId}
                setIsLoading={setIsLoading}
                getEventById={getEventById}
                displayImage={eventDetails?.Event?.seatingImage }
                name={eventDetails?.Event?.eventTitle}
                info={eventDetails?.Event?.eventDescription}
                imageType={`seatingImage`}
                btnTitle={`Replace Seating Image`}
                collectionType={"event"}
                needOriginal={false}
              />
            </div>
          )}

          {/*  Edit Organizer Images */}

          <Button
            layout='outline'
            className='mb-2 w-4/12'
            onClick={(e) => toggleEditImageSection(e, "organizer")}
          >
            Edit Organizer Images
          </Button>
          {/* Edit Organizer Images */}
          {toggleOrganizer && (
            <ImagEditHelper
              id={eventDetails?.Event?.organizer?._id}
              setIsLoading={setIsLoading}
              getEventById={getEventById}
              displayImage={eventDetails?.Event?.organizer?.logoCompress}
              name={eventDetails?.Event?.eventTitle}
              info={eventDetails?.Event?.eventDescription}
              imageType={"organizerLogoImage"}
              btnTitle={`Replace Organizer Image`}
              collectionType={"organizer"}
              needOriginal={true}
            />
          )}

          {/* Toggle buttons */}

          <Button
            layout='outline'
            className='mb-2 w-4/12'
            onClick={(e) => toggleEditImageSection(e, "artist")}
          >
            Edit Artist Images
          </Button>

          {/* Edit Artist Images */}
          {toggleArtist && (
            <ImagEditHelper
              id={eventDetails?.Event?.artist?._id}
              setIsLoading={setIsLoading}
              getEventById={getEventById}
              displayImage={eventDetails?.Event?.artist?.image}
              name={eventDetails?.Event?.eventTitle}
              info={eventDetails?.Event?.eventDescription}
              imageType={`artistImage`}
              btnTitle={`Replace Artist Image`}
              collectionType={`artist`}
              needOriginal={false}
            />
          )}

          <div className='lg:w-2/3 grid grid-cols-1 lg:grid-cols-2 mx-auto mt-5 leading-relaxed text-base'>
            {eventDetails?.Event?.isVerified
              ? view && <Badge type={"success"}>Verified</Badge>
              : view && (
                  <Button onClick={() => verifyEvent(eventDetails?.Event?._id)}>
                    Verify Event
                  </Button>
                )}
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: eventDetails?.Event?.eventDescription,
            }}
            className='lg:w-full px-2 mx-auto text-justify mt-5 leading-relaxed text-base dark:text-gray-200'
          ></p>
        </div>
        <div className='flex flex-wrap -m-2'>
          <div className='p-2 lg:w-1/3 md:w-1/2 w-full'>
            <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
              <img
                alt='team'
                className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
                src='https://dummyimage.com/80x80'
              />
              <div className='flex-grow'>
                <h2 className='text-gray-900 title-font font-medium dark:text-gray-200'>
                  Total Tickets
                </h2>
                <p className='text-gray-500'>
                  {eventDetails?.Event?.totalTicket}
                </p>
              </div>
            </div>
          </div>
          <div className='p-2 lg:w-1/3 md:w-1/2 w-full'>
            <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
              <img
                alt='team'
                className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
                src='https://dummyimage.com/84x84'
              />
              <div className='flex-grow'>
                <h2 className='text-gray-900 title-font font-medium dark:text-gray-200'>
                  Total Booked
                </h2>
                <p className='text-gray-500'>
                  {eventDetails?.Event?.totalBooked}
                </p>
              </div>
            </div>
          </div>
          <div className='p-2 lg:w-1/3 md:w-1/2 w-full'>
            <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
              <img
                alt='team'
                className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
                src='https://dummyimage.com/88x88'
              />
              <div className='flex-grow'>
                <h2 className='text-gray-900 title-font font-medium dark:text-gray-200'>
                  Status
                </h2>
                <p className='text-gray-500'>
                  {eventDetails?.Event?.eventStatus}
                </p>
              </div>
            </div>
          </div>
          <div className='p-2 lg:w-1/3 md:w-1/2 w-full'>
            <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
              <img
                alt='team'
                className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
                src='https://dummyimage.com/90x90'
              />
              <div className='flex-grow'>
                <h2 className='text-gray-900 title-font font-medium dark:text-gray-200'>
                  Location
                </h2>
                <p className='text-gray-500'>{eventDetails?.Event?.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
