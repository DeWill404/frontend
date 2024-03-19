import { Box, Button, Divider, Slide } from "@mui/material";
import { FORM_STATE } from "../../../Helper/contant";
import { StyledButton } from "../../Misc/style-button";
import { useCallback, useMemo, useState } from "react";
import StepperHeader from "./Forms/form-stepper";
import ActiveForm from "./Forms/active-form";
import FormNavigation from "./Forms/form-navigation";
import { CustomDialog } from "../../Misc/custom-dialog";
import {
  orderFormDataCleanup,
  serializeCurrentOrderData,
} from "./helper.order";
import { ORDER_FORM_STEPPER } from "../../../assets/data/order-data";
import {
  getJobSheetFromStorage,
  getOrderDesigntFromStorage,
  getOrderStatusFromStorage,
  getSerializedFromStorage,
} from "../../../Helper/browser-storage";
import { toast } from "react-toastify";

const sx = {
  form_popup: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    maxHeight: "calc(100dvh - 53px)",
    background: "white",
    padding: {
      xs: "12px 14px 0px 14px",
      sm: "20px 20px 0px 14px",
      md: "20px 20px 0px 28px",
    },
  },
  form_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    "& h2": {
      fontWeight: "normal",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  form_wrapper: {
    marginTop: "20px",
    marginBottom: "60px",
    padding: "40px 20px 30px 20px",
    boxShadow: (theme) => theme.shadows[2],
    border: (theme) => `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "8px",
  },
  form_footer: {
    display: "flex",
    gap: { xs: "8px", sm: "16px" },
    justifyContent: "end",
    alignItems: "center",
    position: "sticky",
    bottom: 0,
    background: "white",
    zIndex: 2,
    padding: {
      xs: "10px 14px 20px 14px",
      sm: "10px 20px 20px 14px",
      md: "10px 20px 20px 28px",
    },
    margin: {
      xs: "0px -14px 0px -14px",
      sm: "0px -20px 0px -14px",
      md: "0px -20px 0px -28px",
    },
    "& button": {
      paddingInline: { xs: "8px", sm: "16px" },
    },
  },
  reset_btn: {
    marginRight: "auto",
  },
};

export default function OrderForm({
  name,
  showForm,
  formData,
  closeForm,
  formSubmit,
  isAdmin,
}) {
  const [isLoading, setLoading] = useState(false);
  const onSubmitClick = async (payload) => {
    if (!isLoading) {
      setLoading(true);
      await formSubmit(payload);
      setLoading(false);
    }
  };
  const validateCreateFormStatus = () => {
    if (showForm !== FORM_STATE.CREATE) {
      return true;
    }
    const jobsheetData = getJobSheetFromStorage();
    const designData = getOrderDesigntFromStorage();
    if (!jobsheetData || !designData) {
      return false;
    }
    return true;
  };
  const submitHandler = async (e) => {
    e.stopPropagation();
    if (stepValidator) {
      let isValid = await stepValidator();
      if (!isValid) {
        toast.error("Please fill all required values");
      } else if (!validateCreateFormStatus()) {
        toast.error("Please complete Jobsheet form & select a Design first");
      } else {
        const currData = getSerializedFromStorage();
        const orderStatus = getOrderStatusFromStorage();
        currData["order_status"] = orderStatus;
        onSubmitClick(currData);
      }
    }
  };

  const formTitle = () => {
    switch (showForm) {
      case FORM_STATE.CREATE:
        return "Create Order";
      case FORM_STATE.UPDATE:
        return `Update Order`;
      case FORM_STATE.READ:
        return (
          <span>
            <strong>{name}:</strong> {formData.order_id}
          </span>
        );
      default:
        break;
    }
  };

  const defaultStep = useMemo(
    () => (showForm === FORM_STATE.CREATE ? 0 : ORDER_FORM_STEPPER.length - 1),
    [showForm]
  );
  const [activeStep, setActiveStep] = useState(defaultStep);
  const [stepValidator, setStepValidator] = useState(null);
  const onStepChange = async (updatedStep) => {
    if (stepValidator) {
      const isValid = await stepValidator();
      if (isValid) {
        setActiveStep(updatedStep);
      }
    }
  };

  const [resetDefault, setResetDefault] = useState(0);
  const closeResetDialog = () => setResetDialog(false);
  const onResetConfirm = () => {
    closeResetDialog();
    orderFormDataCleanup();
    resetForm();
  };
  const [resetDialog, setResetDialog] = useState(false);
  const resetForm = () => setResetDefault((p) => (p === 100 ? 0 : p + 1));
  const onResetClick = (e) => {
    e.stopPropagation();
    setResetDialog(true);
  };

  return (
    <Slide direction="up" unmountOnExit in={showForm !== FORM_STATE.CLOSE}>
      <Box id="order-form" sx={sx.form_popup}>
        <span id="order-form-scroll-element"></span>
        <Box sx={sx.form_header}>
          <Box width={1}>
            <h2>{formTitle()}</h2>
            {showForm === FORM_STATE.UPDATE && (
              <h5>
                {name}: {formData.order_id}
              </h5>
            )}
          </Box>
        </Box>
        <Box sx={sx.form_wrapper}>
          {showForm === FORM_STATE.CREATE && (
            <>
              <StepperHeader activeStep={activeStep} onClick={onStepChange} />
              <Divider />
            </>
          )}
          <ActiveForm
            activeIndex={activeStep}
            formState={showForm}
            formData={formData}
            setValidator={setStepValidator}
            isAdmin={isAdmin}
            resetDefault={resetDefault}
          />
        </Box>
        <Box sx={sx.form_footer}>
          {showForm === FORM_STATE.CREATE ? (
            <FormNavigation
              activeStep={activeStep}
              setActiveStep={onStepChange}
            />
          ) : (
            <Button
              color="error"
              variant="outlined"
              sx={sx.reset_btn}
              onClick={onResetClick}
              disabled={isLoading}
            >
              Reset Form
            </Button>
          )}
          <Button
            color="inherit"
            variant="outlined"
            onClick={closeForm}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <StyledButton isLoading={isLoading} onClick={submitHandler}>
            {showForm === FORM_STATE.CREATE ? "Save" : "Update"}
          </StyledButton>
        </Box>

        <CustomDialog
          open={resetDialog}
          onClose={closeResetDialog}
          showDivider={false}
          showCloseBtn={false}
          title={<h3>Alert !!</h3>}
          content="This action will clear all unsaved updates, Are you sure want to do it?"
          actions={
            <>
              <Button
                autoFocus
                color="inherit"
                variant="outlined"
                onClick={closeResetDialog}
              >
                Close
              </Button>
              <StyledButton onClick={onResetConfirm}>Reset</StyledButton>
            </>
          }
        />
      </Box>
    </Slide>
  );
}
