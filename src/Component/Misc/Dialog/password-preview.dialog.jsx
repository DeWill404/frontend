import { useDispatch, useSelector } from "react-redux";
import { CustomDialog } from "../custom-dialog";
import { togglePasswordPreview } from "../../../Store/misc.slice";
import { Box, Button, TextField } from "@mui/material";
import { CopyAll } from "@mui/icons-material";

const sx = {
  preview_row: {
    display: "flex",
    alignItems: { xs: "start", sm: "center" },
    gap: { xs: "8px", sm: "16px" },
    flexWrap: "wrap",
    marginBlock: "20px",
    "& .label": {
      whiteSpace: "nowrap",
      fontWeight: "bold",
      fontSize: "14px",
      width: { xs: "100%", sm: "auto" },
    },
    "& .password, & .link": {
      flex: 1,
      maxWidth: "400px",
    },
    "& .link": {
      fontSize: "14px",
      wordBreak: "break-all",
      maxHeight: "100px",
      overflow: "hidden",
      color: "purple",
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
};

export default function PasswordPreviewDialog() {
  const { passwordPreview } = useSelector((store) => store.misc);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(togglePasswordPreview(false));
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <CustomDialog
      open={passwordPreview.visible}
      onClose={handleClose}
      title="Password Preview"
      maxWidth="md"
      content={
        <Box marginBlock={{ xs: "10px", sm: "30px" }}>
          <h4
            style={{
              fontWeight: "normal",
              fontSize: "14px",
              marginBottom: "32px",
            }}
          >
            This is the temporary password & login URL for user. You won't be
            able to see this after closing. <br />
            Please copy it somewhere safe.
          </h4>
          <Box sx={sx.preview_row}>
            <span className="label">Password:</span>
            <TextField
              value={passwordPreview.password}
              size="small"
              type="password"
              disabled
              className="password"
            />
            <Button
              color="info"
              variant="text"
              size="small"
              autoFocus
              onClick={() => copyText(passwordPreview.password)}
            >
              <span>Copy</span>
              <CopyAll />
            </Button>
          </Box>
          <Box sx={sx.preview_row}>
            <span className="label">Login URL:</span>
            <span className="link">{passwordPreview.resetLink}</span>
            <Button
              color="info"
              variant="text"
              size="small"
              onClick={() => copyText(passwordPreview.resetLink)}
            >
              <span>Copy</span>
              <CopyAll />
            </Button>
          </Box>
        </Box>
      }
      actions={
        <>
          <Button color="inherit" variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </>
      }
    />
  );
}
