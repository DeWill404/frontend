import { useEffect, useMemo, useState } from "react";
import {
  getChangingDataFromStorage,
  saveChangingDataToStorage,
} from "../../../../Helper/browser-storage";
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
  CHANGING_DATA_COLS,
  ORDER_FORM_STEPPER,
} from "../../../../assets/data/order-data";
import {
  calculateChangingWeight,
  getChangeDiaDefaultData,
  processOrderTableData,
} from "../helper.order";
import { STX } from "../../../../Helper/misc";
import { cad_table_sx as table_sx } from "../../Designs/helper.designs";
import { DataTable } from "../../../Misc/Page-Misc";

const CHANGING_DIA_FORM_INDEX = 4;

const sx = {
  form_root: {
    marginTop: "10px",
  },
};

export default function ChangingDiamondDataForm({
  formState,
  formData,
  setValidator,
  isAdmin,
  resetDefault,
}) {
  const cachedData = useMemo(getChangingDataFromStorage, [resetDefault]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(
      getChangeDiaDefaultData(formState, formData, cachedData, isAdmin)
    );
  }, [resetDefault, formData]);

  useEffect(() => {
    setValidator(() => () => {
      const processedData = processOrderTableData(
        tableData,
        CHANGING_DATA_COLS
      );
      saveChangingDataToStorage(processedData);
      return true;
    });
  }, [tableData]);

  return (
    <Box sx={sx.form_root}>
      <h3>{ORDER_FORM_STEPPER[CHANGING_DIA_FORM_INDEX][1]}</h3>
      <Box sx={STX(table_sx.tableRoot, { maxWidth: "700px" })}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {CHANGING_DATA_COLS.map((cadCol) => (
                  <TableCell sx={table_sx.headerCell} key={cadCol.name}>
                    {cadCol.label}
                  </TableCell>
                ))}
                <TableCell sx={table_sx.headerCell}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <DataTable
                columnMap={CHANGING_DATA_COLS}
                data={tableData}
                setData={setTableData}
              />
              <TableRow sx={table_sx.tableRow}>
                <TableCell sx={table_sx.totalCell} colSpan={3}>
                  <span>Total Diamond Weight</span>
                </TableCell>
                <TableCell sx={table_sx.totalCell}>
                  <span>{calculateChangingWeight(tableData)}</span>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
