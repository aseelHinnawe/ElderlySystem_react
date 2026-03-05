import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";

import { useNavigate } from "react-router-dom";

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
      navigate("/Sponsor/profile");
    }

    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#6a6a57" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* اسم دار المسنين على الطرف */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ElderlyWomanIcon fontSize="large" />
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            دار المحبة والوئام للمسنين
          </Typography>
        </Box>

        {/* ايقونة الحساب */}
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <AccountCircle sx={{ fontSize: 40 }} />
        </IconButton>

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