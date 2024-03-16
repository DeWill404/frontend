import { Done } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  getMonthlyLosses,
  updateMonthlyLosses,
} from "../../../Service/loss.service";

const sx = {
  loss_footer: {
    position: "sticky",
    bottom: 0,
    background: "white",
    transition: "all 0.2s linear",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    fontWeight: "bold",
    gap: "12px",
    padding: "16px 2px",
    transform: "scale(1.009)",
    borderTop: (theme) => `1px solid ${theme.palette.grey[200]}`,
  },
  input_root: {
    width: "150px",
  },
};

export default function MonthlyLoss({ filterData, lossData, setLossData }) {
  const [isLoading, setLoading] = useState(false);
  const [isDone, setDone] = useState(false);

  const timeoutRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    (async () => {
      if (lossData === null && !isLoading) {
        setLoading(true);
        const res = await getMonthlyLosses();
        if (res.status) {
          setLossData(res.data);
          setValue(res.data[filterData.dept][filterData.month]);
        }
        setLoading(false);
        inputRef.current?.focus();
      }
    })();
  }, []);

  useEffect(() => {
    setValue(lossData?.[filterData.dept]?.[filterData.month] || 0);
  }, [filterData.dept, filterData.month]);

  useEffect(() => {
    if (isDone) {
      setTimeout(() => {
        setDone(false);
        inputRef.current?.focus();
      }, 1000);
    }
  }, [isDone]);

  const onLossChange = (e) => {
    const _value = parseFloat(e.target.value || "0") || 0;
    setValue(_value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      if (!isLoading) {
        setLoading(true);
        setDone(false);
        const res = await updateMonthlyLosses({
          dept: filterData.dept,
          month: filterData.month,
          value: _value,
        });
        if (res.status) {
          setDone(true);
        }
        setLoading(false);
        setLossData((p) => ({
          ...p,
          [filterData.dept]: {
            ...(p[filterData.dept] || {}),
            [filterData.month]: _value,
          },
        }));
        inputRef.current?.focus();
      }
    }, 500);
  };

  return (
    <Box sx={sx.loss_footer}>
      <span>Loss: </span>
      <TextField
        size="small"
        sx={sx.input_root}
        value={value}
        onChange={onLossChange}
        disabled={isLoading}
        inputRef={inputRef}
        InputProps={{
          endAdornment:
            isLoading || isDone ? (
              <InputAdornment disablePointerEvents position="end">
                <Done sx={{ color: "black", opacity: isDone ? 1 : 0 }} />
                <CircularProgress
                  size={20}
                  sx={{
                    position: "absolute",
                    color: "black",
                    background: "white",
                    right: 16,
                    opacity: isLoading ? 1 : 0,
                    transition: "all 0.2s linear",
                  }}
                />
              </InputAdornment>
            ) : (
              ""
            ),
        }}
      />
    </Box>
  );
}
