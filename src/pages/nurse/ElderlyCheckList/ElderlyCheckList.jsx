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


import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";


import AxiosUserInstance from "../../../api/AxiosUserInstance";


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
                          التاريخ
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          درجة الحرارة
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          النبض
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          سكر الدم
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          ضغط الدم
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          إدخال
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          إخراج
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          التفاصيل
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
                                        <Box
                                          sx={{
                                            border:
                                              "1px solid rgba(15, 15, 15, 0.14)",
                                            borderRadius: 4,
                                            background: "#ebebe0",
                                            overflow: "hidden",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              px: 2.5,
                                              py: 1.5,
                                              borderBottom:
                                                "1px solid rgba(106,106,87,0.12)",
                                              backgroundColor:
                                                "rgba(106,106,87,0.05)",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontWeight: 900,
                                                fontSize: 17,
                                                color: "#6a6a57",
                                                textAlign: "right",
                                              }}
                                            >
                                              تفاصيل الممرضة
                                            </Typography>
                                          </Box>


                                          <Box
                                            sx={{
                                              px: 2.5,
                                              py: 2,
                                              display: "grid",
                                              gridTemplateColumns:
                                                "repeat(4, minmax(0, 1fr))",
                                              gap: 3,
                                              alignItems: "start",
                                            }}
                                          >
                                            <Box sx={{ textAlign: "center" }}>
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


                                            <Box sx={{ textAlign: "center" }}>
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


                                            <Box sx={{ textAlign: "center" }}>
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


                                            <Box sx={{ textAlign: "center" }}>
                                              <Typography
                                                sx={{
                                                  fontSize: 12,
                                                  color: "text.secondary",
                                                  mb: 0.5,
                                                }}
                                              >
                                                الملاحظات
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontWeight: 700,
                                                  fontSize: 15,
                                                  color: "#2f2f27",
                                                  whiteSpace: "normal",
                                                  wordBreak: "break-word",
                                                  lineHeight: 1.8,
                                                }}
                                              >
                                                {getValue(details.notes)}
                                              </Typography>
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
                          {item.dateTime || "-"}
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
                              <Box sx={detailBoxSx}>
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: "text.secondary",
                                    mb: 0.5,
                                  }}
                                >
                                  اسم المسن
                                </Typography>
                                <Typography sx={{ fontWeight: 800 }}>
                                  {getValue(details.elderlyName)}
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
                                  اسم الممرضة
                                </Typography>
                                <Typography sx={{ fontWeight: 800 }}>
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


                              <Box sx={detailBoxSx}>
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: "text.secondary",
                                    mb: 0.5,
                                  }}
                                >
                                  الملاحظات
                                </Typography>
                                <Typography sx={{ fontWeight: 800 }}>
                                  {getValue(details.notes)}
                                </Typography>
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



