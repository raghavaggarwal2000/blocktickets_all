export default {
  formId: 'checkoutForm',
  formField: {
    companyName: {
      name: 'companyName',
      label: 'Company Name*',
      requiredErrorMsg: 'Company Name is required'
    },

    address1: {
      name: 'address1',
      label: 'Company Address*',
      requiredErrorMsg: 'Company Address is required'
    },

    city: {
      name: 'city',
      label: 'City*',
      requiredErrorMsg: 'City is required'
    },
    state: {
      name: 'state',
      label: 'State/Province/Region',
      requiredErrorMsg: 'State is required'
    },
    zipcode: {
      name: 'zipcode',
      label: 'Zipcode*',
      requiredErrorMsg: 'Zipcode is required',
      invalidErrorMsg: 'Zipcode is not valid (e.g. 70000)'
    },
    country: {
      name: 'country',
      label: 'Country*',
      requiredErrorMsg: 'Country is required',
      invalidErrorMsg: 'Phone is not valid '

    },
    phone: {
      name: 'phone',
      label: 'Phone*',
      requiredErrorMsg: 'Phone number is required'
    },
    email: {
      name: 'email',
      label: 'Email*',
      requiredErrorMsg: 'Email is required'
    },
    accountType: {
      name: 'accountType',
      label: 'Bank Account Type*',
      requiredErrorMsg: 'Bank Account Type is required'
    },
    beneficiaryName: {
      name: 'beneficiaryName',
      label: 'Beneficiary Name*',
      requiredErrorMsg: 'Beneficiary Name is required'
    },
    accountNumber: {
      name: 'accountNumber',
      label: 'Account Number*',
      requiredErrorMsg: 'Account Number is required'
    },
    ifscCode: {
      name: 'ifscCode',
      label: 'IFSC Code*',
      requiredErrorMsg: 'IFSC Code is required'
    },
    agreeTerms: {
      name: 'agreeTerms',
      label: 'Agree to terms*',
      requiredErrorMsg: 'Please Agree to terms and condition'
    },
  }
};