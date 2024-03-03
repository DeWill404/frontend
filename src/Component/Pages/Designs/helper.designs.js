import Image from "rc-image";
import { FORM_STATE, IMAGE_PREVIEW_ACTIONS } from "../../../Helper/contant";
import { uploadImage } from "../../../Service/design.service";
import { DESIGN_CAD_COLUMNS } from "../../../assets/data/design-data";
import { getEmptyRow, precision } from "../../../Helper/misc";

export const form_sx = {
  form_popup: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    maxHeight: "calc(100dvh - 53px)",
    background: "white",
    zIndex: 10,
    padding: {
      xs: "12px 14px 0px 14px",
      sm: "20px 20px 0px 14px",
      md: "20px 20px 0px 28px",
    },
  },
  form_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    "& h2": {
      fontWeight: "normal",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  form_wrapper: {
    marginTop: "20px",
    marginBottom: "60px",
    padding: "40px 20px 30px 20px",
    boxShadow: (theme) => theme.shadows[2],
    border: (theme) => `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    "& .error-text": {
      color: (theme) => theme.palette.error.main,
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: "1.66",
      letterSpacing: "0.03333em",
      textAlign: "left",
      marginTop: "4px",
      marginRight: "14px",
      marginBottom: "0",
      marginLeft: "14px",
    },
  },
  form_footer: {
    zIndex: 2,
    display: "flex",
    gap: { xs: "8px", sm: "16px" },
    justifyContent: "end",
    alignItems: "center",
    position: "sticky",
    bottom: 0,
    background: "white",
    padding: {
      xs: "20px 14px 20px 14px",
      sm: "20px 20px 20px 14px",
      md: "20px 20px 20px 28px",
    },
    margin: {
      xs: "0px -14px 0px -14px",
      sm: "0px -20px 0px -14px",
      md: "0px -20px 0px -28px",
    },
    "& button": {
      paddingInline: { xs: "8px", sm: "16px" },
    },
  },
  reset_btn: {
    marginRight: "auto",
  },
  image_container: {
    display: "flex",
    flexDirection: "column",
    height: "200px",
    gap: "12px",
    "& .container-title": {
      whiteSpace: "nowrap",
    },
    "& .drag-container": {
      flex: 1,
    },
  },
};

export const cad_table_sx = {
  tableRoot: {
    width: "100%",
    border: (theme) => `1px solid ${theme.palette.grey[500]}`,
    borderRadius: "8px",
    marginTop: "10px",
    marginBottom: "10px",
    overflow: "hidden",
    transition: "all 0.2s linear",
    "& td:not(:first-of-type), & th:not(:first-of-type)": {
      borderLeft: (theme) => `1px solid ${theme.palette.grey[300]}`,
    },
  },
  headerCell: {
    background: (theme) => theme.palette.grey[100],
    borderBottomColor: (theme) => theme.palette.grey[500],
    whiteSpace: "nowrap",
    fontWeight: "bold",
  },
  tableRowCell: {
    whiteSpace: "nowrap",
    paddingBlock: "24px",
  },
  totalCell: {
    paddingBlock: "12px",
  },
};

export const page_table_sx = {
  wrapper: {
    "& table .rc-image": {
      maxHeight: "100px",
      maxWidth: "200px",
      margin: "0px",
    },
  },
  actionHeader: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    "& .chk-container": {
      display: "flex",
      alignItems: { xs: "start", sm: "center" },
      flex: 1,
      "& .chk-label": {
        width: { xs: "min-content", sm: "auto" },
        minWidth: "110px",
        fontSize: "14px",
        cursor: "pointer",
      },
      "& .unused-design-chk-bx": {
        color: "black",
      },
    },
    "& .toggle-container button": {
      borderColor: "black",
      color: "black",
      transition: "all 0.2s linear",
      paddingBlock: "4px",
      "& svg": {
        fontSize: "20px",
      },
      "&.Mui-selected": {
        background: "black",
        color: "white",
      },
    },
  },
};

export const DIT = {
  REF: "ref_image",
  CAD: "cad_image",
  FNL: "final_image",
  TBL: "cad_data",
  CTS: "cts",
};

export const getDefaultImgValue = (name, formData, formState) => {
  if (formState === FORM_STATE.CREATE) {
    return {
      url: null,
      blob: null,
      is_admin_edit: false,
      progress: null,
      is_invalid: false,
    };
  }
  return { ...formData[name], progress: null, is_invalid: false };
};

export const getDefaultProperties = (formState, formData, isAdmin) => {
  if (formState === FORM_STATE.CREATE) {
    return {
      metal: { value: null, is_admin_edit: false, is_editable: true },
      kt: { value: null, is_admin_edit: false, is_editable: true },
      rhodium: { value: null, is_admin_edit: false, is_editable: true },
    };
  }
  return {
    metal: {
      value: formData["metal"].value,
      is_admin_edit: formData["metal"].is_admin_edit,
      is_editable: isAdmin || formData["metal"].value === null,
    },
    kt: {
      value: formData["kt"].value,
      is_admin_edit: formData["kt"].is_admin_edit,
      is_editable: isAdmin || formData["kt"].value === null,
    },
    rhodium: {
      value: formData["rhodium"].value,
      is_admin_edit: formData["rhodium"].is_admin_edit,
      is_editable: isAdmin || formData["rhodium"].value === null,
    },
  };
};

export const getDefaultCadData = (formState, formData, isAdmin) => {
  if (formState === FORM_STATE.CREATE) {
    const rowObj = {};
    const cellNames = DESIGN_CAD_COLUMNS;
    for (const cell of cellNames) {
      rowObj[cell.name] = {
        value: null,
        is_admin_edit: false,
        is_editable: true,
      };
    }
    return [rowObj];
  }
  return formData[DIT.TBL].map((row) => {
    const rowObj = {};
    const cellNames = DESIGN_CAD_COLUMNS;
    for (const { name } of cellNames) {
      const is_editable = isAdmin || row[name].value === null;
      rowObj[name] = { ...row[name], is_editable };
    }
    return rowObj;
  });
};

export const getDefaultCadCts = (formState, formData, isAdmin) => {
  if (formState === FORM_STATE.CREATE) {
    return { value: null, is_admin_edit: false, is_editable: true };
  }
  const is_editable = isAdmin || formData[DIT.CTS].value === null;
  return { ...formData[DIT.CTS], is_editable };
};

export const designFormTitle = (formState, designId) => {
  switch (formState) {
    case FORM_STATE.CREATE:
      return "Create Design";
    case FORM_STATE.UPDATE:
      return "Update Design";
    case FORM_STATE.READ:
      return (
        <span>
          <strong>Design ID:</strong> {designId}
        </span>
      );
    default:
      break;
  }
};

const progressListener = (setter) => {
  const listener = (progressEvent) => {
    const { loaded, total } = progressEvent;
    let percent = Math.round((loaded * 100) / total);
    if (percent < 100) {
      setter((p) => ({ ...p, progress: percent }));
    } else {
      setter((p) => ({ ...p, progress: null }));
    }
  };
  return listener;
};
const compareAndUploadImg = async (
  formState,
  name,
  wholeData,
  [newData, setNewData],
  is_admin
) => {
  let imageObj = {};
  if (formState === FORM_STATE.CREATE) {
    let imgURL = null;
    if (newData.blob) {
      imgURL = await uploadImage(
        name,
        null,
        newData.blob,
        progressListener(setNewData)
      );
      if (imgURL === undefined) return null;
    }
    imageObj = { url: imgURL, is_admin_edit: false };
  } else {
    const formData = wholeData[name];
    let imgURL = formData.url;
    let is_admin_edit = formData.is_admin_edit;
    if (imgURL !== newData.url) {
      imgURL = await uploadImage(
        name,
        imgURL,
        newData.blob,
        progressListener(setNewData)
      );
      is_admin_edit = is_admin;
      if (imgURL === undefined) return null;
    }
    imageObj = { url: imgURL, is_admin_edit };
  }
  return imageObj;
};
export const populateImages = async (
  formState,
  formData,
  isAdmin,
  ref,
  cad,
  fnl
) => {
  const imagePayload = {};

  const ref_paylod = await compareAndUploadImg(
    formState,
    DIT.REF,
    formData,
    ref,
    isAdmin
  );
  if (!ref_paylod) return null;
  imagePayload[DIT.REF] = ref_paylod;

  const cad_paylod = await compareAndUploadImg(
    formState,
    DIT.CAD,
    formData,
    cad,
    isAdmin
  );
  if (!cad_paylod) return null;
  imagePayload[DIT.CAD] = cad_paylod;

  const fnl_paylod = await compareAndUploadImg(
    formState,
    DIT.FNL,
    formData,
    fnl,
    isAdmin
  );
  if (!fnl_paylod) return null;
  imagePayload[DIT.FNL] = fnl_paylod;

  return imagePayload;
};

export const processDesignPropties = (data) => {
  return {
    metal: {
      value: data["metal"].value?.trim() || null,
      is_admin_edit: data["metal"].is_admin_edit,
    },
    kt: {
      value: data["kt"].value?.trim() || null,
      is_admin_edit: data["kt"].is_admin_edit,
    },
    rhodium: {
      value: data["rhodium"].value?.trim() || null,
      is_admin_edit: data["rhodium"].is_admin_edit,
    },
  };
};

export const processCadTableData = (data) => {
  const processData = [];
  data.forEach((row) => {
    const rowObj = {};
    const cellNames = Object.keys(row);
    let emptyCellCount = 0;
    const columnCount = cellNames.length;
    for (const name of cellNames) {
      const value = row[name].value?.trim() || null;
      rowObj[name] = {
        value,
        is_admin_edit: row[name].is_admin_edit,
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
    processData.push(getEmptyRow(DESIGN_CAD_COLUMNS));
  }
  return processData;
};

export const processCadCts = (data) => {
  return {
    value: data.value?.trim() || null,
    is_admin_edit: data.is_admin_edit,
  };
};

export const getDesignFormValidation = () => ({
  ref_image: (refImage, setRefImage) => {
    if (!refImage || !(refImage.url || refImage.blob)) {
      setRefImage((prev) => ({ ...prev, invalid: true }));
      return false;
    }
    setRefImage((prev) => ({ ...prev, invalid: false }));
    return true;
  },
});

export const getTotalQuantity = (data) => {
  let totalQuantity = 0;
  data.forEach((row) => {
    const value = parseFloat(row["qty"].value);
    if (!isNaN(value)) {
      totalQuantity += value;
    }
  });
  return precision(totalQuantity);
};

export const getTotalWeight = (data) => {
  let totalWeight = 0;
  data.forEach((row) => {
    const value = parseFloat(row["weight"].value);
    if (!isNaN(value)) {
      totalWeight += value;
    }
  });
  return precision(totalWeight);
};

export const formatedTableData = (data) => {
  const obj = {};
  obj["_id"] = data["_id"];
  obj["design_id"] = data["design_id"];
  obj["final_image"] = (
    <Image
      src={data["final_image"].url}
      placeholder
      preview={{ icons: IMAGE_PREVIEW_ACTIONS, mask: "Preview" }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    />
  );
  obj["metal"] = data["metal"].value || "";
  obj["kt"] = data["kt"].value || "";
  obj["rhodium"] = data["rhodium"].value || "";
  return obj;
};

export const mapFilterToParams = (filter) => {
  let metal = filter.metal?.trim();
  let kt = filter.kt?.trim();
  let rhodium = filter.rhodium?.trim();
  let showUnused = filter.showUnused;
  let skipFilter = filter.skipFilter;

  let param = "";
  if (metal) {
    param += `&metal=${metal}`;
  }
  if (kt) {
    param += `&kt=${kt}`;
  }
  if (rhodium) {
    param += `&rhodium=${rhodium}`;
  }
  if (showUnused !== undefined) {
    param += `&showUnused=${showUnused}`;
  }
  if (skipFilter !== undefined) {
    param += `&skipFilter=${skipFilter}`;
  }
  return param;
};
