import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";


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


const renderShiftCell = (val) => {
  if (!val) return "-";
  if (val === "-") return <Typography sx={{ opacity: 0.7 }}>-</Typography>;
  if (val.toLowerCase() === "off")
    return <Typography sx={{ fontWeight: 900 }}>Off</Typography>;
  return <Typography sx={{ fontWeight: 900 }}>{val}</Typography>;
};


export default function NurseShifts() {
  const navigate = useNavigate();
  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const [offset, setOffset] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const fetchSchedule = async () => {
    const res = await AxiosUserInstance.get("/Admin/Shift/schedule", {
      params: { view: "week", offset },
    });
    return res?.data?.data;
  };


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["nurseScheduleWeek", offset],
    queryFn: fetchSchedule,
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
        message:
          err?.response?.data?.message || "حدث خطأ أثناء جلب جدول الشفتات",
      });
    },
  });


  const dates = data?.dates || [];
  const rows = data?.rows || [];


  const onPrevWeek = () => setOffset((o) => o - 1);
  const onNextWeek = () => setOffset((o) => o + 1);
  const onCurrentWeek = () => setOffset(0);


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
                  جدول شفتات الممرضات
                </Typography>
                <EventNoteIcon
                  sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }}
                />
              </Box>
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
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={onPrevWeek}
                startIcon={<ChevronRightIcon />} // RTL
                sx={buttonStyle}
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
              >
                الأسبوع التالي
              </Button>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1, opacity: 0.6 }} />
            </Grid>
          </Grid>


          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          )}


          {isError && !isLoading && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="error" sx={{ fontWeight: 900 }}>
                فشل تحميل جدول الشفتات
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
{!isLoading && !isError && (
  <>
    {/* ================= DESKTOP (نفس كودك بدون تغيير) ================= */}
    {!isMobile && (
      <TableContainer
        sx={{
            width: "100%",
          borderRadius: 3,
          border: "1px solid rgba(106, 106, 87, 0.15)",
          background: "rgba(255,255,255,0.25)",
        }}
      >
        <Table stickyHeader
  size="small"
  sx={{
    tableLayout: "fixed",
    width: "100%",
  }} >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 900,
                  background: "rgba(106,106,87,0.18)",
                  
                }}
              >
                الممرضة
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
                <TableRow key={r.nurseId} hover>
                  <TableCell sx={{ fontWeight: 800 }}>
                    {r.nurseName}
                  </TableCell>

                  {dates.map((d) => (
                    <TableCell key={`${r.nurseId}-${d}`} align="center">
                      {renderShiftCell(r.days?.[d])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )}

    {/* ================= MOBILE (حسب اليوم) ================= */}
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
                rows.map((r) => (
                  <Box
                    key={`${r.nurseId}-${d}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom:
                        "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      {r.nurseName}
                    </Typography>

                    {renderShiftCell(r.days?.[d])}
                  </Box>
                ))
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



