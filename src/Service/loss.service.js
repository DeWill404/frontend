import { API_ROUTE } from "../Helper/contant";
import axios, { resStatusSerializer } from "./axios";

export async function getMonthlyLosses() {
  const res = await axios.get(API_ROUTE.LOSSES);
  const status = resStatusSerializer(res);
  return { data: res.payload, status };
}

export async function updateMonthlyLosses(payload) {
  const res = await axios.put(API_ROUTE.LOSSES, payload);
  const status = resStatusSerializer(res);
  return { data: res.payload, status };
}
