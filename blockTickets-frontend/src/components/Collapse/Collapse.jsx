import React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

import Plus from "../../images/icons/plus.svg";
import Minus from "../../images/icons/Minus.svg";

const CollapseBar = ({ heading, children }) => {
  const id = heading + "panel";
  const [expanded, setExpanded] = React.useState(id);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <div>
      <Accordion
        sx={{ "& .MuiTypography-root": { fontSize: "24px" } }}
        expanded={expanded === id}
        onChange={handleChange(id)}
      >
        <AccordionSummary
          expandIcon={<CustomExpandIcon />}
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <Typography sx={{ fontWeight: "bold" }} variant="h2">
            {heading}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CollapseBar;

const Accordion = styled((props) => (
  <MuiAccordion expanded elevation={2} square {...props} />
))(({ theme }) => ({
  borderTop: `1px solid #979797`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary sx={{ p: "1" }} {...props} />
))(({ theme }) => ({
  backgroundColor: "#181818",
  color: "#ffff",
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    color: "#ffff",
  },
  "& .MuiAccordionSummary-content": {
    // marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "2px solid #979797",
  backgroundColor: "#181818",
  color: "#ffff",
  fontSize: "1rem",
}));

const CustomExpandIcon = () => {
  return (
    <Box
      sx={{
        ".Mui-expanded & > .collapsIconWrapper": {
          display: "none",
        },
        ".expandIconWrapper": {
          display: "none",
        },
        ".Mui-expanded & > .expandIconWrapper": {
          display: "block",
        },
      }}
    >
      <div className="collapsIconWrapper">
        <img className="h-[30px] md:h-[30px]" src={Plus} alt="plus" />
      </div>
      <div className="expandIconWrapper ">
        <img className="w-[30px] md:w-[30px]" src={Minus} alt="minus" />
      </div>
    </Box>
  );
};
