import { toast } from "react-toastify";
import { API_ROUTE, RESPONSE_CODE } from "../Helper/contant";
import axios, { resStatusSerializer } from "./axios";

export async function createOrder(data) {
  const res = await axios.post(API_ROUTE.ORDDER_CREATE, data);
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

export async function getOrderList(search, params = "") {
  let api = `${API_ROUTE.ORDDER_GET_ALL}?search=${search}` + params;
  const res = await axios.get(api);
  const status = resStatusSerializer(res);
  return { data: res.payload, status };
}

export async function updateOrder(OrderObjId, data, mute) {
  const res = await axios.put(API_ROUTE.ORDDER_UPDATE + OrderObjId, data);
  const status = resStatusSerializer(res);
  if (status && !mute) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function deleteOrder(orderObjId) {
  const res = await axios.delete(API_ROUTE.ORDDER_REMOVE + orderObjId);
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function updateOrderCustomerName(orderIds, name) {
  const ids = "?order_ids=" + orderIds.join(",");
  const res = await axios.put(API_ROUTE.ORDDER_BULK_UPDATE + ids, {
    "job_sheet.customer_name.value": name,
  });
  const status = resStatusSerializer(res);
  return { data: res.payload, status };
}
