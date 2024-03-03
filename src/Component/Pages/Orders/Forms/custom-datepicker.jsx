import { TextField } from "@mui/material";
import { getReadOnlyProps } from "../helper.order";
import { forwardRef } from "react";

const CustomDatePicker = forwardRef(
  ({ defaultValue, onChange, readOnly, fullWidth = true, ...props }, ref) => {
    const handleOnChange = (e) => {
      const target = e.target;
      if (target.value) {
        target.classList.remove("date-empty");
      } else {
        target.classList.add("date-empty");
      }
      onChange(e);
    };
    return (
      <TextField
        type="date"
        size="small"
        fullWidth={fullWidth}
        onChange={handleOnChange}
        {...getReadOnlyProps(readOnly, {
          className: defaultValue || props.value ? "" : "date-empty",
        })}
        {...props}
        ref={ref}
      />
    );
  }
);

export default CustomDatePicker;
