import React from 'react'
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from "@mui/material/Box";
import Plus from "../../images/icons/plus_white.svg";
import Minus from "../../images/icons/minus_white.svg";

const CollapseColored = ({ heading, children, color, ticketRef,}) => {
  const id = 'panel'
  const [expanded, setExpanded] = React.useState(id);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <div className="bg-black" ref={ticketRef}>
      <Accordion sx={{ '& .MuiTypography-root': { fontSize: '24px' } }} expanded={expanded === id} onChange={handleChange(id)}>
        <AccordionSummary expandIcon={<CustomExpandIcon />} className={color} aria-controls="panel1d-content" id="panel1d-header">
          <Typography sx={{fontWeight:"bold"}} variant="h2">{heading}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{bgcolor: '#fff0'}}>
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default CollapseColored;


const Accordion = styled((props) => (
  <MuiAccordion expanded elevation={2} square {...props} />
))(({ theme }) => ({
  borderTop: `1px solid #979797`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },

}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    sx={{ p: '1' }}
    expandIcon={<RemoveIcon sx={{ fontSize: '3.2rem', color: 'white' }} />}
    {...props}
  />
))(({ theme }) => ({
  color: '#ffff',
  flexDirection: 'row',
  backgroundColor: '#fff0',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    color: "#ffff"
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '2px solid #979797',
  backgroundColor: '#fff0',
  // color: '#ffff',
  fontSize: '1rem',
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