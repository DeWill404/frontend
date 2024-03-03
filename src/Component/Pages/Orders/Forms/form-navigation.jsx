import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ORDER_FORM_STEPPER } from "../../../../assets/data/order-data";

const sx = {
  navBtn: {
    gap: "6px",
    minWidth: "auto",
    paddingInline: { xs: "5px", md: "15px" },
    "&:nth-of-type(1)": {
      marginRight: "8px",
    },
    "&:nth-of-type(2)": {
      marginRight: "auto",
    },
    "& .label": {
      display: { xs: "none", md: "inline" },
    },
  },
};

export default function FormNavigation({ activeStep, setActiveStep }) {
  const onPrev = () => {
    setActiveStep((p) => (p === 0 ? p : p - 1));
  };

  const onNext = () => {
    setActiveStep((p) => (p === ORDER_FORM_STEPPER.length - 1 ? p : p + 1));
  };

  return (
    <>
      <Button
        color="inherit"
        variant="outlined"
        disabled={activeStep === 0}
        sx={sx.navBtn}
        onClick={onPrev}
      >
        <ArrowBack />
        <span className="label">Back</span>
      </Button>
      <Button
        color="inherit"
        variant="outlined"
        disabled={activeStep === ORDER_FORM_STEPPER.length - 1}
        sx={sx.navBtn}
        onClick={onNext}
      >
        <span className="label">Next</span>
        <ArrowForward />
      </Button>
    </>
  );
}
