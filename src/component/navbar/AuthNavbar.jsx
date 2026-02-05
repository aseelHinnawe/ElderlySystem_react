import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';
import { Link as RouterLink } from "react-router-dom";
import style from "./Navbar.module.css";

export default function AuthNavbar() {
  return (
     <AppBar
  position="sticky"
  sx={{
    backgroundColor: "#6a6a57",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
  }}
>
  <Container maxWidth="xl">
    <Toolbar disableGutters>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* اللوجو */}
        <Box className={style.headerBox}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#home"
            sx={{
              display: { xs: "none", md: "flex" },
            }}
            className={style.logoText}
          >
            دار المحبة والوئام للمسنين
          </Typography>

          <ElderlyWomanIcon
            fontSize="large"
            sx={{ color: "white", display: { xs: "none", md: "block" } }}
          />
        </Box>

        {/* زر الرجوع – جهة الشمال */}
        <Box sx={{ marginInlineStart: "auto" }}>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              fontFamily: "Cairo",
              fontWeight: 500,
            }}
          >
            الصفحة الرئيسية ←
          </Button>
        </Box>
      </Box>
    </Toolbar>
  </Container>
</AppBar>

  )
}
