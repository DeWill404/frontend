import { useDispatch, useSelector } from "react-redux";
import { NewPasswordDialog } from "./new-password.dialog";
import { useEffect } from "react";
import { toggleNewPassword } from "../../../Store/misc.slice";
import LogoutAlertDialog from "./logout-alert.dialog";
import PasswordPreviewDialog from "./password-preview.dialog";
import PageLoader from "./page-loader";
import DeleteConfirmationDialog from "./delete-confirmation.dialog";
import { DELETE_STATE, ROUTE } from "../../../Helper/contant";
import { useLocation } from "react-router-dom";
import PDFExport from "../../Pdf/export.pdf";

export function DialogWrapper() {
  const { pathname } = useLocation();
  const { user } = useSelector((store) => store.auth);
  const {
    isNewPasswordVisible,
    isLogoutVisible,
    passwordPreview,
    isPageLoaderVisible,
    deleteDialogState,
    exportPDF,
  } = useSelector((store) => store.misc);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      user?.is_password_reset &&
      !pathname.includes(ROUTE.RESET_PASSWORD.route)
    ) {
      dispatch(toggleNewPassword(true));
    }
  }, [user]);

  return (
    <>
      {isNewPasswordVisible && <NewPasswordDialog />}
      {isLogoutVisible && <LogoutAlertDialog />}
      {passwordPreview.visible && <PasswordPreviewDialog />}
      {isPageLoaderVisible && <PageLoader />}
      {deleteDialogState.state === DELETE_STATE.OPEN && (
        <DeleteConfirmationDialog />
      )}
      {exportPDF.visible && <PDFExport />}
    </>
  );
}
