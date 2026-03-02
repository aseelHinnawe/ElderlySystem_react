import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Grid,
} from "@mui/material";


import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";


const paperStyle = {
  p: { xs: 2.5, sm: 4 },
  width: "100%",
  borderRadius: "20px",
  background: "#f0f0ea",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
};


const headerCardStyles = {
  mb: 3,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


export const buttonStyle = {
  py: 1,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 1,
  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
  },
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(6px)",
  },
};


const dayNameAr = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  const names = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  return names[d.getDay()];
};


const showVal = (v) => {
  const val = (v ?? "").toString().trim();
  return val ? val : "-";
};


export default function GetElderlyMeal() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const [offset, setOffset] = useState(0);
  const [elderlyId, setElderlyId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const fetchElderlies = async () => {
    const res = await AxiosUserInstance.get("/Nurse/Elderly");
    return res?.data?.elderlies || [];
  };


  const {
    data: elderlies = [],
    isLoading: loadingElderlies,
    isError: elderliesError,
    refetch: refetchElderlies,
  } = useQuery({
    queryKey: ["elderliesList"],
    queryFn: fetchElderlies,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    onError: (err) => {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setSnackbar({
        open: true,
        severity: "error",
        message: "تعذر تحميل قائمة المسنين",
      });
    },
  });


  // ===== 2) Get weekly meals for selected elderly =====
  const fetchWeeklyMeals = async () => {
    const res = await AxiosUserInstance.get("/Nurse/ElderMeal/weekly", {
      params: { offset, elderlyId: Number(elderlyId) },
    });
    return res?.data?.data; // { dates:[], rows:[{ elderlyId, elderlyName, days: {date:{breakfast,lunch,dinner}}}] }
  };


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["elderMealWeekly", offset, elderlyId],
    queryFn: fetchWeeklyMeals,
    enabled: !!elderlyId, // ✅ لا تجيب بيانات قبل اختيار المسن
    staleTime: 1000 * 30,
    retry: 1,
    onError: (err) => {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء جلب الوجبات",
      });
    },
  });


  const dates = data?.dates || [];
  const row = data?.rows?.[0];
  const daysMap = row?.days || {};


  const onPrevWeek = () => setOffset((o) => o - 1);
  const onNextWeek = () => setOffset((o) => o + 1);
  const onCurrentWeek = () => setOffset(0);


  const selectedName =
    elderlies.find((e) => String(e.elderlyId) === String(elderlyId))?.name ||
    "";


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 2, md: 3 },
        background: "#f0f0ea",
        direction: "rtl",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200 }}>
        {/* Header */}
        <Card sx={{ ...headerCardStyles, width: "100%" }}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
                >
                  جدول الوجبات الأسبوعي
                </Typography>
                <RestaurantIcon
                  sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }}
                />
              </Box>


              <Typography
                sx={{ opacity: 0.9, mt: 1, fontSize: { xs: 12, md: 15 } }}
              >
                اختر المسن أولاً، ثم سيتم عرض (فطور/غداء/عشاء) لكل يوم
                {selectedName ? ` — (${selectedName})` : ""}
              </Typography>
            </Box>


            <Box
              sx={{
                width: { xs: 50, md: 70 },
                height: { xs: 50, md: 70 },
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CalendarMonthIcon
                sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }}
              />
            </Box>
          </CardContent>
        </Card>


        <Paper elevation={0} sx={paperStyle}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="اختر المسن"
                value={elderlyId}
                onChange={(e) => {
                  setElderlyId(e.target.value);
                  setOffset(0);
                }}
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


                {elderlies.map((e) => (
                  <MenuItem key={e.elderlyId} value={e.elderlyId}>
                    {e.name}
                  </MenuItem>
                ))}
              </TextField>


              {elderliesError && (
                <Box sx={{ mt: 1 }}>
                  <Typography color="error" sx={{ fontWeight: 800 }}>
                    تعذر تحميل قائمة المسنين
                  </Typography>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => refetchElderlies()}
                    sx={{ mt: 1, borderRadius: 3 }}
                  >
                    إعادة المحاولة
                  </Button>
                </Box>
              )}
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              {loadingElderlies && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "flex-end" },
                  }}
                >
                  <CircularProgress size={22} />
                </Box>
              )}
            </Grid>
          </Grid>


          {/* Buttons (same idea as shifts) */}
          <Grid container spacing={1.5} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={onPrevWeek}
                startIcon={<ChevronRightIcon />}
                sx={buttonStyle}
                disabled={!elderlyId}
              >
                الأسبوع السابق
              </Button>
            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={onCurrentWeek}
                startIcon={<TodayIcon />}
                sx={buttonStyle}
                disabled={!elderlyId}
              >
                الأسبوع الحالي
              </Button>
            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={onNextWeek}
                endIcon={<ChevronLeftIcon />}
                sx={buttonStyle}
                disabled={!elderlyId}
              >
                الأسبوع التالي
              </Button>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1, opacity: 0.6 }} />
            </Grid>
          </Grid>


          {/* If not selected */}
          {!elderlyId && (
            <Typography
              sx={{
                mt: 2,
                textAlign: "center",
                fontWeight: 800,
                opacity: 0.85,
              }}
            >
              يرجى اختيار المسن لعرض جدول الوجبات
            </Typography>
          )}


          {/* Loading / Error */}
          {elderlyId && isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          )}


          {elderlyId && isError && !isLoading && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="error" sx={{ fontWeight: 900 }}>
                فشل تحميل جدول الوجبات
              </Typography>
              <Button
                onClick={() => refetch()}
                variant="outlined"
                sx={{ mt: 1, borderRadius: 3 }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}


          {/* Table / Mobile View */}
          {elderlyId && !isLoading && !isError && (
            <>
              {/* ===== Desktop: same concept as shifts (dates columns) ===== */}
              {!isMobile && (
                <TableContainer
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    border: "1px solid rgba(106, 106, 87, 0.15)",
                    background: "rgba(255,255,255,0.25)",
                    overflowX: "auto",
                  }}
                >
                  <Table
                    stickyHeader
                    size="small"
                    sx={{
  tableLayout: "fixed",
  width: "100%",
}}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            background: "rgba(106,106,87,0.18)",
                           
                          }}
                        >
                          الوجبة
                        </TableCell>


                        {dates.map((d) => (
                          <TableCell
                            key={d}
                            align="center"
                            sx={{
                              fontWeight: 900,
                              background: "rgba(106,106,87,0.18)",
                              
                            }}
                          >
                            <Typography sx={{ fontWeight: 900, fontSize: 13 }}>
                              {dayNameAr(d)}
                            </Typography>
                            <Typography sx={{ opacity: 0.85, fontSize: 12 }}>
                              {d}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {dates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={1} align="center">
                            لا توجد بيانات
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {/* Breakfast row */}
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <FreeBreakfastIcon fontSize="small" />
                              فطور
                            </TableCell>
                            {dates.map((d) => (
                              <TableCell key={`b-${d}`} align="center">
                                <Typography sx={{ fontWeight: 800 }}>
                                  {showVal(daysMap?.[d]?.breakfast)}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>


                          {/* Lunch row */}
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LunchDiningIcon fontSize="small" />
                              غداء
                            </TableCell>
                            {dates.map((d) => (
                              <TableCell key={`l-${d}`} align="center">
                                <Typography sx={{ fontWeight: 800 }}>
                                  {showVal(daysMap?.[d]?.lunch)}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>


                          {/* Dinner row */}
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <DinnerDiningIcon fontSize="small" />
                              عشاء
                            </TableCell>
                            {dates.map((d) => (
                              <TableCell key={`d-${d}`} align="center">
                                <Typography sx={{ fontWeight: 800 }}>
                                  {showVal(daysMap?.[d]?.dinner)}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}


              {/* ===== Mobile: accordion per day ===== */}
              {isMobile && (
                <Box>
                  {dates.map((d) => {
                    const cell = daysMap?.[d] || {};
                    return (
                      <Accordion
                        key={d}
                        sx={{
                          mb: 1.5,
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.6)",
                          backdropFilter: "blur(10px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          "&:before": { display: "none" },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box>
                            <Typography sx={{ fontWeight: 900 }}>
                              {dayNameAr(d)}
                            </Typography>
                            <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                              {d}
                            </Typography>
                          </Box>
                        </AccordionSummary>


                        <AccordionDetails>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: 1,
                              borderBottom: "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <FreeBreakfastIcon fontSize="small" />
                              فطور
                            </Typography>
                            <Typography sx={{ fontWeight: 800 }}>
                              {showVal(cell.breakfast)}
                            </Typography>
                          </Box>


                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: 1,
                              borderBottom: "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <LunchDiningIcon fontSize="small" />
                              غداء
                            </Typography>
                            <Typography sx={{ fontWeight: 800 }}>
                              {showVal(cell.lunch)}
                            </Typography>
                          </Box>


                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <DinnerDiningIcon fontSize="small" />
                              عشاء
                            </Typography>
                            <Typography sx={{ fontWeight: 800 }}>
                              {showVal(cell.dinner)}
                            </Typography>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </Paper>


        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%", fontWeight: 700 }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}



