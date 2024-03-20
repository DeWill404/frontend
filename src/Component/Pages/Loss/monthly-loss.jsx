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
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    fontWeight: "bold",
    gap: "20px",
    padding: "16px 0",
    flexWrap: "wrap",
  },
  input_root: {
    width: "120px",
    minWidth: "120px",
    "& *": {
      color: "black !important",
      textFillColor: "black !important",
    },
    "& .Mui-disabled": {
      background: "#00000006",
      borderRadius: "4px",
    },
  },
};

export default function MonthlyLoss({
  filterData,
  lossData,
  setLossData,
  totalDust,
}) {
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
          setValue(
            res.data?.[filterData.dept]?.[filterData.month]?.[filterData.kt] ||
              0
          );
        }
        setLoading(false);
        inputRef.current?.focus();
      }
    })();
  }, []);

  useEffect(() => {
    setValue(
      lossData?.[filterData.dept]?.[filterData.month]?.[filterData.kt] || 0
    );
  }, [filterData.dept, filterData.month, filterData.kt]);

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
          kt: filterData.kt,
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
            [filterData.month]: {
              ...(p[filterData.dept][filterData.month] || {}),
              [filterData.kt]: _value,
            },
          },
        }));
        inputRef.current?.focus();
      }
    }, 500);
  };

  return (
    <Box sx={sx.loss_footer}>
      <Box display="flex" alignItems="center" gap={1} textAlign="right">
        <span>Total dust Weight: </span>
        <TextField
          size="small"
          sx={sx.input_root}
          value={totalDust}
          onChange={onLossChange}
          disabled={true}
        />
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <span>Recovered: </span>
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
                  <Done sx={{ opacity: isDone ? 1 : 0 }} />
                  <CircularProgress
                    size={20}
                    sx={{
                      position: "absolute",
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
      <Box display="flex" alignItems="center" gap={1}>
        <span>Loss: </span>
        <TextField
          size="small"
          sx={sx.input_root}
          value={totalDust - value}
          onChange={onLossChange}
          disabled={true}
        />
      </Box>
    </Box>
  );
}
