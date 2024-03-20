import { Box, Slide } from "@mui/material";
import { FORM_STATE } from "../../../Helper/contant";
import { form_sx as sx } from "./helper.designs";
import DesignForm from "./form.design";

export default function DesignFormWrapper(props) {
  return (
    <Slide
      direction="up"
      unmountOnExit
      in={props.showForm !== FORM_STATE.CLOSE}
    >
      <Box sx={sx.form_popup}>
        <DesignForm {...props} />
      </Box>
    </Slide>
  );
}
