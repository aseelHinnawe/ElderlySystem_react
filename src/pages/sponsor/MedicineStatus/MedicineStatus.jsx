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
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";


import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import TrendingUp from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MedicationLiquidRoundedIcon from "@mui/icons-material/MedicationLiquidRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const cardSx = {
  borderRadius: 4,
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f8f2 100%)",
  border: "1px solid rgba(0,0,0,0.06)",
};


const summaryCardSx = {
  borderRadius: 4,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 8px 22px rgba(0,0,0,0.05)",
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(8px)",
};


const medicineCardSx = {
  p: 1.8,
  borderRadius: 4,
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(0,0,0,0.07)",
  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  flexWrap: "wrap",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
  },
};


const pillSx = {
  borderRadius: 999,
  fontWeight: 700,
};


const filterChipBase = {
  borderRadius: 999,
  fontWeight: 900,
  px: 0.8,
  height: 36,
};


export default function MedicineStatus() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("الكل");


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
      icon={meta.icon}
      label={status || "-"}
      sx={{
        fontWeight: 700,
        height: 30,
        fontSize: 13,
        borderRadius: 999,
        "& .MuiChip-icon": {
          fontSize: 18,
          mr: 0.5,
        },
        ...meta.sx,
      }}
    />
  );
};


  const counts = useMemo(() => {
    return {
      total: medicines.length,
      active: medicines.filter((m) => m.statusTypeName === "متبقي").length,
      nearEnd: medicines.filter((m) => m.statusTypeName === "قريب الانتهاء").length,
      finished: medicines.filter((m) => m.statusTypeName === "منتهي").length,
    };
  }, [medicines]);


  const filteredMedicines = useMemo(() => {
    const q = searchText.trim().toLowerCase();


    return medicines.filter((m) => {
      const matchesSearch =
        !q ||
        (m?.medicineName || "").toLowerCase().includes(q) ||
        (m?.medicineTypeName || "").toLowerCase().includes(q) ||
        (m?.statusTypeName || "").toLowerCase().includes(q);


      const matchesStatus =
        selectedStatus === "الكل" || m?.statusTypeName === selectedStatus;


      return matchesSearch && matchesStatus;
    });
  }, [medicines, searchText, selectedStatus]);


  const filters = [
    { key: "الكل", label: `الكل (${counts.total})` },
    { key: "متبقي", label: `متبقي (${counts.active})` },
    { key: "قريب الانتهاء", label: `قريب الانتهاء (${counts.nearEnd})` },
    { key: "منتهي", label: `منتهي (${counts.finished})` },
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
                  حالة الأدوية
                </Typography>
                <MedicalServicesRoundedIcon
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
                يمكنك عرض جميع الأدوية الخاصة بالمسن مع متابعة حالة كل دواء ومعرفة
                الأدوية المتبقية أو القريبة من الانتهاء أو المنتهية.
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


        {/* Summary */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Card sx={summaryCardSx}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.4}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(106,106,87,0.12)",
                    color: "#6a6a57",
                    width: 46,
                    height: 46,
                  }}
                >
                  <Inventory2RoundedIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#777", fontWeight: 900 ,mr:1 }}>
                    إجمالي الأدوية
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 24 , mr:2 }}>
                    {counts.total}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>


          <Card sx={summaryCardSx}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.4}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(46,125,50,0.12)",
                    color: "#1b5e20",
                    width: 46,
                    height: 46,
                  }}
                >
                  <HealthAndSafetyRoundedIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#1b5e20", fontWeight: 900 ,mr:1}}>
                    متبقي
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: 24, color: "#1b5e20" ,mr:2}}
                  >
                    {counts.active}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>


          <Card sx={summaryCardSx}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.4}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(245,124,0,0.12)",
                    color: "#8a4b00",
                    width: 46,
                    height: 46,
                  }}
                >
                  <WarningAmberRoundedIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#8a4b00", fontWeight: 900 ,mr:1}}>
                    قريب الانتهاء
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: 24, color: "#8a4b00",mr:2 }}
                  >
                    {counts.nearEnd}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>


          <Card sx={summaryCardSx}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.4}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(211,47,47,0.12)",
                    color: "#b71c1c",
                    width: 46,
                    height: 46,
                  }}
                >
                  <ErrorOutlineRoundedIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#b71c1c", fontWeight: 900,mr:1 }}>
                    منتهي
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: 24, color: "#b71c1c" ,mr:2}}
                  >
                    {counts.finished}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>


        {/* Main Content */}
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {/* Section Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "rgba(65,125,68,0.14)",
                    color: "#2f5f33",
                    border: "1px solid rgba(65,125,68,0.18)",
                  }}
                >
                  <MedicationLiquidRoundedIcon />
                </Avatar>


                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#1f1f1a" }}>
                    قائمة الأدوية
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#6a6a57",
                    }}
                  >
                    عرض جميع الأدوية المسجلة مع إمكانية البحث والفلترة
                  </Typography>
                </Box>
              </Box>
           
            </Box>


            <Divider sx={{ mb: 2.2 }} />


            {/* Search */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ابحث باسم الدواء أو النوع أو الحالة..."
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6a6a57" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchText ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchText("")}
                        sx={{
                          color: "#6a6a57",
                          "&:hover": {
                            backgroundColor: "rgba(106,106,87,0.08)",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>


            {/* Filters */}
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2.5 }}>
              {filters.map((f) => {
                const selected = selectedStatus === f.key;
                return (
                  <Chip
                    key={f.key}
                    label={f.label}
                    clickable
                    onClick={() => setSelectedStatus(f.key)}
                    sx={{
                      ...filterChipBase,
                      bgcolor: selected ? "#6a6a57" : "rgba(106,106,87,0.08)",
                      color: selected ? "#fff" : "#6a6a57",
                      border: selected
                        ? "1px solid #6a6a57"
                        : "1px solid rgba(106,106,87,0.18)",
                    }}
                  />
                );
              })}
            </Stack>


            {/* Results Count */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#6a6a57",
                  fontWeight: 900,
                }}
              >
                عدد النتائج: {filteredMedicines.length}
              </Typography>
            </Box>


            {/* Medicines */}
            {filteredMedicines.length === 0 ? (
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
                  <MedicalServicesRoundedIcon />
                </Avatar>
                <Typography sx={{ color: "#4a4a3d", fontWeight: 700, mb: 0.5 }}>
                  لا توجد أدوية
                </Typography>


              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {filteredMedicines.map((m, idx) => (
                  <Box key={`${m.medicineName}-${idx}`} sx={medicineCardSx}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.3,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#f4f5ef",
                          color: "#6a6a57",
                          flexShrink: 0,
                        }}
                      >
                        <MedicalServicesRoundedIcon fontSize="small" />
                      </Avatar>


                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ mb: 0.8 }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#1f1f1a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: { xs: "100%", sm: 220 },
                            }}
                            title={m.medicineName}
                          >
                            {m.medicineName ?? "-"}
                          </Typography>


                          <Chip
                            size="small"
                            label={`#${idx + 1}`}
                            sx={{
                              ...pillSx,
                              bgcolor: "rgba(106,106,87,0.08)",
                              color: "#6a6a57",
                              fontSize: 11,
                              
                            }}
                          />
                        </Stack>


                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          <Chip
                            size="small"
                            label={m.medicineTypeName ?? "-"}
                            sx={{
                              ...pillSx,
                              bgcolor: "rgba(106,106,87,0.10)",
                              color: "#4a4a3d",
                            }}
                          />
                        </Stack>
                      </Box>
                    </Box>


                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getStatusChip(m.statusTypeName)}
                    </Box>
                  </Box>
                ))}
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
