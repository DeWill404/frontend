import { configureStore } from "@reduxjs/toolkit";
import miscReducer from "./misc.slice";
import authReducer from "./auth.slice";

export default configureStore({
  reducer: {
    misc: miscReducer,
    auth: authReducer,
  },
});
