import { useEffect, useMemo, useState } from "react";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";


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


export default function MedicineStatus() {


  const [elderly, setElderly] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


const fetchMedicinesPage = async () => {
  setLoading(true);
  try {
    const medsRes = await AxiosUserInstance.get("/Sponsor/Elderly/mine/medicines");
    const meds = medsRes?.data?.data?.[0]?.medicines ?? [];


    setMedicines(Array.isArray(meds) ? meds : []);
  } catch (error) {
    setSnackbar({
      open: true,
      message: "فشل تحميل بيانات الأدوية",
      severity: "error",
    });
    setMedicines([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMedicinesPage();
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
      متبقي: {
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


  const counts = useMemo(() => {
    return {
      total: medicines.length,
      active: medicines.filter((m) => m.statusTypeName === "متبقي").length,
      nearEnd: medicines.filter((m) => m.statusTypeName === "قريب الانتهاء")
        .length,
      finished: medicines.filter((m) => m.statusTypeName === "منتهي").length,
    };
  }, [medicines]);


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
        p: { xs: 2, md: 5 },
      }}
    >
      <Stack spacing={3}>
       


        <Card sx={cardSx}>
          <CardContent sx={{ p: 2.6 }}>
            <Typography sx={{ fontWeight: 1100, color: "#1f1f1a", mb: 2 }}>
              ملخص الأدوية
            </Typography>


            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  md: "repeat(4, 1fr)",
                },
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#777", fontWeight: 900 }}>
                  إجمالي الأدوية
                </Typography>
                <Typography sx={{ fontWeight: 1100, fontSize: 22 }}>
                  {counts.total}
                </Typography>
              </Box>


              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(46,125,50,0.08)",
                  border: "1px solid rgba(46,125,50,0.15)",
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#1b5e20", fontWeight: 900 }}>
                  متبقي
                </Typography>
                <Typography sx={{ fontWeight: 1100, fontSize: 22, color: "#1b5e20" }}>
                  {counts.active}
                </Typography>
              </Box>


              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(245,124,0,0.08)",
                  border: "1px solid rgba(245,124,0,0.15)",
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#8a4b00", fontWeight: 900 }}>
                  قريب الانتهاء
                </Typography>
                <Typography sx={{ fontWeight: 1100, fontSize: 22, color: "#8a4b00" }}>
                  {counts.nearEnd}
                </Typography>
              </Box>


              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(211,47,47,0.08)",
                  border: "1px solid rgba(211,47,47,0.15)",
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#b71c1c", fontWeight: 900 }}>
                  منتهي
                </Typography>
                <Typography sx={{ fontWeight: 1100, fontSize: 22, color: "#b71c1c" }}>
                  {counts.finished}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>


        {/* Medicines List */}
        <Card sx={cardSx}>
          <CardContent sx={{ p: 2.6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: "rgba(65,125,68,0.14)",
                  color: "#2f5f33",
                  border: "1px solid rgba(65,125,68,0.18)",
                }}
              >
                <MedicalServicesRoundedIcon />
              </Avatar>


              <Box>
                <Typography sx={{ fontWeight: 1100, color: "#1f1f1a" }}>
                  قائمة الأدوية
                </Typography>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                >
                  جميع الأدوية المسجلة للمسن
                </Typography>
              </Box>
            </Box>


            <Divider sx={{ my: 2 }} />


            {medicines.length === 0 ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(106,106,87,0.08)",
                  border: "1px dashed rgba(106,106,87,0.28)",
                }}
              >
                <Typography sx={{ color: "#777", fontWeight: 900 }}>
                  لا يوجد أدوية مسجّلة حالياً.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.4}>
                {medicines.map((m, idx) => (
                  <Box
                    key={`${m.medicineName}-${idx}`}
                    sx={{
                      p: 1.6,
                      borderRadius: 3,
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          bgcolor: "#f4f5ef",
                          color: "#6a6a57",
                        }}
                      >
                        <MedicalServicesRoundedIcon fontSize="small" />
                      </Avatar>


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


                        <Box
                          sx={{
                            mt: 0.7,
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Chip
                            size="small"
                            label={m.medicineTypeName ?? "-"}
                            sx={{
                              ...pillSx,
                              bgcolor: "rgba(106,106,87,0.10)",
                              color: "#4a4a3d",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>


                    {getStatusChip(m.statusTypeName)}
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>


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

