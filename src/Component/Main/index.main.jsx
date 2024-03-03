import { Box } from "@mui/material";
import Sidebar from "../Sidebar/index.sidebar";
import { Outlet } from "react-router-dom";

const sx = {
  main_root: {
    flex: 1,
    display: "flex",
    marginLeft: {
      xs: "calc(-1 * var(--sidebar-width))",
      sm: "0",
    },
    transition: "all 0.2s linear",
    position: "relative",
  },
  content_root: {
    flex: 1,
    padding: {
      xs: "12px 14px 0px 14px",
      sm: "20px 20px 0px 14px",
      md: "20px 20px 0px 28px",
    },
    overflowX: "hidden",
    transition: "all 0.2s linear",
    position: "relative",
  },
};

export function Main() {
  return (
    <Box component="main" sx={sx.main_root}>
      <Sidebar />
      <Box sx={sx.content_root}>
        <Outlet />
      </Box>
    </Box>
  );
}
