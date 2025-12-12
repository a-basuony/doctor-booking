import { useState, forwardRef } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { TextFieldProps } from "@mui/material/TextField";

type PasswordInputProps = Omit<TextFieldProps, "type"> & {
  // Additional custom props can be added here if needed
};

const PasswordInput = forwardRef<HTMLDivElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
    };

    return (
      <TextField
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        slotProps={{
          input: {
            ...props.slotProps?.input,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
