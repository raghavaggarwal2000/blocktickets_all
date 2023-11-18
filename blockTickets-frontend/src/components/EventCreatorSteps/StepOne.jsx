import React from "react";
import { Grid, Typography } from "@material-ui/core";
import {
    InputField,
    SelectField,
} from "../../FormModel/FormFields";

const account = [
    {
        value: undefined,
        label: "None",
    },
    {
        value: "Savings",
        label: "Savings",
    },
    {
        value: "Current",
        label: "Current",
    },
    {
        value: "Joint",
        label: "Joint",
    },
];

export default function StepOne(props) {
    const {
        formField: {
            companyName,
            address1,
            city,
            state,
            zipcode,
            country,
            phone,
            email,
            accountType,
            beneficiaryName,
            accountNumber,
            ifscCode,
        },
    } = props;
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Company Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InputField
                        name={companyName.name}
                        label={companyName.label}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputField
                        name={address1.name}
                        label={address1.label}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField name={city.name} label={city.label} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        name={state.name}
                        label={state.label}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        name={zipcode.name}
                        label={zipcode.label}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        name={country.name}
                        label={country.label}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        name={phone.name}
                        label={phone.label}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        name={email.name}
                        label={email.label}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" style={{ marginTop: 40 }} gutterBottom>
                Bank Account Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <SelectField
                        name={accountType.name}
                        label={accountType.label}
                        data={account}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputField
                        name={beneficiaryName.name}
                        label={beneficiaryName.label}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        name={accountNumber.name}
                        label={accountNumber.label}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        name={ifscCode.name}
                        label={ifscCode.label}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
