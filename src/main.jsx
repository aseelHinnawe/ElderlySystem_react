import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/cairo";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Cairo, sans-serif",
  },
});

createRoot(document.getElementById('root')).render(
  <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    </ThemeProvider>
    </>
)
