import {
  Badge,
  Box,
  Button,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import CustomDatePicker from "./Forms/custom-datepicker";
import { useState } from "react";
import { CustomDialog } from "../../Misc/custom-dialog";
import { StyledButton } from "../../Misc/style-button";
import { showFilterApplied } from "./helper.order";
import _ from "lodash";

const sx = {
  filter_root: {
    marginTop: "20px",
  },
  filterBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s linear",
    "& svg": {
      fontSize: "20px",
    },
    "&.disabled": {
      color: "black",
      boxShadow: "none",
      border: "none",
    },
  },
  mdRapper: {
    marginTop: "10px",
    transition: "all 0.2s linear",
    maxHeight: "200px",
    "&.close": {
      overflow: "hidden",
      marginTop: "0px",
      maxHeight: "0px",
    },
    "& div > *": {
      maxWidth: "250px",
    },
  },
  filter_container: {
    display: "flex",
    alignItems: "start",
    gap: "16px",
    flexWrap: "wrap",
    "& > *": {
      flex: 1,
      minWidth: "200px !important",
      "&:nth-of-type(1), &:nth-of-type(2)": {
        minWidth: { xs: "200px !important", sm: "190px !important" },
      },
    },
  },
};

const Filters = ({ value, onChange }) => {
  return (
    <Box sx={sx.filter_container}>
      <CustomDatePicker
        name="start_date"
        label="From Delivery Date"
        placeholder="Select start range of delivery date"
        fullWidth={false}
        value={value["start_date"]}
        onChange={onChange}
      />
      <CustomDatePicker
        name="end_date"
        label="To Delivery Date"
        placeholder="Select end range of delivery date"
        fullWidth={false}
        value={value["end_date"]}
        onChange={onChange}
      />
      <TextField
        select
        name="metal"
        label="Metal"
        placeholder="Select Metal"
        size="small"
        value={value["metal"]}
        onChange={onChange}
      >
        <MenuItem value="Gold">Gold</MenuItem>
        <MenuItem value="Silver">Silver</MenuItem>
        <MenuItem value="Brass">Brass</MenuItem>
      </TextField>
      <TextField
        name="kt"
        label="KT"
        placeholder="Enter KT here"
        size="small"
        value={value["kt"]}
        onChange={onChange}
      />
      <TextField
        select
        name="rhodium"
        label="Rhodium"
        placeholder="Select Rhodium"
        size="small"
        value={value["rhodium"]}
        onChange={onChange}
      >
        <MenuItem value="White">White</MenuItem>
        <MenuItem value="Yellow">Yellow</MenuItem>
        <MenuItem value="Rose">Rose</MenuItem>
      </TextField>
    </Box>
  );
};

export default function FilterOrder({ prevValueRef, valueRef, reload }) {
  const isMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const defaultValue = {
    start_date: "",
    end_date: "",
    metal: "",
    kt: "",
    rhodium: "",
  };

  const [filterValue, setValue] = useState({ ...defaultValue });
  const setFilterValue = (e) =>
    setValue((p) => {
      const value = { ...p, [e.target.name]: e.target.value };
      valueRef.current = value;
      return value;
    });

  const [showFilter, setFilter] = useState([false, false]);
  const closeModal = () => setFilter((p) => [p[0], false]);
  const clearFilters = () => {
    valueRef.current = { ...defaultValue };
    setValue({ ...defaultValue });
    if (!_.isEqual(prevValueRef.current, valueRef.current)) {
      reload();
    }
    prevValueRef.current = { ...defaultValue };
  };

  const onApplyFilter = () => {
    if (!_.isEqual(prevValueRef.current, valueRef.current)) {
      reload();
    }
    prevValueRef.current = _.cloneDeep(valueRef.current);
    if (isMd && showFilter[1]) {
      closeModal();
    }
  };

  return (
    <Box sx={sx.filter_root} key={filterValue}>
      <Badge
        color="primary"
        variant="dot"
        invisible={!showFilterApplied(valueRef.current)}
      >
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          sx={sx.filterBtn}
          className={isMd ? "" : "disabled"}
          onClick={(e) => {
            if (isMd) {
              setFilter((p) => [p[0], !p[1]]);
            } else {
              setFilter((p) => [!p[0], p[1]]);
            }
          }}
        >
          <span>
            {(isMd && showFilter[1]) || (!isMd && showFilter[0])
              ? "Hide "
              : "Show "}
            Filters
          </span>
          <Tune />
        </Button>
      </Badge>

      {isMd ? (
        <CustomDialog
          open={showFilter[1]}
          onClose={closeModal}
          title={<h3>Filters</h3>}
          content={
            <Box marginTop="20px">
              <Filters value={filterValue} onChange={setFilterValue} />
            </Box>
          }
          actions={
            <>
              <Button
                color="warning"
                variant="contained"
                size="small"
                onClick={clearFilters}
              >
                &nbsp; Clear Filters &nbsp;
              </Button>

              <StyledButton
                variant="contained"
                size="small"
                onClick={onApplyFilter}
              >
                Apply Filters
              </StyledButton>
            </>
          }
        />
      ) : (
        <Box sx={sx.mdRapper} className={showFilter[0] ? "" : "close"}>
          <Filters value={filterValue} onChange={setFilterValue} />
          <Button
            color="warning"
            variant="outlined"
            size="small"
            sx={{ marginTop: "20px" }}
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
          <StyledButton
            color="warning"
            variant="outlined"
            size="small"
            sx={{ marginTop: "20px", marginLeft: "20px" }}
            onClick={onApplyFilter}
          >
            Apply Filters
          </StyledButton>
        </Box>
      )}
    </Box>
  );
}
