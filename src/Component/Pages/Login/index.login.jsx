import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import loginImg from "../../../assets/login.png";
import logoImg from "../../../assets/logo.svg";
import { useForm } from "react-hook-form";
import { REGEX } from "../../../Helper/contant";
import { loginUser } from "../../../Service/user.service";
import useMisc from "../../../Hook/useMisc";
import { StyledButton } from "../../Misc/style-button";

const sx = {
  login_container: {
    height: "100dvh",
    display: "flex",
    position: "relative",
  },
  login_image: {
    width: { xs: "0", md: "50%" },
    objectFit: "cover",
    height: "100%",
    transition: "all 0.2s linear",
  },
  content_wrapper: {
    zIndex: 1,
    background: "#ffffff40",
    flex: 1,
    transition: "all 0.2s linear",
    display: "flex",
    alignItems: "center",
  },
  inner_wrapper: {
    width: "100%",
    maxWidth: "600px",
    margin: { xs: "0 auto", md: "0" },
    transition: "all 0.2s linear",
  },
  logo_image: {
    display: "block",
    height: { xs: "20px", sm: "24px" },
    margin: { xs: "0 auto 40px auto", sm: "0 0 40px 10%" },
    transition: "all 0.2s linear",
  },
  form_wrapper: {
    width: "80%",
    paddingInline: { xs: "20px", sm: "40px" },
    paddingBottom: "40px",
    paddingTop: "20px",
    marginInline: "auto",
    border: (theme) => `2px solid ${theme.palette.grey[300]}`,
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  form_title: {
    marginBottom: "20px",
  },
  form_submit_btn: {
    maxWidth: { xs: "100px", sm: "150px" },
    width: "100%",
    alignSelf: "end",
    transition: "all 0.2s linear",
    marginTop: "40px",
  },
};

export default function Login() {
  const [isLoading, setLoading] = useState(false);

  const defaultValues = { email: "", password: "" };
  const validation = {
    email: {
      required: { value: true, message: "Email is required" },
      pattern: { value: REGEX.EMAIL, message: "Email is invalid" },
    },
    password: { required: { value: true, message: "Password is required" } },
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const { setUserLogin } = useMisc();

  useEffect(() => {
    const root = document.getElementById("root");
    root.setAttribute("style", "max-width: 100%");
  }, []);

  const formSubmit = async (payload) => {
    if (!isLoading) {
      setLoading(true);
      const { data, status } = await loginUser({
        email: payload.email.toLowerCase(),
        password: payload.password,
      });
      if (status) {
        setUserLogin(data);
      }
      setLoading(false);
    }
  };

  return (
    <Box sx={sx.login_container}>
      <Box component="img" src={loginImg} alt="Login" sx={sx.login_image} />
      <Box sx={sx.content_wrapper}>
        <Box sx={sx.inner_wrapper}>
          <Box
            component="img"
            src={logoImg}
            alt="Forme Jewels Logo"
            sx={sx.logo_image}
          />
          <form onSubmit={handleSubmit(formSubmit)}>
            <Box sx={sx.form_wrapper}>
              <Box component="h1" sx={sx.form_title}>
                Login
              </Box>
              <TextField
                name="email"
                label="Email"
                placeholder="Enter email"
                fullWidth
                size="small"
                {...register("email", validation.email)}
                error={!!errors.email}
                helperText={errors.email?.message || ""}
                autoFocus
              />
              <TextField
                name="password"
                label="Password"
                placeholder="Enter password"
                type="password"
                fullWidth
                size="small"
                {...register("password", validation.password)}
                error={!!errors.password}
                helperText={errors.password?.message || ""}
              />
              <StyledButton
                sx={sx.form_submit_btn}
                onClick={handleSubmit(formSubmit)}
                type="submit"
              >
                Login
              </StyledButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
