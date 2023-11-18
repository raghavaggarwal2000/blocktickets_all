import React, { useState, useRef } from "react";
import { Button, Badge } from "@windmill/react-ui";
import { EventServices, uploadImage } from "../../../services/api-client";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useQuery from "../../../hooks/useQuery";

const ImagEditHelper = ({
  id,
  setIsLoading,
  displayImage,
  getEventById,
  name,
  info,
  imageType,
  btnTitle,
  collectionType,
  needOriginal,
}) => {
  let query = useQuery();
  const view = Boolean(query.get("view"));
  const imageInputRef = useRef(null);

  console.log("updateEventImage outside", id);

  const updateEventImage = async (e, name, info, imageType, needOriginal) => {
    try {
      setIsLoading(true);
      const res = await uploadImage(e, name, info, imageType, needOriginal);
      // console.log("updateEventImage inside", imageType);
      const formData = new FormData();
      if (needOriginal) {
        formData.append("image", res?.pinataImage);
        formData.append("uri", res.uri);
      }
      formData.append("imageType", imageType);
      formData.append("s3", res?.s3_upload);

      const response =
        (collectionType == "event" &&
          (await EventServices.updateEventImage(id, formData))) ||
        (collectionType == "artist" &&
          (await EventServices.updateArtistImage(id, formData))) ||
        (collectionType == "organizer" &&
          (await EventServices.updateOrganizerImage(id, formData)));

      if (response.status === 200) {
        toast.success("Image uploaded");
      }

      setIsLoading(false);
      getEventById();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data?.error
          ? error.response.data.error
          : error.message || "Bad Request!"
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-center flex-col w-full max-h-md'>
        <img
          src={displayImage}
          className='p-1 bg-white border rounded max-w-sm md:max-w-lg '
          alt='Banner Image'
          style={{ maxHeight: "260px" }}
        />
        <div className='box'>
          <input
            ref={imageInputRef}
            type='file'
            id='eventImageInput'
            name='image'
            onChange={(e) => {
              updateEventImage(e, name, info, imageType, needOriginal);
            }}
            style={{ display: "none" }}
            accept='image/png, image/jpeg'
          />
          {!view && (
            <Button
              className='mt-2'
              onClick={() => imageInputRef.current.click()}
            >
              {btnTitle}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ImagEditHelper;
