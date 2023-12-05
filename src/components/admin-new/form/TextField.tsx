import { Controller, Control } from "react-hook-form";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";

type TextFieldProps = Omit<MuiTextFieldProps, "variant"> & {
  name: string;
  control?: Control<any, any>;
};

export function TextField({ label, name, control }: TextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <MuiTextField
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
        />
      )}></Controller>
  );
}
