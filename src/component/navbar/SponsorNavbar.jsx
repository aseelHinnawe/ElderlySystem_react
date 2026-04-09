import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";


export default function SponsorNavbar() {
  const navigate = useNavigate();


  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const handleMenuClick = (option) => {
    if (option === "تسجيل الخروج") {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }


    if (option === "الحساب الشخصي") {
      navigate("/Sponsor/Sponsor-Profile");
    }


    handleMenuClose();
  };


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
      <Toolbar
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr auto", md: "1fr auto 1fr" },
          alignItems: "center",
          minHeight: 80,
          px: { xs: 2, sm: 3, md: 5 },
          width: "100%",
        }}
      >
        {/* اسم الدار */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ElderlyWomanIcon fontSize="large" />
          <Typography
            variant="h6"
            sx={{
              whiteSpace: "nowrap",
              fontSize: { xs: "1rem", md: "1.15rem" },
              fontWeight: 600,
            }}
          >
            دار المحبة والوئام للمسنين
          </Typography>
        </Box>


        {/* الروابط بالنص */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Typography
            sx={{ cursor: "pointer", fontWeight: 500 }}
            onClick={() => navigate("/Sponsor")}
          >
            معلومات المسن
          </Typography>


          <Typography
            sx={{ cursor: "pointer", fontWeight: 500 }}
            onClick={() => navigate("/Sponsor/MedicineStatus")}
          >
            حالة الأدوية
          </Typography>


          <Typography
            sx={{ cursor: "pointer", fontWeight: 500 }}
            onClick={() => navigate("/Sponsor/DailyFollow")}
          >
            المتابعة اليومية
          </Typography>
          <Typography
            sx={{ cursor: "pointer", fontWeight: 500 }}
            onClick={() => navigate("/Sponsor/Doctors")}
          >
            ترشيحات الأطباء
          </Typography>
        </Box>


        {/* يمين الشاشة */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* زر القائمة للموبايل */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
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
              <MenuItem
                onClick={() => {
                  navigate("/Sponsor/ElderInfo");
                  handleCloseNavMenu();
                }}
              >
                معلومات المسن
              </MenuItem>


              <MenuItem
                onClick={() => {
                  navigate("/Sponsor/MedicineStatus");
                  handleCloseNavMenu();
                }}
              >
                حالة الأدوية
              </MenuItem>


              <MenuItem
                onClick={() => {
                  navigate("/Sponsor/DailyFollow");
                  handleCloseNavMenu();
                }}
              >
                المتابعة اليومية
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/Sponsor/Doctors");
                  handleCloseNavMenu();
                }}
              >
                ترشيحات الأطباء
              </MenuItem>
            </Menu>
          </Box>


          {/* ايقونة الحساب */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>


        {/* قائمة الحساب */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => handleMenuClick("الحساب الشخصي")}>
            الحساب الشخصي
          </MenuItem>


          <MenuItem onClick={() => handleMenuClick("تسجيل الخروج")}>
            تسجيل الخروج
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
