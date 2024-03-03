import { BROWSER_STORAGE_KEY } from "./contant";

export function getUserInfo() {
  const info = localStorage.getItem(BROWSER_STORAGE_KEY.USER_DATA);
  try {
    return info ? JSON.parse(info) : {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function setUserInfo(info) {
  if (info) {
    localStorage.setItem(BROWSER_STORAGE_KEY.USER_DATA, JSON.stringify(info));
  }
}

export function getUserToken() {
  const token = localStorage.getItem(BROWSER_STORAGE_KEY.ACCESS_TOKEN);
  return token || null;
}

export function setUserToken(token) {
  if (token) {
    localStorage.setItem(BROWSER_STORAGE_KEY.ACCESS_TOKEN, token);
  }
}

export function logoutUser() {
  localStorage.removeItem(BROWSER_STORAGE_KEY.ACCESS_TOKEN);
  localStorage.removeItem(BROWSER_STORAGE_KEY.USER_DATA);
}

export function saveCustomerToStorage(data) {
  if (data && data.length) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.CUSTOMER_LIST,
      JSON.stringify(data)
    );
  }
}
export function getCustomerFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.CUSTOMER_LIST);
  return data ? JSON.parse(data) : null;
}

export function saveDesignsToStorage(data) {
  if (data && data.length) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.DESIGN_LIST,
      JSON.stringify(data)
    );
  }
}
export function getDesignsFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.DESIGN_LIST);
  return data ? JSON.parse(data) : null;
}

export function savejobSheetToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.JOB_SHEET_DATA,
      JSON.stringify(data)
    );
  }
}
export function getJobSheetFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.JOB_SHEET_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveOrderDesignToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.ORDER_DESIGN_DATA,
      JSON.stringify(data)
    );
  }
}
export function getOrderDesigntFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.ORDER_DESIGN_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveDiamondDataToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.DIAMOND_DATA,
      JSON.stringify(data)
    );
  }
}
export function getDiamondDataFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.DIAMOND_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveMetalDataToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.METAL_DATA,
      JSON.stringify(data)
    );
  }
}
export function getMetalDataFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.METAL_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveChangingDataToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.CHANGE_DIA_DATA,
      JSON.stringify(data)
    );
  }
}
export function getChangingDataFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.CHANGE_DIA_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveExtraMetalToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.EXTRA_METAL_DATA,
      JSON.stringify(data)
    );
  }
}
export function getExtraMetalFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.EXTRA_METAL_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveOrderStatusToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.ORDER_STATUS_DATA,
      JSON.stringify(data)
    );
  }
}
export function getOrderStatusFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.ORDER_STATUS_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveSerializedDataToStorage(data) {
  if (data) {
    sessionStorage.setItem(
      BROWSER_STORAGE_KEY.SERIALIZE_ORDER_DATA,
      JSON.stringify(data)
    );
  }
}
export function getSerializedFromStorage() {
  const data = sessionStorage.getItem(BROWSER_STORAGE_KEY.SERIALIZE_ORDER_DATA);
  return data ? JSON.parse(data) : null;
}
