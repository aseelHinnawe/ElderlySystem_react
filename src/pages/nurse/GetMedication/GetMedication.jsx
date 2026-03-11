import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Tooltip,
  Stack,
  Chip,
} from "@mui/material";


import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
} from "@mui/material";


import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import PersonIcon from "@mui/icons-material/Person";


// ========== styles ==========
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
  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
  gap: 1,
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
  },
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.5)",
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


// ========== cell rendering ==========
const getSummaryStyle = (cell) => {
  if (!cell || !cell.inPlanPeriod) {
    return { bg: "rgba(0,0,0,0.04)", color: "#555" };
  }


  const taken = Number(cell.takenCount || 0);
  const req = Number(cell.requiredCount || 0);


  if (req > 0 && taken >= req) {
    return { bg: "rgba(46,125,50,0.12)", color: "#2E7D32" };
  }
  if (taken > 0) {
    return { bg: "rgba(141,110,99,0.12)", color: "#8D6E63" };
  }
  return { bg: "rgba(198,40,40,0.10)", color: "#C62828" };
};


const renderMedicationCell = (cell) => {
  if (!cell) return <Typography sx={{ opacity: 0.7 }}>-</Typography>;
  if (!cell.inPlanPeriod) return <Typography sx={{ opacity: 0.7 }}>-</Typography>;


  const style = getSummaryStyle(cell);
  const summary =
    cell.summary || `${cell.takenCount || 0}/${cell.requiredCount || 0}`;


  const takenList = Array.isArray(cell.taken) ? cell.taken : [];
  const hasTaken = takenList.length > 0;


  const tooltipContent = (
    <Box sx={{ p: 1.2, minWidth: 280, textAlign: "center" }}>
      <Typography sx={{ fontWeight: 900, mb: 1 }}>تفاصيل الجرعات</Typography>


      {!hasTaken ? (
        <Typography sx={{ opacity: 0.8 }}>لا توجد جرعات مسجلة</Typography>
      ) : (
        <Stack gap={1}>
          {takenList.map((t, i) => (
            <Box
              key={i}
              sx={{
                borderRadius: 2,
                px: 1.2,
                py: 1,
                background: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(106,106,87,0.15)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  alignItems: "center",
                  mb: 0.6,
                }}
              >
                <Typography sx={{ fontWeight: 900 }}>{t.time}</Typography>


                <Chip
                  size="small"
                  label={`شفت ${t.shiftKey || "-"}`}
                  sx={{
                    fontWeight: 900,
                    borderRadius: 2,
                    background: "rgba(106,106,87,0.10)",
                    border: "1px solid rgba(106,106,87,0.18)",
                  }}
                />
              </Box>


              <Typography sx={{ fontWeight: 800, opacity: 0.9 }}>
                الجرعة: {t.dose}
              </Typography>


              {!!t.nurseName && (
                <Typography sx={{ mt: 0.4, fontSize: 12, opacity: 0.85 }}>
                  الممرضة: {t.nurseName}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );


  return (
    <Tooltip title={tooltipContent} placement="top" arrow>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1.2,
          py: 0.6,
          borderRadius: 3,
          fontWeight: 900,
          fontSize: 13,
          cursor: "default",
          background: style.bg,
          color: style.color,
          border: "1px solid rgba(106,106,87,0.12)",
          minWidth: 64,
        }}
      >
        {summary}
      </Box>
    </Tooltip>
  );
};


export default function GetMedication() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));


  const [elderlyId, setElderlyId] = useState("");
  const [offset, setOffset] = useState(0);


  const [elderlies, setElderlies] = useState([]);
  const [loadingElderlies, setLoadingElderlies] = useState(false);
  const [elderliesError, setElderliesError] = useState(false);


  const [weeklyData, setWeeklyData] = useState({ dates: [], rows: [] });
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [weeklyError, setWeeklyError] = useState(false);


  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const fetchElderlies = useCallback(async () => {
    setLoadingElderlies(true);
    setElderliesError(false);


    try {
      const res = await AxiosUserInstance.get("/Nurse/Elderly");
      const list = Array.isArray(res?.data?.elderlies) ? res.data.elderlies : [];


      const mapped = list
        .filter((x) => x?.elderlyId != null)
        .map((x) => ({
          id: String(x.elderlyId),
          name: x.name || `مسن #${x.elderlyId}`,
        }));


      setElderlies(mapped);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }


      setElderliesError(true);
      setSnackbar({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء جلب قائمة المسنين",
      });
      setElderlies([]);
    } finally {
      setLoadingElderlies(false);
    }
  }, [navigate]);


  const fetchWeekly = useCallback(
    async (selectedElderlyId = elderlyId, selectedOffset = offset) => {
      if (!selectedElderlyId) {
        setWeeklyData({ dates: [], rows: [] });
        setWeeklyError(false);
        return;
      }


      setLoadingWeekly(true);
      setWeeklyError(false);


      try {
        const res = await AxiosUserInstance.get(
          `/Nurse/Medicine/elderly/${selectedElderlyId}/weekly`,
          { params: { offset: selectedOffset } },
        );


        setWeeklyData(res?.data?.data || { dates: [], rows: [] });
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }


        setWeeklyError(true);
        setSnackbar({
          open: true,
          severity: "error",
          message:
            err?.response?.data?.message || "حدث خطأ أثناء جلب جدول الجرعات",
        });
        setWeeklyData({ dates: [], rows: [] });
      } finally {
        setLoadingWeekly(false);
      }
    },
    [elderlyId, offset, navigate],
  );


  useEffect(() => {
    fetchElderlies();
  }, [fetchElderlies]);


  useEffect(() => {
    if (!elderlyId) {
      setWeeklyData({ dates: [], rows: [] });
      setWeeklyError(false);
      return;
    }


    fetchWeekly(elderlyId, offset);
  }, [elderlyId, offset, fetchWeekly]);


  const elderlyName = useMemo(() => {
    const x = elderlies.find((e) => e.id === String(elderlyId));
    return x?.name || "";
  }, [elderlies, elderlyId]);


  const dates = weeklyData?.dates || [];
  const rows = weeklyData?.rows || [];


  const onPrevWeek = () => setOffset((o) => o - 1);
  const onNextWeek = () => setOffset((o) => o + 1);
  const onCurrentWeek = () => setOffset(0);


  const renderMedicineHeader = (r) => {
    const times = Array.isArray(r?.scheduledTimes) ? r.scheduledTimes : [];


    return (
      <Box sx={{ minWidth: 220 }}>
        <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>
          {r.medicineName || "-"}
        </Typography>


        <Typography sx={{ fontSize: 12, opacity: 0.8, mt: 0.3 }}>
          {r.medicineTypeName || ""}{" "}
          {r.dailyIntake ? `— ${r.dailyIntake} جرعة/يوم` : ""}
        </Typography>


        {times.length > 0 && (
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={0.6}
            sx={{ mt: 0.8, justifyContent: "center" }}
          >
            {times.map((t, i) => (
              <Chip
                key={i}
                label={t}
                size="small"
                sx={{
                  borderRadius: 2,
                  fontWeight: 800,
                  background: "rgba(106,106,87,0.10)",
                  border: "1px solid rgba(106,106,87,0.15)",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    );
  };


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
                  جدول الجرعات الأسبوعي
                </Typography>


                <MedicationOutlinedIcon
                  sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }}
                />
              </Box>


              <Typography
                sx={{
                  mt: 1,
                  fontSize: { xs: 12, md: 14 },
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 400,
                }}
              >
                اختر المسنة ثم تنقّل بين الأسابيع لرؤية الجرعات المسجلة لكل دواء
                {elderlyName ? ` — (${elderlyName})` : ""}
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
          <Grid container spacing={1.5} alignItems="center">
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="اسم المسنة"
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
                  {loadingElderlies ? "جارٍ تحميل المسنين..." : "اختر المسنة"}
                </MenuItem>


                {elderlies.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
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


                <Button
                  fullWidth
                  variant="contained"
                  onClick={onCurrentWeek}
                  startIcon={<TodayIcon />}
                  sx={buttonStyle}
                  disabled={!elderlyId}
                >
                  الحالي
                </Button>


                <Button
                  fullWidth
                  variant="contained"
                  onClick={onNextWeek}
                  endIcon={<ChevronLeftIcon />}
                  sx={buttonStyle}
                  disabled={!elderlyId}
                >
                  التالي
                </Button>
              </Box>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1, opacity: 0.6 }} />
            </Grid>
          </Grid>


          {elderliesError && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography color="error" sx={{ fontWeight: 900 }}>
                تعذر تحميل قائمة المسنين
              </Typography>
              <Button
                onClick={fetchElderlies}
                variant="outlined"
                sx={{ mt: 1, borderRadius: 3 }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}


          {!elderlyId && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <PersonIcon sx={{ fontSize: 48, opacity: 0.35 }} />
              <Typography sx={{ fontWeight: 900, mt: 1, opacity: 0.8 }}>
                يرجى اختيار المسنة لعرض الجرعات الأسبوعية
              </Typography>
            </Box>
          )}


          {loadingWeekly && elderlyId && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          )}


          {weeklyError && !loadingWeekly && elderlyId && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="error" sx={{ fontWeight: 900 }}>
                فشل تحميل جدول الجرعات
              </Typography>
              <Button
                onClick={() => fetchWeekly(elderlyId, offset)}
                variant="outlined"
                sx={{ mt: 1, borderRadius: 3 }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}


          {!loadingWeekly && !weeklyError && elderlyId && (
            <>
              {/* ========== DESKTOP ========== */}
              {!isMobile && (
                <TableContainer
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    border: "1px solid rgba(106, 106, 87, 0.15)",
                    background: "rgba(255,255,255,0.25)",
                  }}
                >
                  <Table
                    stickyHeader
                    size="small"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            background: "rgba(106,106,87,0.18)",
                            width: 260,
                            textAlign: "center",
                          }}
                        >
                          الدواء
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
                      {rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={dates.length + 1} align="center">
                            لا توجد بيانات
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((r) => (
                          <TableRow key={r.drugPlanId} hover>
                            <TableCell
                              sx={{ fontWeight: 800, textAlign: "center" }}
                            >
                              {renderMedicineHeader(r)}
                            </TableCell>


                            {dates.map((d) => (
                              <TableCell
                                key={`${r.drugPlanId}-${d}`}
                                align="center"
                              >
                                {renderMedicationCell(r.days?.[d])}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}


              {/* ========== MOBILE ========== */}
              {isMobile && (
                <Box>
                  {dates.map((d) => (
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
                        {rows.length === 0 ? (
                          <Typography textAlign="center">
                            لا توجد بيانات
                          </Typography>
                        ) : (
                          rows.map((r) => {
                            const cell = r.days?.[d];
                            const taken = Array.isArray(cell?.taken)
                              ? cell.taken
                              : [];


                            return (
                              <Box
                                key={`${r.drugPlanId}-${d}`}
                                sx={{
                                  py: 1.2,
                                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Box>
                                    <Typography sx={{ fontWeight: 900 }}>
                                      {r.medicineName}
                                    </Typography>
                                    <Typography
                                      sx={{ fontSize: 12, opacity: 0.75 }}
                                    >
                                      {r.medicineTypeName}{" "}
                                      {r.dailyIntake
                                        ? `— ${r.dailyIntake} جرعة/يوم`
                                        : ""}
                                    </Typography>


                                    {Array.isArray(r?.scheduledTimes) &&
                                      r.scheduledTimes.length > 0 && (
                                        <Stack
                                          direction="row"
                                          flexWrap="wrap"
                                          gap={0.6}
                                          sx={{ mt: 0.8 }}
                                        >
                                          {r.scheduledTimes.map((t, i) => (
                                            <Chip
                                              key={i}
                                              label={t}
                                              size="small"
                                              sx={{
                                                borderRadius: 2,
                                                fontWeight: 800,
                                                background:
                                                  "rgba(106,106,87,0.10)",
                                                border:
                                                  "1px solid rgba(106,106,87,0.15)",
                                              }}
                                            />
                                          ))}
                                        </Stack>
                                      )}
                                  </Box>


                                  <Box>{renderMedicationCell(cell)}</Box>
                                </Box>


                                {cell?.inPlanPeriod && taken.length > 0 && (
                                  <Stack
                                    direction="column"
                                    gap={0.8}
                                    sx={{ mt: 1.2 }}
                                  >
                                    {taken.map((t, i) => (
                                      <Chip
                                        key={i}
                                        label={`${t.time} — ${t.dose} — شفت ${t.shiftKey || "-"}`}
                                        size="small"
                                        sx={{
                                          borderRadius: 2,
                                          fontWeight: 800,
                                          background: "rgba(255,255,255,0.70)",
                                          border:
                                            "1px solid rgba(106,106,87,0.15)",
                                          justifyContent: "space-between",
                                        }}
                                      />
                                    ))}


                                    <Box sx={{ mt: 0.2 }}>
                                      {taken.map((t, i) =>
                                        t?.nurseName ? (
                                          <Typography
                                            key={i}
                                            sx={{ fontSize: 12, opacity: 0.85 }}
                                          >
                                            • {t.nurseName}
                                          </Typography>
                                        ) : null,
                                      )}
                                    </Box>
                                  </Stack>
                                )}
                              </Box>
                            );
                          })
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
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

