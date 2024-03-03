import { Box } from "@mui/material";
import { DELETE_STATE, FORM_STATE, ROUTE } from "../../../Helper/contant";
import { PageHeader, PageTable } from "../../Misc/Page-Misc";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createCustomer,
  deleteCustomer,
  getCustomerList,
  updateCustomer,
} from "../../../Service/customer.service";
import {
  CUSTOMER_COLUMNS,
  CUSTOMER_TABLE_ACTIONS,
} from "../../../assets/data/customer-data";
import {
  toggleDeleteDialog,
  togglePageLoader,
} from "../../../Store/misc.slice";
import {
  overflowAuto,
  overflowHidden,
  scrollToTop,
} from "../../../Helper/misc";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomersForm from "./customers-form";

export default function Customers() {
  const route = ROUTE.CUSTOMER;
  const { deleteDialogState } = useSelector((store) => store.misc);
  const { state } = useLocation();
  const navigate = useNavigate();

  const isUpdated = useRef(false);
  const [showForm, setFormVisiblity] = useState(FORM_STATE.CLOSE);
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();

  const initialSearch = useMemo(() => {
    return state && state.action ? state.search : "";
  }, []);
  const [searchedValue, setSearchedValue] = useState(initialSearch);
  const [dataList, setDataList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reloadTable, setReloadTable] = useState(0);
  const reload = () => setReloadTable((p) => (p === 100 ? 0 : p + 1));
  useEffect(() => {
    (async () => {
      if (!isLoading) {
        let search = searchedValue;
        if (state && state.action) {
          navigate(ROUTE.CUSTOMER.route, { state: null });
        }

        setLoading(true);
        const res = await getCustomerList(search);
        if (res.status) {
          setDataList(res.data);
        }
        setLoading(false);

        if (state && state.action) {
          const data = res.data;
          if (data && data.length === 1) {
            onRowClick(data[0]._id, data);
          } else if (data && data.length === 0) {
            toast.error("Customer not found!");
            setLoading(true);
            const res = await getCustomerList(searchedValue);
            if (res.status) {
              setDataList(res.data);
            }
            setLoading(false);
          } else if (data && data.length > 1) {
            toast.info("Multiple customers found with same name");
          }
        }
      }
    })();
  }, [reloadTable, searchedValue]);

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
    const _payload = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      mobile_no: payload.mobile_no,
    };
    if (showForm === FORM_STATE.CREATE) {
      await createNew(_payload);
    } else if (showForm === FORM_STATE.UPDATE) {
      await updateRow(_payload);
    }
  };

  const createNew = async (payload) => {
    const { status } = await createCustomer(payload);
    if (status) {
      closeForm();
      reload();
    }
  };

  const updateRow = async (payload) => {
    const idAsPath = "/" + formData._id;
    const { data, status } = await updateCustomer(idAsPath, payload);
    if (status) {
      setFormData(data);
      isUpdated.current = true;
    }
  };

  const onRowClick = (rowId, src) => {
    isUpdated.current = false;
    const row = (src || dataList).find((data) => data._id === rowId);
    if (row) {
      setFormData({ ...row });
      scrollToTop();
      overflowHidden();
      setFormVisiblity(FORM_STATE.UPDATE);
    }
  };

  CUSTOMER_TABLE_ACTIONS.DELETE_USER.onClick = (rowId) => {
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      const state = DELETE_STATE.OPEN;
      const message = `
        <span>
          Do you want to delete this customer, <strong>${row.name}</strong>
        </span>
      `;
      const id = `${route.route}/${rowId}`;
      dispatch(toggleDeleteDialog({ state, message, id }));
    }
  };
  useEffect(() => {
    if (deleteDialogState.state === DELETE_STATE.CONFIRM) {
      const deleteId = deleteDialogState.id;
      if (deleteId.startsWith(route.route)) {
        const rowIdAsPath = deleteId.split(route.route)[1];
        (async () => {
          dispatch(togglePageLoader(true));
          const res = await deleteCustomer(rowIdAsPath);
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
        onAdd={showCreateForm}
        onSearch={setSearchedValue}
        defaultSearchValue={initialSearch}
      />

      <PageTable
        isLoading={isLoading}
        headCells={CUSTOMER_COLUMNS}
        rows={dataList}
        onRowClick={onRowClick}
        tableActions={Object.values(CUSTOMER_TABLE_ACTIONS)}
      />

      {showForm !== FORM_STATE.CLOSE && (
        <CustomersForm
          name={route.name}
          showForm={showForm}
          formData={formData}
          closeForm={closeForm}
          formSubmit={formSubmit}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
}
