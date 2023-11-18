import EventCreatorFormModel from './EventCreatorFormModel';
const {
  formField: {
    companyName,
    address1,
    city,
    zipcode,
    state,
    country,
    phone,
    email,
    accountType,
    beneficiaryName,
    accountNumber,
    ifscCode,
    agreeTerms
  }
} = EventCreatorFormModel;

export default {
  [companyName.name]: '',
  [state.name]: '',
  [address1.name]: '',
  [city.name]: '',
  [zipcode.name]: '',
  [country.name]: '',
  [phone.name]: '',
  [accountType.name]: '',
  [beneficiaryName.name]: '',
  [accountNumber.name]: '',
  [ifscCode.name]: '',
  [agreeTerms.name]: '',
  [email.name]: '',
};