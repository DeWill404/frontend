import { configureStore } from "@reduxjs/toolkit";
import miscReducer from "./misc.slice";
import authReducer from "./auth.slice";
import orderReducer from "./order.slice";

export default configureStore({
  reducer: {
    misc: miscReducer,
    auth: authReducer,
    order: orderReducer,
  },
});
