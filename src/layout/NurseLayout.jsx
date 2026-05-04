
import React, { useCallback, useEffect, useState } from "react";
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
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ElderlyWoman,
  Close,
  Dashboard,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Bed,
  FactCheck,
  PlaylistAddCheck,
  ListAlt,
  CalendarMonth,
  RestaurantMenu,
  PostAdd,
  ReceiptLong,
  LocalPharmacy,
  Medication,
} from "@mui/icons-material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicationIcon from "@mui/icons-material/Medication";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { Chip, Popover, Stack, ListItemAvatar, Avatar } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import AxiosUserInstance from "../api/AxiosUserInstance";


const COLORS = {
  main: "#6a6a57",
  dark: "#5a5a4a",
  light: "#a0a078",
  bg: "#f0f0ea",
  surface: "#ffffff",
  border: "rgba(106,106,87,0.18)",
  soft: "rgba(106,106,87,0.10)",
  soft2: "rgba(106,106,87,0.06)",
  whiteSoft: "rgba(255,255,255,0.20)",
  ok: "#2E7D32",
  warn: "#8D6E63",
  danger: "#C62828",
};


const navBtnSx = (open, isChild = false) => ({
  px: open ? 2 : 0,
  py: isChild ? 1 : 1.2,
  mx: isChild ? 4 : 1,
  mt: isChild ? 0 : 1,
  borderRadius: 2,




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


const stockBadge = (status) => {
  if (status === 2)
    return {
      text: "قرب الانتهاء",
      icon: <WarningAmberOutlinedIcon fontSize="small" />,
    };
  if (status === 3)
    return {
      text: "منتهي",
      icon: <WarningAmberOutlinedIcon fontSize="small" />,
    };
  return { text: "—", icon: null };
};


const SectionCard = ({ title, icon, right, children }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${COLORS.border}`,
        overflow: "hidden",
        backgroundColor: COLORS.surface,
      }}
    >
      <Box sx={{ px: 2, py: 1.5, bgcolor: COLORS.soft2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography sx={{ fontWeight: 900, color: COLORS.dark }}>
              {title}
            </Typography>
          </Stack>
          {right}
        </Stack>
      </Box>
      <Divider />
      <CardContent sx={{ p: 2 }}>{children}</CardContent>
    </Card>
  );
};


export default function NurseLayout() {
 
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
const [err, setErr] = useState("");
  const [open, setOpen] = useState(!isSmallScreen);
  const [anchorEl, setAnchorEl] = useState(null);
  const [elderlyFolderOpen, setElderlyFolderOpen] = useState(true);
  const [mealsOpen, setMealsOpen] = useState(true);
  const [dailyChecksOpen, setDailyChecksOpen] = useState(true);
  const [medicinesOpen, setMedicinesOpen] = useState(true);
  const [data, setData] = useState(null);


  const fetchHome = useCallback(async () => {
      setLoading(true);
      setErr("");
 
      try {
        const res = await AxiosUserInstance.get("/Nurse/Nurse/home");
 
 
        const payload = res?.data?.data;
        if (!payload) throw new Error("Invalid response shape");
 
        setData(payload);
      } catch (e) {
        setErr(
          e?.response?.data?.message ||
            e?.message ||
            "حدث خطأ أثناء جلب البيانات.",
        );
      } finally {
        setLoading(false);
      }
    }, []); 
 
    useEffect(() => {
      fetchHome();
    }, [fetchHome]);


  const [activePage, setActivePage] = useState("الرئيسية");
  const isMenuOpen = Boolean(anchorEl);

  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
const openNotifications = Boolean(notificationsAnchor);

const handleNotificationsClick = (event) => setNotificationsAnchor(event.currentTarget);
const handleNotificationsClose = () => setNotificationsAnchor(null);

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);


  useEffect(() => {
    const path = location.pathname;

    if (path === "/Nurse" || path === "/Nurse/") {
      setActivePage("الرئيسية");
      return;
    }

    if (path.startsWith("/Nurse/profile")) {
      setActivePage("الحساب الشخصي");
      return;
    }

    if (path.startsWith("/Nurse/elderlies")) {
      setActivePage("المسنين");
      setElderlyFolderOpen(true);
      return;
    }
    if (path.startsWith("/Nurse/elderly/add-checklist")) {
      setActivePage("إضافة فحص");
      setDailyChecksOpen(true);
      return;
    }


    if (path.startsWith("/Nurse/elderly/checklist")) {
      setActivePage("عرض الفحوصات");
      setDailyChecksOpen(true);
      return;
    }
    if (path.startsWith("/Nurse/Add-Medicine")) {
      setActivePage("إضافة دواء");
      setMedicinesOpen(true);
      return;
    }

    if (path.startsWith("/Nurse/Elderly-Medicine")) {
      setActivePage("عرض أدوية ");
      setMedicinesOpen(true);
      return;
    }
    if (path.startsWith("/Nurse/Elderly-Medication")) {
      setActivePage("إضافة جرعة");
      setMedicinesOpen(true);
      return;
    }
    if (path.startsWith("/Nurse/Medication")) {
      setActivePage("عرض الجرعات");
      setMedicinesOpen(true);
      return;
    }

    if (path.startsWith("/Nurse/MyShifts")) {
      setActivePage("مناوباتي الأسبوعية");
      return;
    }
    if (path.startsWith("/Nurse/AddMeal")) {
      setActivePage("إضافة وجبة");
      setMealsOpen(true);
      return;
    }


    if (path.startsWith("/Nurse/Elderly-Meal")) {
      setActivePage("عرض الوجبات");
      setMealsOpen(true);
      return;
    }
  }, [location.pathname]);


  const handleMenuClick = (option) => {
    if (option === "تسجيل الخروج") {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
    if (option === "الحساب الشخصي") {
      navigate("/Nurse/profile");
      if (isSmallScreen) setOpen(false);
    }

    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const toggleElderlyFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setElderlyFolderOpen(true);
      return;
    }
    setElderlyFolderOpen((prev) => !prev);
  };
  const toggleMealsFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setMealsOpen(true);
      return;
    }
    setMealsOpen((prev) => !prev);
  };
  const toggleMedicinesFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setMedicinesOpen(true);
      return;
    }
    setMedicinesOpen((prev) => !prev);
  };
  const toggleDailyChecksFolder = () => {
    if (isSmallScreen && !open) {
      setOpen(true);
      setDailyChecksOpen(true);
      return;
    }
    setDailyChecksOpen((prev) => !prev);
  };
  const goTo = (label, path) => {
    setActivePage(label);
    navigate(path);
    if (isSmallScreen) setOpen(false);
  };

  const overdueCount = data?.overdueDoses?.length || 0;
  const expiringCount = data?.plansExpiringSoon?.length || 0;
  const dueSoonCount = data?.dueSoonDoses?.length || 0;
  const stockCount = data?.lowOrOutStock?.length || 0;

  const notificationsCount = overdueCount + expiringCount + stockCount + dueSoonCount;

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
                لوحة الممرضين
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
              onClick={() => goTo("الرئيسية", "/Nurse")}
              sx={navBtnSx(open)}
            >
              <ListItemIcon sx={navIconSx}>
                <Dashboard />
              </ListItemIcon>
              {open && <ListItemText primary="الرئيسية" sx={navTextSx} />}
            </ListItemButton>
          </ListItem>

          {/* مناوباتي الأسبوعية */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => goTo("مناوباتي الأسبوعية", "/Nurse/MyShifts")}
              sx={{
                ...navBtnSx(open),
                backgroundColor:
                  activePage === "مناوباتي الأسبوعية"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
              }}
            >
              <ListItemIcon sx={navIconSx}>
                <CalendarMonth />
              </ListItemIcon>
              {open && (
                <ListItemText primary="مناوباتي الأسبوعية" sx={navTextSx} />
              )}
            </ListItemButton>
          </ListItem>

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
                  onClick={() => goTo("المسنين", "/Nurse/elderlies")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <Bed fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="المسنين" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>
          {/* إدارة الفحوصات اليومية */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={toggleDailyChecksFolder}
              sx={navBtnSx(open)}
            >
              <ListItemIcon sx={navIconSx}>
                <FactCheck />
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
                    إدارة الفحوصات
                  </Typography>
                  {dailyChecksOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={dailyChecksOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    goTo("إضافة فحص", "/Nurse/elderly/add-checklist")
                  }
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <PlaylistAddCheck fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="إضافة فحص" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    goTo("عرض الفحوصات", "/Nurse/elderly/checklist")
                  }
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <ListAlt fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="الفحوصات" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>
          {/* إدارة الأدوية */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleMedicinesFolder} sx={navBtnSx(open)}>
              <ListItemIcon sx={navIconSx}>
                <LocalPharmacy />
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
                    إدارة الأدوية
                  </Typography>
                  {medicinesOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>


          <Collapse in={medicinesOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 0.5 }}>
              {/* إضافة دواء */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("إضافة دواء", "/Nurse/Add-Medicine")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <Medication fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="إضافة دواء" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>




              {/* عرض أدوية المسن */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    goTo("عرض أدوية المسن", "/Nurse/Elderly-Medicine")
                  }
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <ReceiptLong fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText primary="عرض الأدوية " sx={navTextSx} />
                  )}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    goTo("إضافة جرعة ", "/Nurse/Elderly-Medication")
                  }
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <VaccinesIcon fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText primary="إضافة جرعة " sx={navTextSx} />
                  )}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("عرض الجرعات", "/Nurse/Medication")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <MedicationIcon fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText primary="عرض الجرعات " sx={navTextSx} />
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
          </Collapse>
          {/* إدارة الوجبات */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleMealsFolder} sx={navBtnSx(open)}>
              <ListItemIcon sx={navIconSx}>
                <RestaurantMenu />
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
                    إدارة الوجبات
                  </Typography>
                  {mealsOpen ? <ExpandLess /> : <ExpandMore />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>




          <Collapse in={mealsOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 0.5 }}>
              {/* إضافة وجبة */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("إضافة وجبة", "/Nurse/AddMeal")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <PostAdd fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary="إضافة وجبة" sx={navTextSx} />}
                </ListItemButton>
              </ListItem>


              {/* عرض الوجبات */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => goTo("عرض الوجبات", "/Nurse/Elderly-Meal")}
                  sx={navBtnSx(open, true)}
                >
                  <ListItemIcon sx={navIconSx}>
                    <ReceiptLong fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText primary="عرض الوجبات" sx={navTextSx} />
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
              <ElderlyWoman fontSize="large" sx={{ pointerEvents: "auto" }} />
              <Typography
                variant="h6"
                sx={{ whiteSpace: "nowrap", pointerEvents: "auto" }}
              >
                دار المحبة والوئام للمسنين
              </Typography>
            </Box>


            <IconButton color="inherit" onClick={handleNotificationsClick}>
  <NotificationsActiveOutlinedIcon />
  {notificationsCount > 0 && (
    <Chip size="small" label={notificationsCount} sx={{ ml: 0.5, bgcolor: "red", color: "white" }} />
  )}
</IconButton>
<Popover
  open={openNotifications}
  anchorEl={notificationsAnchor}
  onClose={handleNotificationsClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  transformOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Box sx={{ p: 2, maxWidth: 400, maxHeight: 500, overflowY: "auto" }}>
   
            <SectionCard
              title="الإشعارات"
              icon={
                <NotificationsActiveOutlinedIcon sx={{ color: COLORS.main }} />
              }
              right={
                <Chip
                  size="small"
                  label={`${notificationsCount} إشعار`}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 900,
                    borderColor: notificationsCount
                      ? "rgba(198,40,40,0.35)"
                      : COLORS.border,
                    color: notificationsCount ? COLORS.danger : COLORS.dark,
                    bgcolor: notificationsCount
                      ? "rgba(198,40,40,0.06)"
                      : COLORS.soft2,
                  }}
                />
              }
            >
              <Stack spacing={2}>

                   {/* Due Soon */}
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                    gap={1}
                  >
                    <NotificationsActiveOutlinedIcon
                      fontSize="small"
                      sx={{ color: COLORS.ok }}
                    />
                    <Typography sx={{ fontWeight: 900 }}>
                      جرعات اقترب موعدها
                    </Typography>




                    <Chip
                      size="small"
                      label={dueSoonCount}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 900,
                        bgcolor: "rgba(46,125,50,0.10)",
                        color: COLORS.ok,
                        border: "1px solid rgba(46,125,50,0.25)",
                      }}
                    />
                  </Stack>


                  {!dueSoonCount ? (
                    <Typography variant="body2" color="text.secondary">
                      لا يوجد جرعات قريبة حالياً.
                    </Typography>
                  ) : (
                    <List
                      dense
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {data.dueSoonDoses.slice(0, 6).map((a, idx) => (
                        <ListItem
                          key={`${a.reminderKey || a.drugPlanId}-${idx}`}
                          divider
                        >
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ fontWeight: 900, textAlign: "right" }}
                              >
                                {a.elderlyName}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 900, textAlign: "right" }}
                              >
                                جرعة <b>{a.medicineName}</b> موعدها الساعة{" "}
                                <b>{a.dueTime}</b> — متبقي{" "}
                                <b>{a.minutesLeft}</b> دقيقة.
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>

                {/* Overdue */}
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                    gap={1}
                  >
                    <WarningAmberOutlinedIcon
                      fontSize="small"
                      sx={{ color: COLORS.warn }}
                    />
                    <Typography sx={{ fontWeight: 900 }}>
                      جرعات متأخرة
                    </Typography>
                    <Chip
                      size="small"
                      label={overdueCount}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 900,
                        bgcolor: "rgba(141,110,99,0.12)",
                        color: COLORS.warn,
                        border: "1px solid rgba(141,110,99,0.25)",
                      }}
                      variant="outlined"
                    />
                  </Stack>




                  {!overdueCount ? (
                    <Typography variant="body2" color="text.secondary">
                      لا يوجد جرعات متأخرة
                    </Typography>
                  ) : (
                    <List
                      dense
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {data.overdueDoses.slice(0, 6).map((a, idx) => (
                        <ListItem key={`${a.drugPlanId}-${idx}`} divider>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ fontWeight: 900, textAlign: "right" }}
                              >
                                {a.elderlyName}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 900, textAlign: "right" }}
                              >
                                جرعة <b>{a.medicineName}</b> كانت الساعة{" "}
                                <b>{a.dueTime}</b> — متأخرة{" "}
                                <b>{a.lateMinutes}</b> دقيقة.
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
             
                {/* Expiring */}
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                    gap={1}
                  >
                    <ScheduleOutlinedIcon
                      fontSize="small"
                      sx={{ color: COLORS.main }}
                    />
                    <Typography sx={{ fontWeight: 900 }}>
                      خطط دواء اقتربت من الانتهاء
                    </Typography>
                    <Chip
                      size="small"
                      label={expiringCount}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 900,
                        borderColor: COLORS.border,
                        bgcolor: COLORS.soft2,
                        color: COLORS.dark,
                      }}
                    />
                  </Stack>




                  {!expiringCount ? (
                    <Typography variant="body2" color="text.secondary">
                      لا يوجد خطط قريبة الانتهاء.
                    </Typography>
                  ) : (
                    <List
                      dense
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {data.plansExpiringSoon.slice(0, 6).map((a, idx) => (
                        <ListItem key={`${a.drugPlanId}-${idx}`} divider>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ fontWeight: 900, textAlign: "right" }}
                              >
                                {a.elderlyName}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                sx={{ fontWeight: 900, textAlign: "right" }}
                                variant="body2"
                                color="text.secondary"
                              >
                                متبقي {a.daysLeft} يوم لانتهاء إعطاء{" "}
                                {a.medicineName} للمسنة {a.elderlyName}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>




                {/* Stock */}
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                    gap={1}
                  >
                    <LocalPharmacyOutlinedIcon
                      fontSize="small"
                      sx={{ color: COLORS.main }}
                    />
                    <Typography sx={{ fontWeight: 900 }}>
                      كمية الدواء
                    </Typography>
                    <Chip
                      size="small"
                      label={stockCount}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 900,
                        borderColor: COLORS.border,
                        bgcolor: COLORS.soft2,
                        color: COLORS.dark,
                      }}
                    />
                  </Stack>




                  {!stockCount ? (
                    <Typography variant="body2" color="text.secondary">
                      لا يوجد تنبيهات كمية.
                    </Typography>
                  ) : (
                    <List
                      dense
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {data.lowOrOutStock.slice(0, 8).map((a, idx) => {
                        const badge = stockBadge(a.stockStatus);
                        const isOut = a.stockStatus === 3;




                        return (
                          <ListItem key={`${a.drugPlanId}-${idx}`} divider>
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  bgcolor: isOut
                                    ? "rgba(198,40,40,0.10)"
                                    : "rgba(141,110,99,0.12)",
                                  color: isOut ? COLORS.danger : COLORS.warn,
                                  border: `1px solid ${
                                    isOut
                                      ? "rgba(198,40,40,0.25)"
                                      : "rgba(141,110,99,0.25)"
                                  }`,
                                }}
                              >
                                {badge.icon || (
                                  <LocalPharmacyOutlinedIcon fontSize="small" />
                                )}
                              </Avatar>
                            </ListItemAvatar>




                            <ListItemText
                              primary={
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  flexWrap="wrap"
                                  gap={1}
                                >
                                  <Typography sx={{ fontWeight: 900 }}>
                                    {a.elderlyName}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={a.stockStatusText || badge.text}
                                    variant="outlined"
                                    sx={{
                                      borderRadius: 2,
                                      fontWeight: 900,
                                      borderColor: isOut
                                        ? "rgba(198,40,40,0.35)"
                                        : "rgba(141,110,99,0.35)",
                                      color: isOut
                                        ? COLORS.danger
                                        : COLORS.warn,
                                      bgcolor: isOut
                                        ? "rgba(198,40,40,0.06)"
                                        : "rgba(141,110,99,0.08)",
                                    }}
                                  />
                                </Stack>
                              }
                              secondary={
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 800, textAlign: "right" }}
                                >
                                  اسم الدواء : {a.medicineName}
                                </Typography>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </Box>
              </Stack>
            </SectionCard>
          </Box>
</Popover>


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
