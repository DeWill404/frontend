import { createSlice } from "@reduxjs/toolkit";
import { DELETE_STATE } from "../Helper/contant";

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
  exportPDF: {
    visible: false,
    data: {},
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
    toggleExportPDF: (state, action) => ({
      ...state,
      exportPDF: action.payload,
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
  toggleExportPDF
} = miscSlice.actions;

const miscReducer = miscSlice.reducer;
export default miscReducer;
