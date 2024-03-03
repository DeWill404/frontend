import { AccountCircle, Key, Logout } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleLogoutAlert, toggleNewPassword } from "../../Store/misc.slice";

const sx = {
  profileBtn: {
    color: "black",
    padding: { xs: "4px", sm: "2px" },
    transition: "all 0.2s linear",
  },
  profileIcon: {
    width: { xs: "28px", sm: "36px" },
    height: { xs: "28px", sm: "36px" },
    transition: "all 0.2s linear",
  },
  profile_popup: {
    "& .MuiPaper-root": {
      borderRadius: "8px",
    },
    "& .MuiMenu-list": {
      padding: 0,
    },
  },
  profile_popup_btn: {
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

export function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const dispatch = useDispatch();

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const logoutUser = (e) => {
    handleClose(e);
    dispatch(toggleLogoutAlert(true));
  };
  const showResetPassword = (e) => {
    handleClose(e);
    dispatch(toggleNewPassword(true));
  };

  return (
    <Box>
      <IconButton sx={sx.profileBtn} onClick={handleMenuOpen}>
        <AccountCircle sx={sx.profileIcon} />
      </IconButton>
      <Menu
        sx={sx.profile_popup}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem sx={sx.profile_popup_btn} onClick={showResetPassword}>
          <Key />
          <span>Update Password</span>
        </MenuItem>
        <MenuItem sx={sx.profile_popup_btn} onClick={logoutUser}>
          <Logout />
          <span>Logout</span>
        </MenuItem>
      </Menu>
    </Box>
  );
}
