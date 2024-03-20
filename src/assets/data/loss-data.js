export const DEFAULT_LOSS_FILTER = {
  dept: "",
  month: new Date().toISOString().split("-").slice(0, 2).join("-"),
  kt: null,
};

export const LOSS_COLUMNS = [
  { name: "order_id", label: "Order ID" },
  { name: "customer_name", label: "Customer Name" },
  { name: "pcs", label: "Pcs" },
  {
    name: "in_wt",
    label: (
      <span>
        In Weight <small className="normal-text">(gms)</small>
      </span>
    ),
  },
  {
    name: "out_wt",
    label: (
      <span>
        Out Weight <small className="normal-text">(gms)</small>
      </span>
    ),
  },
  {
    name: "dust_wt",
    label: (
      <span>
        Dust Weight <small className="normal-text">(gms)</small>
      </span>
    ),
  },
  {
    name: "complete_date",
    label: "Completion Date",
  },
];

export const KT_VALUES = [
  "24",
  "23",
  "22",
  "21",
  "20",
  "19",
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
];
