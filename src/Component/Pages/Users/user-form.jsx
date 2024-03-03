import { Box, Button, Grid, Slide, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FORM_STATE, REGEX } from "../../../Helper/contant";
import { StyledButton } from "../../Misc/style-button";

const sx = {
  form_popup: {
    position: "absolute",
    top: "0",
    left: 0,
    width: "100%",
    height: "100%",
    background: "white",
    overflow: "auto",
    maxHeight: "calc(100dvh - 53px)",
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
    zIndex: 2,
    display: "flex",
    gap: { xs: "8px", sm: "16px" },
    justifyContent: "end",
    alignItems: "center",
    position: "sticky",
    bottom: 0,
    background: "white",
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
  },
};

export default function UserForm({
  name,
  showForm,
  formData,
  closeForm,
  formSubmit,
}) {
  const inputPlaceholders = {
    name: `Enter ${name} name`,
    email: `Enter ${name} email`,
    mobile_no: `Enter 10 digit ${name} mobile no.`,
  };
  let defaultValues = { name: "", email: "", mobile_no: "" };
  defaultValues = showForm !== FORM_STATE.CREATE ? formData : defaultValues;
  const validation = {
    name: {
      required: { value: true, message: "Name is required" },
    },
    email: {
      required: { value: true, message: "Email is required" },
      pattern: { value: REGEX.EMAIL, message: "Email is invalid" },
    },
    mobile_no: {
      required: { value: true, message: "Mobile no. is required" },
      minLength: { value: 10, message: "Mobile no. should have 10 digits" },
      maxLength: { value: 10, message: "Mobile no. should have 10 digits" },
      pattern: { value: REGEX.MOBILE_NO, message: "Mobile no. is invalid" },
    },
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const [isLoading, setLoading] = useState(false);
  const onSubmitClick = async (payload) => {
    if (!isLoading) {
      setLoading(true);
      await formSubmit(payload);
      setLoading(false);
    }
  };

  const formTitle = () => {
    switch (showForm) {
      case FORM_STATE.CREATE:
        return `Create ${name}`;
      case FORM_STATE.UPDATE:
        return `Update ${name}`;
      case FORM_STATE.READ:
        return (
          <span>
            <strong>{name}:</strong> {formData.name}
          </span>
        );
      default:
        break;
    }
  };

  const readOnlyProps =
    showForm === FORM_STATE.READ
      ? {
          autoFocus: false,
          inputProps: { readOnly: true, tabIndex: -1 },
          sx: { pointerEvents: "none" },
        }
      : {};

  return (
    <Slide direction="up" unmountOnExit in={showForm !== FORM_STATE.CLOSE}>
      <Box sx={sx.form_popup}>
        <Box sx={sx.form_header}>
          <Box width={1}>
            <h2>{formTitle()}</h2>
            {showForm === FORM_STATE.UPDATE && (
              <h5>
                {name}: {formData.name}
              </h5>
            )}
          </Box>
        </Box>
        <Box sx={sx.form_wrapper}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                className="form-input"
                name="name"
                label="Name"
                placeholder={inputPlaceholders.name}
                size="small"
                fullWidth
                {...register("name", validation.name)}
                error={!!errors.name}
                helperText={errors.name?.message || ""}
                autoFocus={showForm !== FORM_STATE.READ}
                {...readOnlyProps}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                className="form-input"
                name="email"
                label="Email"
                placeholder={inputPlaceholders.email}
                size="small"
                fullWidth
                {...register("email", validation.email)}
                error={!!errors.email}
                helperText={errors.email?.message || ""}
                {...readOnlyProps}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                className="form-input"
                name="mobile_no"
                label="Mobile No."
                placeholder={inputPlaceholders.mobile_no}
                size="small"
                fullWidth
                {...register("mobile_no", validation.mobile_no)}
                error={!!errors.mobile_no}
                helperText={errors.mobile_no?.message || ""}
                {...readOnlyProps}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={sx.form_footer}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={closeForm}
            autoFocus={showForm === FORM_STATE.READ}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {showForm !== FORM_STATE.READ && (
            <StyledButton
              isLoading={isLoading}
              onClick={handleSubmit(onSubmitClick)}
            >
              {showForm === FORM_STATE.CREATE ? "Save" : "Update"}
            </StyledButton>
          )}
        </Box>
      </Box>
    </Slide>
  );
}
