import React, { useEffect, useState } from "react";
import CustomizedSteppers from "./Stepper";
import InputField, { InfoInputField } from "../InputField/InputField";
import SelectField from "../SelectField/SelectField";
import TextEditor from "../../components/TextEditor/TextEditor";
import ImageUpload from "../FileUpload/ImageUpload";
import DateTimeInput from "../DateTimePicker/DateTimeInput";
import { getCompleteDate, getTime } from "../../utils/date";
import SummaryEventPage from "../SummaryEventPage/SummaryEventPage";
import TimezoneSelect from "react-timezone-select";
import InputLabel from "@mui/material/InputLabel";

const Steps = ({
  register,
  errors,
  activeStep,
  setActiveStep,
  steps,
  control,
  fields,
  append,
  remove,
  addTicket,
  deleteTicket,
  setValue,
  getValues,
  setLoading,
  setPageLoading,
  watch,
}) => {
  const allProps = {
    register,
    errors,
    activeStep,
    setActiveStep,
    control,
    fields,
    append,
    remove,
    addTicket,
    deleteTicket,
    setValue,
    getValues,
    setLoading,
    setPageLoading,
    watch,
  };
  return (
    <>
      <CustomizedSteppers
        activeStep={activeStep}
        steps={steps}
        setActiveStep={setActiveStep}
      />
      <br />
      <br />
      <StepComponent {...allProps} />
    </>
  );
};

export default Steps;

const AboutOrganiser = (props) => {
  const [logo, setLogo] = useState([]);
  const [sourceLogo, setSourceLogo] = useState([]);

  const inputProps = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 lg:px-4 gap-2 place-items-center">
      <h2 className="col-span-full text-[1.25rem] text-silver">
        Organiser information
      </h2>
      <div className="col-span-full grid grid-cols-3 gap-2 w-full h-full">
        <div className="w-full col-span-2 h-full">
          <InputField
            className="col-span-2 m-0"
            label="Company Name"
            type="text"
            value="organizerName"
            placeholder="Enter the company name"
            required="Please enter the company name"
            {...inputProps}
          />
          <div className="col-span-2 text-black rounded-lg w-full mt-4">
            <label
              className="text-sm text-silver font-hnb "
              htmlFor="aboutOrganizer"
            >
              Compose an epic organiser's company description <span>*</span>
            </label>
            <TextEditor {...inputProps} name="organiserDescription" />
          </div>
        </div>

        <ImageUpload
          fileType="image"
          imageField="Logo"
          pinataUpload={false}
          square={false}
          {...inputProps}
          ratio={2}
          maxH={1000}
          maxW={2000}
        />
      </div>
      <SelectField
        {...inputProps}
        field="teamSize"
        options={[
          { value: "0-25", label: "0-25" },
          { value: "26-50", label: "26-50" },
          { value: "51-100", label: "51-100" },
          { value: "101-300", label: "101-300" },
          { value: "301-500", label: "301-500" },
          { value: "500+", label: "500+" },
        ]}
        placeholder={"Pick number of employees"}
        label={"How many full time employees?"}
        required="Please pick team size"
      />
      <SelectField
        {...inputProps}
        field="experienceLevel"
        options={[
          { value: "0-1 years", label: "0-1 years" },
          { value: "2-5 years", label: "2-5 years" },
          { value: "6-10 years", label: "6-10 years" },
          { value: "11-15 years", label: "11-15 years" },
          { value: "16-20 years", label: "16-20 years" },
          { value: "20+ years", label: "20+ years" },
        ]}
        placeholder={"Pick your experience"}
        label={"What's your level of experience in organising events?"}
        required="Please pick your experience"
      />
      <SelectField
        {...inputProps}
        field="numOfEvents"
        options={[
          { value: "0-5", label: "0-5" },
          { value: "6-10", label: "6-10" },
          { value: "11-20", label: "11-20" },
          { value: "21-50", label: "21-50" },
          { value: "51-100", label: "51-100" },
          { value: "101-300", label: "101-300" },
          { value: "301-500", label: "301-500" },
          { value: "501+", label: "501+" },
        ]}
        placeholder={"Pick number of events you have organised"}
        label={"How many events you have organized?"}
        required="Please pick number of events you have organised"
      />
      <InputField
        label="How many attended the largest event you have organized?"
        type="text"
        value="peopleAttended"
        placeholder="20000"
        required="Please enter largest gathering in your event"
        {...inputProps}
      />
      <SelectField
        {...inputProps}
        field="referral"
        options={[
          { value: "Friend", label: "Friend" },
          { value: "Social Media", label: "Social Media" },
          { value: "Advertisement", label: "Advertisement" },
        ]}
        placeholder={"Pick an option"}
        label={"How did you first hear about Blocktickets?"}
        required="Please pick an option"
      />
    </div>
  );
};

const AboutEvent = (props) => {
  const inputProps = props;
  const { watch, setValue } = props;
  const watchTimezone = watch("timezone");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-2 lg:px-4 gap-2 place-items-center w-full">
      <h2 className="col-span-full  text-[1.25rem] text-silver">
        Event information
      </h2>

      <InputField
        label="Event Title"
        type="text"
        value="eventTitle"
        placeholder="eg:Dubai Music Festival"
        required="Please enter event title"
        {...inputProps}
      />

      <InputField
        label="Event Venue"
        type="text"
        value="eventVenue"
        placeholder="eg:Delhi"
        required="Please enter event venue"
        {...inputProps}
      />
      <InputField
        label="Event Venue Link"
        type="text"
        value="eventVenueLink"
        placeholder="eg:https://map.google.com/Bs=i3"
        // required="Please enter event venue link"
        {...inputProps}
      />
      {/* <div className="flex items-center flex-col 2xl:flex-row justify-between gap-2"> */}
      <DateTimeInput
        label="Event start date and time"
        value="startDateTime"
        required
        {...inputProps}
      />
      <DateTimeInput
        label="Event end date and time"
        value="endDateTime"
        // required
        {...inputProps}
      />
      {/* </div> */}

      <SelectField
        {...inputProps}
        field="eventType"
        options={[
          { value: "Concert", label: "Concert" },
          { value: "Music Festival", label: "Music Festival" },
          { value: "Sporting Event", label: "Sporting Event" },
          { value: "Food Festival", label: "Food Festival" },
          { value: "Theatre", label: "Theatre" },
          { value: "Metaverse Event", label: "Metaverse Event" },
          { value: "Conference", label: "Conference" },
          { value: "Exhibition", label: "Exhibition" },
          { value: "Attraction", label: "Attraction" },
          { value: "Activity", label: "Activity" },
          { value: "Club", label: "Club" },
          { value: "Meetup", label: "Meetup" },
        ]}
        placeholder={"Pick event type"}
        label={"What type of event are you organizing ?"}
        required={"Please pick event type"}
      />
      <SelectField
        {...inputProps}
        field="category"
        options={[
          { value: "Sports", label: "Sports" },
          { value: "Movies", label: "Movies" },
          { value: "Theatre", label: "Theatre" },
          { value: "Activities", label: "Activities" },
          { value: "Metaverse", label: "Metaverse" },
          { value: "Conference", label: "Conference" },
          { value: "Music", label: "Music" },
        ]}
        placeholder={"Pick your category"}
        label={"How would you categorize this event?"}
        required="Please pick your category"
      />
      <SelectField
        {...inputProps}
        field="ageRequirement"
        options={[
          { value: "All Ages", label: "All Ages" },
          { value: "Family", label: "Family" },
          { value: "16+", label: "16+" },
          { value: "18+", label: "18+" },
          { value: "21+", label: "21+" },
          { value: "25+", label: "25+" },
        ]}
        placeholder={"Pick age requirements for the event"}
        label={"What are the age requirements for the event?"}
        required="Please select age requirements for the event"
      />
      <SelectField
        {...inputProps}
        field="valeParking"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        placeholder={"Pick if valet parking available or not"}
        label={"Is valet parking available?"}
        required="Please select if valet parking available or not"
      />
      <SelectField
        {...inputProps}
        field="dressCode"
        options={[
          { value: "No dress code", label: "No dress code" },
          { value: "Casual", label: "Casual" },
          { value: "Smart casual", label: "Smart casual" },
          { value: "Business casual", label: "Business casual" },
          { value: "Formal", label: "Formal" },
        ]}
        placeholder={"Pick if there is a dress code for the event"}
        label={"Is there a dress code for the event?"}
        required="Please select if there is a dress code for the event"
      />
      <SelectField
        {...inputProps}
        field="freeWifi"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        placeholder={"Pick if free wifi available"}
        label={"Is free WiFi available?"}
        required="Please select if free WiFi available"
      />
      <SelectField
        {...inputProps}
        field="alcoholicDrink"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        placeholder={"Pick if alcohol be available at the event"}
        label={"Will alcohol be available at the event?"}
        required="Please select if alcohol be available at the event"
      />
      <SelectField
        {...inputProps}
        field="foodAndBeverage"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        placeholder={"Pick if food and beverages served in the event"}
        label={"Are there any food and beverages served in the event?"}
        required="Please select if food and beverages served in the event"
      />
      <div className="w-full">
        <InputLabel shrink>
          Timezone <sup className="text-red">*</sup>{" "}
        </InputLabel>
        <TimezoneSelect
          value={watchTimezone ? watchTimezone : ""}
          onChange={(e) => setValue("timezone", e)}
          className="timezone"
          // required = "Please select timezone"
        />
      </div>
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 w-full h-full place-items-center">
        <div className="w-full col-span-full xl:col-span-1 h-full">
          <div className="text-black rounded-lg w-full mt-4">
            <label
              className="text-sm text-silver font-hnb"
              htmlFor="aboutOrganizer"
            >
              Compose an epic event's description{" "}
              <span className="text-red">*</span>
            </label>
            <TextEditor name="eventDescription" {...inputProps} />
          </div>
        </div>
        <div className="w-full col-span-2 h-full">
          <ImageUpload
            imageField="Event Banner Image"
            fileType="image"
            pinataUpload={true}
            {...inputProps}
            square={false}
            required="Please insert Banner image"
            ratio={2}
            maxH={2500}
            maxW={5000}
          />
        </div>

        <ImageUpload
          imageField="Event Square Banner Image"
          fileType="image"
          pinataUpload={false}
          square={true}
          {...inputProps}
          required="Please insert Event square banner image"
          ratio={1}
          maxH={1080}
          maxW={1080}
        />
        <div className="h-[300px]">
          <ImageUpload
            imageField="Event video"
            fileType="video"
            pinataUpload={false}
            square={true}
            {...inputProps}
            ratio={-1}
          />
        </div>
        <ImageUpload
          imageField="Seating image"
          fileType="image"
          pinataUpload={false}
          square={true}
          {...inputProps}
          ratio={-1}
        />
      </div>
    </div>
  );
};
const AboutPerformer = (props) => {
  const inputProps = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-2 lg:px-4 gap-2 place-items-center w-full">
      <h2 className="col-span-full  text-[1.25rem] text-silver">
        About Performer
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 col-span-full">
        <div className="col-span-2 row-span-2 mr-4">
          <InputField
            label="Artist name"
            className="col-span-2"
            type="text"
            value="artistName"
            placeholder="Enter artist name"
            required="Please enter artist title"
            {...inputProps}
          />

          <div className="col-span-2 text-black rounded-lg w-full mt-4">
            <label
              className="text-sm text-silver font-hnb "
              htmlFor="aboutPerformer"
            >
              About performer <span>*</span>
            </label>
            <TextEditor {...inputProps} name="aboutPerformer" />
          </div>
        </div>
        <div className="h-[290px] w-[290px]">
          <ImageUpload
            imageField="Artist image"
            fileType="image"
            pinataUpload={false}
            square={true}
            {...inputProps}
            // required="Please upload performer image"
            ratio={1}
            maxH={1080}
            maxW={1080}
          />
        </div>
      </div>
    </div>
  );
};
const AboutTickets = (props) => {
  const inputProps = {
    ...props,
  };
  const { addTicket, deleteTicket } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-2 lg:px-4 gap-2 place-items-center w-full">
      <h2 className="col-span-full text-[1.25rem] text-silver">
        Ticket information
      </h2>

      {props.fields.map((field, idx) => {
        return (
          <TicketContainer
            key={field.id}
            index={idx}
            field={field}
            {...inputProps}
          />
        );
      })}

      <button
        className="w-full text-white border-orange bg-orange rounded-lg px-4 py-2 hover:opacity-75"
        onClick={addTicket}
      >
        Add
      </button>
    </div>
  );
};

const Summary = (props) => {
  const { watch } = props;
  const watchFields = watch();
  const [data, setData] = useState(watchFields);

  useEffect(() => {}, [data]);
  return (
    <div className="grid grid-cols-1 px-2 lg:px-4 gap-2 place-items-center w-full">
      <h2 className="col-span-full text-[1.25rem] text-silver">Summary</h2>

      <SummaryEventPage data={watchFields} />
    </div>
  );
};

const StepComponent = (props) => {
  switch (props?.activeStep) {
    case 0:
      return <AboutOrganiser {...props} />;
      break;
    case 1:
      return <AboutEvent {...props} />;
      break;
    case 2:
      return <AboutPerformer {...props} />;
      break;
    case 3:
      return <AboutTickets {...props} />;
      break;
    case 4:
      return <Summary {...props} />;
      break;
  }
};

const TicketContainer = (inputProps) => {
  const { field, deleteTicket, index, watch } = inputProps;
  const watchTicketPrice = watch(`tickets[${index}].ticketPrice`);
  let gst_base = 0;
  if(watchTicketPrice >= 500)
    gst_base = watchTicketPrice * 0.18;
  const bt_fee = (Number(gst_base) + Number(watchTicketPrice)) * 0.05;
  const gst_bt_fee = bt_fee * 0.18;

  return (
    <>
      <h2 className="pb-4 flex items-center justify-centerfont-bold col-span-full text-left text-white w-full border-b-[1px] border-silver">
        <span className="text-2xl mr-4">{index + 1}.</span>
        {index !== 0 && (
          <button
            className="text-sm text-white border-orange bg-orange rounded-lg px-2 py-2 hover:opacity-75"
            onClick={() => deleteTicket(index)}
          >
            &lt; Remove this ticket
          </button>
        )}
      </h2>
      <div className="col-span-full grid-cols-1  lg:grid grid-cols-3 md:grid-rows-3 gap-2 place-items-center w-full">
        <div className="min-h-[140px] xl:min-h-[100px] col-span-full lg:col-span-1 xl:row-span-full h-full w-full">
          <ImageUpload
            imageField="Sponsor image"
            pinataUpload={false}
            square={false}
            {...inputProps}
          />
        </div>
        <InputField
          label="Ticket title"
          type="text"
          value={`tickets[${index}].ticketName`}
          placeholder="eg:General Admission"
          required="Please enter ticket title"
          {...inputProps}
        />
        <InputField
          label="Ticket quantity"
          type="number"
          value={`tickets[${index}].ticketQuantity`}
          placeholder="Enter total ticket quantity"
          required="Please enter total ticket quantity"
          {...inputProps}
        />
        <div className="w-full col-span-2">
          <InputField
            label="Base price "
            type="number"
            value={`tickets[${index}].ticketPrice`}
            multiplier={5}
            placeholder="Enter price per ticket"
            required="Please enter price per ticket"
            {...inputProps}
          />
          <span className="font-bold text-[12px] text-silver">
            Note: Your ticket price will be displayed after adding 18% GST fee and a 5%
            Blocktickets fee and gst on it so, the display Price will be will be:
          {watchTicketPrice && " "+(Number(watchTicketPrice) + Number(gst_base) + Number(bt_fee) + Number(gst_bt_fee)).toFixed(2)} 
         
            {/* {watchTicketPrice && (watchTicketPrice * 0.18).toFixed(2)} */}
            {/* <br />
            {watchTicketPrice && "GST on Base Price (18%):" + gst_base}
            <br />
            {watchTicketPrice && "Bt_fee on the sum of base price ans gst on base(5%): " + bt_fee}
            <br />
            {watchTicketPrice && "GST on Bt_fee (18%): " + gst_bt_fee}
            
            <br />
            {watchTicketPrice && "Display Price: " + (Number(watchTicketPrice) + Number(gst_base) + Number(bt_fee) + Number(gst_bt_fee)).toFixed(2)} */}
          </span>
        </div>

        <InputField
          label="Advance price(%)"
          type="number"
          value={`tickets[${index}].undiscountedPrice`}
          placeholder="Enter advance price of the ticket"
          max={100}
          min={0}
          // required="Please enter advance price per ticket"
          {...inputProps}
        />

        <SelectField
          {...inputProps}
          field={`tickets[${index}].currency`}
          options={[
            { value: "INR", label: "INR" },
            { value: "USD", label: "USD" },
            { value: "AED", label: "AED" },
            { value: "EUR", label: "EUR" },
            { value: "POUND", label: "POUND" },
          ]}
          placeholder={"Pick currency"}
          label={"Currency?"}
          required="Please select currency"
        />
        <div className="hidden lg:block"></div>
        <SelectField
          {...inputProps}
          field={`tickets[${index}].flag`}
          options={[
            { value: "", label: "Select your flag" },
            { value: "Bestseller", label: "Bestseller" },
            { value: "Early Bird", label: "Early Bird" },
            { value: "Best Value", label: "Best Value" },
            { value: "VIP", label: "VIP" },
            { value: "Few left !", label: "Few left !" },
            { value: "10% Off", label: "10% Off" },
            { value: "20% Off", label: "20% Off" },
            { value: "25% Off", label: "25% Off" },
            { value: "30% Off", label: "30% Off" },
            { value: "40% Off", label: "40% Off" },
            { value: "50% Off", label: "50% Off" },
          ]}
          placeholder={"Pick flag of the ticket"}
          label={"Flag for the ticket"}
          required="Please select flag"
        />
      </div>

      <InfoInputField
        className="col-span-full doubleXl:col-span-2"
        label="What does this ticket include?(Enter each point in a separate line)"
        required="Please enter ticket includes"
        placeholder="Enter ticket inclusion"
        field={`tickets[${index}].ticketInfo`}
        index={index}
        {...inputProps}
      />
      <div className="col-span-full doubleXl:col-span-1 flex items-center flex-col justify-between gap-2 w-full">
        <div className="flex items-center flex-row justify-between gap-2 w-full">
          <DateTimeInput
            label="Sale start date and time"
            value={`tickets[${index}].saleStartDateTime`}
            required="Please enter sale start date and time"
            {...inputProps}
          />
          <DateTimeInput
            label="Sale end date and time"
            value={`tickets[${index}].saleEndDateTime`}
            required="Please enter sale end date and time"
            {...inputProps}
          />
        </div>
        <div className="flex items-center flex-row justify-between gap-2 w-full">
          <DateTimeInput
            label="Ticket start date and time"
            value={`tickets[${index}].ticketStartDateTime`}
            required="Please enter Ticket start date and time"
            {...inputProps}
          />
          <DateTimeInput
            label="Ticket end date and time"
            value={`tickets[${index}].ticketEndDateTime`}
            required="Please enter Ticket end date and time"
            {...inputProps}
          />
        </div>
      </div>
      <hr class="h-px my-8 border-b-2 border-white" />
      <br />
      <br />
    </>
  );
};
