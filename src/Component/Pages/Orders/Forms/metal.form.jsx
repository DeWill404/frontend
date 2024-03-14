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
import { STX } from "../../../../Helper/misc";
import { DataTable } from "../../../Misc/Page-Misc";

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
