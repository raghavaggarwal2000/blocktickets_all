import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Select,
  HelperText,
  Textarea,
} from "@windmill/react-ui";
import Loading from "../../../components/new/Loading";
import useForm from "../../../hooks/useForm";
import validate from "../../../validations/eventValidationRules";
import { EventServices } from "../../../services/api-client";
import toast from "react-hot-toast";
import TextEditor from "../../../components/TextEditor/TextEditor";
const ArtistDetailsForm = ({ eventDetails, errorMessage, getEventById }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [artistDescription, setArtistDescription] = useState("");

  const {
    values,
    errors,
    setIsSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  } = useForm(submitForm, validate);

  useEffect(() => {
    if (!isShowForm) setErrors(false);
  }, [isShowForm]);

  function submitForm() {
    updateArtist();
  }
  const toggleEditForm = () => {
    setIsShowForm(!isShowForm);

    setValues({
      name: eventDetails.Event?.artist?.name,
      image: eventDetails.Event?.artist?.image,
    });
    setArtistDescription(eventDetails.Event?.artist?.about);
  };

  const updateArtist = async () => {
    try {
      setIsLoading(true);
      let artistValues = values;
      let artistId = eventDetails.Event?.artist?._id;
      artistValues = {
        ...artistValues,
        about: artistDescription,
      };
      const updateArtistResponse = await EventServices.updateArtistData(
        artistValues,
        artistId
      );
      console.log("artist", updateArtistResponse);
      if (updateArtistResponse.status === 200) {
        toast.success(updateArtistResponse.data.message);
        getEventById();
        setIsShowForm(false);
      }
      setIsSubmitting(false);
      setIsLoading(false);
    } catch (error) {
      setIsSubmitting(false);
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <>
      <div className='flex justify-start'>
        <Button layout='outline' className='mb-2' onClick={toggleEditForm}>
          Edit Artist Details
        </Button>
      </div>
      {isShowForm && (
        <div className='px-4 grid-cols-2 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
          <Label className='mt-4 mx-1 w-1/2'>
            <span>Artist Name</span>
            <Input
              className='mt-1'
              placeholder='Name'
              name='name'
              onChange={handleChange}
              value={values.name}
            />
            {errorMessage(errors.name)}
          </Label>

          <Label className='mt-4 ml-1'>
            <span>Event Description</span>
            <TextEditor
              description={artistDescription}
              setDescription={setArtistDescription}
            />
          </Label>

          <div className='footer'>
            <Button className='mt-4' onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtistDetailsForm;
