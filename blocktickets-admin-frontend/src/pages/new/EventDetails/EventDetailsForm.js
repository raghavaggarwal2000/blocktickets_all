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
import { useParams } from "react-router-dom";
import TextEditor from "../../../components/TextEditor/TextEditor";

const EventDetailsForm = ({ eventDetails, errorMessage, getEventById }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [eventDescription, setEventDescription] = useState("");
  const { eventId } = useParams();

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
    updateEventData();
  }

  const toggleEditForm = () => {
    setIsShowForm(!isShowForm);

    setValues({
      eventTitle: eventDetails.Event.eventTitle,
      location: eventDetails.Event.location,
      startDate: eventDetails.Event.startDate.split("T")[0],
      endDate: eventDetails.Event.endDate.split("T")[0],
      startTime: eventDetails.Event.startTime,
      endTime: eventDetails.Event.endTime,
      totalTicket: eventDetails.Event.totalTicket,
      isPublic: eventDetails.Event.isPublic,
      eventDescription: eventDetails.Event.eventDescription,
      foodAndBeverage: eventDetails.Event.foodAndBeverage,
      dressCode: eventDetails.Event.dressCode,
      alcoholicDrink: eventDetails.Event.alcoholicDrink,
      valeParking: eventDetails.Event.valeParking,
      freeWifi: eventDetails.Event.freeWifi,
      eventVenueLink: eventDetails.Event.eventVenueLink,
      ageRequirement: eventDetails.Event.ageRequirement,
      localTax: eventDetails.Event.fees.tax,
      platformFee: eventDetails.Event.fees.platform_fee,
    });
    setEventDescription(eventDetails.Event.eventDescription);
  };

  const updateEventData = async () => {
    try {
      setIsLoading(true);
      let eventValues = values;
      if (values.localTax > 99 || values.platformFee > 99) {
        setIsLoading(false);
        return toast.error("Tax should be less than 100");
      }
      const fees = {
        platform_fee: values.platformFee,
        tax: values.localTax,
      };

      eventValues = {
        ...eventValues,
        eventDescription: eventDescription,
        fees,
        show_on_banner: values?.showOnBanner === "Yes" ? true : false,
      };
      const updateEventResponse = await EventServices.updateEvent(
        eventValues,
        eventId
      );
      if (updateEventResponse.status === 200) {
        toast.success(updateEventResponse.data.message);
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
          Edit Event
        </Button>
      </div>
      {isShowForm && (
        <div className='px-4 grid-cols-2 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
          <div className='flex justify-between'>
            <Label className='mt-4 mx-1 w-1/2'>
              <span>Event Title</span>
              <Input
                className='mt-1'
                placeholder='Event Title'
                name='eventTitle'
                onChange={handleChange}
                value={values.eventTitle}
              />
              {errorMessage(errors.eventTitle)}
            </Label>
            <Label className='mt-4 mx-1 w-1/2'>
              <span>Event Location</span>
              <Input
                className='mt-1'
                placeholder='Event Location'
                name='location'
                onChange={handleChange}
                value={values.location}
              />
              {errorMessage(errors.location)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Start Date</span>
              <Input
                className='mt-1'
                type='date'
                name='startDate'
                onChange={handleChange}
                value={values.startDate}
                min={new Date().toISOString().split("T")[0]}
              />
              {errorMessage(errors.startDate)}
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>End Date</span>
              <Input
                className='mt-1'
                type='date'
                name='endDate'
                onChange={handleChange}
                value={values.endDate}
                min={new Date().toISOString().split("T")[0]}
              />
              {errorMessage(errors.endDate)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Start Time</span>
              <Input
                className='mt-1'
                type='time'
                name='startTime'
                onChange={handleChange}
                value={values.startTime}
              />
              {errorMessage(errors.startTime)}
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>End Time</span>
              <Input
                className='mt-1'
                type='time'
                name='endTime'
                onChange={handleChange}
                value={values.endTime}
              />
              {errorMessage(errors.endTime)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Total Tickets</span>
              <Input
                className='mt-1'
                type='number'
                name='totalTicket'
                onChange={handleChange}
                placeholder='Total No of Tickets'
                value={values.totalTicket}
              />
              {errorMessage(errors.totalTicket)}
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>Is Public</span>
              <Select
                className='mt-1'
                name='isPublic'
                id='isPublic'
                onChange={handleChange}
                value={values.isPublic}
              >
                <option>Select</option>
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </Select>
              {errorMessage(errors.isPublic)}
            </Label>
          </div>

          {/* New Fields */}
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Event Venue Link</span>
              <Input
                className='mt-1'
                type='text'
                name='eventVenueLink'
                onChange={handleChange}
                placeholder='Enter venue link'
                value={values.eventVenueLink}
              />
              {errorMessage(errors.eventVenueLink)}
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>What are the age requirements for the event?</span>
              <Select
                className='mt-1'
                name='ageRequirement'
                id='ageRequirement'
                onChange={handleChange}
                value={values.ageRequirement}
              >
                <option value=''>Select Option</option>
                <option value='All Ages'>All Ages</option>
                <option value='Family'>Family</option>
                <option value='16+'>16+</option>
                <option value='18+'>18+</option>
                <option value='21+'>21+</option>
                <option value='25+'>25+</option>
              </Select>
              {errorMessage(errors.ageRequirement)}
            </Label>
          </div>

          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Is valet parking available?</span>
              <Select
                className='mt-1'
                name='valeParking'
                id='valeParking'
                onChange={handleChange}
                value={values.valeParking}
              >
                <option value=''>Select Option</option>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
              </Select>
              {errorMessage(errors.valeParking)}
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>Is free WiFi available?</span>
              <Select
                className='mt-1'
                name='freeWifi'
                id='freeWifi'
                onChange={handleChange}
                value={values.freeWifi}
              >
                <option value=''>Select Option</option>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
              </Select>
              {errorMessage(errors.freeWifi)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mr-1 w-6/12'>
              <span>Is there a dress code for the event?</span>
              <Select
                className='mt-1'
                name='dressCode'
                id='dressCode'
                onChange={handleChange}
                value={values.dressCode}
              >
                <option value=''>Select Option</option>
                <option value='No dress code'>No dress code</option>
                <option value='Casual'>Casual</option>
                <option value='smart casual'>Smart casual</option>
                <option value='business casual'>Business casual</option>
                <option value='formal '>Formal</option>
              </Select>
              {errorMessage(errors.dressCode)}
            </Label>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>Will alcohol be available at the event?</span>
              <Select
                className='mt-1'
                name='alcoholicDrink'
                id='alcoholicDrink'
                onChange={handleChange}
                value={values.alcoholicDrink}
              >
                <option value=''>Select Option</option>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
              </Select>
              {errorMessage(errors.alcoholicDrink)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 ml-1 w-6/12'>
              <span>Are there any food and beverages served in the event?</span>
              <Select
                className='mt-1'
                name='foodAndBeverage'
                id='foodAndBeverage'
                onChange={handleChange}
                value={values.foodAndBeverage}
              >
                <option value=''>Select Option</option>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
              </Select>
              {errorMessage(errors.foodAndBeverage)}
            </Label>

            <Label className='mt-4  mx-1 w-1/2'>
              <span>Platform Fees</span>
              <Input
                className='mt-1'
                placeholder='Enter platform fee(0-100)'
                name='platformFee'
                onChange={handleChange}
                value={values.platformFee}
                max={100}
              />
              {errorMessage(errors.platformFee)}
            </Label>
          </div>
          <div className='flex justify-between'>
            <Label className='mt-4 mx-1 w-1/2'>
              <span>Local tax(0-100)</span>
              <Input
                className='mt-1'
                placeholder='Enter local tax(0-100)'
                name='localTax'
                onChange={handleChange}
                max={100}
                value={values.localTax}
              />
              {errorMessage(errors.localTax)}
            </Label>
          </div>
          <Label className='mt-4 ml-1'>
            <span>Event Description</span>
            <TextEditor
              description={eventDescription}
              setDescription={setEventDescription}
            />
          </Label>
          <Label className='mt-4 mr-1 w-6/12'>
            <span>Show on banner?</span>
            <Select
              className='mt-1'
              name='showOnBanner'
              id='showOnBanner'
              onChange={handleChange}
              value={values.showOnBanner}
            >
              <option value=''>Select Option</option>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
            </Select>
            {errorMessage(errors.showOnBanner)}
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

export default EventDetailsForm;
