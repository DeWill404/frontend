import { Box, Button, CircularProgress, styled } from "@mui/material";
import { STX } from "../../Helper/misc";

const CustomButton = styled(Button)({
  background: "black",
  color: "white",
  "&:hover": {
    background: "#353232",
  },
  "&:disabled": {
    background: "#8e8e8e",
    color: "white",
  },
});

const sx = {
  text: {
    opacity: 0,
    transition: "all 0.2s linear",
  },
  loader: {
    transition: "all 0.2s linear",
    position: "absolute",
    top: "calc(50% + 4px)",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export function StyledButton({
  isLoading = false,
  loaderSize,
  children,
  ...props
}) {
  return (
    <CustomButton variant="contained" color="inherit" {...props}>
      <Box
        component="span"
        className="content"
        sx={STX(sx.text, {
          [!isLoading]: sx.visible,
        })}
      >
        {children}
      </Box>
      <Box
        component="span"
        sx={STX(sx.loader, {
          [isLoading]: sx.visible,
        })}
      >
        <CircularProgress color="inherit" size={loaderSize || 24} />
      </Box>
    </CustomButton>
  );
}
