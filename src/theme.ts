import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Mulish",
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          // Controls default (unchecked) color for the thumb
          color: "#ccc",
        },
        colorPrimary: {
          "&.Mui-checked": {
            // Controls checked color for the thumb
            color: "#fff",
          },
        },
        track: {
          // Controls default (unchecked) color for the track
          opacity: 1,
          backgroundColor: "#D1D1D6",
          ".Mui-checked.Mui-checked + &": {
            // Controls checked color for the track
            opacity: 1,
            backgroundColor: "#0088CC",
          },
        },
        thumb: {
          background: "#fff",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.16)",
        },
      },
    },
  },
});
