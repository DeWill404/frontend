import { Box, Divider, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import JobSheetForm from "./job-sheet.form";
import OrderDesignForm from "./design.form";
import DiamondDataForm from "./diamond.form";
import MetalForm from "./metal.form";
import ChangingDiamondDataForm from "./change.form";
import ExtraMetalForm from "./extra.form";
import { FORM_STATE } from "../../../../Helper/contant";
import {
  calculateGrossWeight,
  getReadOnlyProps,
  serializeCurrentOrderData,
} from "../helper.order";
import {
  getOrderGrossWeightFromStorage,
  getOrderStatusFromStorage,
  saveOrderGrossWeightToStorage,
  saveOrderStatusToStorage,
  saveSerializedDataToStorage,
} from "../../../../Helper/browser-storage";
import {
  ORDER_FORM_STEPPER,
  ORDER_STATUS,
} from "../../../../assets/data/order-data";
import { useDispatch, useSelector } from "react-redux";
import { grossWeightUpdated } from "../../../../Store/order.slice";

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
  divider: {
    margin: "30px 0 20px 0",
    opacity: 0,
  },
};

export default function FormSummary({ ...props }) {
  const { weightUpdated, weightDetails } = useSelector((store) => store.order);
  const dispatch = useDispatch();

  const [orderStatus, setOrderStatus] = useState("");
  const [grossWeight, setGrossWeight] = useState(0);

  const [reloadFlag, setReloadFlag] = useState(0);
  const reload = () => setReloadFlag((p) => (p === 100 ? 0 : p + 1));

  useEffect(() => {
    const orderData = serializeCurrentOrderData(
      props.formState,
      props.formData
    );
    saveSerializedDataToStorage(orderData);

    let currWeight;
    const cachedWeight = getOrderGrossWeightFromStorage();
    if (cachedWeight) {
      currWeight = cachedWeight;
    } else if (props.formState !== FORM_STATE.CREATE) {
      currWeight = props.formData.gross_weight;
    } else {
      currWeight = calculateGrossWeight(orderData);
    }
    setGrossWeight(currWeight);
    saveOrderGrossWeightToStorage(currWeight);

    let currStatus;
    const cachedStatus = getOrderStatusFromStorage();
    if (cachedStatus) {
      currStatus = cachedStatus;
    } else if (props.formState !== FORM_STATE.CREATE) {
      currStatus = props.formData.order_status;
    } else {
      currStatus = ORDER_STATUS[0];
    }
    setOrderStatus(currStatus);
    saveOrderStatusToStorage(currStatus);
  }, [props.resetDefault, reloadFlag, props.formData]);

  useEffect(() => {
    if (weightUpdated) {
      const orderData = serializeCurrentOrderData(
        props.formState,
        props.formData
      );
      const updatedWeight = calculateGrossWeight(orderData, weightDetails);
      setGrossWeight(updatedWeight);
      saveOrderGrossWeightToStorage(updatedWeight);
      dispatch(grossWeightUpdated());
    }
  }, [weightUpdated]);

  useEffect(() => {
    if (props.formState === FORM_STATE.CREATE) {
      props.setValidator(() => () => {
        return true;
      });
      document
        .getElementById("order-form-scroll-element")
        .scrollIntoView({ block: "end" });
    }
  }, []);

  const [iValidator, setIValidator] = useState(
    Array(ORDER_FORM_STEPPER.length - 1)
  );
  const setInternalValidator = (idx) => (validator) =>
    setIValidator((p) => {
      const _p = [...p];
      _p[idx] = validator();
      return _p;
    });
  useEffect(() => {
    if (props.formState !== FORM_STATE.CREATE) {
      props.setValidator(() => async () => {
        let isValid = true;
        for (const validator of iValidator) {
          if (validator) {
            const _isValid = await validator();
            isValid = isValid && _isValid;
          }
        }
        reload();
        return isValid;
      });
    }
  }, [iValidator]);

  return (
    <Box id="order-summary-form" sx={sx.form_root}>
      <h3>Summary</h3>
      <Box sx={sx.form_wrapper}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              label="Gross Weight"
              variant="filled"
              fullWidth
              value={grossWeight}
              {...getReadOnlyProps(true)}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              select
              name="order-status"
              label="Order Status"
              fullWidth
              value={orderStatus}
              onChange={(e) => {
                const v = e.target.value;
                saveOrderStatusToStorage(v);
                setOrderStatus(v);
              }}
            >
              {ORDER_STATUS.map((status, idx) => (
                <MenuItem key={idx} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
      {props.formState !== FORM_STATE.CREATE && (
        <Box>
          <JobSheetForm {...props} setValidator={setInternalValidator(0)} />
          <Divider sx={sx.divider} />
          <OrderDesignForm {...props} setValidator={setInternalValidator(1)} />
          {/* <Divider sx={sx.divider} />
          <DiamondDataForm {...props} setValidator={setInternalValidator(2)} /> */}
          <Divider sx={sx.divider} />
          <MetalForm {...props} setValidator={setInternalValidator(2)} />
          <Divider sx={sx.divider} />
          <ChangingDiamondDataForm
            {...props}
            setValidator={setInternalValidator(3)}
          />
          <Divider sx={sx.divider} />
          <ExtraMetalForm {...props} setValidator={setInternalValidator(4)} />
        </Box>
      )}
    </Box>
  );
}
