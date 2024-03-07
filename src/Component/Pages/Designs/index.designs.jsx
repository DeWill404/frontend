import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DELETE_STATE, FORM_STATE, ROUTE } from "../../../Helper/contant";
import { PageHeader, PageTable } from "../../Misc/Page-Misc";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DESIGN_COLUMNS,
  DESIGN_FILTERS,
  DESIGN_TABLE_ACTIONS,
} from "../../../assets/data/design-data";
import {
  createDesign,
  deleteDesign,
  getDesignList,
  updateDesign,
} from "../../../Service/design.service";
import {
  formatedTableData,
  mapFilterToParams,
  page_table_sx as sx,
} from "./helper.designs";
import {
  STX,
  overflowAuto,
  overflowHidden,
  scrollToTop,
} from "../../../Helper/misc";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import DesignForm from "./form.design";
import { TableChart, Window } from "@mui/icons-material";
import FilterDesign from "./filter.designs";
import {
  toggleDeleteDialog,
  togglePageLoader,
} from "../../../Store/misc.slice";
import DesignTableGrid from "./table-grid";

export default function Designs() {
  const route = ROUTE.DESIGN;
  const { user } = useSelector((store) => store.auth);
  const { deleteDialogState } = useSelector((store) => store.misc);
  const dispatch = useDispatch();

  const isUpdated = useRef(false);
  const [showForm, setFormVisiblity] = useState(FORM_STATE.CLOSE);
  const [formData, setFormData] = useState(null);

  const [viewMode, setViewMode] = useState("table");
  const onViewModeChanged = (_, mode) => mode && setViewMode(mode);

  const prevFilterRef = useRef(DESIGN_FILTERS);
  const filterRef = useRef(DESIGN_FILTERS);
  const [searchedValue, setSearchedValue] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reloadTable, setReloadTable] = useState(0);
  const reload = () => setReloadTable((p) => (p === 100 ? 0 : p + 1));
  useEffect(() => {
    (async () => {
      if (!isLoading) {
        setLoading(true);
        const params = mapFilterToParams(filterRef.current);
        const res = await getDesignList(searchedValue, params);
        if (res.status) {
          setDataList(res.data);
        }
        setLoading(false);
      }
    })();
  }, [reloadTable, searchedValue]);

  const formatedRows = useMemo(
    () => dataList.map(formatedTableData),
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
    if (showForm !== FORM_STATE.CREATE) {
      payload["design_id"] = formData["design_id"];
      const idAsPath = "/" + formData._id;
      const res = await updateDesign(idAsPath, payload);
      if (res.status) {
        setFormData(res.data);
        isUpdated.current = true;
      }
    } else {
      const res = await createDesign(payload);
      if (res.status) {
        closeForm();
        reload();
      }
    }
  };

  const onRowClick = (rowId) => {
    isUpdated.current = false;
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      setFormData(_.cloneDeep(row));
      scrollToTop();
      overflowHidden();
      if (user.is_admin) {
        setFormVisiblity(FORM_STATE.UPDATE);
      } else {
        setFormVisiblity(FORM_STATE.READ);
      }
    }
  };

  const navigate = useNavigate();
  DESIGN_TABLE_ACTIONS.CREATE_DESIGN.onClick = (rowId) => {
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      navigate(ROUTE.ORDER.route, {
        state: { action: "create_order", design_id: row.design_id },
      });
    }
  };
  DESIGN_TABLE_ACTIONS.DELETE_DESIGN.onClick = (rowId) => {
    const row = dataList.find((data) => data._id === rowId);
    if (row) {
      const state = DELETE_STATE.OPEN;
      const message = `
        <span>
          Do you want to delete this design, <strong>${row.design_id}</strong>
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
          const res = await deleteDesign(rowIdAsPath);
          if (res) {
            reload();
          }
          dispatch(togglePageLoader(false));
          dispatch(toggleDeleteDialog());
        })();
      }
    }
  }, [deleteDialogState]);

  const tableActions = () => {
    if (filterRef.current?.showUnused) {
      return [
        DESIGN_TABLE_ACTIONS.CREATE_DESIGN,
        DESIGN_TABLE_ACTIONS.DELETE_DESIGN,
      ];
    }
    return [DESIGN_TABLE_ACTIONS.CREATE_DESIGN];
  };

  return (
    <Box sx={sx.wrapper}>
      <PageHeader
        icon={route.icon}
        label={route.label}
        name={route.name}
        placeholder="Search Designs by ID"
        onSearch={setSearchedValue}
        onAdd={showCreateForm}
      />

      <Box sx={STX(sx.actionHeader, { alignItems: "start", gap: "20px" })}>
        <Box flex="1">
          <FilterDesign
            prevValueRef={prevFilterRef}
            valueRef={filterRef}
            reload={reload}
            isAdmin={user.is_admin}
          />
        </Box>

        <ToggleButtonGroup
          exclusive
          size="small"
          className="toggle-container"
          value={viewMode}
          onChange={onViewModeChanged}
        >
          <ToggleButton value="table">
            <TableChart />
          </ToggleButton>
          <ToggleButton value="grid">
            <Window />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === "table" ? (
        <PageTable
          isLoading={isLoading}
          headCells={DESIGN_COLUMNS}
          rows={formatedRows}
          onRowClick={onRowClick}
          tableActions={tableActions()}
        />
      ) : (
        <DesignTableGrid
          isLoading={isLoading}
          rows={dataList}
          onRowClick={onRowClick}
          tableActions={tableActions()}
        />
      )}

      {showForm !== FORM_STATE.CLOSE && (
        <DesignForm
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
