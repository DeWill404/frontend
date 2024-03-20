import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weightUpdated: false,
  weightDetails: {},
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    updateGrossWeight: (state, action) => ({
      ...state,
      weightUpdated: true,
      weightDetails: action.payload,
    }),
    grossWeightUpdated: (state) => ({
      ...state,
      weightUpdated: false,
      weightDetails: {},
    }),
  },
});

export const { updateGrossWeight, grossWeightUpdated } =
  orderSlice.actions;

const orderReducer = orderSlice.reducer;
export default orderReducer;
