import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toggleNewPassword, togglePageLoader } from "../../../Store/misc.slice";
import { validateResetToken } from "../../../Service/user.service";
import { REGEX, ROUTE } from "../../../Helper/contant";
import { setUserToken } from "../../../Helper/browser-storage";
import { toast } from "react-toastify";
import { Box, TextField } from "@mui/material";
import logo from "../../../assets/logo.svg";
import { StyledButton } from "../../Misc/style-button";
import { useForm } from "react-hook-form";
import useMisc from "../../../Hook/useMisc";

const sx = {
  reset_container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 10px",
    height: "100dvh",
  },
  reset_logo_img: {
    height: "24px",
    transition: "all 0.2s linear",
  },
  reset_body: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  reset_form: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "60px 20px 40px 20px",
    borderRadius: "8px",
    boxShadow: (theme) => theme.shadows[2],
    "& .disclamer": { fontSize: "18px", marginRight: "10px" },
    "& .inputField": { marginInline: { xs: "0", sm: "20px" } },
    gap: "30px",
  },
  reset_footer: { alignSelf: "end", minWidth: "100px" },
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const { isNewPasswordVisible } = useSelector((store) => store.misc);
  const { setUserLogin } = useMisc();

  useEffect(() => {
    (async () => {
      dispatch(togglePageLoader(true));
      setUserToken(token);
      const { data, status } = await validateResetToken(token);
      dispatch(togglePageLoader(false));
      if (status) {
        setUserLogin(data, true);
      } else {
        toast.error("Invalid reset password URL");
        navigate(ROUTE.RESET_PASSWORD.route);
      }
    })();
  }, []);

  const emailValidation = {
    required: { value: true, message: "Email is required" },
    pattern: { value: REGEX.EMAIL, message: "Email is invalid" },
    validate: (value) => {
      if (value?.toLocaleLowerCase() !== user?.email) {
        return "This email does not matched";
      }
      return true;
    },
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });
  const onSubmit = () => {
    dispatch(toggleNewPassword(true));
    setListen(true);
  };

  const [listen, setListen] = useState(false);
  useEffect(() => {
    if (!isNewPasswordVisible && listen) {
      navigate(ROUTE.USER.route);
      setListen(false);
    }
  }, [isNewPasswordVisible, listen]);

  return (
    <Box sx={sx.reset_container}>
      <Box
        component="img"
        src={logo}
        alt="Forme Jewels Logo"
        sx={sx.reset_logo_img}
      />
      <Box sx={sx.reset_body}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={sx.reset_form}
        >
          <span className="disclamer">
            Please enter your email to confirm it is you.
          </span>
          <TextField
            label="Email"
            placeholder="Enter email here"
            className="inputField"
            {...register("email", emailValidation)}
            error={!!errors.email}
            helperText={errors.email?.message || ""}
          />
          <StyledButton sx={sx.reset_footer} onClick={handleSubmit(onSubmit)}>
            Verify
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
}
