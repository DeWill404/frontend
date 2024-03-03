import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { getReadOnlyProps } from "../helper.order";
import { forwardRef } from "react";

const AutoComplete = forwardRef(
  (
    {
      readOnly,
      loading,
      sx,
      label,
      autoFocus,
      errors,
      textFieldProps = {},
      ...props
    },
    ref
  ) => (
    <Autocomplete
      loading={loading}
      readOnly={readOnly}
      sx={{ ...sx, pointerEvents: readOnly ? "none" : "auto" }}
      ref={ref}
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {!readOnly && loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          {...textFieldProps}
          {...getReadOnlyProps(readOnly, params.inputProps, params.sx)}
          autoFocus={autoFocus && !readOnly}
          error={!!errors}
          helperText={errors?.message || ""}
        />
      )}
    />
  )
);

export default function CustomAutoComplete({
  name,
  control,
  validate,
  errors,
  label,
  loading,
  readOnly,
  autoFocus,
  sx = {},
  ...props
}) {
  if (!control) {
    return (
      <AutoComplete
        loading={loading}
        readOnly={readOnly}
        autoSelect={props.freeSolo}
        sx={sx}
        label={label}
        autoFocus={autoFocus}
        errors={errors}
        {...props}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={validate}
      render={({ field }) => (
        <AutoComplete
          loading={loading}
          readOnly={readOnly}
          autoSelect={props.freeSolo}
          sx={sx}
          label={label}
          autoFocus={autoFocus}
          errors={errors}
          {...field}
          onChange={(_, data) => field.onChange(data)}
          onInputChange={(_, data) => field.onChange(data)}
          {...props}
        />
      )}
    />
  );
}
