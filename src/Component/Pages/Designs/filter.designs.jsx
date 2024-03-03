import {
  Badge,
  Box,
  Button,
  Checkbox,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import { useState } from "react";
import _ from "lodash";
import { DESIGN_FILTERS } from "../../../assets/data/design-data";
import { CustomDialog } from "../../Misc/custom-dialog";
import { StyledButton } from "../../Misc/style-button";

const sx = {
  filter_root: {},
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
    },
    "& .chk-container": {
      display: "flex",
      alignItems: { xs: "start", sm: "center" },
      "& .unused-design-chk-bx": {
        color: "black",
      },
    },
  },
};

const showFilterApplied = (data) =>
  Object.keys(data).some((d) =>
    d === "showUnused" ? !!data[d] : !!data[d]?.trim()
  );

const Filters = ({ value, onChange, isAdmin }) => {
  return (
    <Box sx={sx.filter_container}>
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
      {isAdmin && (
        <Box className="chk-container">
          <Checkbox
            className="unused-design-chk-bx"
            id="unused-design-chk"
            name="showUnused"
            checked={value["showUnused"]}
            onChange={onChange}
          />
          <label className="chk-label" htmlFor="unused-design-chk">
            Show unused designs
          </label>
        </Box>
      )}
    </Box>
  );
};

export default function FilterDesign({
  prevValueRef,
  valueRef,
  reload,
  isAdmin,
}) {
  const isMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const defaultValue = { ...DESIGN_FILTERS };

  const [filterValue, setValue] = useState({ ...defaultValue });
  const setFilterValue = (e) => {
    const n = e.target.name;
    const v = e.target.value;
    setValue((p) => {
      const value = { ...p, [n]: n === "showUnused" ? e.target.checked : v };
      valueRef.current = value;
      return value;
    });
  };

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
              <Filters
                value={filterValue}
                onChange={setFilterValue}
                isAdmin={isAdmin}
              />
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
          <Filters
            value={filterValue}
            onChange={setFilterValue}
            isAdmin={isAdmin}
          />
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
