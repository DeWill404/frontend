import { useEffect, useMemo, useState } from "react";
import {
  getMetalDataFromStorage,
  saveMetalDataToStorage,
} from "../../../../Helper/browser-storage";
import {
  calculateMetalWeight,
  getMetalDefaultData,
  processOrderTableData,
} from "../helper.order";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  METAL_DATA_COLS,
  ORDER_FORM_STEPPER,
} from "../../../../assets/data/order-data";
import { cad_table_sx as table_sx } from "../../Designs/helper.designs";
import { STX, precision } from "../../../../Helper/misc";
import { DataTable } from "../../../Misc/Page-Misc";
import { useDispatch } from "react-redux";
import { updateGrossWeight } from "../../../../Store/order.slice";

const METAL_FORM_INDEX = 3;

const sx = {
  form_root: {
    marginTop: "10px",
    "& tbody": {
      "& tr:not(:last-child)": {
        "& td:nth-of-type(1)": {
          fontWeight: "bold",
        },
      },
    },
  },
};

export default function MetalForm({
  formState,
  formData,
  setValidator,
  isAdmin,
  resetDefault,
}) {
  const dispatch = useDispatch();

  const cachedData = useMemo(getMetalDataFromStorage, [resetDefault]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(getMetalDefaultData(formState, formData, cachedData, isAdmin));
  }, [resetDefault, formData]);

  useEffect(() => {
    setValidator(() => () => {
      const processedData = processOrderTableData(tableData);
      saveMetalDataToStorage(processedData);
      return true;
    });
  }, [tableData]);

  const updateDustWt = (idx) => {
    setTableData((_rows) =>
      _rows.map((_row, _idx) => {
        if (_idx === idx) {
          const in_wt = isNaN(parseFloat(_row["in_wt"].value))
            ? 0
            : parseFloat(_row["in_wt"].value);
          const out_wt = isNaN(parseFloat(_row["out_wt"].value))
            ? 0
            : parseFloat(_row["out_wt"].value);
          _row["dust_wt"].value = String(in_wt - out_wt);
          _row["dust_wt"].is_admin_edit = isAdmin;
          return { ..._row };
        }
        return _row;
      })
    );
  };

  const updateGrossWt = (idx, value) => {
    let totalWeight = 0;
    if (Array.isArray(tableData)) {
      tableData.forEach((row, _idx) => {
        const _value = parseFloat(idx === _idx ? value : row["out_wt"].value);
        if (!isNaN(_value)) {
          totalWeight += _value;
        }
      });
    } else {
      Object.keys(tableData).forEach((rowKey, _idx) => {
        const _value = parseFloat(
          idx === _idx ? value : tableData[rowKey]["out_wt"].value
        );
        if (!isNaN(_value)) {
          totalWeight += _value;
        }
      });
    }
    totalWeight = precision(totalWeight);
    dispatch(updateGrossWeight({ type: "metal", weight: totalWeight }));
  };

  const onDataChange = (idx, name, value) => {
    if (name === "in_wt" || name === "out_wt") {
      updateDustWt(idx);
      if (name === "out_wt") {
        updateGrossWt(idx, value);
      }
    }
  };

  return (
    <Box sx={sx.form_root}>
      <h3>{ORDER_FORM_STEPPER[METAL_FORM_INDEX][1]}</h3>
      <Box sx={STX(table_sx.tableRoot, { maxWidth: "900px" })}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {METAL_DATA_COLS.map((cadCol) => (
                  <TableCell sx={table_sx.headerCell} key={cadCol.name}>
                    {cadCol.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <DataTable
                columnMap={METAL_DATA_COLS}
                data={tableData}
                setData={setTableData}
                onChange={onDataChange}
                hideActions
              />
              <TableRow sx={table_sx.tableRow}>
                <TableCell sx={table_sx.totalCell} colSpan={2}>
                  <span>Final Weight</span>
                </TableCell>
                <TableCell sx={table_sx.totalCell}>
                  <span>{calculateMetalWeight(tableData, "in_wt")}</span>
                </TableCell>
                <TableCell sx={table_sx.totalCell}>
                  <span>{calculateMetalWeight(tableData, "out_wt")}</span>
                </TableCell>
                <TableCell sx={table_sx.totalCell}>
                  <span>{calculateMetalWeight(tableData, "dust_wt")}</span>
                </TableCell>
                <TableCell sx={table_sx.totalCell}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
