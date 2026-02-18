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


const pageWrapperSx = {
  p: "16px",
  minHeight: "100vh",
  background: "#f0f0ea",
  
};


const paperStyle = {
  p: { xs: 2.2, sm: 3.2, md: 4 },
  width: "100%",
  borderRadius: "22px",
  background: "#f0f0ea",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 10px 34px rgba(0,0,0,0.12)",
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.75)",
  },
};


const toolbarCardSx = {
  borderRadius: 4,
  overflow: "hidden",
  mb: 2.5,
  background: "#f0f0ea",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};


const toolBtnBase = {
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 900,
  px: 2,
  py: 1.1,
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
  "& .MuiButton-startIcon": { ml: 1.2, mr: 0.2 },
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
  "& .MuiButton-startIcon": { ml: 1.2, mr: 0.2 },
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

const statIconWrapSx = {
  width: 52,
  height: 52,
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(106,106,87,0.12)",
  border: "1px solid rgba(106,106,87,0.18)",
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


const orgChipSx = {
  px: 2.2,
  py: 1.0,
  borderRadius: "999px",
  fontWeight: 600,
  fontSize: { xs: 14.5, md: 18.5 },
  border: "1px solid rgba(106,106,87,0.18)",
  background: "rgba(240, 240, 234, 0.85)",
  color: "#2f2f27",
  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
};


const sectionTitleSx = {
  fontWeight: 700,
  color: "#6a6a57",
  mt: 3,
  mb: 1.2,
  display: "flex",
  alignItems: "center",
  gap: 1,
 
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


export default function() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);


  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);


  const [editForm, setEditForm] = useState({
    activityName: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    updateParticipantId: "",
    updateOrganizationName: "",
  });


  const orgs = useMemo(() => activity?.activityOrganizations || [], [activity]);


  const showSnack = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };


  const closeSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


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
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDetails();
  }, [id]);


  const handleDelete = async () => {
    setDeleting(true);
    try {
      await AxiosUserInstance.delete(`/Admin/Activity/${id}`);
      showSnack("success", "تم حذف النشاط بنجاح");
      setTimeout(() => navigate("/Admin/activites"), 400);
    } catch (e) {
      showSnack("error", e?.response?.data?.message || "فشل حذف النشاط");
    } finally {
      setDeleting(false);
      setOpenDelete(false);
    }
  };


  const buildUpdatePayload = () => {
    const payload = {
      activityName: editForm.activityName?.trim(),
      description: editForm.description?.trim(),
      location: editForm.location?.trim(),
      date: editForm.date,
      startTime: editForm.startTime?.trim(),
    };


    const hasOrgUpdate =
      String(editForm.updateParticipantId || "").trim() &&
      String(editForm.updateOrganizationName || "").trim();


    if (hasOrgUpdate) {
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
    } finally {
      setSaving(false);
    }
  };


  return (
    <Box sx={pageWrapperSx}>
      {/* Header */}
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
                sx={{ fontWeight: 900, fontSize: { xs: 20, lg: 28 } }}
              >
                تفاصيل النشاط
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
              عرض وتعديل وحذف النشاط وإدارة الجهات المشاركة
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : !activity ? (
        <Typography align="center">لا توجد بيانات</Typography>
      ) : (
        <Paper elevation={0} sx={{ ...paperStyle, maxWidth: 1200, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
              direction: "rtl",
              flexWrap: "wrap",
            }}
          >
           <Typography
  sx={{
    direction: "rtl",
    textAlign: "right",
    fontWeight: 600,
    fontSize: { xs: 18, md: 22 },
    color: "#2f2f27",
    flex: 1,
    minWidth: 260,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
  title={activity?.activityName}
>
  اسم النشاط :{" "}
  <Box
    component="span"
    sx={{ display: { xs: "block", md: "inline" } }}
  >
    {activity?.activityName}
  </Box>
</Typography>



            {/* الأزرار يمين */}
            <Box
  sx={{
    display: "flex",
    gap: 1.2,
    flexWrap: { xs: "nowrap", sm: "wrap" }, // على الشاشات الصغيرة يبقوا جنب بعض
    justifyContent: { xs: "center", sm: "flex-start" }, // وسط على xs
  }}
>
  <Button
    startIcon={<EditOutlinedIcon />}
    variant="contained"
    onClick={() => setOpenEdit(true)}
    sx={{
      ...editBtnSx,
      fontSize: { xs: 13, sm: 15 }, // خط أصغر على xs
      minWidth: { xs: 120, sm: 140 },
      px: { xs: 1.2, sm: 2 },
      py: { xs: 0.8, sm: 1.1 },
    }}
  >
    تعديل النشاط
  </Button>

  <Button
    startIcon={<DeleteOutlineIcon />}
    variant="contained"
    onClick={() => setOpenDelete(true)}
    sx={{
      ...deleteBtnSx,
      fontSize: { xs: 13, sm: 15 }, // خط أصغر على xs
      minWidth: { xs: 120, sm: 130 },
      px: { xs: 1.2, sm: 2 },
      py: { xs: 0.8, sm: 1.1 },
    }}
  >
    حذف النشاط
  </Button>
</Box>

          </Box>


          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={statCardSx}>
                <Box sx={statInnerSx}>
                  <Box sx={statIconWrapSx}>
                    <PlaceOutlinedIcon
                      sx={{ fontSize: 26, color: "#6a6a57" }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={statLabelSx}>الموقع</Typography>
                    <Typography sx={statValueSx}>
                      {activity.location}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={statCardSx}>
                <Box sx={statInnerSx}>
                  <Box sx={statIconWrapSx}>
                    <CalendarMonthOutlinedIcon
                      sx={{ fontSize: 26, color: "#6a6a57" }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={statLabelSx}>التاريخ</Typography>
                    <Typography sx={statValueSx}>{activity.date}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={statCardSx}>
                <Box sx={statInnerSx}>
                  <Box sx={statIconWrapSx}>
                    <ScheduleOutlinedIcon
                      sx={{ fontSize: 26, color: "#6a6a57" }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={statLabelSx}>وقت البداية</Typography>
                    <Typography sx={statValueSx}>
                      {activity.startTime}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>


          {/* الوصف */}
          <Box sx={descBoxSx}>
            <Typography sx={{ fontWeight: 900, color: "#6a6a57", mb: 0.8 }}>
              الوصف
            </Typography>
            <Typography
              sx={{
                fontWeight: 900,
                color: "#2f2f27",
                lineHeight: 1.9,
                fontSize: 15.5,
              }}
            >
              {activity.description}
            </Typography>
          </Box>


          
        </Paper>
      )}


      {/* ===== Edit Dialog ===== */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900 }}>تعديل النشاط</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="اسم النشاط"
                value={editForm.activityName}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, activityName: e.target.value }))
                }
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-input": {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              />
            </Grid>


            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="الموقع"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, location: e.target.value }))
                }
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-input": {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="الوصف"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, description: e.target.value }))
                }
                multiline
                minRows={3}
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-input": {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              />
            </Grid>


            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="التاريخ"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editForm.date}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, date: e.target.value }))
                }
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="وقت البداية"
                placeholder="مثال: 10 صباحا"
                value={editForm.startTime}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, startTime: e.target.value }))
                }
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-input": {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{color: "#6a6a57", mb: 1 }}>
                تعديل جهة واحدة (اختياري)
              </Typography>


              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={inputStyle}>
                    <InputLabel>اختر الجهة</InputLabel>
                    <Select
                      label="اختر الجهة"
                      value={editForm.updateParticipantId}
                      onChange={(e) =>
                        setEditForm((p) => ({
                          ...p,
                          updateParticipantId: e.target.value,
                        }))
                      }
                      sx={{
                        borderRadius: "14px",
                        "& .MuiSelect-select": {
                          direction: "rtl",
                          textAlign: "right",
                        },
                      }}
                    >
                      <MenuItem value="">بدون</MenuItem>
                      {orgs.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                          {o.organizationName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>


                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="اسم الجهة الجديد"
                    value={editForm.updateOrganizationName}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        updateOrganizationName: e.target.value,
                      }))
                    }
                    sx={{
                      ...inputStyle,
                      "& .MuiOutlinedInput-input": {
                        direction: "rtl",
                        textAlign: "right",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>


        <DialogActions sx={{ p: 2, gap: 2 }}>
  <Button
    onClick={() => setOpenEdit(false)}
    variant="outlined"
    sx={{
      borderRadius: 3,
      fontWeight: 900,
      textTransform: "none",
      color: "#6a6a57",
      minWidth: { xs: 100, sm: 140 }, // أصغر على الشاشات الصغيرة
      px: { xs: 1.5, sm: 2 }, // padding أصغر على xs
      py: { xs: 0.8, sm: 1.1 },
      borderColor: "rgba(106,106,87,0.45)",
      background: "#fff",
      "&:hover": { borderColor: "rgba(106,106,87,0.85)" },
    }}
  >
    إلغاء
  </Button>

  <Button
    onClick={handleUpdate}
    disabled={saving}
    variant="contained"
    sx={{
      ...editBtnSx,
      minWidth: { xs: 100, sm: 140 }, // أصغر على xs
      px: { xs: 1.5, sm: 2 },
      py: { xs: 0.8, sm: 1.1 },
      opacity: saving ? 0.8 : 1,
    }}
  >
    {saving ? "جارٍ الحفظ..." : "حفظ التعديل"}
  </Button>
</DialogActions>

      </Dialog>


      {/* ===== Delete Dialog ===== */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#B71C1C" }}>
          تأكيد حذف النشاط
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontWeight: 900 }}>
            هل أنت متأكد أنك تريد حذف هذا النشاط؟
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary", fontWeight: 800 }}>
            هذا الإجراء لا يمكن التراجع عنه.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 2 }}>
  <Button
    onClick={() => setOpenDelete(false)}
    variant="outlined"
    sx={{
      borderRadius: 3,
      fontWeight: 900,
      textTransform: "none",
      color: "#6a6a57",
      minWidth: { xs: 90, sm: 140 }, // أصغر على الشاشات الصغيرة
      px: { xs: 1, sm: 2 },          // padding أصغر على xs
      py: { xs: 0.6, sm: 1.1 },
      borderColor: "rgba(106,106,87,0.45)",
      background: "#fff",
      "&:hover": { borderColor: "rgba(106,106,87,0.85)" },
    }}
  >
    إلغاء
  </Button>

  <Button
    onClick={handleDelete}
    disabled={deleting}
    variant="contained"
    sx={{
      ...deleteBtnSx,
      minWidth: { xs: 90, sm: 130 }, // أصغر على xs
      px: { xs: 1, sm: 2 },
      py: { xs: 0.6, sm: 1.1 },
      opacity: deleting ? 0.8 : 1,
    }}
  >
    {deleting ? "جارٍ الحذف..." : "حذف"}
  </Button>
</DialogActions>

      </Dialog>


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}





