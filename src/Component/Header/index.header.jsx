import { Box, IconButton } from "@mui/material";
import logo from "../../assets/logo.svg";
import { Close, Menu } from "@mui/icons-material";
import { ProfileMenu } from "./profile-menu.header";
import { STX } from "../../Helper/misc";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../Store/misc.slice";
import { Link } from "react-router-dom";
import { ROUTE } from "../../Helper/contant";

const sx = {
  header_root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.2s linear",
    padding: { xs: "8px 4px", sm: "8px 16px" },
    borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
    position: "sticky",
    top: 0,
    background: "white",
    zIndex: 2,
  },
  sidebarToggle: {
    color: "black",
    overflow: "hidden",
    height: "36px",
    width: { xs: "40px", sm: 0 },
    padding: { xs: "8px", sm: 0 },
    marginRight: { xs: 0, sm: "-8px" },
    transition: "all 0.2s linear",
  },
  toggleIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.2s linear",
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  logo_link: {
    display: "block",
    marginTop: "4px",
  },
  header_logo: {
    height: { xs: "16px", sm: "24px" },
    transition: "all 0.2s linear",
  },
};

export function Header() {
  const { isSidebarOpen } = useSelector((store) => store.misc);
  const dispatch = useDispatch();

  return (
    <Box sx={sx.header_root}>
      <Box display="flex" alignItems="center" gap="6px">
        <IconButton
          sx={sx.sidebarToggle}
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu sx={STX(sx.toggleIcon, { [!isSidebarOpen]: sx.visible })} />
          <Close sx={STX(sx.toggleIcon, { [isSidebarOpen]: sx.visible })} />
        </IconButton>
        <Box component={Link} to={ROUTE.USER.route} sx={sx.logo_link}>
          <Box
            component="img"
            src={logo}
            alt="Forme Jewels Logo"
            sx={sx.header_logo}
          />
        </Box>
      </Box>
      <ProfileMenu />
    </Box>
  );
}
