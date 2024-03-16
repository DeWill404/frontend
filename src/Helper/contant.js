import {
  ArrowLeft,
  ArrowRight,
  AssignmentInd,
  CloseOutlined,
  Inventory,
  People,
  RotateLeftOutlined,
  RotateRightOutlined,
  ShoppingCart,
  SwapHorizOutlined,
  SwapVertOutlined,
  TrendingDown,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@mui/icons-material";

export const ROUTE = {
  ROOT: {
    icon: null,
    label: "Root",
    route: "/",
    isProtected: false,
    isVisible: false,
    name: "Root",
  },
  LOGIN: {
    icon: null,
    label: "Login",
    route: "/login",
    isProtected: false,
    isVisible: false,
    name: "Login",
  },
  RESET_PASSWORD: {
    icon: null,
    label: "Reset Password",
    route: "/reset-password",
    isProtected: false,
    isVisible: false,
    name: "Reset Password",
  },
  USER: {
    icon: <AssignmentInd />,
    label: "Manage User",
    route: "/users",
    isProtected: true,
    isVisible: true,
    name: "User",
  },
  CUSTOMER: {
    icon: <People />,
    label: "Manage Customer",
    route: "/customers",
    isProtected: true,
    isVisible: true,
    name: "Customer",
  },
  DESIGN: {
    icon: <Inventory />,
    label: "Manage Design",
    route: "/designs",
    isProtected: true,
    isVisible: true,
    name: "Design",
  },
  ORDER: {
    icon: <ShoppingCart />,
    label: "Manage Order",
    route: "/orders",
    isProtected: true,
    isVisible: true,
    name: "Order",
  },
  Loss: {
    icon: <TrendingDown />,
    label: "Monthy Loss",
    route: "/loss",
    isProtected: true,
    isVisible: true,
    isAdminOnly: true,
    name: "Monthy Loss",
  },
};

export const REGEX = {
  EMAIL:
    /^([\w\d-!?=&{}^`/*#|~$'+%]+\.?)*[\w\d-!?=&{}^`/*#|~$'+%]+@[\w\d]{2,}(\.[\w\d]{2,})+$/i,
  MOBILE_NO: /\d{10}/,
};

export const MESSAGE = {
  _TARGET_: "forme-jewels",
  LOGOUT: "logout",
};

export const API_ROUTE = {
  LOGIN: "/users/login",
  VALIDATE_TOKEN: "/users/validate-reset-token",
  USER_UPDATE: "/users/update",
  USER_CREATE: "/users/create",
  USER_GET_ALL: "/users/all",
  USER_REMOVE: "/users/remove",
  CUSTOMER_GET_ALL: "/customers/all",
  CUSTOMER_CREATE: "/customers/create",
  CUSTOMER_UPDATE: "/customers/update",
  CUSTOMER_REMOVE: "/customers/remove",
  DESIGN_GET_ALL: "/designs/all",
  DESIGN_CREATE: "/designs/create",
  DESIGN_UPDATE: "/designs/update",
  DESIGN_REMOVE: "/designs/remove",
  IMAGE_UPLOAD: "/misc/upload",
  ORDDER_GET_ALL: "/orders/all",
  ORDDER_CREATE: "/orders/create",
  ORDDER_UPDATE: "/orders/update",
  ORDDER_BULK_UPDATE: "/orders/bulk_update",
  ORDDER_REMOVE: "/orders/remove",
  ORDDER_LOSS_DATA: "/orders/loss",
  LOSSES: "/losses",
};

export const BROWSER_STORAGE_KEY = {
  ACCESS_TOKEN: "user_access_token",
  USER_DATA: "user_info",
  CUSTOMER_LIST: "order-list-customer_list",
  DESIGN_LIST: "order-list-design_list",
  JOB_SHEET_DATA: "order-form-job_sheet_data",
  ORDER_DESIGN_DATA: "order-form-design_data",
  DIAMOND_DATA: "order-form-diamond_data",
  METAL_DATA: "order-form-metal_data",
  CHANGE_DIA_DATA: "order-form-change_dia_data",
  EXTRA_METAL_DATA: "order-form-extra_metal_data",
  ORDER_STATUS_DATA: "order-form-order_status_data",
  SERIALIZE_ORDER_DATA: "order-form-serialize_order_data",
};

export const RESPONSE_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
};

export const FORM_STATE = {
  CLOSE: 0,
  READ: 1,
  CREATE: 2,
  UPDATE: 3,
};

export const DELETE_STATE = {
  CLOSE: 0,
  OPEN: 1,
  CONFIRM: 2,
};

export const VALID_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

export const IMAGE_PREVIEW_ACTIONS = {
  rotateLeft: <RotateLeftOutlined />,
  rotateRight: <RotateRightOutlined />,
  zoomIn: <ZoomInOutlined />,
  zoomOut: <ZoomOutOutlined />,
  close: <CloseOutlined />,
  left: <ArrowLeft />,
  right: <ArrowRight />,
  flipX: <SwapHorizOutlined />,
  flipY: <SwapVertOutlined />,
};
