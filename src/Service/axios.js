import instance from "axios";
import { MESSAGE, RESPONSE_CODE } from "../Helper/contant";
import { triggerMessage } from "../Helper/misc";
import { getUserToken } from "../Helper/browser-storage";
import { toast } from "react-toastify";

const axios = instance.create({
  baseURL: process.env.REACT_APP_BACKEND_URI,
});

axios.interceptors.request.use(
  (config) => {
    const { skipLogin, ..._config } = { ...config };
    if (!skipLogin) {
      const token = getUserToken();
      if (token) {
        _config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return _config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  function (error) {
    console.error(error.response.data);
    if (error.response.status === RESPONSE_CODE.UNAUTHORIZED) {
      triggerMessage(MESSAGE.LOGOUT);
    }
    return error.response.data;
  }
);

export default axios;

export const apiDelay = async (timeOut = 5000) =>
  await new Promise((resolve) => setTimeout(resolve, timeOut));

export const resStatusSerializer = (res, ...successCode) => {
  const status = (
    successCode.length ? successCode : [RESPONSE_CODE.SUCCESS]
  ).includes(res.status);
  if (!status && res.status !== RESPONSE_CODE.UNAUTHORIZED) {
    toast.error(res.message);
  }
  return status;
};
