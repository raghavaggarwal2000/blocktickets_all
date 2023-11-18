export default function validate(values) {
  let errors = {};
  if (!values.ticketName) {
    errors.ticketName = "Ticket Name is required";
  }
  if (!values.ticketQuantity) {
    errors.ticketQuantity = "Ticket Qty is required";
  }
  if (!values.price) {
    errors.price = "Price  is required";
  }
  // if (!values.location) {
  //   errors.location = "Location  is required";
  // }
  if (!values.visible) {
    errors.visible = "Visible  is required";
  }
  if (!values.ticketCategory) {
    errors.ticketCategory = "Category  is required";
  }
  if (!values.currency) {
    errors.currency = "Currency  is required";
  }
  if (!values.startDate) {
    errors.startDate = "Start Date is required";
  }
  if (!values.endDate) {
    errors.endDate = "End Date is required";
  }
  if (!values.startTime) {
    errors.startTime = "Start Time is required";
  }
  if (!values.endTime) {
    errors.endTime = "End Time is required";
  }
  if (!values.ticketInfo) {
    errors.ticketInfo = "Ticket Info is required";
  }

  return errors;
}
