import { List, ListItemButton } from "@mui/material";
import { STX, overflowAuto } from "../../Helper/misc";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE } from "../../Helper/contant";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../Store/misc.slice";

const sx = {
  sidebar_container: {
    borderRight: (theme) => `1px solid ${theme.palette.grey[300]}`,
    paddingLeft: "12px",
    paddingBlock: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    zIndex: 2,
    position: "sticky",
    top: 57,
    height: "calc(100dvh - 57px)",
  },
  sidebar_item: {
    width: "var(--sidebar-item)",
    maxWidth: "calc(100vw - var(--sidebar-padding))",
    minHeight: "40px",
    maxHeight: "40px",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "20px",
    gap: "12px",
    transition: "all 0.2s linear",
    whiteSpace: "nowrap",
  },
  item_active: {
    background: (theme) => theme.palette.grey[300],
  },
};

export default function SidebarData() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isSidebarOpen } = useSelector((store) => store.misc);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const onLinkClick = (e, route) => {
    e.stopPropagation();
    navigate(route, { state: null });
    overflowAuto();
    if (isSidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <List sx={sx.sidebar_container}>
      {Object.values(ROUTE)
        .filter((o) => o.isVisible && (user.is_admin || !o.isAdminOnly))
        .map((option, idx) => (
          <ListItemButton
            onClick={(e) => onLinkClick(e, option.route)}
            key={idx}
            sx={STX(sx.sidebar_item, {
              [pathname.includes(option.route)]: sx.item_active,
            })}
          >
            {option.icon}
            <span>{option.label}</span>
          </ListItemButton>
        ))}
    </List>
  );
}
