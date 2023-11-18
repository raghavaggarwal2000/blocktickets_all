import * as React from "react";
import Box from "@mui/material/Box";
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    CircularProgress,
} from "@material-ui/core";
import StepOne from "../../components/EventCreatorSteps/StepOne";
import StepTwo from "../../components/EventCreatorSteps/StepTwo";
import { Formik, Form } from "formik";
import FormModel from "../../FormModel/EventCreator/EventCreatorFormModel";
import FormValidation from "../../FormModel/EventCreator/EventCreatorFormValidation";
import formInitialValues from "../../FormModel/EventCreator/EventCreatorInitialValues";
import useStyles from "../../styles/styles";
import {
    EventCreatorServices,
    getToken,
    setAuthToken,
} from "../../api/supplier";
import { toast } from "react-toastify";
import FullLoading from "../../Loading/FullLoading"
import {useNavigate} from "react-router-dom"

const steps = [
    "Company Details",
    "Upload and Agree to Terms & Condition",
    // "Agree to Terms and Condition",
];
const { formId, formField } = FormModel;

export default function HorizontalLinearStepper() {
    let navigate = useNavigate();
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const currentValidationSchema = FormValidation[activeStep];
    const [panImage, setPanImage] = React.useState("");
    const [chequeImage, setChequeImage] = React.useState("");
    const [loading,setLoading] = React.useState(false)
    const isLastStep = activeStep === steps.length - 1;

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    async function _submitForm(values, actions) {
        // alert(JSON.stringify(values, null, 2));
        // console.log(values);
        actions.setSubmitting(false);
        await registerCreator(values);

        // setActiveStep(activeStep + 1);
    }
    function _handleSubmit(values, actions) {
        if (isLastStep) {
            _submitForm(values, actions);
        } else {
            setActiveStep(activeStep + 1);
            // console.log(actions);
            actions.setTouched({});
            actions.setSubmitting(false);
        }
    }

    const registerCreator = async (data) => {
        try {
            if (!getToken) {
                return toast.error("Please register or login!");
            }
            setLoading(true)
            let creator =  new FormData()
            creator.append('companyName',data.companyName)
            creator.append('companyAddress',data.address1)
            creator.append('city',data.city)
            creator.append('state', data.state)
            creator.append('zip',data.zipcode)
            creator.append('phone',data.phone)
            creator.append('email',data.email)
            creator.append('country',data.country)
            creator.append('bankAccountType',data.accountType)
            creator.append('bankAccountName',data.beneficiaryName)
            creator.append('bankAccountNumber',data.accountNumber)
            creator.append('ifscCode',data.ifscCode)
            creator.append('cheque',chequeImage)
            creator.append('pan',panImage)
            // creator.append('cheque',chequeImage)
            // creator.append('pan',panImage)
            //setAuthToken
            setAuthToken(getToken());
            const _register = await EventCreatorServices.register(creator);
            // console.log(_register);
            toast.success("Your form has been submitted successfully! You will receive confirmation once we verify your information")
            navigate("/")
            setLoading(false)
        } catch (err) {
            // console.log(err);
            toast.error(
                err.response.data.err ||
                    "Error! Please try again or contact support!"
            );
            setLoading(false)

        }
    };
    return (
        <Box sx={{ width: "90%" }}>
            {loading && <FullLoading />}
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Formik
                        initialValues={formInitialValues}
                        validationSchema={currentValidationSchema}
                        onSubmit={_handleSubmit}
                    >
                        {({ isSubmitting, handleChange }) => (
                            <Form id={formId}>
                                {_renderStepContent(activeStep, handleChange, {
                                    panImage,
                                    setPanImage,
                                    chequeImage,
                                    setChequeImage,
                                })}

                                <div className={classes.buttons}>
                                    {activeStep !== 0 && (
                                        <Button
                                            onClick={handleBack}
                                            className={classes.button}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    <div className={classes.wrapper}>
                                        <Button
                                            disabled={isSubmitting}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                        >
                                            {isLastStep ? "Submit" : "Next"}
                                        </Button>
                                        {isSubmitting && (
                                            <CircularProgress
                                                size={24}
                                                className={
                                                    classes.buttonProgress
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </React.Fragment>
            )}
        </Box>
    );
}

function _renderStepContent(step, handleChange, newState) {
    switch (step) {
        case 0:
            return (
                <StepOne formField={formField} formikChange={handleChange} />
            );
        case 1:
            return (
                <StepTwo
                    formField={formField}
                    formikChange={handleChange}
                    chequeImage={newState.chequeImage}
                    setChequeImage={newState.setChequeImage}
                    panImage={newState.panImage}
                    setPanImage={newState.setPanImage}
                />
            );
        default:
            return <div>Not Found</div>;
    }
}
