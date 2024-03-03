import { Delete } from "@mui/icons-material";

export const CUSTOMER_COLUMNS = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "mobile_no", label: "Mobile No." },
];

export const CUSTOMER_TABLE_ACTIONS = {
  DELETE_USER: {
    icon: <Delete />,
    label: "Delete Customer",
    onClick: () => {},
  },
};

export const CUS_ORDER_COLUMNS = [
  { name: "order_id", label: "Order ID" },
  { name: "job_sheet.delivery_date", label: "Delivery Date" },
  { name: "order_status", label: "Order Status" },
  { name: "job_sheet.metal", label: "Metal" },
  { name: "job_sheet.kt", label: "KT" },
  { name: "job_sheet.rhodium", label: "Rhodium" },
];
