import { useDispatch, useSelector } from "react-redux";
import { CustomDialog } from "../custom-dialog";
import {
  toggleLogoutAlert,
  toggleNewPassword,
} from "../../../Store/misc.slice";
import { Box, Button, TextField } from "@mui/material";
import { StyledButton } from "../style-button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { updatePassword } from "../../../Service/user.service";
import { setLogin } from "../../../Store/auth.slice";
import { setUserInfo } from "../../../Helper/browser-storage";
import { visuallyHidden } from "@mui/utils";
import { useLocation } from "react-router-dom";
import { ROUTE } from "../../../Helper/contant";

export function NewPasswordDialog() {
  const { pathname } = useLocation();
  const { isNewPasswordVisible } = useSelector((store) => store.misc);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(toggleNewPassword(false));
  };

  const { user } = useSelector((store) => store.auth);
  const isReset = user.is_password_reset;

  const [isLoading, setLoading] = useState(false);

  const defaultValues = { pass: "", "confirm-pass": "" };
  const validation = {
    pass: {
      required: { value: true, message: "Password is required" },
      minLength: {
        value: 8,
        message: "Password should be of minimum 8 charecters",
      },
      maxLength: {
        value: 20,
        message: "Password should be of maximum 20 charecters",
      },
      validate: (pass) => {
        if (!pass.match(/\d/)) return "Password should atleast have a number";
        if (!pass.match(/[a-z]/))
          return "Password should atleast have a small alphabet(a-z)";
        if (!pass.match(/[A-Z]/))
          return "Password should atleast have a Capital alphabet(A-Z)";
        if (!pass.match(/[~`!@#$%^&*-+|<>,.?]/))
          return "Password should atleast have a Special character";
        if (pass.includes(" ")) return "Password cannot contain spaces in it";
        return true;
      },
    },
    "confirm-pass": {
      required: { value: true, message: "Confirm Password is required" },
      validate: (value, data) => {
        if (value !== data.pass) {
          return "Confirm password should match with New password";
        }
        return true;
      },
    },
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const formSubmit = async (payload) => {
    if (!isLoading) {
      setLoading(true);
      const { data, status } = await updatePassword(payload.pass);
      if (status) {
        setUserInfo(data);
        dispatch(setLogin({ user: data }));
        dispatch(toggleNewPassword(false));
      }
      setLoading(false);
    }
  };

  const onLogoutClick = () => {
    dispatch(toggleLogoutAlert(true));
  };

  return (
    <CustomDialog
      open={isNewPasswordVisible}
      onClose={handleClose}
      closeable={!isReset}
      title={"Set New Password"}
      content={
        <form onSubmit={handleSubmit(formSubmit)}>
          <Box
            paddingTop="30px"
            paddingBottom="10px"
            paddingInline={{ xs: "0", sm: "20px" }}
            display="flex"
            flexDirection="column"
            gap="30px"
          >
            <TextField
              name="pass"
              label="New Password"
              placeholder="Enter New Password"
              fullWidth
              size="small"
              type="password"
              {...register("pass", validation.pass)}
              error={!!errors.pass}
              helperText={errors.pass?.message || ""}
              autoFocus
            />
            <TextField
              name="confirm-pass"
              label="Confirm New Password"
              placeholder="Re-enter the new password again"
              fullWidth
              size="small"
              type="password"
              {...register("confirm-pass", validation["confirm-pass"])}
              error={!!errors["confirm-pass"]}
              helperText={errors["confirm-pass"]?.message || ""}
            />
          </Box>
          <button type="submit" hidden></button>
        </form>
      }
      actions={
        <>
          {!isReset ? (
            <Button color="inherit" variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <Button
              color="inherit"
              variant="outlined"
              sx={{
                marginRight: "auto",
                ...(pathname.includes(ROUTE.RESET_PASSWORD.route)
                  ? visuallyHidden
                  : {}),
              }}
              onClick={onLogoutClick}
            >
              Logout
            </Button>
          )}
          <StyledButton
            isLoading={isLoading}
            onClick={handleSubmit(formSubmit)}
          >
            Confirm
          </StyledButton>
        </>
      }
    />
  );
}
