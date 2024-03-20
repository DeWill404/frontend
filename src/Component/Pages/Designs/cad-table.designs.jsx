import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DESIGN_CAD_COLUMNS } from "../../../assets/data/design-data";
import { DataTable } from "../../Misc/Page-Misc";
import {
  getTotalQuantity,
  getTotalWeight,
  cad_table_sx as sx,
} from "./helper.designs";
import DataCell from "../../Misc/Page-Misc/data-cell";
import { precision } from "../../../Helper/misc";
import { updateGrossWeight } from "../../../Store/order.slice";
import { useDispatch } from "react-redux";

export default function CADTable({ data, setData, cts, setCts, hideActions }) {
  const dispatch = useDispatch();

  const updateCts = (value, isAdmin) =>
    setCts((p) => ({ ...p, value, is_admin_edit: isAdmin }));

  const onDataChange = (idx, name, value) => {
    if (name === "weight") {
      let totalWeight = 0;
      data.forEach((row, _idx) => {
        const _value = parseFloat(idx === _idx ? value : row["weight"].value);
        if (!isNaN(_value)) {
          totalWeight += _value;
        }
      });
      totalWeight = precision(totalWeight);
      dispatch(updateGrossWeight({ type: "diamond", weight: totalWeight }));
    }
  };

  const onDelete = (idx) => {
    onDataChange(idx, "weight", 0);
  };

  return (
    <Box sx={sx.tableRoot}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {DESIGN_CAD_COLUMNS.map((cadCol) => (
                <TableCell sx={sx.headerCell} key={cadCol.name}>
                  {cadCol.label}
                </TableCell>
              ))}
              {!hideActions && <TableCell sx={sx.headerCell}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            <DataTable
              columnMap={DESIGN_CAD_COLUMNS}
              data={data}
              setData={setData}
              hideActions={hideActions}
              onChange={onDataChange}
              onRowDelete={onDelete}
            />
            <TableRow sx={sx.tableRow}>
              <TableCell sx={sx.totalCell} colSpan={4}>
                <span>Total Diamond Weight</span>
              </TableCell>
              <DataCell name="CTS" cell={cts} onChange={updateCts} />
              <TableCell sx={sx.totalCell}>
                <span>{getTotalQuantity(data)}</span>
              </TableCell>
              <TableCell sx={sx.totalCell}>
                <span>{getTotalWeight(data)}</span>
              </TableCell>
              {!hideActions && <TableCell></TableCell>}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
