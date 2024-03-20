import { useEffect, useMemo, useState } from "react";
import {
  getDiamondDataFromStorage,
  saveDiamondDataToStorage,
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
  DIAMOND_DATA_COLS,
  ORDER_FORM_STEPPER,
} from "../../../../assets/data/order-data";
import {
  calculateDiamondWeight,
  getDiamondDefaultData,
  processOrderTableData,
} from "../helper.order";
import { STX, precision } from "../../../../Helper/misc";
import { cad_table_sx as table_sx } from "../../Designs/helper.designs";
import { DataTable } from "../../../Misc/Page-Misc";
import { useDispatch } from "react-redux";
import { updateGrossWeight } from "../../../../Store/order.slice";

const DIAMOND_FORM_INDEX = 2;

const sx = {
  form_root: {
    marginTop: "10px",
  },
};

export default function DiamondDataForm({
  formState,
  formData,
  setValidator,
  isAdmin,
  resetDefault,
}) {
  const dispatch = useDispatch();

  const cachedData = useMemo(getDiamondDataFromStorage, [resetDefault]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(
      getDiamondDefaultData(formState, formData, cachedData, isAdmin)
    );
  }, [resetDefault, formData]);

  useEffect(() => {
    setValidator(() => () => {
      const processedData = processOrderTableData(tableData, DIAMOND_DATA_COLS);
      saveDiamondDataToStorage(processedData);
      return true;
    });
  }, [tableData]);

  const onDataChange = (idx, name, value) => {
    if (name === "total_weight") {
      let totalWeight = 0;
      tableData.forEach((row, _idx) => {
        const _value = parseFloat(
          idx === _idx ? value : row["total_weight"].value
        );
        if (!isNaN(_value)) {
          totalWeight += _value;
        }
      });
      totalWeight = precision(totalWeight);
      dispatch(updateGrossWeight({ type: "diamond", weight: totalWeight }));
    }
  };

  const onDelete = (idx) => {
    onDataChange(idx, "total_weight", 0);
  };

  return (
    <Box sx={sx.form_root}>
      <h3>{ORDER_FORM_STEPPER[DIAMOND_FORM_INDEX][1]}</h3>
      <Box sx={STX(table_sx.tableRoot, { maxWidth: "700px" })}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {DIAMOND_DATA_COLS.map((cadCol) => (
                  <TableCell sx={table_sx.headerCell} key={cadCol.name}>
                    {cadCol.label}
                  </TableCell>
                ))}
                <TableCell sx={table_sx.headerCell}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <DataTable
                columnMap={DIAMOND_DATA_COLS}
                data={tableData}
                setData={setTableData}
                onChange={onDataChange}
                onRowDelete={onDelete}
              />
              <TableRow sx={table_sx.tableRow}>
                <TableCell sx={table_sx.totalCell} colSpan={3}>
                  <span>Total Weight</span>
                </TableCell>
                <TableCell sx={table_sx.totalCell}>
                  <span>{calculateDiamondWeight(tableData)}</span>
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
