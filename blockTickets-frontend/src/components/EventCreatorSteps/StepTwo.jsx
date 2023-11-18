import React, { useEffect, useState } from "react";
import { FileUpload } from "../FileUpload/FileUpload";
import { Grid, Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import { CheckboxField } from "../../FormModel/FormFields";
import  { Formik }  from "formik"
const fileUploadProp = {};

const StepTwo = (props) => {
    const {
        formField: { agreeTerms },
        panImage,
        setPanImage,
        chequeImage,
        setChequeImage
    } = props;
    // const [panImage, setPanImage] = useState("");
    // const [chequeImage, setChequeImage] = useState("");

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Upload Documents
            </Typography>
            <Grid container spacing={3}>
                <Grid
                    item
                    xs={12}
                    className="flex items-start justify-center flex-col"
                >
                    <Box>
                        <div className="form-group">
                            <label for="file"> PAN Card</label>
                            <input
                                id="file"
                                type="file"
                                name="pan"
                                onChange={(e) => {setPanImage(e.target.files[0])}}
                                className="form-control"
                            />
                            {/* <Thumb file={values.file} /> */}
                        </div>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    className="flex items-start justify-center flex-col"
                >
                   
                    <Box>
                    <div className="form-group">
                            <label for="file">Cancelled Cheque</label>
                            <input
                                id="file"
                                type="file"
                                name="cheque"
                                onChange={(e) => {setChequeImage(e.target.files[0])}}
                                className="form-control"
                            />
                            {/* <Thumb file={values.file} /> */}
                        </div>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    className="flex flex-row items-center justify-center"
                >
                    {/* checkbox */}
                    <CheckboxField
                        name={agreeTerms.name}
                        // label={`I have read and agree to Blockticket's ${<a href="/terms-and-condition">User Agreement</a>} and {<a href="/privacy-and-policy" target="_blank">Privacy Policy}`}
                    />
                    <Typography align="center" variant="subtitle1">
                        I have read and agree to Blockticket's{" "}
                        <a href="/terms-and-condition">User Agreement</a> and{" "}
                        <a href="/privacy-and-policy" target="_blank">
                            Privacy Policy
                        </a>
                    </Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default StepTwo;
