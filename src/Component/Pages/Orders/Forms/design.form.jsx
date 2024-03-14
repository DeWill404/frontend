import { Box, Button, CircularProgress, Divider } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ORDER_FORM_STEPPER } from "../../../../assets/data/order-data";
import { getOrderDesignData, setOrderDesign } from "../helper.order";
import {
  getDesignsFromStorage,
  getOrderDesigntFromStorage,
  saveDesignsToStorage,
  saveOrderDesignToStorage,
} from "../../../../Helper/browser-storage";
import {
  createDesign,
  getDesignList,
  updateDesign,
} from "../../../../Service/design.service";
import CustomAutoComplete from "./custom-autocomplete";
import { FORM_STATE, ROUTE } from "../../../../Helper/contant";
import DesignAutoOption from "./design-autocomplete.option";
import { StyledButton } from "../../../Misc/style-button";
import DesignForm from "../../Designs/form.design";
import { Add, Visibility } from "@mui/icons-material";
import _ from "lodash";
import { toast } from "react-toastify";
import { CustomDialog } from "../../../Misc/custom-dialog";
import { mapFilterToParams } from "../../Designs/helper.designs";

const ORDER_DESIGN_FORM_INDEX = 1;

const sx = {
  form_root: {
    marginTop: "10px",
  },
  form_wrapper: {
    marginBlock: "20px",
    border: (theme) => `1px solid ${theme.palette.grey[500]}`,
    borderRadius: "8px",
    "& .preview-btn": {
      marginLeft: "8px",
      padding: "4px 8px 4px 8px",
      minWidth: "auto",
      textTransform: "none",
      "& .content": {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      "& svg": {
        fontSize: "20px",
      },
    },
    "& .action-btn": {
      minWidth: "auto",
      padding: { xs: "5px 10px", sm: "5px 15px" },
      "& .content": {
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },
      "& svg": {
        fontSize: "20px",
      },
      "& .label": {
        display: { xs: "none", sm: "inline" },
      },
    },
  },
  form_section: {
    padding: { xs: "20px", md: "30px" },
    transition: "all 0.2s linear",
    "& .section-title": {
      marginBottom: "16px",
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& .section-title, &.section-title": {
      whiteSpace: "nowrap",
      margin: 0,
    },
  },
};

export default function OrderDesignForm({
  formState,
  formData,
  setValidator,
  isAdmin,
}) {
  const scrollToTop = () => {
    document.getElementById("order-form-scroll-element").scrollIntoView();
  };
  const stopOverflowOrderForm = () => {
    document.getElementById("order-form").style.overflow = "hidden";
  };
  const scrollOrderForm = () => {
    document.getElementById("order-form").style.overflow = "auto";
  };

  const cachedData = useMemo(getOrderDesigntFromStorage, []);
  const designData = useMemo(
    () => getOrderDesignData(formState, formData, cachedData, isAdmin),
    [formData]
  );

  const { state } = useLocation();
  const navigate = useNavigate();
  const refState = useRef(null);
  const [selectedDesign, setDesignSelection] = useState(null);
  const [designList, setDesignList] = useState([]);
  const [loadingDesign, setDesignLoading] = useState(false);

  const [isCreateActive, setCreateActive] = useState(false);
  const openCreate = () => {
    scrollToTop();
    stopOverflowOrderForm();
    setCreateActive(true);
  };
  const closeCreate = () => {
    scrollOrderForm();
    setCreateActive(false);
  };
  const createSubmit = async (payload) => {
    const res = await createDesign(payload);
    if (res.status) {
      const newDesignList = [res.data, ...designList];
      setDesignList(newDesignList);
      saveDesignsToStorage(newDesignList);
      refState.current = res.data;
      setDesignSelection(null);
      closeCreate();
    }
  };

  const [reloadFlag, setReloadFlag] = useState(0);
  const reload = () => setReloadFlag((p) => (p === 100 ? 0 : p + 1));
  const onClearSelction = () => {
    const found = designList.find(
      (d) => d.design_id === refState.current.design_id
    );
    if (!found) {
      setDesignList((p) => [refState.current, ...p]);
    }
    refState.current = null;
    setDesignSelection(null);
    closeResetDialog();
    reload();
  };

  const [isUpdateActive, setUpdateActive] = useState(false);
  const openUpdate = () => {
    scrollToTop();
    stopOverflowOrderForm();
    setUpdateActive(true);
  };
  const closeUpdate = () => {
    scrollOrderForm();
    setUpdateActive(false);
  };
  const updateSubmit = async (payload) => {
    payload["design_id"] = refState.current["design_id"];
    const idAsPath = "/" + refState.current._id;
    const res = await updateDesign(idAsPath, payload);
    if (res.status) {
      refState.current = _.cloneDeep(res.data);
      reload();
      // closeUpdate();
    }
  };

  useEffect(() => {
    setValidator(() => () => {
      const value = refState.current;
      if (value) {
        saveOrderDesignToStorage(value);
      } else {
        toast.error(
          "Please select a design or create new one, before continuing"
        );
      }
      return !!value;
    });

    (async () => {
      setDesignLoading(true);
      let data = getDesignsFromStorage();
      if (!data) {
        const res = await getDesignList(
          formState === FORM_STATE.CREATE ? "" : designData.design_id,
          mapFilterToParams({ skipFilter: true })
        );
        if (res.status) {
          data = res.data;
          saveDesignsToStorage(data);
        }
      }
      if (data) {
        setDesignList(data);
      }
      setDesignLoading(false);

      setOrderDesign(setDesignSelection, data, designData, state, refState);
      if (state && state.action === "create_order") {
        navigate(ROUTE.ORDER.route, { state: null });
      }
    })();
  }, []);

  const [resetDialog, setResetDialog] = useState(false);
  const closeResetDialog = () => setResetDialog(false);
  const openResetDialog = () => setResetDialog(true);

  return (
    <Box sx={sx.form_root} key={reloadFlag}>
      <h3>
        {formState === FORM_STATE.CREATE
          ? ORDER_FORM_STEPPER[ORDER_DESIGN_FORM_INDEX][1]
          : "Design"}
      </h3>
      <Box sx={sx.form_wrapper}>
        {formState === FORM_STATE.CREATE && !refState.current && (
          <>
            <Box sx={sx.form_section}>
              <h4 className="section-title">Select An Existing Design</h4>
              <CustomAutoComplete
                name="design-list"
                label="Existing Design"
                loading={loadingDesign}
                autoFocus={true}
                sx={{ maxWidth: "300px" }}
                disabled={!!refState.current}
                options={designList}
                value={selectedDesign}
                onChange={(_, value) => {
                  setDesignSelection(value);
                  refState.current = value;
                  return value;
                }}
                getOptionLabel={(option) => option.design_id || option}
                isOptionEqualToValue={(option, value) =>
                  !value ||
                  option.design_id === value.design_id ||
                  option.design_id === value
                }
                renderOption={(props, option) => (
                  <DesignAutoOption option={option} {...props} />
                )}
              />
            </Box>
            <Divider />
          </>
        )}
        <Box sx={sx.form_section}>
          {refState.current || loadingDesign ? (
            <Box sx={sx.header}>
              <span>
                Design ID: <strong>{refState.current?.design_id}</strong>
              </span>
              {loadingDesign ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <StyledButton
                  size="small"
                  className="preview-btn"
                  onClick={() => !loadingDesign && openUpdate()}
                >
                  <span> Preview</span>
                  <Visibility />
                </StyledButton>
              )}
            </Box>
          ) : (
            <Box sx={sx.header}>
              <h4 className="section-title">Create New Design</h4>
              <StyledButton
                size="small"
                className="action-btn"
                onClick={openCreate}
              >
                <Add />
                <span className="label">Create</span>
              </StyledButton>
            </Box>
          )}
          {isCreateActive && (
            <DesignForm
              showForm={FORM_STATE.CREATE}
              formData={null}
              closeForm={closeCreate}
              formSubmit={createSubmit}
            />
          )}
          {isUpdateActive && (
            <DesignForm
              showForm={isAdmin ? FORM_STATE.UPDATE : FORM_STATE.READ}
              closeForm={closeUpdate}
              formData={refState.current}
              formSubmit={updateSubmit}
            />
          )}
        </Box>
        {formState === FORM_STATE.CREATE &&
          (refState.current || selectedDesign) && (
            <>
              <Divider />
              <Box sx={sx.form_section}>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  sx={{ textTransform: "none" }}
                  onClick={openResetDialog}
                >
                  Clear Selection
                </Button>
              </Box>
            </>
          )}
      </Box>
      <CustomDialog
        open={resetDialog}
        onClose={closeResetDialog}
        showDivider={false}
        showCloseBtn={false}
        title={<h3>Alert !!</h3>}
        content="Are you sure de-select current design?"
        actions={
          <>
            <Button
              autoFocus
              color="inherit"
              variant="outlined"
              onClick={closeResetDialog}
            >
              No
            </Button>
            <StyledButton onClick={onClearSelction}>Yes</StyledButton>
          </>
        }
      />
    </Box>
  );
}
