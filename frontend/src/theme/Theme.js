import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const colors = {
  primary: "#750C0C",
  background: "#F5F5F5",
  grey: "#767676",
  secondary: "#000",
  brand:"#d43725",
  //solid colors
  white: "#fff",
  black: "#000",
  blue: '#396dff',
  danger: '#ff0000'
};

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      // small
      sm: 600,
      // medium
      md: 900,
      // large
      lg: 1200,
      // extra-large
      xl: 1500,
    },
  },

  typography: {
    fontFamily: ["Monton", "sans-serif"].join(","),
    button: {
      fontWeight: 500,
      lineHeight: 1.86,
      fontSize: 18,
      textTransform: "none",
    },

    caption: {
      color: colors.secondary,
      fontSize: 18,
      textDecoration: "underline",
      fontWeight: 600,
      cursor: "pointer",
    },
  },

  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
  },

  palette: {
    primary: {
      main: colors.white,
    },
    secondary: {
      main: colors.secondary,
    },
    info: {
      main: colors.grey,
    },
    action: {
      main: "#fff",
    },
    brand: {
      main: colors.brand
    },
    blue: {
      main: colors.blue
    },
    danger: {
      main: colors.danger
    }
  },
});

export default responsiveFontSizes(theme);
