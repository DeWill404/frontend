import { Box, Button, Step, Stepper } from "@mui/material";
import { ORDER_FORM_STEPPER } from "../../../../assets/data/order-data";
import { StyledButton } from "../../../Misc/style-button";

const sx = {
  stepper_root: {
    overflowX: "auto",
    minHeight: "60px",
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: (theme) => theme.palette.grey[200],
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "20px",
    },
    "& .MuiStepper-root": {
      rowGap: "12px",
    },
    "& .MuiStepConnector-root": {
      maxWidth: "50px",
      minWidth: "20px",
    },
    "& .MuiButtonBase-root": {
      textTransform: "none",
      gap: "6px",
      minWidth: "auto",
      padding: "6px 8px",
      "& .content": {
        display: "flex",
        gap: "6px",
        alignItems: "center",
      },
      "& svg": {
        fontSize: "18px",
      },
      "& .label": {
        whiteSpace: "nowrap",
      },
    },
  },
};

export default function StepperHeader({ activeStep, onClick }) {
  const handleStepClick = (idx) => (e) => {
    e.target.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "end",
    });
    onClick(idx);
  };

  return (
    <Box sx={sx.stepper_root}>
      <Stepper nonLinear activeStep={activeStep}>
        {ORDER_FORM_STEPPER.map((label, index) => (
          <Step key={label}>
            {activeStep === index ? (
              <StyledButton
                autoFocus={activeStep === index}
                onClick={handleStepClick(index)}
              >
                {label[0]}
                <span className="label">{label[1]}</span>
              </StyledButton>
            ) : (
              <Button
                color="inherit"
                autoFocus={activeStep === index}
                onClick={handleStepClick(index)}
              >
                {label[0]}
                <span className="label">{label[1]}</span>
              </Button>
            )}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
