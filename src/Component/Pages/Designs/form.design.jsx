import { Box, Button, Grid, MenuItem, Slide, TextField } from "@mui/material";
import { FORM_STATE } from "../../../Helper/contant";
import { StyledButton } from "../../Misc/style-button";
import { useEffect, useState } from "react";
import CADTable from "./cad-table.designs";
import { useSelector } from "react-redux";
import {
  DIT,
  designFormTitle,
  getDefaultCadCts,
  getDefaultCadData,
  getDefaultImgValue,
  getDefaultProperties,
  getDesignFormValidation,
  populateImages,
  processCadCts,
  processCadTableData,
  processDesignPropties,
  form_sx as sx,
} from "./helper.designs";
import ImageUploader from "./image-uploader";
import { CustomDialog } from "../../Misc/custom-dialog";
import { JOB_SHEET_KEYS } from "../../../assets/data/order-data";
import { getReadOnlyProps } from "../Orders/helper.order";

export default function DesignForm({
  showForm,
  formData,
  closeForm,
  formSubmit,
}) {
  const { user } = useSelector((store) => store.auth);

  const [refImage, setRefImage] = useState({});
  const [cadImage, setCadImage] = useState({});
  const [finalImage, setFinalImage] = useState({});
  const [designProperties, setProperties] = useState({});
  const [cadTable, setCadTable] = useState([]);
  const [cadCts, setCadCts] = useState({});

  const validation = getDesignFormValidation();

  const [resetDefault, setResetDefault] = useState(0);
  const closeResetDialog = () => setResetDialog(false);
  const onResetConfirm = () => {
    closeResetDialog();
    resetForm();
  };

  const [resetDialog, setResetDialog] = useState(false);
  const resetForm = () => setResetDefault((p) => (p === 100 ? 0 : p + 1));
  useEffect(() => {
    const getDef = (name) => getDefaultImgValue(name, formData, showForm);
    setRefImage(getDef(DIT.REF));
    setCadImage(getDef(DIT.CAD));
    setFinalImage(getDef(DIT.FNL));
    setProperties(getDefaultProperties(showForm, formData, user.is_admin));
    setCadTable(getDefaultCadData(showForm, formData, user.is_admin));
    setCadCts(getDefaultCadCts(showForm, formData, user.is_admin));
  }, [resetDefault, formData]);
  const onResetClick = (e) => {
    e.stopPropagation();
    setResetDialog(true);
  };

  const [isLoading, setLoading] = useState(false);
  const onSubmitClick = async (e) => {
    e.stopPropagation();
    if (!isLoading) {
      setLoading(true);
      if (!validation.ref_image(refImage, setRefImage)) {
      } else {
        const imagePayload = await populateImages(
          showForm,
          formData,
          user.is_admin,
          [refImage, setRefImage],
          [cadImage, setCadImage],
          [finalImage, setFinalImage]
        );
        if (imagePayload) {
          const propPayload = processDesignPropties(designProperties);
          const tablePayload = processCadTableData(cadTable);
          const ctsPaylod = processCadCts(cadCts);
          const payload = { ...imagePayload, ...propPayload };
          payload[DIT.TBL] = tablePayload;
          payload[DIT.CTS] = ctsPaylod;
          await formSubmit(payload);
        }
      }
      setLoading(false);
    }
  };

  const l = (label, key) =>
    label + (designProperties[key]?.is_admin_edit ? " *" : "");
  const iro = (key) => !designProperties[key]?.is_editable;
  const v = (key) => designProperties[key]?.value || "";
  const ch = (key) => (e) => {
    const value = e.target.value;
    setProperties((prev) => ({
      ...prev,
      [key]: { ...prev[key], value, is_admin_edit: user.is_admin },
    }));
  };

  return (
    <Slide direction="up" unmountOnExit in={showForm !== FORM_STATE.CLOSE}>
      <Box sx={sx.form_popup}>
        <Box sx={sx.form_header}>
          <Box width={1}>
            <h2>{designFormTitle(showForm, formData?.design_id)}</h2>
            {showForm === FORM_STATE.UPDATE && (
              <h5>Design ID: {formData.design_id}</h5>
            )}
          </Box>
        </Box>
        <Box sx={sx.form_wrapper}>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={sx.image_container}>
                  <span className="container-title">
                    Reference Image {refImage.is_admin_edit ? "*" : ""}
                  </span>
                  <ImageUploader
                    selectedFile={refImage}
                    setSelectedFile={setRefImage}
                    className="drag-container"
                    isReadOnly={
                      showForm === FORM_STATE.READ && refImage.url !== null
                    }
                  />
                </Box>
                {refImage.invalid && (
                  <span className="error-text">
                    Reference Image is required
                  </span>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={sx.image_container}>
                  <span className="container-title">
                    CAD Image {cadImage.is_admin_edit ? "*" : ""}
                  </span>
                  <ImageUploader
                    selectedFile={cadImage}
                    setSelectedFile={setCadImage}
                    className="drag-container"
                    isReadOnly={
                      showForm === FORM_STATE.READ && cadImage.url !== null
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={sx.image_container}>
                  <span className="container-title">
                    Final Image {finalImage.is_admin_edit ? "*" : ""}
                  </span>
                  <ImageUploader
                    selectedFile={finalImage}
                    setSelectedFile={setFinalImage}
                    className="drag-container"
                    isReadOnly={
                      showForm === FORM_STATE.READ && finalImage.url !== null
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  name={JOB_SHEET_KEYS[3]}
                  label={l("Metal", "metal")}
                  value={v("metal")}
                  onChange={ch("metal")}
                  placeholder="Select Metal"
                  size="small"
                  fullWidth
                  {...getReadOnlyProps(iro("metal"))}
                >
                  <MenuItem value="Gold">Gold</MenuItem>
                  <MenuItem value="Silver">Silver</MenuItem>
                  <MenuItem value="Brass">Brass</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name={JOB_SHEET_KEYS[4]}
                  label={l("KT", "kt")}
                  value={v("kt")}
                  onChange={ch("kt")}
                  placeholder="Enter KT here"
                  size="small"
                  fullWidth
                  {...getReadOnlyProps(iro("kt"))}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  name={JOB_SHEET_KEYS[6]}
                  label={l("Rhodium", "rhodium")}
                  value={v("rhodium")}
                  onChange={ch("rhodium")}
                  placeholder="Select Rhodium"
                  size="small"
                  fullWidth
                  {...getReadOnlyProps(iro("rhodium"))}
                >
                  <MenuItem value="White">White</MenuItem>
                  <MenuItem value="Yellow">Yellow</MenuItem>
                  <MenuItem value="Rose">Rose</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  name={JOB_SHEET_KEYS[3]}
                  label={l("Product Type", "product_type")}
                  value={v("product_type")}
                  onChange={ch("product_type")}
                  placeholder="Select Product Type"
                  size="small"
                  fullWidth
                  {...getReadOnlyProps(iro("product_type"))}
                >
                  <MenuItem value="Necklace">Necklace</MenuItem>
                  <MenuItem value="Pendant">Pendant</MenuItem>
                  <MenuItem value="Bracelet">Bracelet</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name={JOB_SHEET_KEYS[4]}
                  label={l("Product Size", "product_size")}
                  value={v("product_size")}
                  onChange={ch("product_size")}
                  placeholder="Enter Product size here"
                  size="small"
                  fullWidth
                  {...getReadOnlyProps(iro("product_size"))}
                />
              </Grid>
            </Grid>
          </Box>
          <Box marginTop="-10px">
            <span className="container-title">CAD Details</span>
            <CADTable
              data={cadTable}
              setData={setCadTable}
              cts={cadCts}
              setCts={setCadCts}
            />
          </Box>
        </Box>
        <Box sx={sx.form_footer}>
          {showForm !== FORM_STATE.CREATE && (
            <Button
              color="error"
              variant="outlined"
              sx={sx.reset_btn}
              onClick={onResetClick}
              disabled={isLoading}
            >
              Reset Form
            </Button>
          )}
          <Button
            color="inherit"
            variant="outlined"
            onClick={closeForm}
            autoFocus={showForm === FORM_STATE.READ}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <StyledButton isLoading={isLoading} onClick={onSubmitClick}>
            {showForm === FORM_STATE.CREATE ? "Save" : "Update"}
          </StyledButton>
        </Box>

        <CustomDialog
          open={resetDialog}
          onClose={closeResetDialog}
          showDivider={false}
          showCloseBtn={false}
          title={<h3>Alert !!</h3>}
          content="This action will clear all unsaved updates, Are you sure want to do it?"
          actions={
            <>
              <Button
                autoFocus
                color="inherit"
                variant="outlined"
                onClick={closeResetDialog}
              >
                Close
              </Button>
              <StyledButton onClick={onResetConfirm}>Reset</StyledButton>
            </>
          }
        />
      </Box>
    </Slide>
  );
}
