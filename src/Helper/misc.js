import _ from "lodash";
import { MESSAGE, ROUTE } from "./contant";

export function STX(...sxs) {
  let sx = {};

  for (const _sx of sxs) {
    const keys = Object.keys(_sx);
    const values = Object.values(_sx);
    if (keys.length === 1 && ["true", "false"].includes(keys[0])) {
      if (keys[0] === "true") {
        sx = _.merge(sx, values[0]);
      }
    } else {
      sx = _.merge(sx, _sx);
    }
  }

  return sx;
}

export function triggerMessage(type, data) {
  window.postMessage({ target: MESSAGE._TARGET_, type, data });
}

export function getRouteFromPath(path) {
  if (path === ROUTE.ROOT.route) {
    return ROUTE.ROOT;
  }
  const routes = Object.values(ROUTE);
  const matchedRoute = routes.find((route) =>
    route.route.startsWith(path?.toLowerCase())
  );
  return matchedRoute || null;
}

export function scrollToTop() {
  const el = document.getElementById("scroll-to-top");
  if (el) {
    el.scrollIntoView({ block: "end" });
  }
}

export function overflowHidden() {
  document.body.style.overflow = "hidden";
}

export function overflowAuto() {
  document.body.style.overflow = "auto";
}

export function getEmptyRow(columnMap, setEditFlag) {
  const emptyRow = {};
  for (const col of columnMap) {
    emptyRow[col.name] = {
      value: null,
      is_admin_edit: false,
    };
    if (setEditFlag) {
      emptyRow[col.name]["is_editable"] = true;
    }
  }
  return emptyRow;
}

export const REQUIRED = (isReadOnly) => ({
  required: isReadOnly
    ? false
    : { value: true, message: "This field is required" },
});

export const precision = (num) => {
  const _num = String(num).split(".");
  if (_num.length > 1) {
    const decimal = parseFloat("0." + _num[1]).toPrecision(5);
    return parseInt(_num[0]) + parseFloat(decimal);
  }
  return num;
};

export const imagePath = (key) => {
  if (!key) {
    return null;
  }
  return process.env.REACT_APP_BACKEND_URI + "/misc/images/" + key;
};
