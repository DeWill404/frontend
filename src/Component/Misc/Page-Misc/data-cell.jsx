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

function TextCell({ isEditable, value, onChange }) {
  return isEditable ? (
    <InputBase sx={sx.input_style} value={value || ""} onChange={onChange} />
  ) : (
    <span>{value}</span>
  );
}

function DateCell({ isEditable, value, onChange }) {
  if (isEditable) {
    return (
      <InputBase
        type="date"
        sx={sx.input_style}
        value={value ? (value.includes("T") ? value.split("T")[0] : value) : ""}
        onChange={onChange}
        inputProps={{ className: value ? "" : "date-empty" }}
      />
    );
  }

  let _v;
  if (value) {
    _v = value.split("T")[0];
    const [y, m, d] = _v.split("-");
    _v = [d, m, y].join("-");
  } else {
    _v = "";
  }
  return <span>{_v}</span>;
}

export default function DataCell({ name, cell, onChange }) {
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
      {name.includes("date") ? (
        <DateCell
          isEditable={isEditable}
          value={value}
          onChange={onValueChange}
        />
      ) : (
        <TextCell
          isEditable={isEditable}
          value={value}
          onChange={onValueChange}
        />
      )}
      <span className="astrik">{isAdminEdit ? "*" : ""}</span>
    </TableCell>
  );
}
