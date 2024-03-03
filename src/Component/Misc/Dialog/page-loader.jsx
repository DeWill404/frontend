import { Box, CircularProgress, Fade } from "@mui/material";
import { useSelector } from "react-redux";

export default function PageLoader() {
  const { isPageLoaderVisible } = useSelector((store) => store.misc);

  return (
    <Fade in={isPageLoaderVisible} unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          zIndex: 9999,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <CircularProgress color="inherit" size={60} />
      </Box>
    </Fade>
  );
}
