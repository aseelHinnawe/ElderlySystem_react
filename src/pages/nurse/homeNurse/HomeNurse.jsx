import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";


import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";


import AxiosUserInstance from "../../../api/AxiosUserInstance";


// ✅ Theme palette (colors only)
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


const arabicDayName = (date) => {
  const names = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  return names[date.getDay()];
};


const shiftLabel = (k) => {
  if (!k) return "—";
  if (k === "-") return "—";
  if (k === "A" || k === "B" || k === "C") return `شفت ${k}`;
  return k;
};


const StatCard = ({ icon, title, value, subtitle }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.surface,
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ lineHeight: 1.1, fontWeight: 800 }}>
              {value}
            </Typography>
            {subtitle ? (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Stack>


          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.bg,
              color: COLORS.main,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};


const SectionCard = ({ title, icon, right, children, sx: sxProp }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${COLORS.border}`,
        overflow: "hidden",
        backgroundColor: COLORS.surface,
        display: "flex", // ← إضافة flex
        flexDirection: "column", // ← عمودي
        ...sxProp, // ← دمج أي sx من الخارج
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
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        {" "}
        {/* <- flexGrow يجعل المحتوى يتمدد */}
        {children}
      </CardContent>
    </Card>
  );
};


export default function HomeNurse() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
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


  const todayKey = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);


  const weeklyDates = data?.myWeeklyShift?.dates || [];
  const weeklyDays = data?.myWeeklyShift?.days || {};


  const overdueCount = data?.overdueDoses?.length || 0;
  const expiringCount = data?.plansExpiringSoon?.length || 0;
  const dueSoonCount = data?.dueSoonDoses?.length || 0;
  const stockCount = data?.lowOrOutStock?.length || 0;


  const notificationsCount =
    overdueCount + expiringCount + stockCount + dueSoonCount;


  if (loading) {
    return (
      <Box sx={{ p: 3, display: "grid", placeItems: "center", minHeight: 420 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">
            جاري تحميل الصفحة الرئيسية...
          </Typography>
        </Stack>
      </Box>
    );
  }


  if (err) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              onClick={fetchHome}
              color="inherit"
              size="small"
              startIcon={<RefreshOutlinedIcon />}
              sx={{
                borderRadius: 2,
                fontWeight: 900,
              }}
            >
              إعادة المحاولة
            </Button>
          }
        >
          {err}
        </Alert>
      </Box>
    );
  }


  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        direction: "rtl",
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, #e6e7dc 50%, #d4d6c8 100%)`,
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: { xs: 2, md: 3 },
          mb: 2.5,
          background: `linear-gradient(135deg, ${COLORS.main}, ${COLORS.light})`,
          color: "#fff",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
              الصفحة الرئيسية للممرضة
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.88)", fontWeight: 500 }}
            >
              نظرة سريعة على الشفت، الإشعارات، وحالة الأدوية لليوم.
            </Typography>
          </Box>
        </Stack>
      </Paper>


      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard
            icon={<PeopleAltOutlinedIcon sx={{ color: COLORS.main }} />}
            title="عدد المسنين "
            value={data?.activeElderliesCount ?? 0}
          />
        </Grid>


        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard
            icon={
              <NotificationsActiveOutlinedIcon sx={{ color: COLORS.main }} />
            }
            title="إشعارات اليوم"
            value={notificationsCount}
          />
        </Grid>
      </Grid>


      <Grid container spacing={2}>
        {/* Weekly Shift */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <SectionCard
            title="جدول شفتاتي (الأسبوع الحالي)"
            icon={<ScheduleOutlinedIcon sx={{ color: COLORS.main }} />}
            sx={{ height: "100%" }}
          >
            {!weeklyDates.length ? (
              <Alert
                icon={false}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.soft2,
                  color: COLORS.dark,
                  fontWeight: 900,
                  "& .MuiAlert-message": { width: "100%", textAlign: "center" },
                }}
              >
                لا يوجد بيانات أسبوعية.
              </Alert>
            ) : (
              <Grid container spacing={1.2}>
                {weeklyDates.map((k) => {
                  const dt = new Date(k);
                  const isToday = k === todayKey;
                  const val = weeklyDays?.[k] ?? "-";


                  const nice = `${arabicDayName(dt)} • ${String(
                    dt.getDate(),
                  ).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(
                    2,
                    "0",
                  )}`;


                  return (
                    <Grid size={{ xs: 6, md: 3, sm: 4 }} key={k}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.2,
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: isToday ? COLORS.main : "divider",
                          bgcolor: isToday ? COLORS.soft : "background.paper",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 700 }}
                        >
                          {nice}
                        </Typography>


                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mt: 1 }}
                        >
                          <Chip
                            label={shiftLabel(val)}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 900,
                              borderRadius: 2,
                              bgcolor: isToday ? COLORS.whiteSoft : COLORS.soft,
                              color: isToday ? "#000000" : COLORS.dark,
                              borderColor: isToday ? "#000000" : COLORS.border,
                            }}
                          />
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </SectionCard>
        </Grid>


        {/* Team Today */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard
            title="أسماء الممرضات في شفت اليوم"
            icon={<GroupOutlinedIcon sx={{ color: COLORS.main }} />}
            sx={{ height: "100%" }}
          >
            {!data?.todayTeam?.length ? (
              <Alert
                icon={false}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.soft2,
                  color: COLORS.dark,
                  fontWeight: 900,
                  "& .MuiAlert-message": { width: "100%", textAlign: "center" },
                }}
              >
                لا يوجد ممرضات مجدولات اليوم.
              </Alert>
            ) : (
              <Stack gap={2}>
                {["A", "B", "C"]
                  .map((shift) => ({
                    shift,
                    nurses: data.todayTeam.filter((n) => n.shiftKey === shift),
                  }))
                  .filter((group) => group.nurses.length > 0)
                  .map((group) => (
                    <Box key={group.shift}>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: COLORS.main,
                          mb: 1,
                          fontSize: "0.95rem",
                        }}
                      >
                        شفت {group.shift} :
                      </Typography>


                      <Stack direction="row" flexWrap="wrap" gap={1}>
  {group.nurses.map((n) => (
    <Chip
      key={n.id}
      label={n.fullName}
      variant="outlined"
      sx={{
        borderRadius: 2,
        fontWeight: 800,
        borderColor: COLORS.border,
        bgcolor: COLORS.soft2,
        color: COLORS.dark,

        flexBasis: "48%",   
        justifyContent: "center"
      }}
    />
  ))}
</Stack>
                    </Box>
                  ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>


        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <SectionCard
            title="نشاطات اليوم"
            icon={<HistoryOutlinedIcon sx={{ color: COLORS.main }} />}
            right={
              <Chip
                size="small"
                label={`${data?.todayActivity?.length ?? 0} نشاط`}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 900,
                  borderColor: COLORS.border,
                  bgcolor: COLORS.soft2,
                  color: COLORS.dark,
                }}
              />
            }
          >
            {!data?.todayActivity?.length ? (
              <Alert
                icon={false}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.soft2,
                  color: COLORS.dark,
                  fontWeight: 900,
                  "& .MuiAlert-message": {
                    width: "100%",
                    textAlign: "center",
                  },
                }}
              >
                لا يوجد نشاطات مسجلة اليوم.
              </Alert>
            ) : (
              <List
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                {data.todayActivity.map((a, idx) => (
                  <ListItem key={`${a.drugPlanId}-${idx}`} divider>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: COLORS.soft,
                          color: COLORS.dark,
                          border: `1px solid ${COLORS.border}`,
                          fontWeight: 900,
                        }}
                      >
                        {(a.nurseName || "?").slice(0, 1)}
                      </Avatar>
                    </ListItemAvatar>


                    <ListItemText
                      primary={
                        <Stack
                          gap={1}
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                        >
                          <Typography sx={{ fontWeight: 900 }}>
                            {a.action || "تم تسجيل جرعة"}
                          </Typography>
                          <Chip
                            size="small"
                            label={a.time}
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              borderColor: COLORS.border,
                              bgcolor: COLORS.soft2,
                              color: COLORS.dark,
                              fontWeight: 900,
                            }}
                          />
                        </Stack>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 900, textAlign: "right" }}
                        >
                          تم إعطاء جرعة من {a.medicineName} للمسنة{" "}
                          {a.elderlyName} بواسطة الممرضة {a.nurseName} (شفت{" "}
                          {a.shiftKey || "-"}).
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
