import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import style from './ActivityDetails.module.css'

import { useNavigate, useParams } from "react-router-dom";
import AxiosUserInstance from "../../../api/AxiosUserInstance.jsx";


// ===== Styles =====
const headerCardStyles = {
  mb: 3,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const paperStyle = {
  p: { xs: 2.2, sm: 3.2, md: 4 },
  width: "100%",
  borderRadius: "22px",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 10px 34px rgba(0,0,0,0.12)",
  background: "#f9f9f4",
};
const orgChipSx = {
  px: 2.2,
  py: 1.0,
  borderRadius: "999px",
  fontWeight: 600,
  fontSize: { xs: 14.5, md: 18.5 },
  border: "1px solid rgba(200,200,200,0.4)", // حدود رمادية فاتحة
  background: "#ffffff", // لون أبيض
  color: "#2f2f27",      // لون الخط داكن
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)", // ظل خفيف
  cursor: "default",      // مؤشر عادي
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.75)",
  },
};

const toolBtnBase = {
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 900,
  px: { xs: 1.5, sm: 2 },    // أصغر على شاشات xs
  py: { xs: 0.8, sm: 1.1 },
  fontSize: { xs: 12, sm: 13, md: 13 }, // حجم خط أصغر على الموبايل
};


const editBtnSx = {
  ...toolBtnBase,
  background:
    "linear-gradient(135deg, rgba(255,248,225,1), rgba(255,236,179,1))",
  color: "#7A5B4E",
  border: "1px solid rgba(141,110,99,0.25)",
  boxShadow: "0 8px 18px rgba(141,110,99,0.15)",
  "&:hover": {
    filter: "brightness(0.98)",
    boxShadow: "0 10px 22px rgba(141,110,99,0.2)",
  },
  "& .MuiButton-startIcon": { ml: 1.0, mr: 0.2 }, // icon margin أصغر على xs
};


const deleteBtnSx = {
  ...toolBtnBase,
  background:
    "linear-gradient(135deg, rgba(255,235,238,1), rgba(255,205,210,1))",
  color: "#B71C1C",
  border: "1px solid rgba(198,40,40,0.25)",
  boxShadow: "0 8px 18px rgba(198,40,40,0.12)",
  "&:hover": {
    filter: "brightness(0.98)",
    boxShadow: "0 10px 22px rgba(198,40,40,0.18)",
  },
  "& .MuiButton-startIcon": { ml: 1.0, mr: 0.2 },
};


const statCardSx = {
  borderRadius: 4,
  border: "1px solid rgba(106,106,87,0.16)",
  background: "rgba(255,255,255,0.72)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  overflow: "hidden",
};

const statInnerSx = {
  p: 2.2,
  display: "flex",
  alignItems: "center",
  gap: 1.6,
};

const statLabelSx = { fontWeight: 900, color: "#6a6a57", fontSize: 14 };
const statValueSx = {
  fontWeight: 600,
  color: "#2f2f27",
  fontSize: { xs: 17, md: 19 },
  mt: 0.4,
};

const descBoxSx = {
  mt: 2.2,
  borderRadius: 4,
  border: "1px solid rgba(106,106,87,0.14)",
  background: "rgba(255,255,255,0.72)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  p: { xs: 2, md: 2.4 },
};


function ddmmyyyy_to_yyyymmdd(s) {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const parts = String(s).split("/");
  if (parts.length !== 3) return s;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return s;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    activityName: "", description: "", location: "", date: "", startTime: "",
    updateParticipantId: "", updateOrganizationName: ""
  });

  const orgs = useMemo(() => activity?.activityOrganizations || [], [activity]);

  const showSnack = (severity, message) => setSnackbar({ open: true, severity, message });
  const closeSnack = (_, reason) => { if (reason !== "clickaway") setSnackbar(s => ({ ...s, open: false })); }

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get(`/Admin/Activity/${id}`);
      const data = res.data?.data;
      setActivity(data);
      setEditForm({
        activityName: data?.activityName || "",
        description: data?.description || "",
        location: data?.location || "",
        date: ddmmyyyy_to_yyyymmdd(data?.date || ""),
        startTime: data?.startTime || "",
        updateParticipantId: "",
        updateOrganizationName: "",
      });
    } catch (e) {
      showSnack("error", "فشل جلب تفاصيل النشاط");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await AxiosUserInstance.delete(`/Admin/Activity/${id}`);
      showSnack("success", "تم حذف النشاط بنجاح");
      setTimeout(() => navigate("/Admin/activites"), 400);
    } catch (e) {
      showSnack("error", e?.response?.data?.message || "فشل حذف النشاط");
    } finally { setDeleting(false); setOpenDelete(false); }
  };

  const buildUpdatePayload = () => {
    const payload = {
      activityName: editForm.activityName?.trim(),
      description: editForm.description?.trim(),
      location: editForm.location?.trim(),
      date: editForm.date,
      startTime: editForm.startTime?.trim(),
    };
    if (editForm.updateParticipantId && editForm.updateOrganizationName) {
      payload.updateParticipantId = Number(editForm.updateParticipantId);
      payload.updateOrganizationName = editForm.updateOrganizationName.trim();
    }
    return payload;
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const payload = buildUpdatePayload();
      await AxiosUserInstance.put(`/Admin/Activity/${id}`, payload);
      showSnack("success", "تم تعديل النشاط بنجاح");
      setOpenEdit(false);
      await fetchDetails();
    } catch (e) {
      showSnack("error", e?.response?.data?.message || "فشل تعديل النشاط");
    } finally { setSaving(false); }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f9f9f4", minHeight: "100vh" }}>
      {/* ===== Header ===== */}
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
                إدارة الأنشطة
              </Typography>
              <EventNoteIcon
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
              يمكنك عرض جميع الأنشطة مع الاسم والموقع والتاريخ ووقت البداية
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
            <TrendingUp sx={{ fontSize: { xs: 28, lg: 40 }, color: "#fff" }} />
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>
      ) : !activity ? (
        <Typography align="center" sx={{ mt: 6 }}>لا توجد بيانات</Typography>
      ) : (
        <Grid container spacing={3} maxWidth={1200} mx="auto" alignItems="stretch">
          {/* ===== Activity Main Info ===== */}
<Grid size={{ xs: 12, md: 8 }} display="flex" flexDirection="column" gap={3}>
  
  {/* اسم النشاط */}
  <Paper
    sx={{
      ...paperStyle,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 1,
    }}
  >
   <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
  <Typography sx={{ fontWeight: 900, fontSize: { xs: 20, md: 25, lg: 27 }, color: "#545445" }}>
   اسم النشاط:
  </Typography>
  <Typography sx={{ fontSize: { xs: 18, md: 23, lg: 25 }, fontWeight: 900, color: "#545445"}}>
    {activity.activityName}
  </Typography>
</Box>


    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        startIcon={<EditOutlinedIcon />}
        variant="contained"
        sx={editBtnSx}
        onClick={() => setOpenEdit(true)}
      >
        تعديل النشاط
      </Button>
      <Button
        startIcon={<DeleteOutlineIcon />}
        variant="contained"
        sx={deleteBtnSx}
        onClick={() => setOpenDelete(true)}
      >
        حذف النشاط
      </Button>
    </Box>
  </Paper>

  {/* الوصف */}
  <Paper
    sx={{
      ...paperStyle,
      flexGrow: 1,        // ✨ يخليه يتمدد
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 1 }}>
      الوصف
    </Typography>

    <Typography sx={{ fontSize: 16, lineHeight: 1.8, flexGrow: 1 }}>
      {activity.description}
    </Typography>
  </Paper>
</Grid>




          {/* ===== Stats Cards ===== */}
          <Grid size={{ xs: 12, md: 4 }}
  display="flex"
  flexDirection="column"
  gap={2}>
            <Card sx={statCardSx}>
              <Box sx={statInnerSx}>
                <PlaceOutlinedIcon sx={{ fontSize: 26, color: "#6a6a57" }} />
                <Box>
                  <Typography sx={statLabelSx}>الموقع</Typography>
                  <Typography sx={statValueSx}>{activity.location}</Typography>
                </Box>
              </Box>
            </Card>

            <Card sx={statCardSx}>
              <Box sx={statInnerSx}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 26, color: "#6a6a57" }} />
                <Box>
                  <Typography sx={statLabelSx}>التاريخ</Typography>
                  <Typography sx={statValueSx}>{activity.date}</Typography>
                </Box>
              </Box>
            </Card>

            <Card sx={statCardSx}>
              <Box sx={statInnerSx}>
                <ScheduleOutlinedIcon sx={{ fontSize: 26, color: "#6a6a57" }} />
                <Box>
                  <Typography sx={statLabelSx}>وقت البداية</Typography>
                  <Typography sx={statValueSx}>{activity.startTime}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* ===== Participating Organizations ===== */}
          <Grid size={{xs:12}}>
            <Paper sx={{ ...paperStyle }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BusinessOutlinedIcon sx={{ mr: 1, color: "#6a6a57" }} />
                <Typography sx={{ fontWeight: 900, fontSize: 18 ,mr:1}}>الجهات المشاركة</Typography>
              </Box>

              {orgs.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
                  {orgs.map(o => <Box key={o.id} sx={orgChipSx}>{o.organizationName}</Box>)}
                </Box>
              ) : (
                <Typography sx={{ fontWeight: 900 }}>لا توجد جهات</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}


      
    </Box>
  );
}




