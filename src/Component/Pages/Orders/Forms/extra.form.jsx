import { useEffect, useMemo, useRef, useState } from "react";
import {
  getExtraMetalFromStorage,
  saveExtraMetalToStorage,
} from "../../../../Helper/browser-storage";
import {
  calculateExtraWeight,
  getExtraMetalDefaultData,
  getReadOnlyProps,
} from "../helper.order";
import { Box, Divider, Grid, TextField } from "@mui/material";
import {
  EXTRA_METAL_KEYS,
  ORDER_FORM_STEPPER,
} from "../../../../assets/data/order-data";
import { precision } from "../../../../Helper/misc";
import { useDispatch } from "react-redux";
import { updateGrossWeight } from "../../../../Store/order.slice";

const EXTRA_METAL_FORM_INDEX = 4;

const sx = {
  form_root: {
    marginTop: "10px",
  },
  form_wrapper: {
    marginBlock: "20px",
    padding: "40px 20px 30px 20px",
    border: (theme) => `1px solid ${theme.palette.grey[500]}`,
    borderRadius: "8px",
  },
};

export default function ExtraMetalForm({
  formState,
  formData,
  setValidator,
  isAdmin,
  resetDefault,
}) {
  const dispatch = useDispatch();

  const cachedData = useMemo(getExtraMetalFromStorage, [resetDefault]);
  const [currData, setCurrData] = useState({});
  const dataCopy = useRef(null);

  useEffect(() => {
    const d = getExtraMetalDefaultData(
      formState,
      formData,
      cachedData,
      isAdmin
    );
    setCurrData(d);
    dataCopy.current = d;
  }, [resetDefault, formData]);

  useEffect(() => {
    setValidator(() => () => {
      saveExtraMetalToStorage(dataCopy.current);
      return true;
    });
  }, []);

  const val = (idx) => currData?.[EXTRA_METAL_KEYS[idx]]?.value || "";
  const chg = (idx) => (e) => {
    const key = EXTRA_METAL_KEYS[idx];
    setCurrData((p) => {
      const u = {
        ...p,
        [key]: {
          ...p[key],
          value: e.target.value,
          is_admin_edit: isAdmin,
        },
      };
      dataCopy.current = u;
      return u;
    });
  };
  const iro = (idx) => !currData?.[EXTRA_METAL_KEYS[idx]]?.is_editable;

  useEffect(() => {
    let totalWeight = 0;
    EXTRA_METAL_KEYS.forEach((key) => {
      const value = parseFloat(currData?.[key]?.value);
      if (!isNaN(value)) {
        totalWeight += value;
      }
    });
    totalWeight = precision(totalWeight);
    dispatch(updateGrossWeight({ type: "extra", weight: totalWeight }));
  }, [currData]);

  return (
    <Box sx={sx.form_root}>
      <h3>{ORDER_FORM_STEPPER[EXTRA_METAL_FORM_INDEX][1]}</h3>
      <Box sx={sx.form_wrapper}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              name={EXTRA_METAL_KEYS[0]}
              label="Metal"
              size="small"
              fullWidth
              value={val(0)}
              onChange={chg(0)}
              {...getReadOnlyProps(iro(0))}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              name={EXTRA_METAL_KEYS[1]}
              label="Wire"
              size="small"
              fullWidth
              value={val(1)}
              onChange={chg(1)}
              {...getReadOnlyProps(iro(1))}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              name={EXTRA_METAL_KEYS[2]}
              label="Solder"
              size="small"
              fullWidth
              value={val(2)}
              onChange={chg(2)}
              {...getReadOnlyProps(iro(2))}
            />
          </Grid>
        </Grid>
        <Divider sx={{ marginBlock: "40px" }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              label="Total"
              variant="filled"
              fullWidth
              value={calculateExtraWeight(currData)}
              {...getReadOnlyProps(true)}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
