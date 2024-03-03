import { Box } from "@mui/material";
import { DELETE_STATE, FORM_STATE, ROUTE } from "../../../Helper/contant";
import { PageHeader, PageTable } from "../../Misc/Page-Misc";
import { useEffect, useRef, useState } from "react";
import {
  createUser,
  deleteUser,
  getUserList,
  updateUser,
} from "../../../Service/user.service";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDeleteDialog,
  togglePageLoader,
  togglePasswordPreview,
} from "../../../Store/misc.slice";
import {
  USER_COLUMNS,
  USER_TABLE_ACTIONS,
} from "../../../assets/data/user-data";
import {
  overflowAuto,
  overflowHidden,
  scrollToTop,
} from "../../../Helper/misc";
import UserForm from "./user-form";

export default function Users() {
  const route = ROUTE.USER;
  const { user } = useSelector((store) => store.auth);
  const { deleteDialogState } = useSelector((store) => store.misc);

  const isUpdated = useRef(false);
  const [showForm, setFormVisiblity] = useState(FORM_STATE.CLOSE);
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();

  const [searchedValue, setSearchedValue] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reloadTable, setReloadTable] = useState(0);
  const reload = () => setReloadTable((p) => (p === 100 ? 0 : p + 1));
  useEffect(() => {
    (async () => {
      if (!isLoading) {
        setLoading(true);
        const res = await getUserList(searchedValue);
        if (res.status) {
          setDataList(res.data);
        }
        setLoading(false);
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
    const { data, status } = await createUser(payload);
    if (status) {
      closeForm();
      const { password, password_reset_url } = data;
      dispatch(
        togglePasswordPreview({
          visible: true,
          password: password,
          resetLink: password_reset_url,
        })
      );
      reload();
    }
  };

  const updateRow = async (payload) => {
    const idAsPath = "/" + formData._id;
    const { status } = await updateUser(idAsPath, payload);
    if (status) {
      isUpdated.current = true;
    }
  };

  const onRowClick = (rowId) => {
    isUpdated.current = false;
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      setFormData({ ...row });
      scrollToTop();
      overflowHidden();
      if (user.is_admin) {
        setFormVisiblity(FORM_STATE.UPDATE);
      } else {
        setFormVisiblity(FORM_STATE.READ);
      }
    }
  };

  USER_TABLE_ACTIONS.RESET_PASSWORD.onClick = async (rowId) => {
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      const rowIdAsPath = "/" + rowId;
      dispatch(togglePageLoader(true));
      const res = await updateUser(rowIdAsPath, { password: "yes" }, true);
      if (res.status) {
        const { password, password_reset_url } = res.data;
        dispatch(
          togglePasswordPreview({
            visible: true,
            password: password,
            resetLink: password_reset_url,
          })
        );
      }
      dispatch(togglePageLoader(false));
    }
  };

  USER_TABLE_ACTIONS.DELETE_USER.onClick = (rowId) => {
    const row = dataList.find((user) => user._id === rowId);
    if (row) {
      const state = DELETE_STATE.OPEN;
      const message = `
        <span>
          Do you want to delete this user, <strong>${row.name}</strong>
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
          const res = await deleteUser(rowIdAsPath);
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
        showCreateBtn={user.is_admin}
      />

      <PageTable
        isLoading={isLoading}
        headCells={USER_COLUMNS}
        rows={dataList}
        onRowClick={onRowClick}
        tableActions={user.is_admin ? Object.values(USER_TABLE_ACTIONS) : null}
      />

      {showForm !== FORM_STATE.CLOSE && (
        <UserForm
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
