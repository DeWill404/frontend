import { precision } from "../../../Helper/misc";

export const calculateTotalDust = (data) => {
  let total = 0;
  data.forEach((d) => {
    const value = parseFloat(d["dust_wt"]);
    if (!isNaN(value)) {
      total += value;
    }
  });
  return precision(total);
};
