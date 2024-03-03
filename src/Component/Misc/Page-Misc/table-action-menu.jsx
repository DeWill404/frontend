import { MoreVert } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const sx = {
  popup: {
    "& .MuiPaper-root": {
      borderRadius: "8px",
    },
    "& .MuiMenu-list": {
      padding: 0,
    },
  },
  popup_btn: {
    disply: "flex",
    alignItems: "center",
    gap: "8px",
    padding: { xs: "4px 16px", sm: "8px 16px" },
    minWidth: { xs: "120px", sm: "150px" },
    minHeight: { xs: "40px", sm: "48px" },
    "& svg": {
      width: "20px",
      height: "20px",
    },
  },
};

export default function TableActionMenu({ id, actions, buttonProps }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleMenuClick = (e, onClick) => {
    handleClose(e);
    onClick(id);
  };

  return (
    <Box>
      <IconButton onClick={handleOpen} {...buttonProps}>
        <MoreVert />
      </IconButton>
      <Menu
        sx={sx.popup}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {actions.map((act, idx) => (
          <MenuItem
            key={idx}
            sx={sx.popup_btn}
            onClick={(e) => handleMenuClick(e, act.onClick)}
          >
            {act.icon}
            <span>{act.label}</span>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
