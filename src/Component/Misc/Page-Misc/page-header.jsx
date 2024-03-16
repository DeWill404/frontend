import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  useMediaQuery,
} from "@mui/material";
import { Add, Close, Search } from "@mui/icons-material";
import { StyledButton } from "../style-button";
import { useForm } from "react-hook-form";

const sx = {
  page_header: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: "8px",
    justifyContent: "space-between",
  },
  page_title: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    "& .label": {
      whiteSpace: "nowrap",
      fontWeight: "500",
    },
  },
  page_action_box: {
    display: "flex",
    gap: { xs: "8px", lg: "24px" },
    justifyContent: { xs: "space-between", md: "end" },
    flex: 1,
  },
  page_search_box: {
    paddingLeft: "8px",
    display: "flex",
    alignItems: "center",
    border: "1px solid black",
    borderRadius: "4px",
    flex: 1,
    maxWidth: "350px",
  },
  page_search_input: {
    "& input": {
      padding: 0,
    },
    marginRight: "8px",
    flex: 1,
  },
  page_search_btn: {
    paddingInline: "8px",
    minWidth: "min-content",
    height: "100%",
    borderRadius: "0px 3px 3px 0px",
    "& .search-icon": {
      display: "flex",
    },
  },
  page_add_btn: {
    paddingInline: { xs: "8px", md: "16px" },
    "& .text-container": {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      whiteSpace: "nowrap",
    },
  },
};

export default function PageHeader({
  icon,
  label,
  placeholder,
  name,
  onSearch,
  onAdd,
  showCreateBtn = true,
  defaultSearchValue,
}) {
  const isXS = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isSM = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const { register, setValue, handleSubmit } = useForm({
    defaultValues: { search: defaultSearchValue || "" },
  });

  const clearSearch = () => {
    setValue("search", "");
    onSearch("");
    document
      .getElementById(`search-input-${name.replaceAll(" ", "-")}`)
      .focus();
  };

  return (
    <Box sx={sx.page_header}>
      <Box component="h2" sx={sx.page_title}>
        {isXS && icon}
        <span className="label">{label}</span>
      </Box>
      <Box sx={sx.page_action_box}>
        <Box
          component="form"
          sx={sx.page_search_box}
          onSubmit={handleSubmit((v) => onSearch(v.search))}
        >
          <InputBase
            placeholder={placeholder || `Name, Email`}
            size="small"
            sx={sx.page_search_input}
            {...register("search")}
            inputProps={{ id: `search-input-${name.replaceAll(" ", "-")}` }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <Close />
                </IconButton>
              </InputAdornment>
            }
          />
          <Divider orientation="vertical" />
          <StyledButton
            size="small"
            sx={sx.page_search_btn}
            onClick={handleSubmit((v) => onSearch(v.search))}
          >
            <Search className="search-icon" />
          </StyledButton>
        </Box>
        {showCreateBtn && (
          <StyledButton size="small" sx={sx.page_add_btn} onClick={onAdd}>
            <span className="text-container">
              <Add />
              <span> Create {!isSM && `New ${name}`} </span>
            </span>
          </StyledButton>
        )}
      </Box>
    </Box>
  );
}
