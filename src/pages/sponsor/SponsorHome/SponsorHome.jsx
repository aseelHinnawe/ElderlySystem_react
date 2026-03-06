
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


const cardSx = {
  borderRadius: 4,
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  background: "linear-gradient(135deg, #ffffff 0%, #f6f6ef 100%)",
  border: "1px solid rgba(0,0,0,0.06)",
};


const pillSx = {
  borderRadius: 999,
  fontWeight: 1000,
};


export default function HomeSponsor() {
  const [elderly, setElderly] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [checkLists, setCheckLists] = useState([]);


  const [loading, setLoading] = useState(true);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const navigate = useNavigate();


  const fetchAll = async () => {
    setLoading(true);
    try {
      const [elderlyRes, medsRes, checkRes] = await Promise.all([
        AxiosUserInstance.get("/Sponsor/Elderly/mine"),
        AxiosUserInstance.get("/Sponsor/Elderly/mine/medicines"),
        AxiosUserInstance.get("/Sponsor/Elderly/mine/checklists/today"),
      ]);


      // ✅ المسن (أول عنصر فقط)
      const e = elderlyRes?.data?.data?.[0] ?? null;
      setElderly(e);


      // ✅ الأدوية (حسب شكل الداتا عندك)
      const meds = medsRes?.data?.data?.[0]?.medicines ?? [];
      setMedicines(Array.isArray(meds) ? meds : []);


      // ✅ Checklist اليوم
      const cl = checkRes?.data?.data?.[0]?.checkLists ?? [];
      setCheckLists(Array.isArray(cl) ? cl : []);
    } catch (e) {
      setSnackbar({
        open: true,
        message: "فشل تحميل بيانات الصفحة",
        severity: "error",
      });
      setElderly(null);
      setMedicines([]);
      setCheckLists([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAll();
  }, []);


  const statusMeta = useMemo(() => {
    return {
      منتهي: {
        icon: <ErrorOutlineRoundedIcon />,
        sx: {
          bgcolor: "rgba(211,47,47,0.12)",
          color: "#b71c1c",
          border: "1px solid rgba(211,47,47,0.22)",
        },
      },
      "قريب الانتهاء": {
        icon: <WarningAmberRoundedIcon />,
        sx: {
          bgcolor: "rgba(245,124,0,0.12)",
          color: "#8a4b00",
          border: "1px solid rgba(245,124,0,0.22)",
        },
      },
      سليم: {
        icon: <CheckCircleOutlineRoundedIcon />,
        sx: {
          bgcolor: "rgba(46,125,50,0.12)",
          color: "#1b5e20",
          border: "1px solid rgba(46,125,50,0.22)",
        },
      },
    };
  }, []);


  const getStatusChip = (status) => {
    const meta = statusMeta[status] || {
      icon: <MedicalServicesRoundedIcon />,
      sx: {
        bgcolor: "rgba(106,106,87,0.10)",
        color: "#4a4a3d",
        border: "1px solid rgba(106,106,87,0.18)",
      },
    };


    return (
      <Chip
        size="small"
        icon={meta.icon}
        label={status || "-"}
        sx={{ fontWeight: 1000, ...meta.sx }}
      />
    );
  };


  const renderMetric = (label, value) => {
    const v = (value ?? "").toString().trim();
    if (!v) return null;


    return (
      <Chip
        size="small"
        label={`${label}: ${v}`}
        sx={{
          ...pillSx,
          bgcolor: "rgba(106,106,87,0.10)",
          color: "#4a4a3d",
        }}
      />
    );
  };


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


  if (!elderly) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
          p: { xs: 2, md: 5 },
        }}
      >
        <Card sx={{ ...cardSx, p: 3 }}>
          <Typography sx={{ fontWeight: 1100, color: "#4a4a3d" }}>
            لا يوجد بيانات للمسن حالياً.
          </Typography>
        </Card>


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


  const sponsor = Array.isArray(elderly.sponsors) ? elderly.sponsors[0] : null;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 5 },
      }}
    >
      {/* ===== الكرت الرئيسي للمسن ===== */}
      <Card sx={{ ...cardSx, mb: 3 }}>
        <CardContent sx={{ p: 2.6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
              <Avatar
                sx={{
                  width: 58,
                  height: 58,
                  bgcolor: "#6a6a57",
                  fontWeight: 1100,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                }}
              >
                {(elderly?.elderlyName || "").trim().charAt(0) || "؟"}
              </Avatar>


              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 1100,
                    fontSize: 20,
                    color: "#1f1f1a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: { xs: 240, sm: 520 },
                  }}
                  title={elderly.elderlyName}
                >
                  {elderly.elderlyName}
                </Typography>


                {sponsor ? (
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.8 }}
                  >
                    <Chip
                      size="small"
                      label={`الكفيل: ${sponsor.sponsorName ?? "-"}`}
                      sx={{
                        ...pillSx,
                        bgcolor: "rgba(65,125,68,0.12)",
                        color: "#2f5f33",
                        border: "1px solid rgba(65,125,68,0.18)",
                      }}
                    />
                    <Chip
                      size="small"
                      label={`صلة القرابة: ${sponsor.kinShip ?? "-"}`}
                      sx={{
                        ...pillSx,
                        bgcolor: "rgba(106,106,87,0.10)",
                        color: "#4a4a3d",
                      }}
                    />
                    <Chip
                      size="small"
                      label={sponsor.degree ?? "-"}
                      sx={{
                        ...pillSx,
                        bgcolor: "rgba(255, 248, 225, 0.9)",
                        color: "#8D6E63",
                        border: "1px solid rgba(141,110,99,0.25)",
                      }}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>


            <Button
              variant="contained"
              onClick={() =>
                navigate(`/Sponsor/Elderly-Details/${elderly.elderlyId}`)
              }
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 1100,
                background: "linear-gradient(135deg, #417d44, #6a6a57)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
                "&:hover": {
                  boxShadow: "0 14px 28px rgba(0,0,0,0.16)",
                },
              }}
            >
              عرض تفاصيل المسن
            </Button>
          </Box>
        </CardContent>
      </Card>


      {/* ===== المحتوى: أدوية + Checklist اليوم ===== */}
      <Grid container spacing={3}>
        {/* ===== الأدوية ===== */}
        <Grid size={{xs:12,md:6}}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "rgba(65,125,68,0.14)",
                    color: "#2f5f33",
                    border: "1px solid rgba(65,125,68,0.18)",
                    fontWeight: 1000,
                  }}
                >
                  <MedicalServicesRoundedIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 1100, color: "#1f1f1a" }}>
                    الأدوية
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                  >
                    {medicines.length} دواء
                  </Typography>
                </Box>
              </Box>


              <Divider sx={{ my: 2 }} />


              {medicines.length === 0 ? (
                <Typography sx={{ color: "#777", fontWeight: 900 }}>
                  لا يوجد أدوية مسجّلة حالياً.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {medicines.map((m, idx) => (
                    <Box
                      key={`${m.medicineName}-${idx}`}
                      sx={{
                        p: 1.4,
                        borderRadius: 3,
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.2,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 1100,
                            color: "#1f1f1a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={m.medicineName}
                        >
                          {m.medicineName ?? "-"}
                        </Typography>


                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 900,
                            color: "#4a4a3d",
                          }}
                        >
                          {m.medicineTypeName ?? "-"}
                        </Typography>
                      </Box>


                      {getStatusChip(m.statusTypeName)}
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>


        {/* ===== Checklist اليوم ===== */}
        <Grid size={{xs:12,md:6}}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "rgba(106,106,87,0.12)",
                    color: "#4a4a3d",
                    border: "1px solid rgba(106,106,87,0.18)",
                    fontWeight: 1000,
                  }}
                >
                  <FactCheckRoundedIcon />
                </Avatar>


                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 1100, color: "#1f1f1a" }}>
                    متابعة اليوم
                  </Typography>
                </Box>
              </Box>


              <Divider sx={{ my: 2 }} />


              {checkLists.length === 0 ? (
                <Typography sx={{ color: "#777", fontWeight: 900 }}>
                  لا يوجد سجلات متابعة لليوم.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {checkLists.map((c, idx) => (
                    <Box
                      key={`${c.nurseName ?? "n"}-${idx}`}
                      sx={{
                        p: 1.4,
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f4f5ef 100%)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 1100, color: "#1f1f1a" }}>
                        الممرضة: {c.nurseName ?? "-"}
                      </Typography>


                      <Box
                        sx={{
                          mt: 1.2,
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {renderMetric("حرارة", c.temperature)}
                        {renderMetric("نبض", c.pulse)}
                        {renderMetric("سكر", c.bloodSugar)}
                        {renderMetric("ضغط", c.bloodPressure)}
                        {renderMetric("الإدخال", c.intake)}
                        {renderMetric("الإخراج", c.output)}
                      </Box>
                      {c.notes ? (
                        <Typography
                          sx={{
                            mt: 1,
                            fontWeight: 900,
                            color: "#4a4a3d",
                            fontSize: 12,
                            background: "rgba(106,106,87,0.08)",
                            border: "1px dashed rgba(106,106,87,0.25)",
                            p: 1,
                            borderRadius: 2.5,
                          }}
                        >
                          ملاحظات: {c.notes}
                        </Typography>
                      ) : null}
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


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
