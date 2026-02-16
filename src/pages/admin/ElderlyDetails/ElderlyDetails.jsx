import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Avatar,
  Paper,
  Chip,
  Button,
  Divider,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";


import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HealingIcon from "@mui/icons-material/Healing";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import CloseIcon from "@mui/icons-material/Close";


const chipStatusSx = (isActive) => ({
  fontWeight: 900,
  color: "#fff",
  backgroundColor: isActive ? "#2E7D32" : "#C62828",
  px: 1.5,
});


const cardTitleSx = (borderColor) => ({
  fontWeight: 900,
  mb: 0.3,
  fontSize: 16,
  borderRight: `4px solid ${borderColor}`,
  pr: 1,
});


const infoRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  p: 1.5,
  borderRadius: 2.5,
  background: "#f7f7f3",
};


const iconCircleSx = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#6a6a57",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  flexShrink: 0,
};


const softBtnSx = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 900,
};


function FieldRow({ icon, label, value }) {
  return (
    <Box sx={infoRowSx}>
      <Box sx={iconCircleSx}>{icon}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, color: "#777", fontWeight: 800 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 14,
            color: "#222",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={value ?? ""}
        >
          {value ?? "-"}
        </Typography>
      </Box>
    </Box>
  );
}


export default function ElderlyDetails() {
  const { id } = useParams();
  const [elderly, setElderly] = useState(null);
  const [loading, setLoading] = useState(true);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  // ✅ Preview Dialog (للشخيص/الهوية/التأمين/الفحص الشامل)
  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");


  const openFilePreview = (url, title) => {
    if (!url) return;
    setPreviewUrl(url);
    setPreviewTitle(title || "عرض الملف");
    setOpenPreview(true);
  };


  const closeFilePreview = () => {
    setOpenPreview(false);
    setPreviewUrl("");
    setPreviewTitle("");
  };


  const fetchElderly = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get(`/Admin/Elderly/${id}`);
      setElderly(res?.data?.data || null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب تفاصيل المسن",
        severity: "error",
      });
      setElderly(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchElderly();
  }, [id]);


  const isActive = elderly?.status === "نشط";


  const basicFields = useMemo(() => {
    if (!elderly) return [];
    return [
      { label: "الرقم الوطني", value: elderly.nationalId, icon: <BadgeIcon /> },
      { label: "المدينة", value: elderly.city, icon: <LocationOnIcon /> },
      { label: "الشارع", value: elderly.street, icon: <LocationOnIcon /> },
      { label: "الديانة", value: elderly.doctrine, icon: <FavoriteIcon /> },
      {
        label: "الحالة الاجتماعية",
        value: elderly.maritalStatus,
        icon: <GroupsIcon />,
      },
      {
        label: "تاريخ الميلاد",
        value: elderly.bDate,
        icon: <CalendarMonthIcon />,
      },
      { label: "العمر", value: elderly.age, icon: <CalendarMonthIcon /> },
      {
        label: "الحالة الصحية",
        value: elderly.healthStatus,
        icon: <HealingIcon />,
      },
      {
        label: "سبب التسجيل",
        value: elderly.reasonRegister,
        icon: <ArticleOutlinedIcon />,
      },
    ];
  }, [elderly]);


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }


  if (!elderly) return null;


  const hasSponsors =
    Array.isArray(elderly.sponsors) && elderly.sponsors.length > 0;
  const hasDiseases =
    Array.isArray(elderly.diseases) && elderly.diseases.length > 0;
  const hasReports =
    Array.isArray(elderly.medicalReports) && elderly.medicalReports.length > 0;


  const isPdf = (url = "") => url.toLowerCase().includes(".pdf");


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 6 },
      }}
    >
     
      <Grid container spacing={4} alignItems="stretch">
        {/* ===== Left Column: Profile + IDs ===== */}
        <Grid size={{ xs: 12, lg: 5 }} sx={{ display: "flex" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header Card */}
            <Box sx={{ textAlign: "center", position: "relative" }}>
              <Box sx={{ display: "inline-block", position: "relative" }}>
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    bgcolor: "#bdbdbd", // رمادي مثل الصورة
                    color: "#fff", // الحرف أبيض
                    fontSize: 42,
                    fontWeight: 900,
                    border: "4px solid #fff", // إطار أبيض
                    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                  }}
                >
                  {(elderly?.elderlyName || "").trim().charAt(0) || "؟"}
                </Avatar>


                <Chip
                  label="نشط"
                  size="small"
                  sx={{
                    position: "absolute",
                    right: -6,
                    bottom: 10,
                    height: 22,
                    fontWeight: 900,
                    fontSize: 12,
                    bgcolor: "#2E7D32",
                    color: "#fff",
                    "& .MuiChip-label": { px: 1 },
                    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                  }}
                />
              </Box>


              <Typography sx={{ mt: 2, fontSize: 26, fontWeight: 1000 }}>
                {elderly.elderlyName}
              </Typography>
            </Box>


            {/* Basic Info */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={cardTitleSx("#6a6a57")}>
                البيانات الأساسية
              </Typography>


              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {basicFields.map((f, i) => (
                  <FieldRow
                    key={i}
                    icon={f.icon}
                    label={f.label}
                    value={f.value}
                  />
                ))}
              </Box>
            </Box>


            {/* Diseases */}
            <Box>
              <Typography sx={cardTitleSx("#417d44")}>الأمراض</Typography>


              {hasDiseases ? (
                <Grid container spacing={1.5}>
                  {elderly.diseases.map((d, idx) => (
                    <Grid key={`${d}-${idx}`} size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{
                          p: 1.6,
                          borderRadius: 3,
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f4f5ef 100%)",
                          border: "1px solid rgba(65,125,68,0.18)",
                          boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1.5,
                          transition:
                            "transform .18s ease, box-shadow .18s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 14px 28px rgba(0,0,0,0.10)",
                          },
                        }}
                      >
                        {/* left: icon + name */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2.5,
                              background:
                                "linear-gradient(135deg, #417d44, #6a6a57)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              flexShrink: 0,
                            }}
                          >
                            <HealingIcon />
                          </Box>


                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 1000,
                                color: "#1f1f1a",
                                fontSize: 15,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={d}
                            >
                              {d}
                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#6a6a57",
                                fontWeight: 900,
                              }}
                            >
                              مرض مسجّل
                            </Typography>
                          </Box>
                        </Box>


                        {/* right: number badge */}
                        <Chip
                          label={idx + 1}
                          sx={{
                            fontWeight: 1000,
                            bgcolor: "rgba(65,125,68,0.12)",
                            color: "#2f5f33",
                            border: "1px solid rgba(65,125,68,0.18)",
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(106,106,87,0.08)",
                    border: "1px dashed rgba(106,106,87,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <Box sx={{ ...iconCircleSx, background: "#417d44" }}>
                    <HealingIcon />
                  </Box>
                  <Typography sx={{ fontWeight: 1000, color: "#6a6a57" }}>
                    لا توجد أمراض مسجلة.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>


        {/* ===== Right Column: Stay + Sponsors + Reports ===== */}
        <Grid size={{ xs: 12, lg: 7 }} sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            {/* Current Stay */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#0d0d0d")}>
                الإقامة الحالية
              </Typography>


              {elderly.currentStay ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{ p: 2, borderRadius: 2.5, background: "#f7f7f3" }}
                    >
                      <Typography
                        sx={{ fontSize: 12, color: "#777", fontWeight: 800 }}
                      >
                        تاريخ البداية
                      </Typography>
                      <Typography sx={{ fontWeight: 1000 }}>
                        {elderly.currentStay.startDate ?? "-"}
                      </Typography>
                    </Box>
                  </Grid>


                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{ p: 2, borderRadius: 2.5, background: "#f7f7f3" }}
                    >
                      <Typography
                        sx={{ fontSize: 12, color: "#777", fontWeight: 800 }}
                      >
                        تاريخ النهاية
                      </Typography>
                      <Typography sx={{ fontWeight: 1000 }}>
                        {elderly.currentStay.endDate ?? "-"}
                      </Typography>
                    </Box>
                  </Grid>


                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        background: "#f7f7f3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.2 }}
                      >
                        <Box sx={iconCircleSx}>
                          <BedroomParentIcon />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#777",
                              fontWeight: 800,
                            }}
                          >
                            الغرفة
                          </Typography>
                          <Typography sx={{ fontWeight: 1000 }}>
                            رقم {elderly.currentStay.room?.roomNumber ?? "-"} —{" "}
                            {elderly.currentStay.room?.roomTypeName ?? "-"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ fontWeight: 900, color: "#777" }}>
                  لا يوجد إقامة حالية مسجلة.
                </Typography>
              )}
            </Paper>


            {/* Medical Reports */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#417d44")}>
                التقارير الطبية
              </Typography>


              {hasReports ? (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {elderly.medicalReports.map((r) => (
                    <Box
                      key={r.reportId}
                      sx={{ p: 2, borderRadius: 3, background: "#f7f7f3" }}
                    >
                      <Box
                        sx={{
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
                          }}
                        >
                          <Box sx={iconCircleSx}>
                            <LocalHospitalIcon />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 1000, fontSize: 15 }}>
                              تقرير الدكتور
                            </Typography>
                          </Box>
                        </Box>


                        {r.diagnosisUrl && (
                          <Button
                            onClick={() =>
                              openFilePreview(r.diagnosisUrl, "عرض التشخيص")
                            }
                            startIcon={<PhotoLibraryOutlinedIcon />}
                            variant="contained"
                            sx={{
                              ...softBtnSx,
                              gap: 1,
                              backgroundColor: "#FFF8E1",
                              color: "#8D6E63",
                              border: "1px solid rgba(141,110,99,0.35)",
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor: "#FFECB3",
                                boxShadow: "none",
                              },
                            }}
                          >
                            عرض التشخيص
                          </Button>
                        )}
                      </Box>


                      <Divider sx={{ my: 2 }} />


                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box
                            sx={{ p: 2, borderRadius: 2.5, background: "#fff" }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#777",
                                fontWeight: 900,
                              }}
                            >
                              الطبيب
                            </Typography>
                            <Typography sx={{ fontWeight: 1000 }}>
                              {r.doctor?.name ?? "-"}
                            </Typography>
                          </Box>
                        </Grid>


                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box
                            sx={{ p: 2, borderRadius: 2.5, background: "#fff" }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#777",
                                fontWeight: 900,
                              }}
                            >
                              مكان العمل
                            </Typography>
                            <Typography sx={{ fontWeight: 1000 }}>
                              {r.doctor?.workPlace ?? "-"}
                            </Typography>
                          </Box>
                        </Grid>


                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2.5,
                              background: "#fff",
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
                                gap: 1,
                              }}
                            >
                              <Box sx={iconCircleSx}>
                                <ArticleOutlinedIcon />
                              </Box>
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: "#777",
                                    fontWeight: 900,
                                  }}
                                >
                                  هاتف الطبيب
                                </Typography>
                                <Typography sx={{ fontWeight: 1000 }}>
                                  {r.doctor?.phone ?? "-"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontWeight: 900, color: "#777" }}>
                  لا يوجد تقارير طبية مسجلة.
                </Typography>
              )}
            </Paper>


            {/* Files */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#6a6a57")}>الملفات</Typography>


              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "#f7f7f3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={iconCircleSx}>
                        <BadgeIcon />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 1000 }}>هوية</Typography>
                        <Typography
                          sx={{ fontSize: 12, color: "#777", fontWeight: 900 }}
                        >
                          صورة الرقم الوطني
                        </Typography>
                      </Box>
                    </Box>


                    {elderly.nationalIdImage ? (
                      <Button
                        onClick={() =>
                          openFilePreview(
                            elderly.nationalIdImage,
                            "صورة الهوية",
                          )
                        }
                        size="small"
                        variant="contained"
                        startIcon={<PhotoLibraryOutlinedIcon />}
                        sx={{
                          ...softBtnSx,
                          gap: 1,
                          backgroundColor: "#FFF8E1",
                          color: "#8D6E63",
                          border: "1px solid rgba(141,110,99,0.35)",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#FFECB3",
                            boxShadow: "none",
                          },
                        }}
                      >
                        عرض
                      </Button>
                    ) : (
                      <Chip label="غير متوفر" sx={{ fontWeight: 900 }} />
                    )}
                  </Box>
                </Grid>


                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "#f7f7f3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={iconCircleSx}>
                        <FavoriteIcon />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 1000 }}>
                          تأمين صحي
                        </Typography>
                        <Typography
                          sx={{ fontSize: 12, color: "#777", fontWeight: 900 }}
                        >
                          صورة التأمين الصحي
                        </Typography>
                      </Box>
                    </Box>


                    {elderly.healthInsurance ? (
                      <Button
                        onClick={() =>
                          openFilePreview(
                            elderly.healthInsurance,
                            "صورة التأمين الصحي",
                          )
                        }
                        size="small"
                        variant="contained"
                        startIcon={<PhotoLibraryOutlinedIcon />}
                        sx={{
                          ...softBtnSx,
                          gap: 1,
                          backgroundColor: "#FFF8E1",
                          color: "#8D6E63",
                          border: "1px solid rgba(141,110,99,0.35)",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#FFECB3",
                            boxShadow: "none",
                          },
                        }}
                      >
                        عرض
                      </Button>
                    ) : (
                      <Chip label="غير متوفر" sx={{ fontWeight: 900 }} />
                    )}
                  </Box>
                </Grid>
              </Grid>


              {/* Comprehensive Exam */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{ fontSize: 12, color: "#777", fontWeight: 900, mb: 1 }}
                >
                  الفحص الشامل
                </Typography>


                {elderly.comprehensiveExamination ? (
                  <Button
                    onClick={() =>
                      openFilePreview(
                        elderly.comprehensiveExamination,
                        "الفحص الشامل",
                      )
                    }
                    variant="outlined"
                    startIcon={<ArticleOutlinedIcon />}
                    sx={{
                      ...softBtnSx,
                      gap: 1,
                      borderColor: "rgba(106,106,87,0.45)",
                      color: "#4a4a3d",
                      "&:hover": { borderColor: "rgba(106,106,87,0.8)" },
                    }}
                  >
                    فتح الصورة
                  </Button>
                ) : (
                  <Chip label="غير متوفر" sx={{ fontWeight: 900 }} />
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>


      {/* ✅ Dialog Preview (بنص الصفحة) */}
      {/* ✅ Dialog Preview (بنص الصفحة) */}
      <Dialog
        open={openPreview}
        onClose={closeFilePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
            border: "1px solid rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #ffffff 0%, #f6f6ef 100%)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1.6,
            px: 2.2,
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            color: "#4a4a3d",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6a6a57, #417d44)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
              }}
            >
              <PhotoLibraryOutlinedIcon fontSize="small" />
            </Box>


            <Typography sx={{ fontWeight: 1000, fontSize: 16 }}>
              {previewTitle}
            </Typography>
          </Box>


          <IconButton
            onClick={closeFilePreview}
            sx={{
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f2f2ea" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>


        <DialogContent
          sx={{
            p: 2.2,
            background: "transparent",
          }}
        >
          {isPdf(previewUrl) ? (
            <Box
              component="iframe"
              src={previewUrl}
              title="preview"
              sx={{
                width: "100%",
                height: "70vh", // ✅ أصغر من قبل
                border: 0,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="preview"
                sx={{
                  width: { xs: "100%", sm: "85%", md: "75%" },
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
                  p: 1.2,
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}



