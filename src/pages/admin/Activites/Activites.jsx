import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import style from "./Activites.module.css";


// ✅ NEW: status icons
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PendingActionsIcon from "@mui/icons-material/PendingActions";


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const activityCardSx = {
  mb: "16px",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(8px)",
};


const titleSx = {
  fontWeight: 900,
  fontSize: { xs: 16, "@media (max-width:380px)": 17 },
  color: "#2f2f27",
};


const badgeSx = {
  px: { xs: "12px", "@media (max-width:380px)": "12px" },
  py: { xs: "7px", "@media (max-width:380px)": "7px" },
  borderRadius: "999px",
  fontWeight: 900,
  fontSize: { xs: 13, "@media (max-width:380px)": 14 },
  lineHeight: 1,
  whiteSpace: "nowrap",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  backgroundColor: "rgba(106, 106, 87, 0.12)",
  color: "#6a6a57",
};


const infoLabelSx = {
  fontSize: { xs: 13, "@media (max-width:380px)": 13 },
  fontWeight: 900,
  color: "#6a6a57",
};


const infoValueSx = {
  fontSize: { xs: 15, "@media (max-width:380px)": 16 },
  fontWeight: 900,
  color: "#2f2f27",
};


const detailsButtonStyles = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
};


// ===== Date Helpers =====
const parseDateSafe = (dateStr) => {
  if (!dateStr) return null;


  // Case 1: YYYY-MM-DD (or ISO)
  const isoLike = /^\d{4}-\d{2}-\d{2}/.test(dateStr);
  if (isoLike) {
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? null : d;
  }


  // Case 2: DD/MM/YYYY
  const dmY = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dateStr);
  if (dmY) {
    const day = Number(dmY[1]);
    const month = Number(dmY[2]) - 1;
    const year = Number(dmY[3]);
    const d = new Date(year, month, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }


  // Fallback
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
};


const isPastOrToday = (dateStr) => {
  const d = parseDateSafe(dateStr);
  if (!d) return false;


  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const onlyDate = new Date(d);
  onlyDate.setHours(0, 0, 0, 0);


  return onlyDate.getTime() <= today.getTime();
};


export default function Activites() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get("/Admin/Activity");
      setActivities(res.data?.data || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب الأنشطة",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchActivities();
  }, []);


  const filteredActivities = useMemo(() => {
    const q = searchName.trim().toLowerCase();
    if (!q) return activities;


    return activities.filter((a) =>
      (a?.activityName || "").toLowerCase().includes(q)
    );
  }, [activities, searchName]);


  return (
    <Box className={style.pageWrapper}>
      {/* Header */}
      <Card sx={headerCardStyles}>
        <CardContent className={style.headerContent}>
          <Box>
            <Box className={style.titleWrapper}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 20, lg: 28 } }}
              >
                إدارة الأنشطة
              </Typography>
              <EventNoteIcon sx={{ fontSize: { xs: 26, lg: 34 }, color: "#fff" }} />
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
            className={style.iconCircle}
            sx={{
              width: { xs: 52, lg: 70 },
              height: { xs: 52, lg: 70 },
            }}
          >
            <TrendingUp sx={{ fontSize: { xs: 28, lg: 40 }, color: "#fff" }} />
          </Box>
        </CardContent>
      </Card>


      <Box sx={{ mb: 3, width: { xs: "100%", md: "25%" } }}>
        <TextField
          fullWidth
          label="اسم النشاط"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="ابحث عن اسم النشاط..."
          sx={{ backgroundColor: "#fefefe", borderRadius: 3 }}
          InputProps={{
            sx: { borderRadius: 3 },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#6a6a57" }} />
              </InputAdornment>
            ),
            endAdornment: searchName ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchName("")}
                  sx={{
                    color: "#6a6a57",
                    "&:hover": { backgroundColor: "rgba(106,106,87,0.08)" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* ===== Desktop Table ===== */}
<Box sx={{ display: { xs: "none", lg: "block" } }}>
  <Card component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 750, direction: "rtl" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>الحالة</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>اسم النشاط</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>الموقع</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>التاريخ</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>التفاصيل</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((a, idx) => {
                const done = isPastOrToday(a?.date);
                return (
                  <TableRow key={a.id ?? idx}>
                    {/* عمود الحالة */}
                    <TableCell align="center">
                      {done ? (
                        <TaskAltIcon sx={{ fontSize: 30, color: "#2e7d32" }} />
                      ) : (
                        <PendingActionsIcon sx={{ fontSize: 30, color: "#ed6c02" }} />
                      )}
                    </TableCell>

                    <TableCell align="center">{a.activityName}</TableCell>
                    <TableCell align="center">{a.location}</TableCell>
                    <TableCell align="center">{a.date}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        component={Link}
                        to={a?.id ? `/Admin/activity/${a.id}` : "#"}
                        disabled={!a?.id}
                        sx={{
                          ...detailsButtonStyles,
                          fontSize: 13,
                          backgroundColor: "#FFF8E1",
                          color: "#8D6E63",
                          border: "1px solid rgba(141,110,99,0.35)",
                          boxShadow: "none",
                          "&:hover": { backgroundColor: "#FFECB3", boxShadow: "none" },
                        }}
                      >
                        تفاصيل النشاط
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
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

      {/* ===== Mobile Cards ===== */}
<Box sx={{ display: { xs: "block", lg: "none" } }}>
  {filteredActivities.length > 0 ? (
    filteredActivities.map((a, idx) => {
      const done = isPastOrToday(a?.date);

      return (
        <Card key={a.id ?? idx} sx={activityCardSx}>
          <CardContent sx={{ p: 2.2 }}>
            
            {/* ===== Title + Status ===== */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0, // مهم جداً للـ ellipsis
              }}
            >
              {/* عمود الأيقونة بعرض ثابت */}
              <Box
                sx={{
                  width: 28,
                  display: "flex",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <TaskAltIcon
                    sx={{ fontSize: 24, color: "#2e7d32" }}
                  />
                ) : (
                  <PendingActionsIcon
                    sx={{ fontSize: 24, color: "#ed6c02" }}
                  />
                )}
              </Box>

              {/* اسم النشاط */}
              <Typography
  sx={{
    ...titleSx,
    flex: 1,
    minWidth: 0,
    whiteSpace: "normal",        // يسمح بالنزول
    wordBreak: "break-word",     // يكسر الكلمات الطويلة
    overflowWrap: "anywhere",    // أقوى حل للكلمات الطويلة جداً
    lineHeight: 1.4
  }}
>
  {a.activityName}
</Typography>

            </Box>

            {/* ===== Info Section ===== */}
            <Box sx={{ mt: 1.5 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.2,
                }}
              >
                <Box className={style.infoPill}>
                  <Box component="span" sx={infoLabelSx}>
                    الموقع
                  </Box>
                  <Box component="span" sx={infoValueSx}>
                    {a.location}
                  </Box>
                </Box>

                <Box className={style.infoPill}>
                  <Box component="span" sx={infoLabelSx}>
                    التاريخ
                  </Box>
                  <Box component="span" sx={infoValueSx}>
                    {a.date}
                  </Box>
                </Box>
              </Box>

              {/* ===== Details Button ===== */}
              <Box sx={{ mt: 1.8 }}>
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to={a?.id ? `/Admin/activity/${a.id}` : "#"}
                  disabled={!a?.id}
                  sx={{
                    ...detailsButtonStyles,
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
                  تفاصيل النشاط
                </Button>
              </Box>
            </Box>

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


      {/* Snackbar */}
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

