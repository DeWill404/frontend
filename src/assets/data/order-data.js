import {
  Build,
  Delete,
  Diamond,
  FitnessCenter,
  Inventory,
  Iso,
  PostAdd,
  Summarize,
} from "@mui/icons-material";
import JobSheetForm from "../../Component/Pages/Orders/Forms/job-sheet.form";
import OrderDesignForm from "../../Component/Pages/Orders/Forms/design.form";
import DiamondDataForm from "../../Component/Pages/Orders/Forms/diamond.form";
import MetalForm from "../../Component/Pages/Orders/Forms/metal.form";
import ChangingDiamondDataForm from "../../Component/Pages/Orders/Forms/change.form";
import ExtraMetalForm from "../../Component/Pages/Orders/Forms/extra.form";
import FormSummary from "../../Component/Pages/Orders/Forms/summary";

export const ORDER_FORM_STEPPER = [
  [
    <PostAdd />,
    "Job Sheet",
    (formState, formData, setValidator, isAdmin, resetDefault) => (
      <JobSheetForm
        formState={formState}
        formData={formData}
        setValidator={setValidator}
        isAdmin={isAdmin}
        resetDefault={resetDefault}
      />
    ),
  ],
  [
    <Inventory />,
    "Select/Create Design",
    (formState, formData, setValidator, isAdmin) => (
      <OrderDesignForm
        formState={formState}
        formData={formData}
        setValidator={setValidator}
        isAdmin={isAdmin}
      />
    ),
  ],
  [
    <Diamond />,
    "Diamond Details",
    (formState, formData, setValidator, isAdmin, resetDefault) => (
      <DiamondDataForm
        formState={formState}
        formData={formData}
        setValidator={setValidator}
        isAdmin={isAdmin}
        resetDefault={resetDefault}
      />
    ),
  ],
  [
    <FitnessCenter />,
    "Metal Details",
    (formState, formData, setValidator, isAdmin, resetDefault) => (
      <MetalForm
        formState={formState}
        formData={formData}
        setValidator={setValidator}
        isAdmin={isAdmin}
        resetDefault={resetDefault}
      />
    ),
  ],
  [
    <Build />,
    "Diamond Change",
    (formState, formData, setValidator, isAdmin, resetDefault) => (
      <ChangingDiamondDataForm
        formState={formState}
        formData={formData}
        setValidator={setValidator}
        isAdmin={isAdmin}
        resetDefault={resetDefault}
      />
    ),
  ],
  [
    <Iso />,
    "Extra Metal",
    (formState, formData, setValidator, isAdmin, resetDefault) => (
      <ExtraMetalForm
        formState={formState}
        formData={formData}
        setValidator={setValidator}
        isAdmin={isAdmin}
        resetDefault={resetDefault}
      />
    ),
  ],
  [
    <Summarize />,
    "Summary",
    (formState, formData, setValidator, isAdmin, resetDefault) => (
      <FormSummary
        formState={formState}
        formData={formData}
        setValidator={setValidator}
        isAdmin={isAdmin}
        resetDefault={resetDefault}
      />
    ),
  ],
];

export const ORDER_COLUMNS = [
  { name: "order_id", label: "Order ID" },
  { name: "job_sheet.customer_name", label: "Customer Name" },
  { name: "job_sheet.delivery_date", label: "Delivery Date" },
  { name: "order_status", label: "Order Status", sortable: false },
  { name: "job_sheet.metal", label: "Metal" },
  { name: "job_sheet.kt", label: "KT" },
  { name: "job_sheet.rhodium", label: "Rhodium" },
];

export const ORDER_TABLE_ACTIONS = {
  DELETE_USER: {
    icon: <Delete />,
    label: "Delete Order",
    onClick: () => {},
  },
};

export const ODK = {
  DESIGN: "design",
  JOB_SHEET: "job_sheet",
  DIAMOND: "diamond",
  METAL: "metal",
  CHANGING: "changing",
  EXTRA: "extra",
};

export const JOB_SHEET_KEYS = [
  "customer_name",
  "order_date",
  "delivery_date",
  "metal",
  "kt",
  "pcs",
  "rhodium",
];

export const DIAMOND_DATA_COLS = [
  {
    name: "size",
    label: (
      <span>
        Size <small className="normal-text">(carat)</small>
      </span>
    ),
  },
  { name: "pcs", label: "Pcs" },
  { name: "pointer", label: "Pointer" },
  {
    name: "total_weight",
    label: (
      <span>
        Total Weight <small className="normal-text">(mg)</small>
      </span>
    ),
  },
];

export const METAL_DATA_COLS = [
  {
    name: "dept",
    label: "Department",
  },
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
];

export const METAL_DEPT_NAMES = [
  { name: "filling", label: "Filling" },
  { name: "pre_polish", label: "Pre Polish" },
  { name: "setting", label: "Setting" },
  { name: "final_polish", label: "Final Polish" },
  { name: "qc", label: "QC" },
  { name: "repair", label: "Repair" },
];

export const CHANGING_DATA_COLS = [
  {
    name: "size",
    label: "Size",
  },
  { name: "pcs", label: "Pcs" },
  { name: "wt", label: "Weight" },
  { name: "total_weight", label: "Total Weight" },
];

export const EXTRA_METAL_KEYS = ["metal", "wire", "solder"];

export const ORDER_STATUS = [
  "Not Started",
  "Filling",
  "Pre Polish",
  "Setting",
  "Final Polish",
  "QC",
  "Repair",
];

export const ORDER_DATA = {
  _id: "65db2ac9786d93f361c9c24d",
  order_id: "12345678",
  order_status: "Not Started",
  [ODK.DESIGN]: {
    design_id: "75640098",
  },
  [ODK.JOB_SHEET]: {
    customer_name: { value: "Irshad Siddique", is_admin_edit: false },
    order_date: { value: "2024-02-10", is_admin_edit: false },
    delivery_date: { value: "2024-03-01", is_admin_edit: false },
    metal: { value: "Gold", is_admin_edit: false },
    kt: { value: "24", is_admin_edit: true },
    pcs: { value: "10", is_admin_edit: true },
    rhodium: { value: "Rose", is_admin_edit: false },
  },
  [ODK.DIAMOND]: [
    {
      size: { value: "1", is_admin_edit: false },
      pcs: { value: null, is_admin_edit: false },
      pointer: { value: "4", is_admin_edit: false },
      total_weight: { value: "10", is_admin_edit: true },
    },
    {
      size: { value: "1", is_admin_edit: false },
      pcs: { value: null, is_admin_edit: false },
      pointer: { value: "6", is_admin_edit: false },
      total_weight: { value: "30", is_admin_edit: true },
    },
    {
      size: { value: "1", is_admin_edit: false },
      pcs: { value: "2", is_admin_edit: false },
      pointer: { value: "2", is_admin_edit: false },
      total_weight: { value: "10", is_admin_edit: true },
    },
  ],
  [ODK.METAL]: {
    filling: {
      pcs: { value: null, is_admin_edit: false },
      in_wt: { value: "10", is_admin_edit: false },
      out_wt: { value: "20", is_admin_edit: true },
      dust_wt: { value: null, is_admin_edit: false },
    },
    pre_polish: {
      pcs: { value: null, is_admin_edit: false },
      in_wt: { value: "10", is_admin_edit: false },
      out_wt: { value: "20", is_admin_edit: true },
      dust_wt: { value: null, is_admin_edit: false },
    },
    setting: {
      pcs: { value: null, is_admin_edit: false },
      in_wt: { value: "10", is_admin_edit: false },
      out_wt: { value: "20", is_admin_edit: true },
      dust_wt: { value: null, is_admin_edit: false },
    },
    final_polish: {
      pcs: { value: null, is_admin_edit: false },
      in_wt: { value: "10", is_admin_edit: false },
      out_wt: { value: "20", is_admin_edit: true },
      dust_wt: { value: null, is_admin_edit: false },
    },
    qc: {
      pcs: { value: null, is_admin_edit: false },
      in_wt: { value: "10", is_admin_edit: false },
      out_wt: { value: "20", is_admin_edit: true },
      dust_wt: { value: null, is_admin_edit: false },
    },
    repair: {
      pcs: { value: null, is_admin_edit: false },
      in_wt: { value: "10", is_admin_edit: false },
      out_wt: { value: "20", is_admin_edit: true },
      dust_wt: { value: null, is_admin_edit: false },
    },
  },
  [ODK.CHANGING]: [
    {
      size: { value: "1", is_admin_edit: false },
      pcs: { value: null, is_admin_edit: false },
      wt: { value: "4", is_admin_edit: false },
      total_weight: { value: "10", is_admin_edit: true },
    },
    {
      size: { value: "1", is_admin_edit: false },
      pcs: { value: null, is_admin_edit: false },
      wt: { value: "6", is_admin_edit: false },
      total_weight: { value: "30", is_admin_edit: true },
    },
    {
      size: { value: "1", is_admin_edit: false },
      pcs: { value: "2", is_admin_edit: false },
      wt: { value: "2", is_admin_edit: false },
      total_weight: { value: "10", is_admin_edit: true },
    },
  ],
  [ODK.EXTRA]: {
    metal: { value: "1", is_admin_edit: true },
    wire: { value: "11", is_admin_edit: false },
    solder: { value: "10", is_admin_edit: true },
  },
};
