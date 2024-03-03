import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  JOB_SHEET_KEYS,
  ORDER_FORM_STEPPER,
} from "../../../../assets/data/order-data";
import {
  cacheJobSheetData,
  getJobsheetData,
  getReadOnlyProps,
  jobSheetDefaultValue,
  trimJobSheetData,
} from "../helper.order";
import { useForm } from "react-hook-form";
import { getCustomerList } from "../../../../Service/customer.service";
import {
  getCustomerFromStorage,
  getJobSheetFromStorage,
  saveCustomerToStorage,
} from "../../../../Helper/browser-storage";
import CustomAutoComplete from "./custom-autocomplete";
import CustomDatePicker from "./custom-datepicker";
import { REQUIRED } from "../../../../Helper/misc";
import _ from "lodash";

const JOB_SHEET_FORM_INDEX = 0;

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

export default function JobSheetForm({
  formState,
  formData,
  setValidator,
  isAdmin,
  resetDefault,
}) {
  const cachedData = useMemo(getJobSheetFromStorage, [resetDefault]);
  const prevData = useMemo(
    () => getJobsheetData(formState, formData, cachedData, isAdmin),
    [formState, formData, cachedData, isAdmin, resetDefault]
  );
  const defaultValues = useMemo(
    () => jobSheetDefaultValue(prevData),
    [prevData, resetDefault]
  );

  const l = (label, idx) =>
    label + (prevData[JOB_SHEET_KEYS[idx]].is_admin_edit ? " *" : "");
  const iro = (idx) => !prevData[JOB_SHEET_KEYS[idx]].is_editable;
  const dv = useCallback(
    (idx) => defaultValues[JOB_SHEET_KEYS[idx]],
    [resetDefault]
  );

  const {
    getValues,
    setValue,
    control,
    formState: { errors },
    trigger,
    register,
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
    for (const key of JOB_SHEET_KEYS) {
      setValue(key, defaultValues[key]);
    }
  }, [resetDefault]);

  const [consumerList, setConsumerList] = useState([]);
  const [loadingCustomer, setCustomerLoading] = useState(false);

  useEffect(() => {
    setValidator(() => async () => {
      trimJobSheetData(getValues, setValue);
      const isValid = await trigger(null, { shouldFocus: true });
      if (isValid) {
        cacheJobSheetData(getValues(), defaultValues, prevData, isAdmin);
      }
      return isValid;
    });

    (async () => {
      setCustomerLoading(true);
      let data = getCustomerFromStorage();
      if (!data) {
        const res = await getCustomerList("");
        if (res.status) {
          data = _.uniq(res.data.map((d) => d.name)).sort();
          saveCustomerToStorage(data);
        }
      }
      if (data) {
        setConsumerList(data);
      }
      setCustomerLoading(false);
    })();
  }, []);

  return (
    <Box sx={sx.form_root}>
      <h3>{ORDER_FORM_STEPPER[JOB_SHEET_FORM_INDEX][1]}</h3>
      <Box sx={sx.form_wrapper}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomAutoComplete
              name={JOB_SHEET_KEYS[0]}
              label={l("Customer Name", 0)}
              control={control}
              validate={REQUIRED(iro(0))}
              errors={errors[JOB_SHEET_KEYS[0]]}
              freeSolo
              options={consumerList}
              loading={loadingCustomer}
              readOnly={iro(0)}
              autoFocus={true}
              key={resetDefault}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomDatePicker
              name={JOB_SHEET_KEYS[1]}
              label={l("Order Date", 1)}
              placeholder="Order Date"
              defaultValue={dv(1)}
              {...register(JOB_SHEET_KEYS[1], REQUIRED(iro(1)))}
              error={!!errors[JOB_SHEET_KEYS[1]]}
              helperText={errors[JOB_SHEET_KEYS[1]]?.message || ""}
              readOnly={iro(1)}
              key={resetDefault}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomDatePicker
              name={JOB_SHEET_KEYS[2]}
              label={l("Delivery Date", 2)}
              placeholder="Delivery Date"
              defaultValue={dv(2)}
              {...register(JOB_SHEET_KEYS[2], REQUIRED(iro(2)))}
              error={!!errors[JOB_SHEET_KEYS[2]]}
              helperText={errors[JOB_SHEET_KEYS[2]]?.message || ""}
              readOnly={iro(2)}
              key={resetDefault}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              select
              name={JOB_SHEET_KEYS[3]}
              label={l("Metal", 3)}
              placeholder="Select Metal"
              size="small"
              fullWidth
              defaultValue={dv(3)}
              {...register(JOB_SHEET_KEYS[3], REQUIRED(iro(3)))}
              error={!!errors[JOB_SHEET_KEYS[3]]}
              helperText={errors[JOB_SHEET_KEYS[3]]?.message || ""}
              {...getReadOnlyProps(iro(3))}
              key={resetDefault}
            >
              <MenuItem value="Gold">Gold</MenuItem>
              <MenuItem value="Silver">Silver</MenuItem>
              <MenuItem value="Brass">Brass</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              name={JOB_SHEET_KEYS[4]}
              label={l("KT", 4)}
              placeholder="Enter KT here"
              size="small"
              fullWidth
              {...register(JOB_SHEET_KEYS[4], REQUIRED(iro(4)))}
              error={!!errors[JOB_SHEET_KEYS[4]]}
              helperText={errors[JOB_SHEET_KEYS[4]]?.message || ""}
              {...getReadOnlyProps(iro(4))}
              key={resetDefault}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              name={JOB_SHEET_KEYS[5]}
              label={l("Pcs", 5)}
              placeholder="Enter peices here"
              size="small"
              fullWidth
              {...register(JOB_SHEET_KEYS[5], REQUIRED(iro(5)))}
              error={!!errors[JOB_SHEET_KEYS[5]]}
              helperText={errors[JOB_SHEET_KEYS[5]]?.message || ""}
              {...getReadOnlyProps(iro(5))}
              key={resetDefault}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              select
              name={JOB_SHEET_KEYS[6]}
              label={l("Rhodium", 6)}
              placeholder="Select Rhodium"
              size="small"
              fullWidth
              defaultValue={dv(6)}
              {...register(JOB_SHEET_KEYS[6], REQUIRED(iro(6)))}
              error={!!errors[JOB_SHEET_KEYS[6]]}
              helperText={errors[JOB_SHEET_KEYS[6]]?.message || ""}
              {...getReadOnlyProps(iro(6))}
              key={resetDefault}
            >
              <MenuItem value="White">White</MenuItem>
              <MenuItem value="Yellow">Yellow</MenuItem>
              <MenuItem value="Rose">Rose</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
