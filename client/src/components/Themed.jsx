'use client'
import { ThemeProvider, alpha, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red, orange } from '@mui/material/colors';

const defaultDarkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});
const defaultLightTheme = createTheme({
  palette: {
    mode: 'light',
  }
});
const sharedComponentsTheme = (background, color) => ({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: background,
          color: color
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            transition: 'border-color 0.25s',
          },
        },
      },
    },
  }
})
const sharedTypographyTheme = {
  typography: {
    "fontFamily": "Inter"
   }
}
const sharedPalette = (shade, defaultTheme) => ({
  primary: {
    main: orange[shade],
  },
  secondary:{
    main: red[shade],
  },
  border: {
    main: alpha(defaultTheme.palette.text.disabled, 0.1)
  },
  logo:{
    main: defaultTheme.palette.mode == "light"? "#FFFFFF" : orange[500],
    secondary: defaultTheme.palette.mode == "light"? "#FFFFFF" : orange[700],
  },
})
//does not work!!!
const sharedOverride = () => ({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*": {
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "black",
            width: "1rem",
            height: "1rem",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "black",
            minHeight: 24,
            border: "3px solid black",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "black",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
})

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      ...sharedPalette(400, defaultDarkTheme)
    },
    ...sharedOverride(),
    ...sharedComponentsTheme('black', "white"),
    ...sharedTypographyTheme,
});
const lightSharedPalette = {...sharedPalette(800, defaultLightTheme)}
const lightTheme = createTheme({
    palette: {
      mode: 'light',
      ...lightSharedPalette
    },
    ...sharedOverride(),
    ...sharedComponentsTheme(lightSharedPalette.primary.main, "white"),
    ...sharedTypographyTheme,
});
  
export default function Themed({darkmode, children}){

    return(
        <ThemeProvider theme={darkmode? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
    )
}