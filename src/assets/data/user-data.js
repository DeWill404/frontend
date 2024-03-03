import { Delete, Key } from "@mui/icons-material";

export const USER_COLUMNS = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "mobile_no", label: "Mobile No." },
];

export const USER_TABLE_ACTIONS = {
  RESET_PASSWORD: { icon: <Key />, label: "Reset Password", onClick: () => {} },
  DELETE_USER: { icon: <Delete />, label: "Delete User", onClick: () => {} },
};
