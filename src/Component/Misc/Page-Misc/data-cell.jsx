import { InputBase, TableCell } from "@mui/material";
import { useSelector } from "react-redux";

const sx = {
  tableRowCell: {
    whiteSpace: "nowrap",
    paddingBlock: "24px",
    position: "relative",
    "&.editable": {
      padding: 0,
    },
    "& .astrik": {
      position: "absolute",
      top: "8px",
      right: "8px",
      fontSize: "20px",
    },
  },
  input_style: {
    padding: "24px 16px",
    minWidth: "80px",
    "& input": {
      padding: 0,
    },
  },
};

export default function DataCell({ cell, onChange }) {
  const { user } = useSelector((store) => store.auth);
  const value = cell.value;
  const isAdminEdit = cell.is_admin_edit;
  const isEditable = cell.is_editable;

  const onValueChange = (e) => {
    e.stopPropagation();
    onChange(e.target.value, user.is_admin);
  };

  return (
    <TableCell className={isEditable ? "editable" : ""} sx={sx.tableRowCell}>
      {isEditable ? (
        <InputBase
          sx={sx.input_style}
          value={value || ""}
          onChange={onValueChange}
        />
      ) : (
        <span>{value}</span>
      )}
      <span className="astrik">{isAdminEdit ? "*" : ""}</span>
    </TableCell>
  );
}
