import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogined: false,
  accessToken: "",
  user: {},
  isLSChecked: false,
  isRedirected: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogout: (_, action) => ({
      ...initialState,
      isRedirected: !!action.payload,
    }),
    setLogin: (state, action) => ({
      ...state,
      isLogined: action.payload.dontLogin ? false : true,
      accessToken: action.payload.accessToken || state.accessToken,
      user: action.payload.user || state.user,
      isLSChecked: true,
    }),
    setLSChecked: (state, action) => ({
      ...state,
      isLSChecked: action.payload,
    }),
    clearRedirected: (state) => ({ ...state, isRedirected: false }),
  },
});

export const { setLogin, setLogout, setLSChecked, clearRedirected } =
  authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
