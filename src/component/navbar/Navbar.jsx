import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import style from "./Navbar.module.css";
const pages = [
  { name: "الرئيسية", link: "#home" },
  { name: "من نحن", link: "#about" },
  { name: "خدماتنا", link: "#services" },
  { name: "تواصل معنا", link: "#contact" },
];
export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

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

          <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {pages.map((page) =>
                page.link.startsWith("#") ? (
                  <MenuItem
                    key={page.name}
                    component="a"
                    href={page.link}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography className={style.pageName}>
                      {page.name}
                    </Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={page.name}
                    component={RouterLink}
                    to={page.link}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography className={style.pageName}>
                      {page.name}
                    </Typography>
                  </MenuItem>
                ),
              )}
            </Menu>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
            }}
            className={style.navBox}
          >
            {pages.map((page) =>
              page.link.startsWith("#") ? (
                <Button
                  key={page.name}
                  href={page.link} // anchor داخل الصفحة
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontFamily: "Cairo",
                    textTransform: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {page.name}
                </Button>
              ) : (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.link} // route خارجي
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontFamily: "Cairo",
                    textTransform: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {page.name}
                </Button>
              ),
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                borderRadius: "20px",
                fontFamily: "Cairo",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#f1f1f1",
                  backgroundColor: "transparent",
                },
              }}
            >
              تسجيل الدخول
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: "#3e3e38",
                borderRadius: "20px",
                fontFamily: "Cairo",
                textTransform: "none",
                "&:hover": { backgroundColor: "#f1f1f1" },
              }}
            >
              إنشاء حساب
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
