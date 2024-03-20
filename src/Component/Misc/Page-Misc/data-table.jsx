import { TableCell, TableRow } from "@mui/material";
import DataCell from "./data-cell";
import TableActionMenu from "./table-action-menu";
import { ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
import { getEmptyRow } from "../../../Helper/misc";

const sx = {
  actionCell: {
    width: "1px",
    padding: "6px",
    paddingRight: "12px",
    cursor: "auto",
  },
};

const getRowActions = (columnMap, data, setData) => {
  const createRow = () => getEmptyRow(columnMap, true);

  const onAddAbove = (idx) => {
    if (idx === 0) {
      setData((prev) => [createRow(), ...prev]);
    } else {
      setData((prev) => [
        ...prev.slice(0, idx),
        createRow(),
        ...prev.slice(idx),
      ]);
    }
  };
  const onAddBelow = (idx) => {
    if (idx === data.length - 1) {
      setData((prev) => [...prev, createRow()]);
    } else {
      setData((prev) => [
        ...prev.slice(0, idx + 1),
        createRow(),
        ...prev.slice(idx + 1),
      ]);
    }
  };
  const onDelete = (idx) => {
    setData((prev) => prev.filter((_, _idx) => idx !== _idx));
  };

  const actions = [
    { icon: <ArrowUpward />, label: "Add Row above", onClick: onAddAbove },
    { icon: <ArrowDownward />, label: "Add Row below", onClick: onAddBelow },
  ];
  if (data.length > 1) {
    actions.push({ icon: <Delete />, label: "Delete Row", onClick: onDelete });
  }
  return actions;
};

export default function DataTable({
  columnMap,
  data,
  setData,
  hideActions,
  onChange,
}) {
  const onCellChange = (idx, name, value, isAdmin) => {
    setData((_rows) =>
      _rows.map((_row, _idx) => {
        if (_idx === idx) {
          _row[name].value = value;
          _row[name].is_admin_edit = isAdmin;
          return { ..._row };
        }
        return _row;
      })
    );
    onChange?.(idx, name, value, isAdmin);
  };

  return (
    <>
      {data.map((row, idx) => (
        <TableRow hover key={idx}>
          {columnMap.map(({ name }) => (
            <DataCell
              key={name}
              name={name}
              cell={row[name]}
              onChange={(value, isAdmin) =>
                onCellChange(idx, name, value, isAdmin)
              }
            />
          ))}
          {!hideActions && (
            <TableCell sx={sx.actionCell}>
              <TableActionMenu
                id={idx}
                actions={getRowActions(columnMap, data, setData)}
              />
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}
