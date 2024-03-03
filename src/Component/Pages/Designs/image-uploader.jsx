import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { FileDrop } from "react-file-drop";
import {
  IMAGE_PREVIEW_ACTIONS,
  VALID_IMAGE_TYPES,
} from "../../../Helper/contant";
import Image from "rc-image";
import { Delete } from "@mui/icons-material";

const sx = {
  drag_root: {
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    "& .rc-remove-icon": {
      position: "absolute",
      right: "4px",
      background: "black",
      top: "4px",
      color: "white",
      padding: "5px 8px",
      "& svg": { width: "16px" },
      "&:hover": {
        background: "black",
      },
    },
    "& .progress-indicator-wrapper": {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      "& .progress-indicator": {
        marginInline: "auto",
        background: "rgba(0, 0, 0, 0.7)",
        borderRadius: "8px",
        width: "100%",
        height: "100%",
        maxWidth: "300px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        position: "relative",
        "& .progess-text": {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
    },
    "& .fileDrop": {
      height: "100%",
      "& .fileDropTarget": {
        height: "100%",
        "& .childRoot": {
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.1s linear",
          border: (theme) => `1px dashed ${theme.palette.grey[400]}`,
          background: (theme) => theme.palette.grey[50],
          cursor: "pointer",
          "& .label": {
            fontWeight: "400",
            pointerEvents: "none",
            color: (theme) => theme.palette.grey[600],
            position: "absolute",
            opacity: 0,
            fontStyle: "italic",
            whiteSpace: "nowrap",
            transition: "opacity 0.15s linear",
            "&.visible": {
              opacity: 0.8,
            },
          },
          "&[frame-drag=true]": {
            background: (theme) => theme.palette.grey[200],
          },
          "&[target-drag=true]": {
            borderColor: (theme) => theme.palette.grey[800],
            "& .label.visible": {
              opacity: 1,
            },
          },
          "&.error": {
            background: "#ef535038",
            "& .label.visible": {
              color: "#ff0500",
            },
          },
        },
      },
    },
  },
};

export default function ImageUploader({
  selectedFile,
  setSelectedFile,
  isReadOnly,
  ...props
}) {
  const inputRef = useRef(null);
  const [isInvalid, setInvalid] = useState(false);

  const [isDragActive, setDragActive] = useState(false);
  const [isDragAbove, setDragAbove] = useState(false);
  const resetState = () => {
    setDragActive(false);
    setDragAbove(false);
  };

  const getLabelClass = (labelName) => {
    let clx = "label";
    switch (labelName) {
      case "drop":
        if (isDragAbove && !isInvalid) {
          clx += " visible";
        }
        break;
      case "drag":
        if (isDragActive && !isDragAbove && !isInvalid) {
          clx += " visible";
        }
        break;
      case "placeholder":
        if (!(isDragAbove || isDragActive || isInvalid)) {
          clx += " visible";
        }
        break;
      case "error":
        if (isInvalid) {
          clx += " visible";
        }
        break;
      default:
        break;
    }
    return clx;
  };

  const openFileSelect = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const onInputChange = (e) => {
    fileSelection(e.target.files);
  };

  const fileSelection = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      VALID_IMAGE_TYPES.includes(file.type)
    );
    if (validFiles.length === 0) {
      setInvalid(true);
      setTimeout(() => {
        setInvalid(false);
      }, 5000);
      return;
    }

    setInvalid(false);
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      setSelectedFile((prev) => ({
        ...prev,
        url: e.target.result,
        blob: validFiles[0],
      }));
    };
    fileReader.readAsDataURL(validFiles[0]);
  };

  const removeImage = () => {
    setSelectedFile((prev) => ({
      ...prev,
      url: null,
      blob: null,
    }));
  };

  return (
    <Box sx={sx.drag_root} {...props}>
      <input
        ref={inputRef}
        onChange={onInputChange}
        hidden
        type="file"
        accept=".png,.jpg,.jpeg"
      />
      {isReadOnly || selectedFile.url ? (
        <>
          <Image
            src={selectedFile.url}
            placeholder
            preview={{ icons: IMAGE_PREVIEW_ACTIONS, mask: "Preview" }}
          />
          {!isReadOnly && (
            <IconButton
              className="rc-remove-icon"
              size="small"
              onClick={removeImage}
            >
              <Delete />
            </IconButton>
          )}
          {selectedFile.progress !== null && (
            <Box className="progress-indicator-wrapper">
              <Box className="progress-indicator">
                <CircularProgress
                  size={60}
                  color="inherit"
                  variant="determinate"
                  value={selectedFile.progress}
                />
                <Box className="progress-text">{selectedFile.progress}%</Box>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <FileDrop
          className="fileDrop"
          targetClassName="fileDropTarget"
          onTargetClick={() => openFileSelect()}
          onFrameDragEnter={() => setDragActive(true)}
          onFrameDragLeave={() => setDragActive(false)}
          onFrameDrop={() => resetState()}
          onDragOver={() => setDragAbove(true)}
          onDragLeave={() => setDragAbove(false)}
          onDrop={(files) => resetState() & fileSelection(files)}
        >
          <Box width={1} height={1}>
            <Box
              className={`childRoot${isInvalid ? " error" : ""}`}
              frame-drag={String(isDragActive)}
              target-drag={String(isDragAbove)}
            >
              <Typography className={getLabelClass("drop")}>Drop it</Typography>
              <Typography className={getLabelClass("drag")}>
                Drag here
              </Typography>
              <Typography className={getLabelClass("placeholder")}>
                Select a png/jpg file
              </Typography>
              <Typography className={getLabelClass("error")}>
                Invalid file selected
              </Typography>
            </Box>
          </Box>
        </FileDrop>
      )}
    </Box>
  );
}
