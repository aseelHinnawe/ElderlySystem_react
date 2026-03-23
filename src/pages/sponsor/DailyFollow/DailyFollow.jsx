import { useEffect, useState } from "react";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import TrendingUp from "@mui/icons-material/TrendingUp";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import DeviceThermostatRoundedIcon from "@mui/icons-material/DeviceThermostatRounded";
import BloodtypeRoundedIcon from "@mui/icons-material/BloodtypeRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const shellCardSx = {
  borderRadius: 4,
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f8f2 100%)",
  border: "1px solid rgba(0,0,0,0.06)",
};


const recordCardSx = {
  borderRadius: 4,
  border: "1px solid rgba(0,0,0,0.07)",
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
  },
};


const metricCardBase = {
  borderRadius: 3,
  border: "1px solid rgba(0,0,0,0.06)",
  background: "#fff",
  boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  p: 1.5,
  minHeight: 92,
  display: "flex",
  alignItems: "center",
  gap: 1.2,
};


const notesBoxSx = {
  mt: 2,
  p: 1.5,
  borderRadius: 3,
  background: "rgba(106,106,87,0.07)",
  border: "1px dashed rgba(106,106,87,0.22)",
};


function MetricCard({ label, value, icon, color, bg }) {
  return (
    <Box
      sx={{
        ...metricCardBase,
        background: `linear-gradient(135deg, #ffffff 0%, ${bg} 100%)`,
      }}
    >
      <Avatar
        sx={{
          width: 42,
          height: 42,
          bgcolor: bg,
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Avatar>


      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 900,
            color: "#6a6a57",
            mb: 0.4,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color,
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}


export default function DailyFollow() {
  const [checkLists, setCheckLists] = useState([]);
  const [loading, setLoading] = useState(true);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const fetchDailyFollow = async () => {
    setLoading(true);
    try {
      const checkRes = await AxiosUserInstance.get(
        "/Sponsor/Elderly/mine/checklists/today"
      );


      const cl = checkRes?.data?.data?.[0]?.checkLists ?? [];
      setCheckLists(Array.isArray(cl) ? cl : []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "فشل تحميل بيانات المتابعة اليومية",
        severity: "error",
      });
      setCheckLists([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDailyFollow();
  }, []);


  const formatValue = (value) => {
    const v = (value ?? "").toString().trim();
    return v || "-";
  };


  const getMetrics = (record) => [
    {
      label: "درجة الحرارة",
      value: formatValue(record.temperature),
      icon: <DeviceThermostatRoundedIcon />,
      color: "#a84300",
      bg: "rgba(255,152,0,0.12)",
    },
    {
      label: "النبض",
      value: formatValue(record.pulse),
      icon: <FavoriteBorderRoundedIcon />,
      color: "#ad1457",
      bg: "rgba(233,30,99,0.12)",
    },
    {
      label: "سكر الدم",
      value: formatValue(record.bloodSugar),
      icon: <BloodtypeRoundedIcon />,
      color: "#6a1b9a",
      bg: "rgba(156,39,176,0.12)",
    },
    {
      label: "ضغط الدم",
      value: formatValue(record.bloodPressure),
      icon: <MonitorHeartRoundedIcon />,
      color: "#1565c0",
      bg: "rgba(33,150,243,0.12)",
    },
    {
      label: "الإدخال",
      value: formatValue(record.intake),
      icon: <WaterDropRoundedIcon />,
      color: "#00897b",
      bg: "rgba(0,150,136,0.12)",
    },
    {
      label: "الإخراج",
      value: formatValue(record.output),
      icon: <FavoriteRoundedIcon />,
      color: "#2e7d32",
      bg: "rgba(76,175,80,0.12)",
    },
  ];


  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Card sx={headerCardStyles}>
          <CardContent
            sx={{
              p: { xs: 2.5, md: 4 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: 22, md: 30 },
                  }}
                >
                  المتابعة اليومية
                </Typography>
                <FactCheckRoundedIcon
                  sx={{ fontSize: { xs: 28, md: 34 }, color: "#fff" }}
                />
              </Box>


              <Typography
                sx={{
                  opacity: 0.92,
                  mt: 1.5,
                  fontSize: { xs: 13, md: 16 },
                  maxWidth: 700,
                }}
              >
                يمكنك عرض سجلات المتابعة اليومية بشكل واضح ومنظم، مع المؤشرات
                الحيوية والملاحظات الخاصة بكل سجل.
              </Typography>
            </Box>


            <Box
              sx={{
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 },
                borderRadius: "50%",
                background: "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
              }}
            >
              <TrendingUp sx={{ fontSize: { xs: 30, md: 40 }, color: "#fff" }} />
            </Box>
          </CardContent>
        </Card>


        {/* Content */}
        <Card sx={shellCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.3, mb: 2 }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "rgba(106,106,87,0.12)",
                  color: "#4a4a3d",
                  border: "1px solid rgba(106,106,87,0.18)",
                }}
              >
                <FactCheckRoundedIcon />
              </Avatar>


              <Box>
                <Typography sx={{ fontWeight: 700, color: "#1f1f1a" }}>
                  سجلات المتابعة
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#6a6a57",
                  }}
                >
                  عرض السجلات المتوفرة لليوم
                </Typography>
              </Box>
            </Box>


            <Divider sx={{ mb: 2.5 }} />


            {checkLists.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  px: 2,
                  borderRadius: 4,
                  background: "rgba(106,106,87,0.06)",
                  border: "1px dashed rgba(106,106,87,0.28)",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    mx: "auto",
                    mb: 1.5,
                    width: 60,
                    height: 60,
                    bgcolor: "rgba(106,106,87,0.12)",
                    color: "#6a6a57",
                  }}
                >
                  <FactCheckRoundedIcon />
                </Avatar>
                <Typography sx={{ color: "#4a4a3d", fontWeight: 700, mb: 0.5 }}>
                  لا يوجد سجلات متابعة لليوم
                </Typography>
                <Typography sx={{ color: "#777", fontWeight: 800, fontSize: 14 }}>
                  سيتم عرض السجلات هنا عند توفرها.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    checkLists.length === 1
                      ? { xs: "1fr" }
                      : { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
                }}
              >
                {checkLists.map((record, idx) => {
                  const metrics = getMetrics(record);


                  return (
                    <Card key={`${record.nurseName ?? "n"}-${idx}`} sx={recordCardSx}>
                      <CardContent sx={{ p: { xs: 2, md: 2.4 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1.5,
                            flexWrap: "wrap",
                            mb: 1.6,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: "rgba(106,106,87,0.12)",
                                color: "#6a6a57",
                                fontWeight: 700,
                              }}
                            >
                              <PersonRoundedIcon />
                            </Avatar>


                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: "#1f1f1a",
                                  lineHeight: 1.2,
                                }}
                              >
                                {record.nurseName ?? "-"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 900,
                                  color: "#6a6a57",
                                  mt: 0.4,
                                }}
                              >
                                الممرضة
                              </Typography>
                            </Box>
                          </Box>


                          {checkLists.length > 1 ? (
                            <Box
                              sx={{
                                px: 1.2,
                                py: 0.6,
                                borderRadius: 999,
                                bgcolor: "rgba(106,106,87,0.08)",
                                color: "#6a6a57",
                                fontSize: 12,
                                fontWeight: 900,
                                border: "1px solid rgba(106,106,87,0.16)",
                              }}
                            >
                              سجل #{idx + 1}
                            </Box>
                          ) : null}
                        </Box>


                        <Divider sx={{ mb: 1.8 }} />


                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              sm: "repeat(2, minmax(0, 1fr))",
                              lg: checkLists.length === 1
                                ? "repeat(3, minmax(0, 1fr))"
                                : "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 1.4,
                          }}
                        >
                          {metrics.map((metric) => (
                            <MetricCard
                              key={metric.label}
                              label={metric.label}
                              value={metric.value}
                              icon={metric.icon}
                              color={metric.color}
                              bg={metric.bg}
                            />
                          ))}
                        </Box>


                        {record.notes ? (
                          <Box sx={notesBoxSx}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ mb: 0.8 }}
                            >
                              <NotesRoundedIcon
                                sx={{ fontSize: 18, color: "#6a6a57" }}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: 13,
                                  color: "#4a4a3d",
                                }}
                              >
                                ملاحظات الممرضة
                              </Typography>
                            </Stack>


                            <Typography
                              sx={{
                                color: "#4a4a3d",
                                fontWeight: 800,
                                fontSize: 13,
                                lineHeight: 1.8,
                                wordBreak: "break-word",
                              }}
                            >
                              {record.notes}
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              mt: 2,
                              p: 1.3,
                              borderRadius: 3,
                              background: "rgba(245,245,245,0.9)",
                              border: "1px dashed rgba(0,0,0,0.08)",
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <FavoriteRoundedIcon
                                sx={{ fontSize: 17, color: "#9e9e9e" }}
                              />
                              <Typography
                                sx={{
                                  color: "#888",
                                  fontWeight: 800,
                                  fontSize: 12,
                                }}
                              >
                                لا توجد ملاحظات مضافة لهذا السجل
                              </Typography>
                            </Stack>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ fontWeight: 900 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );


}
