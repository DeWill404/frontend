import { toast } from "react-toastify";
import { API_ROUTE, RESPONSE_CODE } from "../Helper/contant";
import axios, { resStatusSerializer } from "./axios";

export async function uploadImage(prefix, url, blob, onUploadProgress) {
  const payload = new FormData();
  payload.append("prefix", prefix);
  payload.append("url", url);
  payload.append("file", blob);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  };

  const res = await axios.post(API_ROUTE.IMAGE_UPLOAD, payload, config);
  const status = resStatusSerializer(res);
  if (status) {
    return res.payload;
  }
}

export async function createDesign(data) {
  const res = await axios.post(API_ROUTE.DESIGN_CREATE, data);
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

export async function getDesignList(search, params = "") {
  let api = `${API_ROUTE.DESIGN_GET_ALL}?search=${search}` + params;
  const res = await axios.get(api);
  const status = resStatusSerializer(res);
  return { data: res.payload, status };
}

export async function updateDesign(designObjId, data) {
  const res = await axios.put(API_ROUTE.DESIGN_UPDATE + designObjId, data);
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}

export async function deleteDesign(designId) {
  const res = await axios.delete(API_ROUTE.DESIGN_REMOVE + designId);
  const status = resStatusSerializer(res);
  if (status) {
    toast.success(res.message);
  }
  return { data: res.payload, status };
}
