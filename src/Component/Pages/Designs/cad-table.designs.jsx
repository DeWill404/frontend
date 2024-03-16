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

export default function CADTable({ data, setData, cts, setCts }) {
  const updateCts = (value, isAdmin) =>
    setCts((p) => ({ ...p, value, is_admin_edit: isAdmin }));

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
              <TableCell sx={sx.headerCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DataTable
              columnMap={DESIGN_CAD_COLUMNS}
              data={data}
              setData={setData}
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
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
