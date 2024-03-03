import { ArrowBackIos } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

export function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" width={1} height="100dvh">
      <Box
        component="img"
        src={logo}
        alt="Forme Jewels Logo"
        height={20}
        marginInline="auto"
        marginBlock="40px"
      />

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={1}
        height={1}
        maxWidth="90%"
        marginInline="auto"
        textAlign="center"
      >
        <h1>404</h1>

        <br />

        <p>
          <i>This page does not exist.</i>
        </p>

        <br />

        <Button paddingInline="24px" onClick={() => navigate(-1)}>
          <ArrowBackIos sx={{ width: 16 }} />
          <span>Go Back</span>
        </Button>
      </Box>
    </Box>
  );
}
