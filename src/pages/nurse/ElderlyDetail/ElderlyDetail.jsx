import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Collapse,
} from "@mui/material";


import BadgeIcon from "@mui/icons-material/Badge";
import HealingIcon from "@mui/icons-material/Healing";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";


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


export default function ElderlyDetail() {
  const { id } = useParams();


  const [elderly, setElderly] = useState(null);
  const [loading, setLoading] = useState(true);


  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");


  const examInputRef = useRef(null);
  const [uploadingExam, setUploadingExam] = useState(false);
  const [deletingExam, setDeletingExam] = useState(false);


  const [editDiseases, setEditDiseases] = useState(false);
  const [diseaseInput, setDiseaseInput] = useState("");
  const [savingDiseases, setSavingDiseases] = useState(false);


  const [doctors, setDoctors] = useState([]);
  const [openAddReport, setOpenAddReport] = useState(false);
  const reportFileRef = useRef(null);


  const [reportDate, setReportDate] = useState("");
  const [reportFile, setReportFile] = useState(null);


  const [doctorMode, setDoctorMode] = useState("existing");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");


  const [newDoctor, setNewDoctor] = useState({
    name: "",
    workPlace: "",
    phone: "",
  });


  const [savingReport, setSavingReport] = useState(false);


  const isPdf = (url = "") => url.toLowerCase().includes(".pdf");


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


  // ===== API Calls =====


  const fetchElderly = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get(`/Nurse/Elderly/${id}`);
      // أنت بالكنترولر ترجع Elderly
      const data = res?.data?.Elderly || res?.data?.elderly || null;


      setElderly(data);


      setSelectedReport(data?.latestDiagnosis || null);
      setSelectedReportId(data?.latestDiagnosis?.reportId ?? "");
    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب تفاصيل المسن",
        severity: "error",
      });
      setElderly(null);
      setSelectedReport(null);
      setSelectedReportId("");
    } finally {
      setLoading(false);
    }
  };


  const fetchReportById = async (reportId) => {
    if (!reportId) return;
    setLoadingReport(true);
    try {
      const res = await AxiosUserInstance.get(
        `/Nurse/Elderly/medical-reports/${reportId}`,
      );
      // أنت ترجع Elderly
      setSelectedReport(res?.data?.Elderly || res?.data?.elderly || null);
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


  const handleReportChange = async (e) => {
    const reportId = Number(e.target.value);
    setSelectedReportId(reportId);
    await fetchReportById(reportId);
  };


  const fetchDoctors = async () => {
    try {
      const res = await AxiosUserInstance.get(`/Nurse/Elderly/Doctor`);
      setDoctors(res?.data?.doctors || []);
    } catch (e) {
      // silent
    }
  };


  // ===== Comprehensive Exam =====
  const handlePickExamFile = () => examInputRef.current?.click();


  const handleExamFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;


    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "الفحص الشامل يجب أن يكون صورة أو PDF.",
        severity: "error",
      });
      return;
    }


    const form = new FormData();
    form.append("File", file);


    setUploadingExam(true);
    try {
      await AxiosUserInstance.post(
        `/Nurse/Elderly/${id}/comprehensive-examination`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setSnackbar({
        open: true,
        message: "تم رفع الفحص الشامل بنجاح.",
        severity: "success",
      });
      await fetchElderly();
    } catch {
      setSnackbar({
        open: true,
        message: "فشل رفع الفحص الشامل.",
        severity: "error",
      });
    } finally {
      setUploadingExam(false);
    }
  };


  const handleDeleteExam = async () => {
    setDeletingExam(true);
    try {
      await AxiosUserInstance.delete(
        `/Nurse/Elderly/${id}/comprehensive-examination`,
      );
      setSnackbar({
        open: true,
        message: "تم حذف الفحص الشامل.",
        severity: "success",
      });
      await fetchElderly();
    } catch {
      setSnackbar({
        open: true,
        message: "فشل حذف الفحص الشامل.",
        severity: "error",
      });
    } finally {
      setDeletingExam(false);
    }
  };


  // ===== Diseases =====
  const handleRemoveDisease = async (disease) => {
    try {
      await AxiosUserInstance.post(`/Nurse/Elderly/${id}/diseases/remove`, {
        disease,
      });
      setSnackbar({
        open: true,
        message: "تم حذف المرض.",
        severity: "success",
      });
      await fetchElderly();
    } catch {
      setSnackbar({
        open: true,
        message: "فشل حذف المرض.",
        severity: "error",
      });
    }
  };


  const handleAddDiseases = async () => {
    // allow add multiple: split by comma/newline
    const diseases = diseaseInput
      .split(/[,;\n]+/)
      .map((x) => x.trim())
      .filter(Boolean);


    if (diseases.length === 0) {
      setSnackbar({
        open: true,
        message: "أدخل مرض واحد على الأقل.",
        severity: "error",
      });
      return;
    }


    setSavingDiseases(true);
    try {
      await AxiosUserInstance.post(`/Nurse/Elderly/${id}/diseases`, {
        diseases,
      });
      setDiseaseInput("");
      setSnackbar({
        open: true,
        message: "تمت إضافة المرض/الأمراض.",
        severity: "success",
      });
      await fetchElderly();
    } catch {
      setSnackbar({
        open: true,
        message: "فشل إضافة الأمراض.",
        severity: "error",
      });
    } finally {
      setSavingDiseases(false);
    }
  };


  // ===== Add Medical Report =====
  const openAddReportDialog = async () => {
    await fetchDoctors();
    setOpenAddReport(true);


    // defaults
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setReportDate(`${yyyy}-${mm}-${dd}`);


    setReportFile(null);
    setDoctorMode("existing");
    setSelectedDoctorId("");
    setNewDoctor({ name: "", workPlace: "", phone: "" });
  };


  const closeAddReportDialog = () => {
    setOpenAddReport(false);
  };


  const pickReportFile = () => reportFileRef.current?.click();


  const onReportFileSelected = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;


    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(f.type)) {
      setSnackbar({
        open: true,
        message: "ملف التشخيص يجب أن يكون صورة أو PDF.",
        severity: "error",
      });
      return;
    }
    setReportFile(f);
  };


  const submitAddReport = async () => {
    if (!reportDate) {
      setSnackbar({
        open: true,
        message: "التاريخ مطلوب.",
        severity: "error",
      });
      return;
    }
    if (!reportFile) {
      setSnackbar({
        open: true,
        message: "ملف التشخيص مطلوب.",
        severity: "error",
      });
      return;
    }


    // doctor validation
    if (doctorMode === "existing") {
      if (!selectedDoctorId) {
        setSnackbar({
          open: true,
          message: "اختر الطبيب من القائمة أو اختر إضافة طبيب جديد.",
          severity: "error",
        });
        return;
      }
    } else {
      if (!newDoctor.name || !newDoctor.workPlace || !newDoctor.phone) {
        setSnackbar({
          open: true,
          message: "أدخل بيانات الطبيب كاملة.",
          severity: "error",
        });
        return;
      }
    }


    const form = new FormData();
    // مهم: أسماء الحقول لازم تطابق DTO (AddMedicalReportRequest)
    form.append("Date", reportDate);
    form.append("DiagnosisFile", reportFile);


    if (doctorMode === "existing") {
      form.append("DoctorId", String(selectedDoctorId));
    } else {
      form.append("DoctorName", newDoctor.name);
      form.append("DoctorWorkPlace", newDoctor.workPlace);
      form.append("DoctorPhone", newDoctor.phone);
    }


    setSavingReport(true);
    try {
      await AxiosUserInstance.post(
        `/Nurse/Elderly/${id}/medical-reports`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );


      setSnackbar({
        open: true,
        message: "تم إضافة التشخيص بنجاح.",
        severity: "success",
      });


      closeAddReportDialog();
      await fetchElderly();
    } catch {
      setSnackbar({
        open: true,
        message: "فشل إضافة التشخيص.",
        severity: "error",
      });
    } finally {
      setSavingReport(false);
    }
  };


  // ===== Lifecycle =====
  useEffect(() => {
    fetchElderly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const basicFields = useMemo(() => {
    if (!elderly) return [];
    return [
      { label: "رقم الهوية", value: elderly.nationalId, icon: <BadgeIcon /> },
      {
        label: "رقم الغرفة",
        value: elderly.roomNumber ?? "-",
        icon: <MeetingRoomIcon />,
      },
      { label: "العمر", value: elderly.age, icon: <CalendarMonthIcon /> },
      {
        label: "الحالة الصحية",
        value: elderly.healthStatus,
        icon: <HealingIcon />,
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


  const hasDiseases =
    Array.isArray(elderly.diseases) && elderly.diseases.length > 0;


  const hasReports =
    Array.isArray(elderly.diagnosisDates) && elderly.diagnosisDates.length > 0;


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
            <Box sx={{ textAlign: "center" }}>
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
                  margin: "0 auto",
                }}
              >
                {(elderly?.name || "").trim().charAt(0) || "؟"}
              </Avatar>


              <Typography sx={{ mt: 2, fontSize: 26, fontWeight: 1000 }}>
                {elderly.name}
              </Typography>
            </Box>


            <Box sx={{ flexGrow: 1 }}>
  <Typography sx={cardTitleSx("#6a6a57")}>
    البيانات الأساسية
  </Typography>

  <Grid container spacing={1.2} sx={{ mt: 1 }}>
    {basicFields.map((f, i) => (
      <Grid size={{ xs: 12, sm: 6 }} key={i}>
        <FieldRow
          icon={f.icon}
          label={f.label}
          value={f.value}
        />
      </Grid>
    ))}
  </Grid>
</Box>


            {/* ===== Diseases ===== */}
            {/* ===== Diseases ===== */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography sx={cardTitleSx("#417d44")}>الأمراض</Typography>


                <Button
                  onClick={() => setEditDiseases((v) => !v)}
                  startIcon={<EditOutlinedIcon />}
                  variant="outlined"
                  sx={{
                    ...softBtnSx,
                    borderColor: "rgba(65,125,68,0.35)",
                    color: "#2f5f33",
                    gap: 1.25,
                    "&:hover": { borderColor: "rgba(65,125,68,0.8)" },
                  }}
                >
                  {editDiseases ? "إغلاق" : "تعديل"}
                </Button>
              </Box>


              <Collapse in={editDiseases} unmountOnExit>
                <Box sx={{ mt: 1.5 }}>
                  <TextField
                    fullWidth
                    value={diseaseInput}
                    onChange={(e) => setDiseaseInput(e.target.value)}
                    label="إضافة مرض (يمكن أكثر من واحد)"
                    placeholder="مثال: ضغط, سكري, كوليسترول"
                    size="small"
                  />


                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button
                      onClick={handleAddDiseases}
                      disabled={savingDiseases}
                      startIcon={<AddIcon />}
                      variant="contained"
                      sx={{
                        ...softBtnSx,
                        backgroundColor: "#417d44",
                        "&:hover": { backgroundColor: "#356836" },
                      }}
                    >
                      {savingDiseases ? "جاري الإضافة..." : "إضافة"}
                    </Button>
                  </Box>
                </Box>
              </Collapse>


              {hasDiseases ? (
                <Grid container spacing={1.5} sx={{ mt: 1 }}>
                  {elderly.diseases.map((d, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={`${d}-${idx}`}>
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
                          position: "relative",
                          overflow: "hidden",


                          pl: editDiseases ? 6 : 1.6,
                        }}
                      >
                        {editDiseases && (
                          <IconButton
                            onClick={() => handleRemoveDisease(d)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 1,
                              zIndex: 2,
                              width: 34,
                              height: 34,
                              borderRadius: 900,
                              border: "1px solid rgba(198,40,40,0.35)",
                              bgcolor: "#fff",
                              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
                              "&:hover": { bgcolor: "rgba(198,40,40,0.06)" },
                            }}
                          >
                            <DeleteOutlineIcon
                              sx={{ color: "#C62828", fontSize: 20 }}
                            />
                          </IconButton>
                        )}


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
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ fontWeight: 900, color: "#777", mt: 1 }}>
                  لا توجد أمراض مسجلة.
                </Typography>
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
            {/* ===== Diagnosis / Doctor Info ===== */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
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
                <Typography sx={cardTitleSx("#417d44")}>
                  معلومات الطبيب
                </Typography>


                <Button
                  onClick={openAddReportDialog}
                  startIcon={<UploadFileOutlinedIcon />}
                  variant="contained"
                  sx={{
                    ...softBtnSx,
                    backgroundColor: "#417d44",
                    "&:hover": { backgroundColor: "#356836" },
                    "& .MuiButton-startIcon": {
                      marginInlineEnd: "10px",
                      marginInlineStart: 0,
                    },
                  }}
                >
                  إضافة تشخيص
                </Button>
              </Box>


              {hasReports ? (
                <Box
                  sx={{
                    mt: 3,
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
                      {elderly.diagnosisDates.map((d) => (
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
                              تقرير طبي للمسنة
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
                                "عرض التشخيص",
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


            {/* ===== Files ===== */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#6a6a57")}>الملفات</Typography>


              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{ fontSize: 12, color: "#777", fontWeight: 900, mb: 1 }}
                >
                  الفحص الشامل
                </Typography>


                <input
                  ref={examInputRef}
                  type="file"
                  hidden
                  accept="image/*,application/pdf"
                  onChange={handleExamFileSelected}
                />


                {elderly.comprehensiveExamination ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
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
                      فتح الملف
                    </Button>


                    {!!elderly.comprehensiveExamination && (
                      <Button
                        onClick={handleDeleteExam}
                        disabled={deletingExam}
                        variant="outlined"
                        startIcon={<DeleteOutlineIcon />}
                        sx={{
                          ...softBtnSx,
                          gap: 1,
                          borderColor: "rgba(198,40,40,0.35)",
                          color: "#C62828",
                          "&:hover": { borderColor: "rgba(198,40,40,0.8)" },
                        }}
                      >
                        {deletingExam ? "جاري الحذف..." : "حذف"}
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip label="غير متوفر" sx={{ fontWeight: 900 }} />
                    <Button
                      onClick={handlePickExamFile}
                      disabled={uploadingExam}
                      variant="contained"
                      startIcon={<PhotoLibraryOutlinedIcon />}
                      sx={{
                        ...softBtnSx,
                        gap: 1,
                        backgroundColor: "#417d44",
                        "&:hover": { backgroundColor: "#356836" },
                      }}
                    >
                      {uploadingExam ? "جاري الرفع..." : "إضافة"}
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>


      {/* ===== Preview Dialog ===== */}
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


      {/* ===== Add Medical Report Dialog ===== */}
      <Dialog
        open={openAddReport}
        onClose={closeAddReportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 1000 }}>إضافة تشخيص جديد</DialogTitle>


        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="التاريخ"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />


            <input
              ref={reportFileRef}
              type="file"
              hidden
              accept="image/*,application/pdf"
              onChange={onReportFileSelected}
            />


            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={pickReportFile}
                variant="outlined"
                startIcon={<UploadFileOutlinedIcon />}
                sx={{ ...softBtnSx, gap: 1.5 }}
              >
                اختيار ملف التشخيص
              </Button>
              <Chip
                label={reportFile ? reportFile.name : "لم يتم اختيار ملف"}
                sx={{ fontWeight: 900 }}
              />
            </Box>


            <Divider />


            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                onClick={() => setDoctorMode("existing")}
                variant={doctorMode === "existing" ? "contained" : "outlined"}
                sx={{
                  ...softBtnSx,
                  backgroundColor:
                    doctorMode === "existing" ? "#417d44" : undefined,
                  "&:hover":
                    doctorMode === "existing"
                      ? { backgroundColor: "#356836" }
                      : undefined,
                }}
              >
                اختيار طبيب
              </Button>


              <Button
                onClick={() => setDoctorMode("new")}
                startIcon={<PersonAddAltOutlinedIcon />}
                variant={doctorMode === "new" ? "contained" : "outlined"}
                sx={{
                  ...softBtnSx,
                  gap: 1.5,
                  backgroundColor: doctorMode === "new" ? "#417d44" : undefined,
                  "&:hover":
                    doctorMode === "new"
                      ? { backgroundColor: "#356836" }
                      : undefined,
                }}
              >
                إضافة طبيب جديد
              </Button>
            </Box>


            {doctorMode === "existing" ? (
              <FormControl fullWidth size="small">
                <InputLabel id="doctor-label">الطبيب</InputLabel>
                <Select
                  labelId="doctor-label"
                  label="الطبيب"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  sx={{
                    borderRadius: 3,
                    background: "#f7f7f3",
                    fontWeight: 900,
                  }}
                >
                  {doctors.map((d) => (
                    <MenuItem key={d.doctorId} value={d.doctorId}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Stack spacing={1.2}>
                <TextField
                  label="اسم الطبيب"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor((p) => ({ ...p, name: e.target.value }))
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="مكان العمل"
                  value={newDoctor.workPlace}
                  onChange={(e) =>
                    setNewDoctor((p) => ({ ...p, workPlace: e.target.value }))
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="رقم الهاتف"
                  value={newDoctor.phone}
                  onChange={(e) =>
                    setNewDoctor((p) => ({ ...p, phone: e.target.value }))
                  }
                  size="small"
                  fullWidth
                />
              </Stack>
            )}
          </Stack>
        </DialogContent>


        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeAddReportDialog} sx={softBtnSx}>
            إلغاء
          </Button>
          <Button
            onClick={submitAddReport}
            variant="contained"
            disabled={savingReport}
            startIcon={<SaveOutlinedIcon />}
            sx={{
              ...softBtnSx,
              backgroundColor: "#417d44",
              gap: 1.5,
              "&:hover": { backgroundColor: "#356836" },
            }}
          >
            {savingReport ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>


      {/* ===== Snackbar ===== */}
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



