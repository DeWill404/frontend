import { Box, Button, Drawer, useMediaQuery } from "@mui/material";
import SidebarData from "./sidebar-data.sidebar";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../Store/misc.slice";
import { Close } from "@mui/icons-material";

const sx = {
  drawer_sidebar: {
    display: { xs: "initial", sm: "none" },
  },
  drawer_close_btn: {
    display: "flex",
    padding: "8px 16px",
    justifyContent: "end",
    "& button": {
      gap: "8px",
      color: "black",
    },
    "& svg": {
      width: "20px",
      height: "20px",
    },
  },
};

export default function Sidebar() {
  const { isSidebarOpen } = useSelector((store) => store.misc);
  const dispatch = useDispatch();

  const isXS = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const closeSidebar = () => {
    if (isSidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      <SidebarData />

      <Drawer
        variant="temporary"
        open={isSidebarOpen && isXS}
        onClose={closeSidebar}
        sx={sx.drawer_sidebar}
      >
        <>
          <Box sx={sx.drawer_close_btn}>
            <Button variant="outlined" color="inherit" onClick={closeSidebar}>
              <span>Close</span>
              <Close />
            </Button>
          </Box>
          <SidebarData />
        </>
      </Drawer>
    </>
  );
}
