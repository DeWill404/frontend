import { Box } from "@mui/material";
import { DELETE_STATE, FORM_STATE, ROUTE } from "../../../Helper/contant";
import { PageHeader, PageTable } from "../../Misc/Page-Misc";
import OrderForm from "./form.order";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  overflowAuto,
  overflowHidden,
  scrollToTop,
} from "../../../Helper/misc";
import {
  ORDER_COLUMNS,
  ORDER_TABLE_ACTIONS,
} from "../../../assets/data/order-data";
import {
  toggleDeleteDialog,
  toggleExportPDF,
  togglePageLoader,
} from "../../../Store/misc.slice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  mapFilterToParams,
  orderDataListCleanup,
  orderFormDataCleanup,
  renderOrderRow,
} from "./helper.order";
import {
  createOrder,
  deleteOrder,
  getOrderList,
  updateOrder,
} from "../../../Service/order.service";
import FilterOrder from "./filter.order";
import { grossWeightUpdated } from "../../../Store/order.slice";
import { getDesignList } from "../../../Service/design.service";

export default function Orders() {
  const route = ROUTE.ORDER;
  const { user } = useSelector((store) => store.auth);
  const { deleteDialogState } = useSelector((store) => store.misc);

  const navigate = useNavigate();
  const { state } = useLocation();
  const defaultFormState = useMemo(() => {
    orderFormDataCleanup();
    orderDataListCleanup();
    if (state?.action === "create_order") {
      return FORM_STATE.CREATE;
    }
    return FORM_STATE.CLOSE;
  }, []);
  const isUpdated = useRef(false);
  const isFirstClosed = useRef(false);
  const [showForm, setShowForm] = useState(defaultFormState);
  const setFormVisiblity = (state) => {
    if (!isFirstClosed.current && state === FORM_STATE.CLOSE) {
      navigate(route.route, { state: null });
      isFirstClosed.current = true;
    }
    orderFormDataCleanup();
    orderDataListCleanup();
    dispatch(grossWeightUpdated());
    setShowForm(state);
  };

  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();

  const initialSearch = useMemo(() => {
    return state && state.action === "customer_search" ? state.search : "";
  }, []);
  const [searchedValue, setSearchedValue] = useState(initialSearch);
  const prevFilterRef = useRef({
    start_date: "",
    end_date: "",
    metal: "",
    kt: "",
    rhodium: "",
    order_status: "",
  });
  const filterRef = useRef({
    start_date: "",
    end_date: "",
    metal: "",
    kt: "",
    rhodium: "",
    order_status: "",
  });
  const [dataList, setDataList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reloadTable, setReloadTable] = useState(0);
  const reload = () => setReloadTable((p) => (p === 100 ? 0 : p + 1));
  useEffect(() => {
    (async () => {
      if (!isLoading) {
        let search = searchedValue;
        if (state && state.action === "customer_search") {
          navigate(ROUTE.ORDER.route, { state: null });
        }

        setLoading(true);
        const params = mapFilterToParams(filterRef.current);
        const res = await getOrderList(search, params);
        if (res.status) {
          setDataList(res.data);
        }
        setLoading(false);

        if (state && state.action === "customer_search") {
          const data = res.data;
          if (data && data.length === 1) {
            onRowClick(data[0]._id, data);
          }
        }
      }
    })();
  }, [reloadTable, searchedValue]);

  const onStatusChange = async (_id, idx, value) => {
    dispatch(togglePageLoader(true));
    const res = await updateOrder("/" + _id, { order_status: value }, true);
    if (res.status) {
      setDataList((prev) =>
        prev.map((d, i) =>
          i === idx ? { ...d, order_status: value } : { ...d }
        )
      );
    }
    dispatch(togglePageLoader(false));
  };
  const dataRow = useMemo(
    () => renderOrderRow(onStatusChange, dataList),
    [dataList]
  );

  const showCreateForm = () => {
    scrollToTop();
    overflowHidden();
    setFormVisiblity(FORM_STATE.CREATE);
  };
  const closeForm = () => {
    overflowAuto();
    setFormVisiblity(FORM_STATE.CLOSE);
    if (isUpdated.current) {
      isUpdated.current = false;
      reload();
    }
  };

  const formSubmit = async (payload) => {
    if (showForm === FORM_STATE.CREATE) {
      const res = await createOrder(payload);
      if (res.status) {
        isUpdated.current = true;
        setFormData(res.data);
        setDataList((p) => [...p, res.data]);
        setFormVisiblity(user.is_admin ? FORM_STATE.UPDATE : FORM_STATE.READ);
      }
    } else {
      const found = dataList.find((d) => d._id === formData._id);
      if (found) {
        const idAsPath = "/" + found._id;
        const res = await updateOrder(idAsPath, payload);
        if (res.status) {
          setFormData(res.data);
          isUpdated.current = true;
        }
      }
    }
  };

  const onRowClick = (rowId, src) => {
    isUpdated.current = false;
    const row = (src || dataList).find((data) => data._id === rowId);
    if (row) {
      setFormData({ ...row });
      scrollToTop();
      overflowHidden();
      setFormVisiblity(user.is_admin ? FORM_STATE.UPDATE : FORM_STATE.READ);
    }
  };

  ORDER_TABLE_ACTIONS.DELETE_USER.onClick = (rowId) => {
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      const state = DELETE_STATE.OPEN;
      const message = `
        <span>
          Do you want to delete this order, <strong>${row.order_id}</strong>
        </span>
      `;
      const id = `${route.route}/${rowId}`;
      dispatch(toggleDeleteDialog({ state, message, id }));
    }
  };
  ORDER_TABLE_ACTIONS.PRINT_ORDER.onClick = async (rowId) => {
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      dispatch(togglePageLoader(true));
      const res = await getDesignList(row.design.design_id);
      if (res.status) {
        const data = { ...row, design: res.data[0] };
        dispatch(toggleExportPDF({ visible: true, data }));
      }
    }
  };
  useEffect(() => {
    if (deleteDialogState.state === DELETE_STATE.CONFIRM) {
      const deleteId = deleteDialogState.id;
      if (deleteId.startsWith(route.route)) {
        const rowIdAsPath = deleteId.split(route.route)[1];
        (async () => {
          dispatch(togglePageLoader(true));
          const res = await deleteOrder(rowIdAsPath);
          if (res) {
            reload();
          }
          dispatch(togglePageLoader(false));
          dispatch(toggleDeleteDialog());
        })();
      }
    }
  }, [deleteDialogState]);

  return (
    <Box>
      <PageHeader
        icon={route.icon}
        label={route.label}
        name={route.name}
        placeholder="Orders ID, Customers Name"
        onAdd={showCreateForm}
        onSearch={setSearchedValue}
        defaultSearchValue={initialSearch}
      />

      <FilterOrder
        prevValueRef={prevFilterRef}
        valueRef={filterRef}
        reload={reload}
      />

      <PageTable
        isLoading={isLoading}
        headCells={ORDER_COLUMNS}
        rows={dataRow}
        onRowClick={onRowClick}
        tableActions={Object.values(ORDER_TABLE_ACTIONS)}
      />

      {showForm !== FORM_STATE.CLOSE && (
        <OrderForm
          name={route.name}
          showForm={showForm}
          formData={formData}
          closeForm={closeForm}
          formSubmit={formSubmit}
          isAdmin={user.is_admin}
        />
      )}
    </Box>
  );
}
