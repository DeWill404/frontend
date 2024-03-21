import _ from "lodash";
import {
  getChangingDataFromStorage,
  getDiamondDataFromStorage,
  getExtraMetalFromStorage,
  getJobSheetFromStorage,
  getMetalDataFromStorage,
  getOrderDesigntFromStorage,
  savejobSheetToStorage,
} from "../../../Helper/browser-storage";
import { BROWSER_STORAGE_KEY, FORM_STATE } from "../../../Helper/contant";
import {
  CHANGING_DATA_COLS,
  DIAMOND_DATA_COLS,
  EXTRA_METAL_KEYS,
  JOB_SHEET_KEYS,
  METAL_DATA_COLS,
  METAL_DEPT_NAMES,
  ODK,
  ORDER_COLUMNS,
  ORDER_STATUS,
} from "../../../assets/data/order-data";
import { getEmptyRow, precision } from "../../../Helper/misc";
import { MenuItem, TextField } from "@mui/material";
import { getTotalWeight } from "../Designs/helper.designs";

export const showFilterApplied = (data) =>
  Object.keys(data).some((d) => !!data[d]?.trim());

export const mapFilterToParams = (filter) => {
  let start_date = filter.start_date.trim();
  let end_date = filter.end_date.trim();
  if (start_date && end_date) {
    const d1 = new Date(start_date);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(end_date);
    d2.setHours(0, 0, 0, 0);
    if (d2.getTime() < d1.getTime()) {
      const t = start_date;
      start_date = end_date;
      end_date = t;
    }
  }
  let metal = filter.metal.trim();
  let kt = filter.kt.trim();
  let rhodium = filter.rhodium.trim();

  let param = "";
  if (start_date) {
    param += `&start_date=${start_date}`;
  }
  if (end_date) {
    param += `&end_date=${end_date}`;
  }
  if (metal) {
    param += `&metal=${metal}`;
  }
  if (kt) {
    param += `&kt=${kt}`;
  }
  if (rhodium) {
    param += `&rhodium=${rhodium}`;
  }
  return param;
};

const blockEvent = (e) => {
  e.stopPropagation();
};
export const renderOrderRow = (onStatusChange, dataList) => {
  const _dataRow = [];
  dataList.forEach((data, idx) => {
    const row = { _id: data._id };
    for (const { name } of ORDER_COLUMNS) {
      if (name === "order_status") {
        if (!onStatusChange) {
          row[name] = data["order_status"];
        } else {
          row[name] = (
            <TextField
              select
              size="small"
              sx={{ maxWidth: "150px", minWidth: "150px" }}
              onClick={blockEvent}
              value={data["order_status"]}
              onChange={(e) => {
                blockEvent(e);
                const value = e.target.value;
                onStatusChange(data._id, idx, value);
              }}
            >
              {ORDER_STATUS.map((status, idx) => (
                <MenuItem key={idx} value={status} onClick={blockEvent}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          );
        }
      } else {
        const keys = name.split(".");
        const value = keys.reduce((acc, crr) => acc[crr], data);
        row[name] = value?.value || data[name];
        if (name.includes("date")) {
          row[name] = row[name]?.split("T")[0] || row[name];
        }
      }
    }
    _dataRow.push(row);
  });
  return _dataRow;
};

export const serializeCurrentOrderData = (formState, formData) => {
  const currentOrderData = {};

  let jobSheetData = getJobSheetFromStorage();
  if (jobSheetData) {
    Object.keys(jobSheetData).forEach((jk) => {
      jobSheetData[jk].value = jobSheetData[jk].value?.trim() || null;
      delete jobSheetData[jk].is_editable;
    });
    currentOrderData[ODK.JOB_SHEET] = jobSheetData;
  } else {
    currentOrderData[ODK.JOB_SHEET] = formData[ODK.JOB_SHEET];
  }

  let designData = getOrderDesigntFromStorage();
  if (designData) {
    currentOrderData[ODK.DESIGN] = designData;
  } else {
    currentOrderData[ODK.DESIGN] = formData[ODK.DESIGN];
  }

  let diamondData = getDiamondDataFromStorage();
  if (diamondData) {
    diamondData.forEach((rowObj) => {
      Object.keys(rowObj).forEach((dk) => {
        rowObj[dk].value = rowObj[dk].value?.trim() || null;
        delete rowObj[dk].is_editable;
      });
    });
    currentOrderData[ODK.DIAMOND] = diamondData;
  } else if (formState === FORM_STATE.CREATE) {
    currentOrderData[ODK.DIAMOND] = [getEmptyRow(DIAMOND_DATA_COLS)];
  } else {
    currentOrderData[ODK.DIAMOND] = formData[ODK.DIAMOND];
  }

  let metalData = getMetalDataFromStorage();
  if (metalData) {
    let _metalData = {};
    METAL_DEPT_NAMES.forEach(({ name: deptName }, idx) => {
      _metalData[deptName] = {};
      METAL_DATA_COLS.forEach(({ name: mk }) => {
        if (mk !== "dept") {
          const value = metalData[idx][mk].value?.trim() || null;
          const is_admin_edit = metalData[idx][mk].is_admin_edit;
          _metalData[deptName][mk] = {
            value,
            is_admin_edit,
          };
        }
      });
    });
    currentOrderData[ODK.METAL] = _metalData;
  } else if (formState === FORM_STATE.CREATE) {
    let _metalData = {};
    METAL_DEPT_NAMES.forEach(({ name: deptName }, idx) => {
      _metalData[deptName] = {};
      METAL_DATA_COLS.forEach(({ name: mk }) => {
        if (mk !== "dept") {
          _metalData[deptName][mk] = {
            value: null,
            is_admin_edit: false,
          };
        }
      });
    });
    currentOrderData[ODK.METAL] = _metalData;
  } else {
    currentOrderData[ODK.METAL] = formData[ODK.METAL];
  }

  let changingData = getChangingDataFromStorage();
  if (changingData) {
    changingData.forEach((rowObj) => {
      Object.keys(rowObj).forEach((ck) => {
        rowObj[ck].value = rowObj[ck].value?.trim() || null;
        delete rowObj[ck].is_editable;
      });
    });
    currentOrderData[ODK.CHANGING] = changingData;
  } else if (formState === FORM_STATE.CREATE) {
    currentOrderData[ODK.CHANGING] = [getEmptyRow(CHANGING_DATA_COLS)];
  } else {
    currentOrderData[ODK.CHANGING] = formData[ODK.CHANGING];
  }

  let extraData = getExtraMetalFromStorage();
  if (extraData) {
    Object.keys(extraData).forEach((ek) => {
      extraData[ek].value = extraData[ek].value?.trim() || null;
      delete extraData[ek].is_editable;
    });
    currentOrderData[ODK.EXTRA] = extraData;
  } else if (formState === FORM_STATE.CREATE) {
    extraData = {};
    EXTRA_METAL_KEYS.forEach((ek) => {
      extraData[ek] = { value: null, is_admin_edit: false };
    });
    currentOrderData[ODK.EXTRA] = extraData;
  } else {
    currentOrderData[ODK.EXTRA] = formData[ODK.EXTRA];
  }

  return currentOrderData;
};

export const calculateGrossWeight = (data, updateDetails = {}) => {
  return (
    (updateDetails.type === "extra"
      ? updateDetails.weight
      : calculateExtraWeight(data[ODK.EXTRA])) +
    (updateDetails.type === "diamond"
      ? updateDetails.weight
      : getTotalWeight(data[ODK.DESIGN]?.["cad_data"] || [])) +
    (updateDetails.type === "metal"
      ? updateDetails.weight
      : calculateMetalWeight(data[ODK.METAL], "out_wt"))
  );
};

export const processOrderTableData = (data, cols) => {
  const processData = [];
  data.forEach((row) => {
    const rowObj = {};
    const cellNames = Object.keys(row);
    let emptyCellCount = 0;
    const columnCount = cellNames.length;
    for (const name of cellNames) {
      let value = row[name].value?.trim() || null;
      rowObj[name] = {
        value,
        is_admin_edit: row[name].is_admin_edit,
        is_editable: row[name].is_editable,
      };
      if (!value) {
        emptyCellCount++;
      }
    }
    if (emptyCellCount < columnCount) {
      processData.push(rowObj);
    }
  });

  if (!processData.length) {
    processData.push(getEmptyRow(cols, true));
  }
  return processData;
};

export const setOrderDesign = (setter, data, prevData, stateData, ref) => {
  const prevId = (prevData || stateData)?.design_id;
  if (!prevId) {
    return;
  }
  let designObj = data?.find((d) => d.design_id === prevId);
  designObj = _.cloneDeep(designObj);
  setter(designObj);
  ref.current = designObj;
  return designObj;
};

export const getReadOnlyProps = (isReadOnly, inputProps = {}, sx = {}) =>
  isReadOnly
    ? {
        autoFocus: false,
        inputProps: { ...inputProps, readOnly: true, tabIndex: -1 },
        sx: { ...sx, pointerEvents: "none" },
      }
    : { inputProps, sx };

export const orderFormDataCleanup = () => {
  const storageKeys = Object.values(BROWSER_STORAGE_KEY).filter((key) =>
    key.startsWith("order-form-")
  );
  for (const key of storageKeys) {
    sessionStorage.removeItem(key);
  }
};

export const orderDataListCleanup = () => {
  const storageKeys = Object.values(BROWSER_STORAGE_KEY).filter((key) =>
    key.startsWith("order-list-")
  );
  for (const key of storageKeys) {
    sessionStorage.removeItem(key);
  }
};

/**
 * *****************************
 * *****************************
 * *****************************
 */

export const getJobsheetData = (formState, formData, cachedData, isAdmin) => {
  if (cachedData) {
    return _.cloneDeep(cachedData);
  }

  if (formState !== FORM_STATE.CREATE) {
    const data = {};
    const jobSheetData = formData[ODK.JOB_SHEET];
    for (const key of JOB_SHEET_KEYS) {
      let value = jobSheetData[key].value;
      if (key.includes("date")) {
        value = String(value)?.split("T")[0] || value;
      }
      data[key] = {
        value: value,
        is_admin_edit: jobSheetData[key].is_admin_edit,
        is_editable: isAdmin || jobSheetData[key].value === null,
      };
    }
    return data;
  }

  return {
    customer_name: { value: null, is_admin_edit: false, is_editable: true },
    order_date: { value: null, is_admin_edit: false, is_editable: true },
    delivery_date: { value: null, is_admin_edit: false, is_editable: true },
    metal: { value: null, is_admin_edit: false, is_editable: true },
    kt: { value: null, is_admin_edit: false, is_editable: true },
    pcs: { value: null, is_admin_edit: false, is_editable: true },
    rhodium: { value: null, is_admin_edit: false, is_editable: true },
  };
};
export const jobSheetDefaultValue = (formData) => {
  const defaultValues = {};
  for (const key of JOB_SHEET_KEYS) {
    defaultValues[key] = formData[key].value || "";
  }
  return defaultValues;
};
export const cacheJobSheetData = (newData, defaultData, prevData, isAdmin) => {
  const updatedObj = {};
  for (const key of JOB_SHEET_KEYS) {
    const newValue = newData[key]?.trim() || null;
    const exValue = defaultData[key];
    if (newValue !== exValue) {
      updatedObj[key] = {
        value: newValue,
        is_admin_edit: isAdmin || prevData[key].is_admin_edit,
      };
    } else {
      updatedObj[key] = {
        value: prevData[key].value,
        is_admin_edit: prevData[key].is_admin_edit,
      };
    }
    updatedObj[key]["is_editable"] = prevData[key]["is_editable"];
  }
  savejobSheetToStorage(updatedObj);
};
export const trimJobSheetData = (getter, setter) => {
  let isUpdate = false;
  for (const key of JOB_SHEET_KEYS) {
    const value = getter(key) || "";
    if (value.trim() !== value) {
      setter(key, value.trim());
      isUpdate = true;
    }
  }
  return isUpdate;
};

/**
 * *****************************
 * *****************************
 * *****************************
 */

export const getOrderDesignData = (
  formState,
  formData,
  cachedData,
  isAdmin
) => {
  if (cachedData) {
    return _.cloneDeep(cachedData);
  }

  if (formState !== FORM_STATE.CREATE) {
    return formData[ODK.DESIGN];
  }

  return null;
};

/**
 * *****************************
 * *****************************
 * *****************************
 */

export const getDiamondDefaultData = (
  formState,
  formData,
  cachedData,
  isAdmin
) => {
  if (cachedData) {
    return _.cloneDeep(cachedData);
  }

  if (formState !== FORM_STATE.CREATE) {
    const diamondData = formData[ODK.DIAMOND];
    return diamondData.map((row) => {
      const rowObj = {};
      const cellNames = DIAMOND_DATA_COLS;
      for (const { name } of cellNames) {
        const is_editable = isAdmin || row[name].value === null;
        rowObj[name] = { ...row[name], is_editable };
      }
      return rowObj;
    });
  }

  const rowObj = {};
  const cellNames = DIAMOND_DATA_COLS;
  for (const cell of cellNames) {
    rowObj[cell.name] = {
      value: null,
      is_admin_edit: false,
      is_editable: true,
    };
  }
  return [rowObj];
};
export const calculateDiamondWeight = (data) => {
  let totalWeight = 0;
  data.forEach((row) => {
    const value = parseFloat(row["total_weight"].value);
    if (!isNaN(value)) {
      totalWeight += value;
    }
  });
  return precision(totalWeight);
};

/**
 * *****************************
 * *****************************
 * *****************************
 */

export const getMetalDefaultData = (
  formState,
  formData,
  cachedData,
  isAdmin
) => {
  if (cachedData) {
    return _.cloneDeep(cachedData);
  }
  if (formState !== FORM_STATE.CREATE) {
    const metalData = formData[ODK.METAL];
    return METAL_DEPT_NAMES.map(({ name: deptName, label: deptLabel }) => {
      const rowObj = {};
      for (const { name } of METAL_DATA_COLS) {
        rowObj[name] =
          name === "dept"
            ? {
                value: deptLabel,
                is_admin_edit: false,
                is_editable: false,
              }
            : {
                ...metalData[deptName][name],
                is_editable:
                  isAdmin || metalData[deptName][name].value === null,
              };
      }
      return rowObj;
    });
  }
  const metalData = [];
  for (const deptName of METAL_DEPT_NAMES) {
    const rowObj = {};
    for (const cell of METAL_DATA_COLS) {
      rowObj[cell.name] =
        cell.name === "dept"
          ? {
              value: deptName.label,
              is_admin_edit: false,
              is_editable: false,
            }
          : {
              value: null,
              is_admin_edit: false,
              is_editable: true,
            };
    }
    metalData.push(rowObj);
  }
  return metalData;
};
export const calculateMetalWeight = (data, key) => {
  let totalWeight = 0;
  if (Array.isArray(data)) {
    data.forEach((row) => {
      const value = parseFloat(row[key].value);
      if (!isNaN(value)) {
        totalWeight += value;
      }
    });
  } else {
    Object.keys(data).forEach((rowKey) => {
      const value = parseFloat(data[rowKey][key].value);
      if (!isNaN(value)) {
        totalWeight += value;
      }
    });
  }
  return precision(totalWeight);
};

/**
 * *****************************
 * *****************************
 * *****************************
 */

export const getChangeDiaDefaultData = (
  formState,
  formData,
  cachedData,
  isAdmin
) => {
  if (cachedData) {
    return _.cloneDeep(cachedData);
  }

  if (formState !== FORM_STATE.CREATE) {
    const diamondData = formData[ODK.CHANGING];
    return diamondData.map((row) => {
      const rowObj = {};
      const cellNames = CHANGING_DATA_COLS;
      for (const { name } of cellNames) {
        const is_editable = isAdmin || row[name].value === null;
        rowObj[name] = { ...row[name], is_editable };
      }
      return rowObj;
    });
  }

  const rowObj = {};
  const cellNames = CHANGING_DATA_COLS;
  for (const cell of cellNames) {
    rowObj[cell.name] = {
      value: null,
      is_admin_edit: false,
      is_editable: true,
    };
  }
  return [rowObj];
};
export const calculateChangingWeight = (data) => {
  let totalWeight = 0;
  data.forEach((row) => {
    const value = parseFloat(row["total_weight"].value);
    if (!isNaN(value)) {
      totalWeight += value;
    }
  });
  return precision(totalWeight);
};

/**
 * *****************************
 * *****************************
 * *****************************
 */

export const getExtraMetalDefaultData = (
  formState,
  formData,
  cachedData,
  isAdmin
) => {
  if (cachedData) {
    return _.cloneDeep(cachedData);
  }

  if (formState !== FORM_STATE.CREATE) {
    const extraMetal = formData[ODK.EXTRA];
    const rowObj = {};
    const cellNames = EXTRA_METAL_KEYS;
    for (const name of cellNames) {
      const is_editable = isAdmin || extraMetal[name].value === null;
      rowObj[name] = { ...extraMetal[name], is_editable };
    }
    return rowObj;
  }

  const rowObj = {};
  const cellNames = EXTRA_METAL_KEYS;
  for (const cell of cellNames) {
    rowObj[cell] = {
      value: null,
      is_admin_edit: false,
      is_editable: true,
    };
  }
  return rowObj;
};
export const calculateExtraWeight = (data) => {
  let totalWeight = 0;
  EXTRA_METAL_KEYS.forEach((key) => {
    const value = parseFloat(data?.[key]?.value);
    if (!isNaN(value)) {
      totalWeight += value;
    }
  });
  return precision(totalWeight);
};
