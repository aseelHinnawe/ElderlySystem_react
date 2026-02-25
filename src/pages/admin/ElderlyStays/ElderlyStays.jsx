import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import { Link } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import style from "./ElderlyStays.module.css";


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const rowCardStyles = {
  mb: 2,
  borderRadius: 3,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};


const detailsBtn = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
  backgroundColor: "#FFF8E1",
  color: "#8D6E63",
  border: "1px solid rgba(141, 110, 99, 0.35)",
};


const actionBtn = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
};


export default function ElderlyStays() {
  const [elderlies, setElderlies] = useState([]);
  const [loading, setLoading] = useState(true);


  const [stayFilter, setStayFilter] = useState("Active");


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openActionsId, setOpenActionsId] = useState(null);


  const toggleActions = (id) => {
    setOpenActionsId((prev) => (prev === id ? null : id));
  };


  // ===== Dialog State =====
  const [dialog, setDialog] = useState({
    open: false,
    type: null, // "end" | "changeRoom" | "assign" | "renew"
    elderlyId: null,
    elderlyName: "",
  });


  const [rooms, setRooms] = useState([]); // available rooms list
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterName, setFilterName] = useState("");


  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [startDate, setStartDate] = useState(todayStr);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const filteredElderlies = useMemo(() => {
    const q = filterName.trim().toLowerCase();
    if (!q) return elderlies;


    return elderlies.filter((e) =>
      (e.elderlyName || "").toLowerCase().includes(q),
    );
  }, [elderlies, filterName]);
  const closeDialog = () => {
    setDialog({ open: false, type: null, elderlyId: null, elderlyName: "" });
    setRooms([]);
    setRoomsLoading(false);
    setSubmitLoading(false);
    setSelectedRoomId("");
    setStartDate(todayStr);
  };


  const fetchElderlies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (stayFilter) params.filter = stayFilter;


      const res = await AxiosUserInstance.get("/Admin/Elderly/by-stay", {
        params,
      });
      setElderlies(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "فشل جلب بيانات الإقامات",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchElderlies();
  }, [stayFilter]);


  // ===== API Calls Helpers =====
  const loadRoomsForAssignOrRenew = async () => {
    setRoomsLoading(true);
    try {
      const res = await AxiosUserInstance.get("/Admin/Elderly/rooms/available");
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "فشل جلب الغرف المتاحة",
        severity: "error",
      });
    } finally {
      setRoomsLoading(false);
    }
  };


  const loadRoomsForChange = async (elderlyId) => {
    setRoomsLoading(true);
    try {
      const res = await AxiosUserInstance.get(
        `/Admin/Elderly/${elderlyId}/rooms/available-for-change`,
      );
      console.log("rooms:", res.data?.data);
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "فشل جلب الغرف المتاحة لتغيير الغرفة",
        severity: "error",
      });
    } finally {
      setRoomsLoading(false);
    }
  };


  // ===== Open Dialogs =====
  const openEndStayDialog = (elderlyId, elderlyName) => {
    setDialog({ open: true, type: "end", elderlyId, elderlyName });
  };


  const openChangeRoomDialog = async (elderlyId, elderlyName) => {
    setDialog({ open: true, type: "changeRoom", elderlyId, elderlyName });
    setSelectedRoomId("");
    await loadRoomsForChange(elderlyId);
  };


  const openAssignDialog = async (elderlyId, elderlyName) => {
    setDialog({ open: true, type: "assign", elderlyId, elderlyName });
    setSelectedRoomId("");
    setStartDate(todayStr);
    await loadRoomsForAssignOrRenew();
  };


  const openRenewDialog = async (elderlyId, elderlyName) => {
    setDialog({ open: true, type: "renew", elderlyId, elderlyName });
    setSelectedRoomId("");
    setStartDate(todayStr);
    await loadRoomsForAssignOrRenew();
  };


  // ===== Actions تنفيذ =====
  const submitEndStay = async () => {
    setSubmitLoading(true);
    try {
      await AxiosUserInstance.patch(
        `/Admin/Elderly/${dialog.elderlyId}/stay/end`,
      );
      setSnackbar({
        open: true,
        message: "تم إنهاء الإقامة بنجاح",
        severity: "success",
      });
      closeDialog();
      fetchElderlies();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل إنهاء الإقامة",
        severity: "error",
      });
      setSubmitLoading(false);
    }
  };


  const submitChangeRoom = async () => {
    if (!selectedRoomId) {
      setSnackbar({
        open: true,
        message: "يرجى اختيار الغرفة الجديدة",
        severity: "warning",
      });
      return;
    }
    setSubmitLoading(true);
    try {
      await AxiosUserInstance.patch(
        `/Admin/Elderly/${dialog.elderlyId}/stay/change-room`,
        { newRoomId: Number(selectedRoomId) },
      );
      setSnackbar({
        open: true,
        message: "تم تغيير الغرفة بنجاح",
        severity: "success",
      });
      closeDialog();
      fetchElderlies();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل تغيير الغرفة",
        severity: "error",
      });
      setSubmitLoading(false);
    }
  };


  const submitAssignOrRenew = async () => {
    if (!selectedRoomId) {
      setSnackbar({
        open: true,
        message: "يرجى اختيار الغرفة",
        severity: "warning",
      });
      return;
    }
    if (!startDate) {
      setSnackbar({
        open: true,
        message: "يرجى اختيار تاريخ البداية",
        severity: "warning",
      });
      return;
    }


    setSubmitLoading(true);
    try {
      // ✅ بدون EndDate
      await AxiosUserInstance.post("/Admin/Elderly/stay", {
        elderlyId: dialog.elderlyId,
        roomId: Number(selectedRoomId),
        startDate, // yyyy-mm-dd
      });


      setSnackbar({
        open: true,
        message:
          dialog.type === "renew"
            ? "تم تجديد الإقامة بنجاح"
            : "تم تحديد الإقامة بنجاح",
        severity: "success",
      });
      closeDialog();
      fetchElderlies();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل العملية",
        severity: "error",
      });
      setSubmitLoading(false);
    }
  };


  const renderActions = (elderlyId, elderlyName) => {
    const isMobile = window.innerWidth < 900; // md breakpoint


    if (stayFilter === "Active") {
      return (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: "100%",
            justifyContent: { xs: "space-between", md: "center" },
          }}
        >
          <Button
            size="small"
            variant="outlined"
            color="error"
            sx={{
              ...actionBtn,
              flex: { xs: 1, md: "unset" },
            }}
            onClick={() => openEndStayDialog(elderlyId, elderlyName)}
          >
            إنهاء الإقامة
          </Button>


          <Button
            size="small"
            variant="outlined"
            sx={{
              ...actionBtn,
              flex: { xs: 1, md: "unset" },
            }}
            onClick={() => openChangeRoomDialog(elderlyId, elderlyName)}
          >
            تغيير الغرفة
          </Button>
        </Box>
      );
    }


    if (stayFilter === "None") {
      return (
        <Box sx={{ width: "100%" }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            sx={actionBtn}
            onClick={() => openAssignDialog(elderlyId, elderlyName)}
          >
            تحديد إقامة
          </Button>
        </Box>
      );
    }


    return (
      <Box sx={{ width: "100%" }}>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          sx={actionBtn}
          onClick={() => openRenewDialog(elderlyId, elderlyName)}
        >
          تجديد الإقامة
        </Button>
      </Box>
    );
  };


  const dialogTitle =
    dialog.type === "end"
      ? "إنهاء الإقامة"
      : dialog.type === "changeRoom"
        ? "تغيير الغرفة"
        : dialog.type === "renew"
          ? "تجديد الإقامة"
          : "تحديد إقامة";


  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Card sx={headerCardStyles}>
        <CardContent className={style.headerContent}>
          <Box>
            <Box className={style.titleWrapper}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
              >
                لوحة إقامات المسنين
              </Typography>
            </Box>


            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 12, md: 16 },
              }}
            >
              يمكنك عرض المسنين حسب حالة الإقامة
            </Typography>
          </Box>
        </CardContent>
      </Card>


      {/* Filters */}
      <Grid container spacing={2} className={style.filtersGrid}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="بحث بالاسم"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="اكتب اسم المستخدم..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#fefefe",
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#6a6a57", fontWeight: 500 }}>
              حالة الإقامة
            </InputLabel>
            <Select
              value={stayFilter}
              label="حالة الإقامة"
              onChange={(e) => setStayFilter(e.target.value)}
              sx={{ borderRadius: 3, backgroundColor: "#fefefe" }}
            >
              <MenuItem value="Active">نشط</MenuItem>
              <MenuItem value="Finish">منتهي</MenuItem>
              <MenuItem value="None">جديد</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* ===== Desktop Table ===== */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Card
              component={Paper}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 450, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          اسم المسن
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الحالة
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الإجراءات
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          التفاصيل
                        </TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {filteredElderlies.length > 0 ? (
                        filteredElderlies.map((e) => (
                          <TableRow key={e.elderlyId}>
                            <TableCell align="center">
                              {e.elderlyName}
                            </TableCell>


                            <TableCell align="center">
                              <Box
                                sx={{
                                  px: 2,
                                  py: 0.6,
                                  borderRadius: 3,
                                  fontSize: 13,
                                  fontWeight: 800,
                                  display: "inline-block",
                                  backgroundColor:
                                    stayFilter === "Active"
                                      ? "#E8F5E9"
                                      : stayFilter === "Finish"
                                        ? "#FFEBEE"
                                        : "#E3F2FD",
                                  color:
                                    stayFilter === "Active"
                                      ? "#2E7D32"
                                      : stayFilter === "Finish"
                                        ? "#C62828"
                                        : "#1565C0",
                                }}
                              >
                                {stayFilter === "Active"
                                  ? "نشط"
                                  : stayFilter === "Finish"
                                    ? "منتهي"
                                    : "جديد"}
                              </Box>
                            </TableCell>


                            <TableCell align="center">
                              {renderActions(e.elderlyId, e.elderlyName)}
                            </TableCell>


                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                component={Link}
                                to={`/Admin/elderly/${e.elderlyId}`}
                                sx={{
                                  ...detailsBtn,
                                  fontSize: { xs: 10, md: 13 },
                                }}
                              >
                                تفاصيل المسن
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
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
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {filteredElderlies.length > 0 ? (
              filteredElderlies.map((e) => (
                <Card key={e.elderlyId} sx={rowCardStyles}>
                  <CardContent sx={{ p: 2 }}>
                    {/* اسم + الحالة + قلم */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                        {e.elderlyName}
                      </Typography>


                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {/* الحالة */}
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.4,
                            borderRadius: 3,
                            fontSize: 14,
                            fontWeight: 800,
                            backgroundColor:
                              stayFilter === "Active"
                                ? "#E8F5E9"
                                : stayFilter === "Finish"
                                  ? "#FFEBEE"
                                  : "#E3F2FD",
                            color:
                              stayFilter === "Active"
                                ? "#2E7D32"
                                : stayFilter === "Finish"
                                  ? "#C62828"
                                  : "#1565C0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stayFilter === "Active"
                            ? "نشط"
                            : stayFilter === "Finish"
                              ? "منتهي"
                              : "جديد"}
                        </Box>


                        {/* القلم */}
                        <IconButton
                          size="small"
                          onClick={() => toggleActions(e.elderlyId)}
                          sx={{
                            width: 27,
                            height: 27,
                            borderRadius: 2, // هون السر 👈 مش 50%
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #e0e0e0",
                            "&:hover": {
                              backgroundColor: "#e0e0e0",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>


                    {/* الأزرار تظهر عند الضغط */}
                    {openActionsId === e.elderlyId && (
                      <Box sx={{ mb: 1, mt: 1 }}>
                        {renderActions(e.elderlyId, e.elderlyName)}
                      </Box>
                    )}


                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to={`/Admin/elderly/${e.elderlyId}`}
                      sx={detailsBtn}
                    >
                      تفاصيل المسن
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography align="center">لا توجد بيانات</Typography>
            )}
          </Box>
        </>
      )}


      {/* ===== Dialog ===== */}
      <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>
          {dialogTitle} — {dialog.elderlyName || ""}
        </DialogTitle>


        <DialogContent dividers sx={{ direction: "rtl" }}>
          {/* End Stay */}
          {dialog.type === "end" && (
            <Typography sx={{ fontSize: 14 }}>
              هل أنت متأكد أنك تريد <b>إنهاء الإقامة</b> لهذا المسن؟
              <br />
              سيتم ضبط تاريخ النهاية تلقائيًا على تاريخ اليوم.
            </Typography>
          )}


          {/* Change Room */}
          {dialog.type === "changeRoom" && (
            <>
              <Typography sx={{ mb: 2, fontSize: 14 }}>
                اختر الغرفة الجديدة من الغرف المتاحة:
              </Typography>


              {roomsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={26} />
                </Box>
              ) : (
                <FormControl fullWidth>
                  <InputLabel>الغرفة الجديدة</InputLabel>
                  <Select
                    value={selectedRoomId}
                    label="الغرفة الجديدة"
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                  >
                    {rooms.length > 0 ? (
                      rooms.map((r) => (
                        <MenuItem key={r.roomId} value={r.roomId}>
                          {r.roomNumber} — {r.roomTypeName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>لا توجد غرف متاحة</MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}
            </>
          )}


          {/* Assign / Renew */}
          {(dialog.type === "assign" || dialog.type === "renew") && (
            <>
              <Typography sx={{ mb: 2, fontSize: 14 }}>
                اختر الغرفة وتاريخ البداية:
              </Typography>


              {roomsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={26} />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>الغرفة</InputLabel>
                      <Select
                        value={selectedRoomId}
                        label="الغرفة"
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                      >
                        {rooms.length > 0 ? (
                          rooms.map((r) => (
                            <MenuItem key={r.roomId} value={r.roomId}>
                              {r.roomNumber} — {r.roomTypeName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>لا توجد غرف متاحة</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>


                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="تاريخ البداية"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </DialogContent>


        <DialogActions sx={{ direction: "rtl", px: 2, py: 1.5 }}>
          <Button
            onClick={closeDialog}
            variant="outlined"
            sx={{ borderRadius: 2, ml: 1 }}
          >
            إلغاء
          </Button>


          {dialog.type === "end" && (
            <Button
              onClick={submitEndStay}
              variant="contained"
              color="error"
              disabled={submitLoading}
              sx={{ borderRadius: 2, fontWeight: 900 }}
            >
              {submitLoading ? "جاري..." : "إنهاء الإقامة"}
            </Button>
          )}


          {dialog.type === "changeRoom" && (
            <Button
              onClick={submitChangeRoom}
              variant="contained"
              disabled={submitLoading || roomsLoading || rooms.length === 0}
              sx={{ borderRadius: 2, fontWeight: 900 }}
            >
              {submitLoading ? "جاري..." : "تأكيد تغيير الغرفة"}
            </Button>
          )}


          {(dialog.type === "assign" || dialog.type === "renew") && (
            <Button
              onClick={submitAssignOrRenew}
              variant="contained"
              disabled={submitLoading || roomsLoading || rooms.length === 0}
              sx={{ borderRadius: 2, fontWeight: 900 }}
            >
              {submitLoading
                ? "جاري..."
                : dialog.type === "renew"
                  ? "تجديد الإقامة"
                  : "تحديد الإقامة"}
            </Button>
          )}
        </DialogActions>
      </Dialog>


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}





