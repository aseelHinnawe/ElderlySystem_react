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
import MenuIcon from "@mui/icons-material/Menu";
import {
  ElderlyWoman,
  Close,
  Dashboard,
  People,
  AccountCircle,
  PersonAdd,
  ExpandLess,
  ExpandMore,
  ManageAccounts,
  Bed,
  RoomPreferences,
  AddHome
} from "@mui/icons-material";
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
    const [roomsFolderOpen, setRoomsFolderOpen] = useState(true);


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

    if (path.startsWith("/Admin/rooms")) {
      setActivePage("الغرف");
      setRoomsFolderOpen(true);
      return;
    }

    if (path.startsWith("/Admin/add-room")) {
      setActivePage("إضافة غرفة");
      setRoomsFolderOpen(true);
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

   const toggleRoomsFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setRoomsFolderOpen(true);
      return;
    }
    setRoomsFolderOpen((prev) => !prev);
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
      {isSmallScreen && open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.25)",
            zIndex: 1100, // أقل من السايدبار (1200)
          }}
        />
      )}

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
        onClick={(e) => e.stopPropagation()}
      >
        {open && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              {/* العنوان يمين */}
              <Typography variant="h5" sx={{ fontWeight: 800, m: 0 }}>
                لوحة الإدارة
              </Typography>

              {/* X يسار (على الشاشات الصغيرة فقط) */}
              {isSmallScreen && (
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{ color: "white" }}
                >
                  <Close />
                </IconButton>
              )}
            </Box>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.25)", mb: 1.5 }} />
          </>
        )}

        <List sx={{ mt: 1 }}>
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
                <Dashboard />
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
                <ManageAccounts />
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

          <Collapse in={usersFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: open ? 4 : 0, mt: 0.5 }}>
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
                    <People fontSize="small" />
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
                    <PersonAdd fontSize="small" />
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
                <ElderlyWoman />
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

          <Collapse in={elderlyFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: open ? 4 : 0, mt: 0.5 }}>
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
                    <ElderlyWoman fontSize="small" />
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
                    <PersonAdd fontSize="small" />
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

          <ListItem disablePadding>
            <ListItemButton
              onClick={toggleRoomsFolder}
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
                <RoomPreferences />
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
                    إدارة الغرف
                  </Typography>
                  {roomsFolderOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={roomsFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: open ? 4 : 0, mt: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("الغرف", "/Admin/rooms")}
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
                    <Bed fontSize="small" />
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary="الغرف"
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

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    goTo("اضافة الغرف", "/Admin/add-room")
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
                    <AddHome fontSize="small" />
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary="اضافة الغرف"
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

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <AppBar position="static" sx={{ backgroundColor: "#6a6a57" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>
              {activePage}
            </Typography>

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
              <ElderlyWoman
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

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle sx={{ fontSize: 40 }} />
            </IconButton>

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

        <Box
          sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: "#f0f0ea" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}