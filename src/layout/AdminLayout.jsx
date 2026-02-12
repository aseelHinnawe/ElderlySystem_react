import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import ElderlyIcon from "@mui/icons-material/Elderly";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";


import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(!isSmallScreen);
  const [anchorEl, setAnchorEl] = useState(null);

  const [usersFolderOpen, setUsersFolderOpen] = useState(true);

  const [elderlyFolderOpen, setElderlyFolderOpen] = useState(true);

  const [activePage, setActivePage] = useState("الرئيسية");

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  // يحدد العنوان والـ highlight تلقائي حسب الرابط
  useEffect(() => {
    const path = location.pathname;

    if (path === "/Admin" || path === "/Admin/") {
      setActivePage("الرئيسية");
      return;
    }

    if (path.startsWith("/Admin/users")) {
      setActivePage("المستخدمين");
      setUsersFolderOpen(true);
      return;
    }

    if (path.startsWith("/Admin/requests")) {
      setActivePage("طلبات الإضافة");
      setUsersFolderOpen(true);
      return;
    }

    if (path.startsWith("/Admin/elderly")) {
      setActivePage("المسنين");
      setElderlyFolderOpen(true);
      return;
    }

    if (path.startsWith("/Admin/elderly-requests")) {
      setActivePage("طلبات المسنين");
      setElderlyFolderOpen(true);
      return;
    }

    if (path.startsWith("/Admin/profile")) {
      setActivePage("الحساب الشخصي");
      return;
    }
  }, [location.pathname]);

  const handleMenuClick = (option) => {
    if (option === "تسجيل الخروج") {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
    if (option === "الحساب الشخصي") {
      navigate("/Admin/profile");
      if (isSmallScreen) setOpen(false);
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const toggleUsersFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setUsersFolderOpen(true);
      return;
    }
    setUsersFolderOpen((prev) => !prev);
  };

  const toggleElderlyFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setElderlyFolderOpen(true);
      return;
    }
    setElderlyFolderOpen((prev) => !prev);
  };

  const goTo = (label, path) => {
    setActivePage(label);
    navigate(path);
    if (isSmallScreen) setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ================= Sidebar ================= */}
      <Box
        sx={{
          width: open ? 260 : 68,
          backgroundColor: "#6a6a57",
          color: "white",
          display: "flex",
          flexDirection: "column",
          p: 2,
          transition: "width 0.3s, left 0.3s",
          position: isSmallScreen ? "fixed" : "relative",
          right: isSmallScreen ? (open ? 0 : -280) : 0,
          top: 0,
          zIndex: 1200,
          minHeight: "100vh",
          direction: "rtl",
        }}
      >
        {open && (
          <>
            <Typography
              variant="h5"
              sx={{ mb: 2.5, fontWeight: 800, textAlign: "center" }}
            >
              لوحة الإدارة
            </Typography>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.25)", mb: 1.5 }} />
          </>
        )}

        <List sx={{ mt: 1 }}>
          {/* الرئيسية */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => goTo("الرئيسية", "/Admin")}
              sx={{
                px: open ? 2 : 0,
                py: 1.2,
                mx: 1,
                borderRadius: 2,
                justifyContent: open ? "flex-start" : "center",
                gap: 0,
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                "&::before": { display: "none" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 34,
                  mr: 0,
                  pr: 0,
                  ml: 0,
                  pl: 0,
                }}
              >
                <DashboardIcon />
              </ListItemIcon>

              {open && (
                <ListItemText
                  primary="الرئيسية"
                  sx={{ flex: "0 0 auto", m: 0 }}
                  slotProps={{
                    primary: {
                      noWrap: true,
                      sx: { fontWeight: 700, m: 0 },
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>

          {/* فولدر إدارة المستخدمين */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={toggleUsersFolder}
              sx={{
                px: open ? 2 : 0,
                py: 1.2,
                mx: 1,
                mt: 1,
                borderRadius: 2,
                justifyContent: open ? "flex-start" : "center",
                gap: 0.6,
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                "&::before": { display: "none" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 28 }}>
                <ManageAccountsIcon />
              </ListItemIcon>

              {open && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }} noWrap>
                    إدارة المستخدمين
                  </Typography>
                  {usersFolderOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>

          {/* فروع إدارة المستخدمين */}
          <Collapse in={usersFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: open ? 4 : 0, mt: 0.5 }}>
              {/* المستخدمين */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("المستخدمين", "/Admin/users")}
                  sx={{
                    px: open ? 2 : 0,
                    py: 1,
                    mx: 4,
                    borderRadius: 2,
                    justifyContent: open ? "flex-start" : "center",
                    gap: 0,
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                    "&::before": { display: "none" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      minWidth: 29,
                      mr: 0,
                      pr: 0,
                      ml: 0,
                      pl: 0,
                    }}
                  >
                    <PeopleIcon fontSize="small" />
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary="المستخدمين"
                      sx={{ flex: "0 0 auto", m: 0 }}
                      slotProps={{
                        primary: {
                          noWrap: true,
                          sx: { fontSize: 15, fontWeight: 600, m: 0 },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>

              {/* طلبات الإضافة */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("طلبات الإضافة", "/Admin/requests")}
                  sx={{
                    px: open ? 2 : 0,
                    py: 1,
                    mx: 4,
                    borderRadius: 2,
                    justifyContent: open ? "flex-start" : "center",
                    gap: 0,
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                    "&::before": { display: "none" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      minWidth: 29,
                      mr: 0,
                      pr: 0,
                      ml: 0,
                      pl: 0,
                    }}
                  >
                    <PersonAddIcon fontSize="small" />
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary="طلبات الإضافة"
                      sx={{ flex: "0 0 auto", m: 0 }}
                      slotProps={{
                        primary: {
                          noWrap: true,
                          sx: { fontSize: 15, fontWeight: 600, m: 0 },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>

          {/* فولدر إدارة المسنين */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={toggleElderlyFolder}
              sx={{
                px: open ? 2 : 0,
                py: 1.2,
                mx: 1,
                mt: 1,
                borderRadius: 2,
                justifyContent: open ? "flex-start" : "center",
                gap: 0.6,
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                "&::before": { display: "none" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 28 }}>
                <ElderlyIcon />
              </ListItemIcon>

              {open && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }} noWrap>
                    إدارة المسنين
                  </Typography>
                  {elderlyFolderOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>

          {/* فروع إدارة المسنين */}
          <Collapse in={elderlyFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: open ? 4 : 0, mt: 0.5 }}>
              {/* المسنين */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("المسنين", "/Admin/elderlies")}
                  sx={{
                    px: open ? 2 : 0,
                    py: 1,
                    mx: 4,
                    borderRadius: 2,
                    justifyContent: open ? "flex-start" : "center",
                    gap: 0,
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                    "&::before": { display: "none" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      minWidth: 29,
                      mr: 0,
                      pr: 0,
                      ml: 0,
                      pl: 0,
                    }}
                  >
                    <ElderlyIcon  fontSize="small" />
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary="المسنين"
                      sx={{ flex: "0 0 auto", m: 0 }}
                      slotProps={{
                        primary: {
                          noWrap: true,
                          sx: { fontSize: 15, fontWeight: 600, m: 0 },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>

              {/* طلبات المسنين */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    goTo("طلبات المسنين", "/Admin/elderliesRequest")
                  }
                  sx={{
                    px: open ? 2 : 0,
                    py: 1,
                    mx: 4,
                    borderRadius: 2,
                    justifyContent: open ? "flex-start" : "center",
                    gap: 0,
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                    "&::before": { display: "none" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      minWidth: 29,
                      mr: 0,
                      pr: 0,
                      ml: 0,
                      pl: 0,
                    }}
                  >
                     <PersonAddIcon fontSize="small" />


                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary="طلبات المسنين"
                      sx={{ flex: "0 0 auto", m: 0 }}
                      slotProps={{
                        primary: {
                          noWrap: true,
                          sx: { fontSize: 15, fontWeight: 600, m: 0 },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>
        </List>
      </Box>

      {/* ================= Main Content ================= */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* ================= Navbar ================= */}
        <AppBar position="static" sx={{ backgroundColor: "#6a6a57" }}>
          <Toolbar>
            {/* زر فتح السايدبار */}
            <IconButton
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>

            {/* اسم الصفحة */}
            <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>
              {activePage}
            </Typography>

            {/* اسم الدار بالوسط */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
                pointerEvents: "none",
                textAlign: "center",
              }}
            >
              <ElderlyWomanIcon
                fontSize="large"
                sx={{ pointerEvents: "auto" }}
              />
              <Typography
                variant="h6"
                sx={{ whiteSpace: "nowrap", pointerEvents: "auto" }}
              >
                دار المحبة والوئام للمسنين
              </Typography>
            </Box>

            {/* الحساب */}
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircleIcon sx={{ fontSize: 40 }} />
            </IconButton>

            {/* القائمة */}
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

        {/* ================= Page Content ================= */}
        <Box
          sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: "#f0f0ea" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}