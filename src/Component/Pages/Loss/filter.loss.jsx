import { Box, MenuItem, TextField } from "@mui/material";
import { METAL_DEPT_NAMES } from "../../../assets/data/order-data";
import { KT_VALUES } from "../../../assets/data/loss-data";
import CustomAutoComplete from "../Orders/Forms/custom-autocomplete";

const sx = {
  filter_root: {
    marginTop: "30px",
  },
  mdRapper: {
    marginTop: "10px",
    transition: "all 0.2s linear",
  },
  filter_container: {
    display: "flex",
    alignItems: "start",
    gap: "16px",
    maxWidth: "700px",
    flexWrap: "wrap",
    "& > *": {
      flex: "1 1 200px",
    },
  },
};

export default function LossFilter({ valueRef, reload }) {
  const setValueRef = (e) => {
    const value = { ...valueRef.current, [e.target.name]: e.target.value };
    valueRef.current = value;
    reload();
  };

  return (
    <Box sx={sx.filter_root} key={valueRef.current}>
      <Box sx={sx.mdRapper}>
        <Box sx={sx.filter_container}>
          <TextField
            select
            name="dept"
            label="Department"
            placeholder="Select a department"
            size="small"
            fullWidth
            value={valueRef.current.dept}
            onChange={setValueRef}
          >
            {METAL_DEPT_NAMES.map((nameObj, idx) => (
              <MenuItem key={idx} value={nameObj.name}>
                {nameObj.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="month"
            name="month"
            label="Month"
            placeholder="Select month & year"
            size="small"
            fullWidth
            value={valueRef.current.month}
            onChange={setValueRef}
            inputProps={{
              className: valueRef.current.month ? "" : "date-empty",
            }}
          />
          <CustomAutoComplete
            options={KT_VALUES}
            label="KT"
            name="kt"
            value={valueRef.current.kt}
            onChange={(_, newVal) =>
              setValueRef({ target: { name: "kt", value: newVal } })
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
