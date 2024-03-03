import { useDispatch, useSelector } from "react-redux";
import { CustomDialog } from "../custom-dialog";
import { toggleLogoutAlert } from "../../../Store/misc.slice";
import { Button } from "@mui/material";
import { StyledButton } from "../style-button";
import useMisc from "../../../Hook/useMisc";

export default function LogoutAlertDialog() {
  const { isLogoutVisible } = useSelector((store) => store.misc);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(toggleLogoutAlert(false));
  };

  const { setUserLogout } = useMisc();
  const handleYes = () => {
    handleClose();
    setUserLogout();
  };

  return (
    <CustomDialog
      open={isLogoutVisible}
      onClose={handleClose}
      title={<h3>Alert !!</h3>}
      content="Are you sure want to logout?"
      fullWidth={false}
      maxWidth={false}
      showCloseBtn={false}
      showDivider={false}
      actions={
        <>
          <Button
            color="inherit"
            variant="outlined"
            sx={{ flex: 1, marginRight: "12px" }}
            onClick={handleClose}
            autoFocus
          >
            No
          </Button>
          <StyledButton sx={{ flex: 1 }} onClick={handleYes}>
            Yes
          </StyledButton>
        </>
      }
    />
  );
}
