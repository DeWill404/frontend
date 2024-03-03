import { Cancel } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { STX } from "../../Helper/misc";

const sx = {
  dialog_container: {
    "& .MuiDialog-paper": { borderRadius: "12px" },
  },
  dialog_title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    "& .title": {
      fontSize: "18px",
    },
  },
  borderBottom: {
    borderBottom: (theme) => `1.5px solid ${theme.palette.grey[500]}`,
  },
  dialog_action: {
    padding: "16px 24px",
  },
};

export function CustomDialog({
  title,
  content,
  actions,
  closeable = true,
  showCloseBtn = true,
  showDivider = true,
  onClose,
  ...props
}) {
  const handleClose = (...params) => closeable && onClose?.(...params);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      sx={sx.dialog_container}
      onClose={handleClose}
      {...props}
    >
      <DialogTitle
        sx={STX(sx.dialog_title, { [showDivider]: sx.borderBottom })}
      >
        <Box className="title">{title}</Box>
        {closeable && showCloseBtn && (
          <IconButton color="inherit" onClick={handleClose}>
            <Cancel />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      {actions && (
        <DialogActions sx={sx.dialog_action}>{actions}</DialogActions>
      )}
    </Dialog>
  );
}
