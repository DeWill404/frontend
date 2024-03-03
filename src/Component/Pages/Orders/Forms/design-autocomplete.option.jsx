import { Box, MenuItem } from "@mui/material";
import Image from "rc-image";

const sx = {
  option_root: {
    display: "flex",
    flexDirection: "column",
    padding: { xs: "4px !important", sm: "8px !important" },
    gap: "4px",
    textAlign: "left",
  },
  text_root: {
    width: "100%",
    fontSize: { xs: "14px", sm: "18px" },
  },
  image_root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: { xs: "8px", sm: "12px" },
    width: "100%",
    "& .rc-image": {
      height: { xs: "40px", sm: "60px" },
      borderRadius: "8px",
      flex: 1,
      maxWidth: "80px",
      objectFit: "cover",
      width: "calc(33% - 12px)",
    },
  },
};

export default function DesignAutoOption({ option, ...props }) {
  return (
    <MenuItem {...props} sx={sx.option_root}>
      <Box sx={sx.text_root}>
        <strong>Design ID:</strong> {option.design_id}
      </Box>
      <Box sx={sx.image_root}>
        <Image src={option.ref_image.url} placeholder />
        <Image src={option.cad_image.url} placeholder />
        <Image src={option.final_image.url} placeholder />
      </Box>
    </MenuItem>
  );
}
