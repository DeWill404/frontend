import { Box, Button } from "@mui/material";
import { CustomDialog } from "../custom-dialog";
import { StyledButton } from "../style-button";
import { useDispatch, useSelector } from "react-redux";
import { toggleDeleteDialog } from "../../../Store/misc.slice";
import { DELETE_STATE } from "../../../Helper/contant";

export default function DeleteConfirmationDialog() {
  const { deleteDialogState } = useSelector((store) => store.misc);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(toggleDeleteDialog());
  };
  const handleDelete = () => {
    dispatch(
      toggleDeleteDialog({
        state: DELETE_STATE.CONFIRM,
        id: deleteDialogState.id,
      })
    );
  };

  return (
    <CustomDialog
      open={deleteDialogState.state === DELETE_STATE.OPEN}
      onClose={handleClose}
      title="Are you sure?"
      content={
        <Box
          marginTop="30px"
          dangerouslySetInnerHTML={{ __html: deleteDialogState.message }}
        ></Box>
      }
      actions={
        <>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleClose}
            autoFocus
          >
            Cancel
          </Button>
          <StyledButton onClick={handleDelete}>Delete</StyledButton>
        </>
      }
    />
  );
}
