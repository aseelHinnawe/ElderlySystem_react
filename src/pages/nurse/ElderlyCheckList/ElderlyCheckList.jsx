import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScienceIcon from "@mui/icons-material/Science";
import InfoIcon from "@mui/icons-material/Info";


import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";


const deleteDialogSx = {
  "& .MuiDialog-paper": {
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#fff",
    minHeight: 260,
  },
};


const deleteDialogTitleSx = {
  fontWeight: 900,
  color: "#C62828",
  textAlign: "right",
  fontSize: { xs: 18, sm: 20 },
  px: 4,
  pt: 3,
  pb: 2.5,
};


const deleteDialogContentSx = {
  textAlign: "center",
  py: 4,
  px: 4,
};


const deleteDialogMainTextSx = {
  fontWeight: 900,
  textAlign: "right",
  fontSize: { xs: 15, sm: 18 },
  color: "#2f2f27",
  mb: 1.5,
};


const deleteDialogSubTextSx = {
  fontWeight: 800,
  textAlign: "right",
  fontSize: { xs: 15, sm: 18 },
  color: "#757575",
};


const deleteDialogActionsSx = {
  p: 3,
  gap: 2,
  justifyContent: "center",
};


const deleteDialogCancelBtnSx = {
  borderRadius: "16px",
  fontWeight: 900,
  textTransform: "none",
  minWidth: 130,
  height: 46,
  fontSize: 14,
  color: "#7B755F",
  borderColor: "#BDB8A8",
  backgroundColor: "#fff",
  boxShadow: "none",
  "&:hover": {
    borderColor: "#A9A38F",
    backgroundColor: "#fff",
    boxShadow: "none",
  },
};


const deleteDialogConfirmBtnSx = {
  borderRadius: "16px",
  fontWeight: 900,
  textTransform: "none",
  minWidth: 130,
  height: 46,
  fontSize: 16,
  background: "#F8DDE0",
  color: "#C62828",
  border: "1px solid #F0AEB5",
  boxShadow: "none",
  "&:hover": {
    background: "#F5D2D7",
    boxShadow: "none",
  },
};


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const pageWrapperSx = {
  p: "16px",
  minHeight: "100vh",
  background: "#f0f0ea",
};


const checklistCardSx = {
  mb: "16px",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(8px)",
};


const titleSx = {
  fontWeight: 900,
  fontSize: {
    xs: 15,
    sm: 17,
    md: 18,
  },
  color: "#2f2f27",
};


const nurseDetailsCardSx = {
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid rgba(106,106,87,0.18)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(245,245,238,0.95) 100%)",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};


const nurseDetailsHeaderSx = {
  px: 2.5,
  py: 1.8,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 1.5,
  background: "linear-gradient(135deg, #6a6a57, #8b8b6d)",
  color: "#fff",
};


const miniInfoCardSx = {
  p: 2,
  borderRadius: 3,
  background: "#ffffff",
  border: "1px solid rgba(106,106,87,0.12)",
  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  minHeight: 95,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};


const actionBtnSx = {
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 800,
  px: 2.2,
  py: 1,
};
const detailsButtonStyles = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
};


const selectPaperStyle = {
  p: { xs: 2.5, sm: 3 },
  mb: 3,
  borderRadius: "20px",
  background: "#f0f0ea",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.5)",
  },
};


const detailBoxSx = {
  p: 2,
  borderRadius: 3,
  backgroundColor: "#F8F8F4",
  border: "1px solid rgba(106,106,87,0.12)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  minHeight: 85,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};


const getValue = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  return value;
};


const formatTimeWithPeriod = (time) => {
  if (!time) return "-";


  const [hoursStr, minutes] = time.split(":");
  const hours = parseInt(hoursStr, 10);


  if (isNaN(hours) || minutes === undefined) return time;


  const period = hours < 12 ? "صباحًا" : "مساءً";
  const normalHour = hours % 12 === 0 ? 12 : hours % 12;


  return `${normalHour}:${minutes} ${period}`;
};


export default function ElderlyCheckList() {
  const [elderlies, setElderlies] = useState([]);
  const [selectedElderlyId, setSelectedElderlyId] = useState("");
  const [checklists, setChecklists] = useState([]);


  const [openRowId, setOpenRowId] = useState(null);
  const [detailsById, setDetailsById] = useState({});
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);


  const [loadingElderlies, setLoadingElderlies] = useState(true);
  const [loadingChecklists, setLoadingChecklists] = useState(false);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [editForm, setEditForm] = useState({
    checkListId: null,
    notes: "",
    temperature: "",
    pulse: "",
    bloodSugar: "",
    bloodPressure: "",
    intake: "",
    output: "",
  });
  useEffect(() => {
    const fetchElderlies = async () => {
      setLoadingElderlies(true);
      try {
        const res = await AxiosUserInstance.get("/Nurse/Elderly");
        setElderlies(res?.data?.elderlies || []);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "تعذر تحميل قائمة المسنين",
          severity: "error",
        });
      } finally {
        setLoadingElderlies(false);
      }
    };


    fetchElderlies();
  }, []);


  useEffect(() => {
    if (!selectedElderlyId) {
      setChecklists([]);
      setOpenRowId(null);
      setDetailsById({});
      return;
    }


    const fetchChecklists = async () => {
      setLoadingChecklists(true);
      try {
        const res = await AxiosUserInstance.get(
          `/Nurse/ElderlyDailyCheck/elderly/${selectedElderlyId}`,
        );
        setChecklists(res?.data?.data || []);
      } catch (err) {
        setChecklists([]);
        setSnackbar({
          open: true,
          message: "تعذر تحميل الفحوصات",
          severity: "error",
        });
      } finally {
        setLoadingChecklists(false);
      }
    };


    fetchChecklists();
  }, [selectedElderlyId]);
  const handleOpenEdit = (item) => {
    setEditForm({
      checkListId: item.checkListId,
      notes: item.notes ?? "",
      temperature: item.temperature ?? "",
      pulse: item.pulse ?? "",
      bloodSugar: item.bloodSugar ?? "",
      bloodPressure: item.bloodPressure ?? "",
      intake: item.intake ?? "",
      output: item.output ?? "",
    });
    setEditOpen(true);
  };
  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleToggleDetails = async (checkListId) => {
    if (openRowId === checkListId) {
      setOpenRowId(null);
      return;
    }


    setOpenRowId(checkListId);


    if (detailsById[checkListId]) return;


    try {
      setDetailsLoadingId(checkListId);


      const res = await AxiosUserInstance.get(
        `/Nurse/ElderlyDailyCheck/${checkListId}`,
      );


      setDetailsById((prev) => ({
        ...prev,
        [checkListId]: res?.data?.data || null,
      }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: "تعذر تحميل تفاصيل الفحص",
        severity: "error",
      });
    } finally {
      setDetailsLoadingId(null);
    }
  };
  const handleUpdate = async () => {
    if (!editForm.checkListId) return;


    try {
      setEditLoading(true);


      const payload = {
        notes: editForm.notes,
        temperature: editForm.temperature,
        pulse: editForm.pulse,
        bloodSugar: editForm.bloodSugar,
        bloodPressure: editForm.bloodPressure,
        intake: editForm.intake,
        output: editForm.output,
      };


      await AxiosUserInstance.put(
        `/Nurse/ElderlyDailyCheck/${editForm.checkListId}`,
        payload,
      );


      setChecklists((prev) =>
        prev.map((item) =>
          item.checkListId === editForm.checkListId
            ? {
                ...item,
                ...payload,
              }
            : item,
        ),
      );


      setDetailsById((prev) => ({
        ...prev,
        [editForm.checkListId]: prev[editForm.checkListId]
          ? {
              ...prev[editForm.checkListId],
              ...payload,
            }
          : prev[editForm.checkListId],
      }));


      setSnackbar({
        open: true,
        message: "تم تعديل الفحص بنجاح",
        severity: "success",
      });


      setEditOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "تعذر تعديل الفحص",
        severity: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedDeleteId) return;


    try {
      setDeleteLoadingId(selectedDeleteId);


      await AxiosUserInstance.delete(
        `/Nurse/ElderlyDailyCheck/${selectedDeleteId}`,
      );


      setChecklists((prev) =>
        prev.filter((item) => item.checkListId !== selectedDeleteId),
      );


      setDetailsById((prev) => {
        const updated = { ...prev };
        delete updated[selectedDeleteId];
        return updated;
      });


      if (openRowId === selectedDeleteId) {
        setOpenRowId(null);
      }


      setSnackbar({
        open: true,
        message: "تم حذف الفحص بنجاح",
        severity: "success",
      });


      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "تعذر حذف الفحص",
        severity: "error",
      });
    } finally {
      setDeleteLoadingId(null);
    }
  };
  const openDeleteDialog = (checkListId) => {
    setSelectedDeleteId(checkListId);
    setDeleteDialogOpen(true);
  };
  return (
    <Box sx={pageWrapperSx}>
      <Card sx={headerCardStyles}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 20, lg: 28 } }}
              >
                الفحوصات اليومية للمسنين
              </Typography>


              <AssignmentOutlinedIcon
                sx={{ fontSize: { xs: 26, lg: 34 }, color: "#fff" }}
              />
            </Box>


            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 13, md: 16 },
              }}
            >
              اختر اسم المسن لعرض جميع الفحوصات اليومية الخاصة به
            </Typography>
          </Box>


          <Box
            sx={{
              width: { xs: 52, lg: 70 },
              height: { xs: 52, lg: 70 },
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FactCheckOutlinedIcon
              sx={{ fontSize: { xs: 28, lg: 40 }, color: "#fff" }}
            />
          </Box>
        </CardContent>
      </Card>


      <Paper elevation={0} sx={selectPaperStyle}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, mb: 2, textAlign: "center" }}
        >
          اختيار المسن
        </Typography>


        <TextField
          select
          fullWidth
          label="اسم المسن"
          value={selectedElderlyId}
          onChange={(e) => setSelectedElderlyId(e.target.value)}
          sx={{
            ...inputStyle,
            "& .MuiSelect-select": {
              direction: "rtl",
              textAlign: "right",
            },
          }}
        >
          <MenuItem value="">
            {loadingElderlies ? "جارٍ تحميل المسنين..." : "اختر المسن"}
          </MenuItem>


          {elderlies.map((elderly) => (
            <MenuItem key={elderly.elderlyId} value={elderly.elderlyId}>
              {elderly.name}
            </MenuItem>
          ))}
        </TextField>
      </Paper>


      {!selectedElderlyId ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "20px",
            background: "#fff",
            border: "1px solid rgba(106, 106, 87, 0.12)",
          }}
        >
          <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
            يرجى اختيار المسن أولاً لعرض الفحوصات
          </Typography>
        </Paper>
      ) : loadingChecklists ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* Desktop Table */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Card
              component={Paper}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 1100, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
  📅 التاريخ
</TableCell>

<TableCell align="center" sx={{ fontWeight: "bold" }}>
  🌡️ درجة الحرارة
</TableCell>

<TableCell align="center" sx={{ fontWeight: "bold" }}>
  🫀 النبض
</TableCell>

<TableCell align="center" sx={{ fontWeight: "bold" }}>
  🩸 سكر الدم
</TableCell>

<TableCell align="center" sx={{ fontWeight: "bold" }}>
  📈 ضغط الدم
</TableCell>

<TableCell align="center" sx={{ fontWeight: "bold" }}>
  💧 إدخال
</TableCell>

<TableCell align="center" sx={{ fontWeight: "bold" }}>
  🧪 إخراج
</TableCell>

<TableCell align="center" sx={{ fontWeight: "bold" }}>
  ℹ️ التفاصيل
</TableCell>

</TableRow>
                    </TableHead>


                    <TableBody>
                      {checklists.length > 0 ? (
                        checklists.map((item, idx) => {
                          const details = detailsById[item.checkListId];
                          const isOpen = openRowId === item.checkListId;
                          const isLoadingDetails =
                            detailsLoadingId === item.checkListId;


                          return (
                            <>
                              <TableRow key={item.checkListId ?? idx}>
                                <TableCell align="center">
                                  {item.date || "-"}
                                </TableCell>
                                <TableCell align="center">
                                  {item.temperature || "-"}
                                </TableCell>
                                <TableCell align="center">
                                  {item.pulse || "-"}
                                </TableCell>
                                <TableCell align="center">
                                  {item.bloodSugar || "-"}
                                </TableCell>
                                <TableCell align="center">
                                  {item.bloodPressure || "-"}
                                </TableCell>
                                <TableCell align="center">
                                  {item.intake || "-"}
                                </TableCell>
                                <TableCell align="center">
                                  {item.output || "-"}
                                </TableCell>
                                <TableCell align="center">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() =>
                                      handleToggleDetails(item.checkListId)
                                    }
                                    endIcon={
                                      isOpen ? (
                                        <KeyboardArrowUpOutlinedIcon />
                                      ) : (
                                        <KeyboardArrowDownOutlinedIcon />
                                      )
                                    }
                                    sx={{
                                      ...detailsButtonStyles,
                                      gap: 1,
                                      fontSize: 13,
                                      backgroundColor: "#FFF8E1",
                                      color: "#8D6E63",
                                      border: "1px solid rgba(141,110,99,0.35)",
                                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                                    }}
                                  >
                                    {isOpen ? "إخفاء التفاصيل" : "تفاصيل الفحص"}
                                  </Button>
                                </TableCell>
                              </TableRow>


                              <TableRow>
                                <TableCell
                                  colSpan={8}
                                  sx={{
                                    p: 0,
                                    borderBottom: 0,
                                    backgroundColor: "#fcfcfa",
                                  }}
                                >
                                  <Collapse
                                    in={isOpen}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <Box sx={{ p: 3 }}>
                                      {isLoadingDetails ? (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            py: 2,
                                          }}
                                        >
                                          <CircularProgress size={28} />
                                        </Box>
                                      ) : details ? (
                                        <Box sx={nurseDetailsCardSx}>
                                          <Box sx={nurseDetailsHeaderSx}>
                                            <Box>
                                              <Typography
                                                sx={{
                                                  fontWeight: 900,
                                                  fontSize: 18,
                                                  textAlign: "right",
                                                }}
                                              >
                                                تفاصيل الفحص
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontSize: 13,
                                                  opacity: 0.9,
                                                  mt: 0.5,
                                                  textAlign: "right",
                                                }}
                                              >
                                                معلومات الممرضة والملاحظات
                                                الخاصة بالفحص
                                              </Typography>
                                            </Box>


                                            <Box
                                              sx={{
                                                px: 1.5,
                                                py: 0.6,
                                                borderRadius: 999,
                                                backgroundColor:
                                                  "rgba(255,255,255,0.18)",
                                                border:
                                                  "1px solid rgba(255,255,255,0.25)",
                                                fontSize: 12,
                                                fontWeight: 700,
                                              }}
                                            >
                                              رقم الفحص {item.checkListId}
                                            </Box>
                                          </Box>


                                          <Box sx={{ p: 2.5 }}>
                                            <Box
                                              sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                  xs: "1fr",
                                                  sm: "repeat(2, minmax(0, 1fr))",
                                                  md: "repeat(3, minmax(0, 1fr))",
                                                },
                                                gap: 2,
                                                mb: 2,
                                              }}
                                            >
                                              <Box sx={miniInfoCardSx}>
                                                <PersonOutlineOutlinedIcon
                                                  sx={{
                                                    fontSize: 24,
                                                    color: "#6a6a57",
                                                    mb: 1,
                                                  }}
                                                />
                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: "text.secondary",
                                                    mb: 0.5,
                                                  }}
                                                >
                                                  اسم الممرضة
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    fontWeight: 800,
                                                    fontSize: 15,
                                                    color: "#2f2f27",
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word",
                                                  }}
                                                >
                                                  {getValue(details.nurseName)}
                                                </Typography>
                                              </Box>


                                              <Box sx={miniInfoCardSx}>
                                                <WorkOutlineOutlinedIcon
                                                  sx={{
                                                    fontSize: 24,
                                                    color: "#6a6a57",
                                                    mb: 1,
                                                  }}
                                                />
                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: "text.secondary",
                                                    mb: 0.5,
                                                  }}
                                                >
                                                  الشفت
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    fontWeight: 800,
                                                    fontSize: 15,
                                                    color: "#2f2f27",
                                                  }}
                                                >
                                                  {getValue(details.shift)}
                                                </Typography>
                                              </Box>


                                              <Box sx={miniInfoCardSx}>
                                                <AccessTimeOutlinedIcon
                                                  sx={{
                                                    fontSize: 24,
                                                    color: "#6a6a57",
                                                    mb: 1,
                                                  }}
                                                />
                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: "text.secondary",
                                                    mb: 0.5,
                                                  }}
                                                >
                                                  الوقت
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    fontWeight: 800,
                                                    fontSize: 15,
                                                    color: "#2f2f27",
                                                  }}
                                                >
                                                  {formatTimeWithPeriod(
                                                    details.time,
                                                  )}
                                                </Typography>
                                              </Box>
                                            </Box>


                                            <Box
                                              sx={{
                                                p: 2.2,
                                                borderRadius: 3,
                                                background:
                                                  "rgba(255,255,255,0.85)",
                                                border:
                                                  "1px solid rgba(106,106,87,0.12)",
                                                boxShadow:
                                                  "0 4px 14px rgba(0,0,0,0.04)",
                                                mb: 2,
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                  mb: 1,
                                                }}
                                              >
                                                <NotesOutlinedIcon
                                                  sx={{
                                                    color: "#6a6a57",
                                                    fontSize: 22,
                                                  }}
                                                />
                                                <Typography
                                                  sx={{
                                                    fontSize: 14,
                                                    fontWeight: 800,
                                                    color: "#6a6a57",
                                                  }}
                                                >
                                                  الملاحظات
                                                </Typography>
                                              </Box>


                                              <Typography
                                                sx={{
                                                  fontWeight: 700,
                                                  fontSize: 15,
                                                  color: "#2f2f27",
                                                  whiteSpace: "normal",
                                                  wordBreak: "break-word",
                                                  lineHeight: 1.9,
                                                  textAlign: "right",
                                                }}
                                              >
                                                {getValue(details.notes)}
                                              </Typography>
                                            </Box>


                                            <Box
                                              sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: 1.2,
                                                flexWrap: "wrap",
                                              }}
                                            >
                                              <Button
                                                variant="outlined"
                                                startIcon={<EditOutlinedIcon />}
                                                onClick={() =>
                                                  handleOpenEdit(item)
                                                }
                                                sx={{
                                                  ...actionBtnSx,
                                                  gap: 1,
                                                  color: "#6a6a57",
                                                  borderColor:
                                                    "rgba(106,106,87,0.35)",
                                                  backgroundColor: "#fff",
                                                  "&:hover": {
                                                    borderColor: "#6a6a57",
                                                    backgroundColor:
                                                      "rgba(106,106,87,0.06)",
                                                  },
                                                }}
                                              >
                                                تعديل
                                              </Button>


                                              <Button
                                                variant="contained"
                                                startIcon={
                                                  <DeleteOutlineOutlinedIcon />
                                                }
                                                onClick={() =>
                                                  openDeleteDialog(
                                                    item.checkListId,
                                                  )
                                                }
                                                disabled={
                                                  deleteLoadingId ===
                                                  item.checkListId
                                                }
                                                sx={{
                                                  ...actionBtnSx,
                                                  gap: 1,
                                                  backgroundColor: "#c62828",
                                                  "&:hover": {
                                                    backgroundColor: "#b71c1c",
                                                  },
                                                }}
                                              >
                                                حذف
                                              </Button>
                                            </Box>
                                          </Box>
                                        </Box>
                                      ) : (
                                        <Typography align="center">
                                          لا توجد تفاصيل
                                        </Typography>
                                      )}
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            لا توجد بيانات
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>


          {/* Mobile Cards */}
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            {checklists.length > 0 ? (
              checklists.map((item, idx) => {
                const details = detailsById[item.checkListId];
                const isOpen = openRowId === item.checkListId;
                const isLoadingDetails = detailsLoadingId === item.checkListId;


                return (
                  <Card key={item.checkListId ?? idx} sx={checklistCardSx}>
                    <CardContent sx={{ p: 2.2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1.5,
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            ...titleSx,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <TableRowsOutlinedIcon
                            sx={{ color: "#6a6a57", fontSize: 20 }}
                          />
                          فحص رقم #{item.checkListId}
                        </Typography>


                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 3,
                            backgroundColor: "#F0F0EA",
                            border: "1px solid rgba(106,106,87,0.25)",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#6a6a57",
                            textAlign: "center",
                          }}
                        >
                          {item.date || "-"}
                        </Box>
                      </Box>


                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 1.2,
                          mb: 2,
                        }}
                      >
                        <Box sx={detailBoxSx}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.5,
                            }}
                          >
                            درجة الحرارة
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {item.temperature || "-"}
                          </Typography>
                        </Box>


                        <Box sx={detailBoxSx}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.5,
                            }}
                          >
                            النبض
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {item.pulse || "-"}
                          </Typography>
                        </Box>


                        <Box sx={detailBoxSx}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.5,
                            }}
                          >
                            سكر الدم
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {item.bloodSugar || "-"}
                          </Typography>
                        </Box>


                        <Box sx={detailBoxSx}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.5,
                            }}
                          >
                            ضغط الدم
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {item.bloodPressure || "-"}
                          </Typography>
                        </Box>


                        <Box sx={detailBoxSx}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.5,
                            }}
                          >
                            إدخال
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {item.intake || "-"}
                          </Typography>
                        </Box>


                        <Box sx={detailBoxSx}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.5,
                            }}
                          >
                            إخراج
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {item.output || "-"}
                          </Typography>
                        </Box>
                      </Box>


                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleToggleDetails(item.checkListId)}
                        startIcon={<VisibilityOutlinedIcon />}
                        endIcon={
                          isOpen ? (
                            <KeyboardArrowUpOutlinedIcon />
                          ) : (
                            <KeyboardArrowDownOutlinedIcon />
                          )
                        }
                        sx={{
                          ...detailsButtonStyles,
                          gap: 1,
                          backgroundColor: "#FFF8E1",
                          color: "#8D6E63",
                          border: "1px solid rgba(141,110,99,0.35)",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        }}
                      >
                        {isOpen ? "إخفاء التفاصيل" : "تفاصيل"}
                      </Button>


                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 2, display: "grid", gap: 1.2 }}>
                          {isLoadingDetails ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 2,
                              }}
                            >
                              <CircularProgress size={28} />
                            </Box>
                          ) : details ? (
                            <>
                              <Box sx={nurseDetailsCardSx}>
                                <Box sx={nurseDetailsHeaderSx}>
                                  <Typography
                                    sx={{ fontWeight: 900, fontSize: 16 }}
                                  >
                                    تفاصيل الفحص
                                  </Typography>


                                  <Box
                                    sx={{
                                      px: 1.2,
                                      py: 0.5,
                                      borderRadius: 999,
                                      backgroundColor: "rgba(255,255,255,0.18)",
                                      border:
                                        "1px solid rgba(255,255,255,0.25)",
                                      fontSize: 11,
                                      fontWeight: 700,
                                    }}
                                  >
                                    #{item.checkListId}
                                  </Box>
                                </Box>


                                <Box sx={{ p: 1.5 }}>
                                  <Box
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, minmax(0, 1fr))",
                                      },
                                      gap: 1.2,
                                    }}
                                  >
                                    <Box sx={detailBoxSx}>
                                      <Typography
                                        sx={{
                                          fontSize: 12,
                                          color: "text.secondary",
                                          mb: 0.5,
                                        }}
                                      >
                                        اسم الممرضة
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontWeight: 800,
                                          whiteSpace: "normal",
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {getValue(details.nurseName)}
                                      </Typography>
                                    </Box>


                                    <Box sx={detailBoxSx}>
                                      <Typography
                                        sx={{
                                          fontSize: 12,
                                          color: "text.secondary",
                                          mb: 0.5,
                                        }}
                                      >
                                        الشيفت
                                      </Typography>
                                      <Typography sx={{ fontWeight: 800 }}>
                                        {getValue(details.shift)}
                                      </Typography>
                                    </Box>


                                    <Box sx={detailBoxSx}>
                                      <Typography
                                        sx={{
                                          fontSize: 12,
                                          color: "text.secondary",
                                          mb: 0.5,
                                        }}
                                      >
                                        الوقت
                                      </Typography>
                                      <Typography sx={{ fontWeight: 800 }}>
                                        {formatTimeWithPeriod(details.time)}
                                      </Typography>
                                    </Box>


                                    <Box
                                      sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        backgroundColor: "#F8F8F4",
                                        border:
                                          "1px solid rgba(106,106,87,0.12)",
                                        textAlign: "center",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                        minHeight: 85,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: 12,
                                          color: "text.secondary",
                                          mb: 0.8,
                                        }}
                                      >
                                        الملاحظات
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontWeight: 700,
                                          lineHeight: 1.8,
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {getValue(details.notes)}
                                      </Typography>
                                    </Box>
                                  </Box>


                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      mt: 1.5,
                                    }}
                                  >
                                    <Button
                                      fullWidth
                                      variant="outlined"
                                      startIcon={<EditOutlinedIcon />}
                                      onClick={() => handleOpenEdit(item)}
                                      sx={{
                                        ...actionBtnSx,
                                        gap: 1,
                                        color: "#6a6a57",
                                        borderColor: "rgba(106,106,87,0.35)",
                                        backgroundColor: "#fff",
                                      }}
                                    >
                                      تعديل
                                    </Button>


                                    <Button
                                      fullWidth
                                      variant="contained"
                                      startIcon={<DeleteOutlineOutlinedIcon />}
                                      onClick={() =>
                                        openDeleteDialog(item.checkListId)
                                      }
                                      disabled={
                                        deleteLoadingId === item.checkListId
                                      }
                                      sx={{
                                        ...actionBtnSx,
                                        gap: 1,
                                        backgroundColor: "#c62828",
                                        "&:hover": {
                                          backgroundColor: "#b71c1c",
                                        },
                                      }}
                                    >
                                      حذف
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </>
                          ) : (
                            <Typography align="center">
                              لا توجد تفاصيل
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Typography align="center">لا توجد بيانات</Typography>
            )}
          </Box>
        </>
      )}
      <Dialog
        open={editOpen}
        onClose={() => !editLoading && setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: "right" }}>
          تعديل الفحص
        </DialogTitle>


        <DialogContent>
          <Box
            sx={{
              mt: 1,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            <TextField
              label="درجة الحرارة"
              value={editForm.temperature}
              onChange={(e) => handleEditChange("temperature", e.target.value)}
              fullWidth
            />


            <TextField
              label="النبض"
              value={editForm.pulse}
              onChange={(e) => handleEditChange("pulse", e.target.value)}
              fullWidth
            />


            <TextField
              label="سكر الدم"
              value={editForm.bloodSugar}
              onChange={(e) => handleEditChange("bloodSugar", e.target.value)}
              fullWidth
            />


            <TextField
              label="ضغط الدم"
              value={editForm.bloodPressure}
              onChange={(e) =>
                handleEditChange("bloodPressure", e.target.value)
              }
              fullWidth
            />


            <TextField
              label="إدخال"
              value={editForm.intake}
              onChange={(e) => handleEditChange("intake", e.target.value)}
              fullWidth
            />


            <TextField
              label="إخراج"
              value={editForm.output}
              onChange={(e) => handleEditChange("output", e.target.value)}
              fullWidth
            />


            <TextField
              label="الملاحظات"
              value={editForm.notes}
              onChange={(e) => handleEditChange("notes", e.target.value)}
              fullWidth
              multiline
              minRows={3}
              sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
            />
          </Box>
        </DialogContent>


        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            sx={deleteDialogCancelBtnSx}
          >
            إلغاء
          </Button>


          <Button
            onClick={handleUpdate}
            disabled={editLoading}
            variant="contained"
            sx={{
              ...deleteDialogCancelBtnSx,
              backgroundColor: "#6a6a57",
              "&:hover": {
                backgroundColor: "#5a5a49",
              },
              color: "#fff",
            }}
          >
            {editLoading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={deleteDialogSx}
      >
        <DialogTitle sx={deleteDialogTitleSx}>تأكيد حذف الفحص</DialogTitle>


        <DialogContent dividers sx={deleteDialogContentSx}>
          <Typography sx={deleteDialogMainTextSx}>
            هل أنت متأكد أنك تريد حذف هذا الفحص؟
          </Typography>


          <Typography sx={deleteDialogSubTextSx}>
            هذا الإجراء لا يمكن التراجع عنه.
          </Typography>
        </DialogContent>


        <DialogActions sx={deleteDialogActionsSx}>
          <Button
            onClick={handleDelete}
            disabled={deleteLoadingId === selectedDeleteId}
            variant="contained"
            sx={{
              ...deleteDialogConfirmBtnSx,
              opacity: deleteLoadingId === selectedDeleteId ? 0.8 : 1,
            }}
          >
            {deleteLoadingId === selectedDeleteId ? "جارٍ الحذف..." : "حذف"}
          </Button>


          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={deleteDialogCancelBtnSx}
          >
            إلغاء
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

