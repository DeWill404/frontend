import { toast } from "react-toastify";
import { API_ROUTE, RESPONSE_CODE } from "../Helper/contant";
import axios, { resStatusSerializer } from "./axios";

export async function createCustomer(data) {
  const res = await axios.post(API_ROUTE.CUSTOMER_CREATE, data);
  const status = resStatusSerializer(
    res,
    RESPONSE_CODE.SUCCESS,
    RESPONSE_CODE.CREATED
  );
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function getCustomerList(search) {
  const api = `${API_ROUTE.CUSTOMER_GET_ALL}?search=${search}`;
  const res = await axios.get(api);
  const status = resStatusSerializer(res);
  return { data: res.payload, status };
}

export async function deleteCustomer(customerId) {
  const res = await axios.delete(API_ROUTE.CUSTOMER_REMOVE + customerId);
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function updateCustomer(customerId, data) {
  const res = await axios.put(API_ROUTE.CUSTOMER_UPDATE + customerId, data);
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}
