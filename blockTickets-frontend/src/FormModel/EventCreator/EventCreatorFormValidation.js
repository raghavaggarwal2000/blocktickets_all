import * as Yup from "yup";
import moment from "moment";
import EventCreatorFormModel from "./EventCreatorFormModel";
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
        agreeTerms,
    },
} = EventCreatorFormModel;


export default [
    Yup.object().shape({
        [companyName.name]: Yup.string().required(
            `${companyName.requiredErrorMsg}`
        ),
        [state.name]: Yup.string().required(`${state.requiredErrorMsg}`),
        [address1.name]: Yup.string().required(`${address1.requiredErrorMsg}`),
        [city.name]: Yup.string()
            .nullable()
            .required(`${city.requiredErrorMsg}`),
        [zipcode.name]: Yup.string()
            .required(`${zipcode.requiredErrorMsg}`)
            // .test(
            //     "len",
            //     `${zipcode.invalidErrorMsg}`,
            //     (val) => val && val.length === 5
            // )
            ,
        [country.name]: Yup.string()
            .nullable()
            .required(`${country.requiredErrorMsg}`),
        [email.name]: Yup.string().required(`${email.requiredErrorMsg}`),
        [phone.name]: Yup.string()
            .required(`${phone.requiredErrorMsg}`),
            // .matches(phoneRegEx, phone.invalidErrorMsg),
        [accountType.name]: Yup.string().required(
            `${accountType.requiredErrorMsg}`
        ),
        [beneficiaryName.name]: Yup.string().required(
            `${beneficiaryName.requiredErrorMsg}`
        ),
        [accountNumber.name]: Yup.string().required(
            `${accountNumber.requiredErrorMsg}`
        ),
        [ifscCode.name]: Yup.string().required(`${ifscCode.requiredErrorMsg}`),
    }),
];
