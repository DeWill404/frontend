import { toast } from "react-toastify";
import { API_ROUTE, RESPONSE_CODE } from "../Helper/contant";
import axios, { resStatusSerializer } from "./axios";

export async function loginUser(body) {
  const res = await axios.post(API_ROUTE.LOGIN, body, { skipLogin: true });
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function updatePassword(password) {
  const res = await axios.patch(API_ROUTE.USER_UPDATE, { password });
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function createUser(data) {
  const res = await axios.post(API_ROUTE.USER_CREATE, data);
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

export async function getUserList(search) {
  const api = `${API_ROUTE.USER_GET_ALL}?search=${search}`;
  const res = await axios.get(api);
  const status = resStatusSerializer(res);
  return { data: res.payload, status };
}

export async function deleteUser(userId) {
  const res = await axios.delete(API_ROUTE.USER_REMOVE + userId);
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function updateUser(userId, data, isResetPassword) {
  const res = await axios.put(API_ROUTE.USER_UPDATE + userId, data);
  const status = resStatusSerializer(res);
  if (status) {
    if (isResetPassword) {
      toast.success("Password reset successfully");
    } else {
      toast.success(res.message);
    }
  }
  return { data: res.payload, status };
}

export async function validateResetToken() {
  const res = await axios.post(API_ROUTE.VALIDATE_TOKEN, {});
  return { data: res.payload, status: res.status === RESPONSE_CODE.SUCCESS };
}
