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
  AddHome,
  EventNote,
  AddCircleOutline,
  VolunteerActivism,
  Payments,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";


const navBtnSx = (open, isChild = false) => ({
  px: open ? 2 : 0,
  py: isChild ? 1 : 1.2,
  mx: isChild ? 4 : 1,
  mt: isChild ? 0 : 1,
  borderRadius: 2,


  // ✅ RTL: الايقونة عاليمين ثم الاسم مباشرة
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: open ? "flex-start" : "center",
  gap: open ? 1 : 0,


  backgroundColor: "transparent",
  "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
  "&::before": { display: "none" },
});


const navIconSx = {
  color: "white",
  minWidth: 34,
  width: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mr: 0,
  ml: 0,
  flexShrink: 0,
};


const navTextSx = {
  m: 0,
  flex: "1 1 auto",
  minWidth: 0,
  textAlign: "right",
  "& .MuiListItemText-primary": {
    fontWeight: 700,
    fontSize: 15,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};


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
  const [activitiesFolderOpen, setActivitiesFolderOpen] = useState(true);
  const [donationsFolderOpen, setDonationsFolderOpen] = useState(true);


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


    if (path.startsWith("/Admin/elderlyStay")) {
      setActivePage("إقامة المسنين");
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


    if (path.startsWith("/Admin/activites")) {
      setActivePage("الأنشطة");
      setActivitiesFolderOpen(true);
      return;
    }


    if (path.startsWith("/Admin/add-activity")) {
      setActivePage("إضافة نشاط");
      setActivitiesFolderOpen(true);
      return;
    }


    if (path.startsWith("/Admin/Donations")) {
      setActivePage("التبرعات");
      setDonationsFolderOpen(true);
      return;
    }


    if (path.startsWith("/Admin/add-Donation")) {
      setActivePage("إضافة تبرع");
      setDonationsFolderOpen(true);
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


  const toggleActivitiesFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setActivitiesFolderOpen(true);
      return;
    }
    setActivitiesFolderOpen((prev) => !prev);
  };


  const toggleDonationsFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setDonationsFolderOpen(true);
      return;
    }
    setDonationsFolderOpen((prev) => !prev);
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
            zIndex: 1100,
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
              <Typography variant="h5" sx={{ fontWeight: 800, m: 0 }}>
                لوحة الإدارة
              </Typography>


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
          {/* الرئيسية */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => goTo("الرئيسية", "/Admin")}
              sx={navBtnSx(open)}
            >
              <ListItemIcon sx={navIconSx}>
                <Dashboard />
              </ListItemIcon>
              {open && <ListItemText primary="الرئيسية" sx={navTextSx} />}
            </ListItemButton>
          </ListItem>


          {/* إدارة المستخدمين */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleUsersFolder} sx={navBtnSx(open)}>
              <ListItemIcon sx={navIconSx}>
                <ManageAccounts />
              </ListItemIcon>


              {open && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minWidth: 0,
                    overflow: "hidden",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      minWidth: 0,
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    إدارة المستخدمين
                  </Typography>


                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {usersFolderOpen ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                </Box>
              )}
            </ListItemButton>
          </ListItem>


          <Collapse in={usersFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("المستخدمين", "/Admin/users")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <People fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="المستخدمين" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>


              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("طلبات الإضافة", "/Admin/requests")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText primary="طلبات الإضافة" sx={navTextSx} />
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>


          {/* إدارة المسنين */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleElderlyFolder} sx={navBtnSx(open)}>
              <ListItemIcon sx={navIconSx}>
                <ElderlyWoman />
              </ListItemIcon>


              {open && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minWidth: 0,
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
            <Box sx={{ mt: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("إقامة المسنين", "/Admin/elderlyStay")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <Bed fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText primary="إقامة المسنين" sx={navTextSx} />
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>


          {/* إدارة الغرف */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleRoomsFolder} sx={navBtnSx(open)}>
              <ListItemIcon sx={navIconSx}>
                <RoomPreferences />
              </ListItemIcon>


              {open && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minWidth: 0,
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
            <Box sx={{ mt: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("الغرف", "/Admin/rooms")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <Bed fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="الغرف" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>


              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("اضافة الغرف", "/Admin/add-room")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <AddHome fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText primary="اضافة الغرف" sx={navTextSx} />
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>


          {/* إدارة الأنشطة */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={toggleActivitiesFolder}
              sx={navBtnSx(open)}
            >
              <ListItemIcon sx={navIconSx}>
                <EventNote />
              </ListItemIcon>


              {open && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }} noWrap>
                    إدارة الأنشطة
                  </Typography>
                  {activitiesFolderOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>


          <Collapse in={activitiesFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("الأنشطة", "/Admin/activites")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <EventNote fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="الأنشطة" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>


              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("إضافة نشاط", "/Admin/add-activity")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <AddCircleOutline fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="إضافة نشاط" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>


          {/* إدارة التبرعات */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleDonationsFolder} sx={navBtnSx(open)}>
              <ListItemIcon sx={navIconSx}>
                <VolunteerActivism />
              </ListItemIcon>


              {open && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }} noWrap>
                    إدارة التبرعات
                  </Typography>
                  {donationsFolderOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>


          <Collapse in={donationsFolderOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("التبرعات", "/Admin/Donations")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <Payments fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="التبرعات" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>


              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("إضافة تبرع", "/Admin/add-Donation")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <AddCircleOutline fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="إضافة تبرع" sx={navTextSx} />}
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
              <ElderlyWoman fontSize="large" sx={{ pointerEvents: "auto" }} />
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



