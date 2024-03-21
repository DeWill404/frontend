import { createSlice } from "@reduxjs/toolkit";
import { DELETE_STATE } from "../Helper/contant";
import { ODK, ORDER_DATA } from "../assets/data/order-data";
import { DESIGN_DATA } from "../assets/data/design-data";

const initialState = {
  isSidebarOpen: false,
  isNewPasswordVisible: false,
  isLogoutVisible: false,
  passwordPreview: {
    visible: false,
    password: "",
    resetLink: "",
  },
  isPageLoaderVisible: false,
  deleteDialogState: {
    state: DELETE_STATE.CLOSE,
    message: null,
    id: null,
  },
  pdfDialog: {
    visible: true,
    data: { ...ORDER_DATA, [ODK.DESIGN]: DESIGN_DATA },
  },
};

export const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    toggleSidebar: (state) => ({
      ...state,
      isSidebarOpen: !state.isSidebarOpen,
    }),
    toggleNewPassword: (state, action) => ({
      ...state,
      isNewPasswordVisible: action.payload,
    }),
    toggleLogoutAlert: (state, action) => ({
      ...state,
      isLogoutVisible: action.payload,
    }),
    togglePasswordPreview: (state, action) => ({
      ...state,
      passwordPreview: {
        visible: action.payload?.visible || false,
        password: action.payload?.password || "",
        resetLink: action.payload?.resetLink || "",
      },
    }),
    togglePageLoader: (state, action) => ({
      ...state,
      isPageLoaderVisible: action.payload,
    }),
    toggleDeleteDialog: (state, action) => ({
      ...state,
      deleteDialogState: {
        state: action.payload?.state || DELETE_STATE.CLOSE,
        message: action.payload?.message || null,
        id: action.payload?.id || null,
      },
    }),
    togglePDFDialog: (state, action) => ({
      ...state,
      pdfDialog: action.payload,
    }),
  },
});

export const {
  toggleSidebar,
  toggleNewPassword,
  toggleLogoutAlert,
  togglePasswordPreview,
  togglePageLoader,
  toggleDeleteDialog,
  togglePDFDialog,
} = miscSlice.actions;

const miscReducer = miscSlice.reducer;
export default miscReducer;
