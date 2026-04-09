
import { useEffect, useMemo, useState } from "react";
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HealingIcon from "@mui/icons-material/Healing";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";




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




export default function ElderlyDetailsSponsor() {
  const [elderly, setElderly] = useState(null);
  const [sponsorInfo, setSponsorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });




  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [openRoomImages, setOpenRoomImages] = useState(false);
  const [roomImages, setRoomImages] = useState([]);
  const [roomImageIndex, setRoomImageIndex] = useState(0);




  const openRoomImagesDialog = (images = []) => {
    const urls = (images || []).map((x) => x?.url).filter(Boolean);
    if (urls.length === 0) return;
    setRoomImages(urls);
    setRoomImageIndex(0);
    setOpenRoomImages(true);
  };




  const closeRoomImagesDialog = () => {
    setOpenRoomImages(false);
    setRoomImages([]);
    setRoomImageIndex(0);
  };




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
      const [detailsRes, mineRes] = await Promise.all([
        AxiosUserInstance.get("/Sponsor/Elderly/details"),
        AxiosUserInstance.get("/Sponsor/Elderly/mine"),
      ]);




      const detailsData = detailsRes?.data?.data || null;
      const mineData = mineRes?.data?.data || null;


      const sponsorData = Array.isArray(mineData)
        ? mineData[0]?.sponsor ?? null
        : mineData?.sponsor ?? null;




      setElderly(detailsData);
      setSponsorInfo(sponsorData);
      setSelectedReport(detailsData?.latestMedicalReport || null);
      setSelectedReportId(detailsData?.latestMedicalReport?.reportId ?? "");
    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب تفاصيل المسن",
        severity: "error",
      });
      setElderly(null);
      setSponsorInfo(null);
      setSelectedReport(null);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    fetchElderly();
  }, []);




  const handleReportChange = async (e) => {
    const reportId = e.target.value;
    setSelectedReportId(reportId);
    await fetchReportById(reportId);
  };




  const fetchReportById = async (reportId) => {
    if (!reportId) return;
    setLoadingReport(true);
    try {
      const res = await AxiosUserInstance.get(
        `/Sponsor/Elderly/medical-reports/${reportId}`
      );
      setSelectedReport(res?.data?.data || null);
      console.log(res);


    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب التقرير",
        severity: "error",
      });
    } finally {
      setLoadingReport(false);
    }
  };




  const isActive = elderly?.status === "نشط";




  const basicFields = useMemo(() => {
    if (!elderly) return [];
    return [
      { label: "رقم الهوية", value: elderly.nationalId, icon: <BadgeIcon /> },
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




  if (!elderly && !loading) {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <Typography sx={{ fontWeight: 700, color: "#777" }}>
            لا توجد بيانات لعرضها
          </Typography>
        </Box>




        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </>
    );
  }




  const roomImgs = elderly?.currentStay?.room?.images ?? [];
  const hasDiseases =
    Array.isArray(elderly.diseases) && elderly.diseases.length > 0;
  const hasReports =
    Array.isArray(elderly.medicalReportDates) &&
    elderly.medicalReportDates.length > 0;




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
        {/* ===== Left Column ===== */}
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
            <Box sx={{ textAlign: "center", position: "relative" }}>
              <Box sx={{ display: "inline-block", position: "relative" }}>
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    bgcolor: "#bdbdbd",
                    color: "#fff",
                    fontSize: 42,
                    fontWeight: 900,
                    border: "4px solid #fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                  }}
                >
                  {(elderly?.elderlyName || "").trim().charAt(0) || "؟"}
                </Avatar>




                <Chip
                  label={isActive ? "نشط" : "غير نشط"}
                  size="small"
                  sx={{
                    position: "absolute",
                    right: -6,
                    bottom: 10,
                    height: 22,
                    fontWeight: 900,
                    fontSize: 12,
                    ...chipStatusSx(isActive),
                    "& .MuiChip-label": { px: 1 },
                    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                  }}
                />
              </Box>




              <Typography sx={{ mt: 2, fontSize: 26, fontWeight: 1000 }}>
                {elderly.elderlyName}
              </Typography>
            </Box>




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




        {/* ===== Right Column ===== */}
        <Grid size={{ xs: 12, lg: 7 }} sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            {sponsorInfo ? (
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <Typography sx={cardTitleSx("#6a6a57")}>بيانات الكفيل</Typography>




                <Box sx={{ mt: 1.5 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          background: "#f7f7f3",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#777",
                            fontWeight: 800,
                          }}
                        >
                          اسم الكفيل
                        </Typography>
                        <Typography sx={{ fontWeight: 1000 }}>
                          {sponsorInfo.sponsorName ?? "-"}
                        </Typography>
                      </Box>
                    </Grid>




                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          background: "#f7f7f3",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#777",
                            fontWeight: 800,
                          }}
                        >
                          صلة القرابة
                        </Typography>
                        <Typography sx={{ fontWeight: 1000 }}>
                          {sponsorInfo.kinShip ?? "-"}
                        </Typography>
                      </Box>
                    </Grid>




                    <Grid size={{ xs: 12 , sm: 4 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          background: "#f7f7f3",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#777",
                            fontWeight: 800,
                          }}
                        >
                          الدرجة
                        </Typography>
                        <Typography sx={{ fontWeight: 1000 }}>
                          {sponsorInfo.degree ?? "-"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            ) : null}




            {isActive ? (
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <Typography sx={cardTitleSx("#0d0d0d")}>الإقامة</Typography>




                {elderly.currentStay ? (
                  <Box sx={{ mt: 1.5 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            background: "#f7f7f3",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#777",
                              fontWeight: 800,
                            }}
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
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            background: "#f7f7f3",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#777",
                              fontWeight: 800,
                            }}
                          >
                            تاريخ النهاية
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 1000,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {elderly.currentStay.endDate ?? "-"}
                          </Typography>
                        </Box>
                      </Grid>




                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            background: "#f7f7f3",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Box sx={iconCircleSx}>
                            <MeetingRoomIcon />
                          </Box>




                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#777",
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                              }}
                            >
                              الغرفة
                            </Typography>




                            <Typography
                              sx={{
                                fontWeight: 1000,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                              }}
                            >
                              رقم {elderly.currentStay.room?.roomNumber ?? "-"} —{" "}
                              {elderly.currentStay.room?.roomTypeName ??
                                elderly.currentStay.room?.roomType ??
                                "-"}
                              {roomImgs.length > 0 && (
                                <Button
                                  size="small"
                                  onClick={() => openRoomImagesDialog(roomImgs)}
                                  sx={{
                                    ...softBtnSx,
                                    ml: 0.5,
                                    px: 1.2,
                                    py: 0.3,
                                    minWidth: "auto",
                                    bgcolor: "#6a6a57",
                                    border: "1px solid rgba(0,0,0,0.12)",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "#11110b" },
                                  }}
                                >
                                  صور الغرفة
                                </Button>
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>




                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            background: "#f7f7f3",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Box sx={iconCircleSx}>
                            <SwapHorizIcon />
                          </Box>




                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#777",
                                fontWeight: 800,
                              }}
                            >
                              الحالة
                            </Typography>
                            <Typography sx={{ fontWeight: 1000 }}>
                              {elderly.currentStay.status ?? "-"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 2,
                      borderRadius: 3,
                      background: "rgba(106,106,87,0.08)",
                      border: "1px dashed rgba(106,106,87,0.35)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <Box sx={iconCircleSx}>
                      <MeetingRoomIcon />
                    </Box>
                    <Typography sx={{ fontWeight: 1000, color: "#6a6a57" }}>
                      لا يوجد إقامة حالياً.
                    </Typography>
                  </Box>
                )}
              </Paper>
            ) : null}




            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#417d44")}>
                معلومات الطبيب
              </Typography>




              {hasReports ? (
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel id="report-date-label">
                      تاريخ التقرير
                    </InputLabel>
                    <Select
                      labelId="report-date-label"
                      value={selectedReportId}
                      label="تاريخ التقرير"
                      onChange={handleReportChange}
                      sx={{
                        borderRadius: 3,
                        background: "#f7f7f3",
                        fontWeight: 900,
                      }}
                    >
                      {elderly.medicalReportDates.map((d) => (
                        <MenuItem key={d.reportId} value={d.reportId}>
                          {d.date}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>




                  {loadingReport ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress size={26} />
                    </Box>
                  ) : selectedReport ? (
                    <Box sx={{ p: 2, borderRadius: 3, background: "#f7f7f3" }}>
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
                              تقرير الطبي للمسنة
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#777",
                                fontWeight: 900,
                              }}
                            >
                              {selectedReport.date ?? "-"}
                            </Typography>
                          </Box>
                        </Box>




                        {selectedReport.diagnosisUrl && (
                          <Button
                            onClick={() =>
                              openFilePreview(
                                selectedReport.diagnosisUrl,
                                "عرض التشخيص"
                              )
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
                              {selectedReport.doctor?.name ?? "-"}
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
                              {selectedReport.doctor?.workPlace ?? "-"}
                            </Typography>
                          </Box>
                        </Grid>




                        <Grid size={{ xs: 12 }}>
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
                              هاتف الطبيب
                            </Typography>
                            <Typography sx={{ fontWeight: 1000 }}>
                              {selectedReport.doctor?.phone ?? "-"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <Typography sx={{ fontWeight: 900, color: "#777" }}>
                      لا يوجد تقرير محدد للعرض.
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography sx={{ fontWeight: 900, color: "#777", mt: 1 }}>
                  لا يوجد تقارير طبية مسجلة.
                </Typography>
              )}
            </Paper>




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
                          openFilePreview(elderly.nationalIdImage, "صورة الهوية")
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
                            "صورة التأمين الصحي"
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
            </Paper>
          </Box>
        </Grid>
      </Grid>




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




        <DialogContent sx={{ p: 2.2, background: "transparent" }}>
          {isPdf(previewUrl) ? (
            <Box
              component="iframe"
              src={previewUrl}
              title="preview"
              sx={{
                width: "100%",
                height: "70vh",
                border: 0,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
              }}
            />
          ) : (
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
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




      <Dialog
        open={openRoomImages}
        onClose={closeRoomImagesDialog}
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
              صور الغرفة
            </Typography>
          </Box>




          <IconButton
            onClick={closeRoomImagesDialog}
            sx={{
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f2f2ea" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>




        <DialogContent sx={{ p: 2.2, background: "transparent" }}>
          {roomImages.length > 0 ? (
            <Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={roomImages[roomImageIndex]}
                  alt="room"
                  sx={{
                    width: "100%",
                    maxHeight: "60vh",
                    objectFit: "contain",
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
                    p: 1.2,
                  }}
                />
              </Box>




              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  pb: 1,
                }}
              >
                {roomImages.map((u, idx) => {
                  const active = idx === roomImageIndex;
                  return (
                    <Box
                      key={`${u}-${idx}`}
                      component="img"
                      src={u}
                      alt={`thumb-${idx}`}
                      onClick={() => setRoomImageIndex(idx)}
                      sx={{
                        width: 90,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 2,
                        cursor: "pointer",
                        border: active
                          ? "2px solid #417d44"
                          : "1px solid rgba(0,0,0,0.12)",
                        opacity: active ? 1 : 0.85,
                        background: "#fff",
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </Box>




              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  disabled={roomImageIndex === 0}
                  onClick={() => setRoomImageIndex((i) => Math.max(0, i - 1))}
                  sx={{
                    ...softBtnSx,
                    borderColor: "rgba(106,106,87,0.45)",
                    color: "#4a4a3d",
                    "&:hover": { borderColor: "rgba(106,106,87,0.8)" },
                  }}
                >
                  السابق
                </Button>




                <Typography sx={{ fontWeight: 900, color: "#6a6a57" }}>
                  {roomImageIndex + 1} / {roomImages.length}
                </Typography>




                <Button
                  variant="outlined"
                  disabled={roomImageIndex === roomImages.length - 1}
                  onClick={() =>
                    setRoomImageIndex((i) =>
                      Math.min(roomImages.length - 1, i + 1)
                    )
                  }
                  sx={{
                    ...softBtnSx,
                    borderColor: "rgba(106,106,87,0.45)",
                    color: "#4a4a3d",
                    "&:hover": { borderColor: "rgba(106,106,87,0.8)" },
                  }}
                >
                  التالي
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ fontWeight: 900, color: "#777" }}>
              لا توجد صور للغرفة.
            </Typography>
          )}
        </DialogContent>
      </Dialog>




      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}


