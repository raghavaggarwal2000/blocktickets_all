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

const OrganizerDetailsForm = ({ eventDetails, errorMessage, getEventById }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [organizerDescription, setOrganizerDescription] = useState("");

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
    updateOrganizerData();
  }
  const toggleEditForm = () => {
    setIsShowForm(!isShowForm);

    setValues({
      organizerName: eventDetails.Event?.organizer?.organizerName,
      experienceLevel: eventDetails.Event?.organizer?.experienceLevel,
      category: eventDetails.Event?.organizer?.category,
      eventType: eventDetails.Event?.organizer?.eventType,
      referral: eventDetails.Event?.organizer?.referral,
      peopleAttended: eventDetails.Event?.organizer?.peopleAttended,
      teamSize: eventDetails.Event?.organizer?.teamSize,
      numOfEvents: eventDetails.Event?.organizer?.numOfEvents,
    });
    setOrganizerDescription(eventDetails.Event?.organizer?.aboutOrganizer);
  };
  // console.log("artist", eventDetails.Event?.organizer);

  const updateOrganizerData = async () => {
    try {
      setIsLoading(true);
      let organizerValues = values;
      let organizerId = eventDetails.Event?.organizer?._id;
      organizerValues = {
        ...organizerValues,
        aboutOrganizer: organizerDescription,
      };
      const updateOrganizerResponse = await EventServices.updateOrganizerData(
        organizerValues,
        organizerId
      );
      if (updateOrganizerResponse.status === 200) {
        console.log(updateOrganizerResponse);
        toast.success(updateOrganizerResponse.data.message);
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
          Edit Organizer Details
        </Button>
      </div>
      {isShowForm && (
        <div className='px-4 grid-cols-2 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
          <div className='flex justify-between'>
            <Label className='mt-4 mx-1 w-1/2'>
              <span>Organizer Name</span>
              <Input
                className='mt-1'
                placeholder='Name'
                name='organizerName'
                onChange={handleChange}
                value={values?.organizerName}
              />
              {errorMessage(errors.organizerName)}
            </Label>

            <Label className='mt-4 mx-1 w-1/2'>
              <span>Experience Level</span>
              <Input
                className='mt-1'
                placeholder='1-5 years'
                name='experienceLevel'
                onChange={handleChange}
                value={values?.experienceLevel}
              />
              {errorMessage(errors.experienceLevel)}
            </Label>
          </div>

          <div className='flex justify-between'>
            <Label className='mt-4 mx-1 w-1/2'>
              <span>category</span>
              <Input
                className='mt-1'
                placeholder='Name'
                name='category'
                onChange={handleChange}
                value={values?.category}
              />
              {errorMessage(errors.category)}
            </Label>

            <Label className='mt-4 mx-1 w-1/2'>
              <span>Event Type</span>
              <Input
                className='mt-1'
                placeholder='1-5 years'
                name='eventType'
                onChange={handleChange}
                value={values?.eventType}
              />
              {errorMessage(errors.eventType)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mx-1 w-1/2'>
              <span>Referral</span>
              <Input
                className='mt-1'
                placeholder='Name'
                name='referral'
                onChange={handleChange}
                value={values?.referral}
              />
              {errorMessage(errors.referral)}
            </Label>

            <Label className='mt-4 mx-1 w-1/2'>
              <span>People Attended</span>
              <Input
                className='mt-1'
                placeholder='1-5 years'
                name='peopleAttended'
                onChange={handleChange}
                value={values?.peopleAttended}
              />
              {errorMessage(errors.peopleAttended)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mx-1 w-1/2'>
              <span>Team Size</span>
              <Input
                className='mt-1'
                placeholder='Name'
                name='teamSize'
                onChange={handleChange}
                value={values?.teamSize}
              />
              {errorMessage(errors.teamSize)}
            </Label>

            <Label className='mt-4 mx-1 w-1/2'>
              <span>Number Of Events</span>
              <Input
                className='mt-1'
                placeholder='1-5 years'
                name='numOfEvents'
                onChange={handleChange}
                value={values?.numOfEvents}
              />
              {errorMessage(errors.numOfEvents)}
            </Label>
          </div>

          <Label className='mt-4 ml-1'>
            <span>Organizer Description</span>
            <TextEditor
              description={organizerDescription}
              setDescription={setOrganizerDescription}
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

export default OrganizerDetailsForm;
