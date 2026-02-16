import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ElderlyIcon from "@mui/icons-material/Elderly";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EditIcon from "@mui/icons-material/Edit";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import style from "./AdminElderlies.module.css";


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const cardStyles = {
  mb: 2,
  borderRadius: 3,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const pillBtn = {
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 900,
};

const detailsBtnSx = {
  ...pillBtn,
  fontSize: { xs: 12, md: 13 },
  backgroundColor: "#FFF8E1",
  color: "#8D6E63",
  border: "1px solid rgba(141,110,99,0.35)",
  borderRadius:2
};


export default function AdminElderlies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStatusId, setEditingStatusId] = useState(null);


  const [filterStatus, setFilterStatus] = useState("Active");


  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  // loading state per row when changing status
  const [statusLoadingId, setStatusLoadingId] = useState(null);


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const fetchElderlies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;


      const res = await AxiosUserInstance.get("/Admin/Elderly", { params });
      const list = res.data?.data || res.data?.elderlies || res.data;
      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "فشل جلب بيانات المسنين",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchElderlies();
  }, [filterStatus]);


  // ✅ إصلاح مشكلة "غير نشط" يحتوي "نشط"
  const normalized = useMemo(() => {
    return (data || []).map((e) => {
      const s = String(e.status || "")
        .trim()
        .toLowerCase();


      // اعتبره Active فقط إذا كان EXACT:
      const isActive = s === "active" || s === "نشط" || s === "متاحة"; // اختياري إذا عندك متاحة


      const isInactive =
        s === "inactive" ||
        s === "in active" || // احتياط
        s === "غير نشط" ||
        s === "غير نشطة";


      const finalIsActive = isActive && !isInactive;


      return {
        ...e,
        isActive: finalIsActive,
      };
    });
  }, [data]);


  const patchElderlyStatus = async (elderlyId, currentIsActive) => {
    const newStatus = currentIsActive ? "InActive" : "Active";


    setStatusLoadingId(elderlyId);
    try {
      await AxiosUserInstance.patch(
        `/Admin/Elderly/${elderlyId}/status`,
        null,
        { params: { status: newStatus } },
      );


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم تغيير الحالة بنجاح",
      });
      setEditingStatusId(null);


      setData((prev) =>
        prev.map((x) =>
          x.elderlyId === elderlyId
            ? { ...x, status: newStatus === "Active" ? "نشط" : "غير نشط" }
            : x,
        ),
      );


      // ✅ أفضل: خليك تعتمد على الباك
      await fetchElderlies();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "فشل تغيير الحالة",
      });
    } finally {
      setStatusLoadingId(null);
    }
  };


  const StatusInlineWithEdit = ({ e }) => {
  const isEditing = editingStatusId === e.elderlyId;
  const nextLabel = e.isActive ? "غير نشط" : "نشط";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        flexWrap: "wrap",
      }}
    >
      {/* ===== Status Chip ===== */}
      {!isEditing && (
        <>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              fontSize: 13,
              fontWeight: 800,
              backgroundColor: e.isActive ? "#E8F5E9" : "#FFEBEE",
              color: e.isActive ? "#2E7D32" : "#C62828",
            }}
          >
            {e.isActive ? "نشط" : "غير نشط"}
          </Box>

          <Tooltip title="تغيير الحالة">
            <span>
              <IconButton
                size="small"
                disabled={statusLoadingId === e.elderlyId}
                onClick={() => setEditingStatusId(e.elderlyId)}
                sx={{
                  backgroundColor: "#f0f4f0",
                  "&:hover": { backgroundColor: "#dce3dc" },
                  borderRadius: 2,
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )}

      {/* ===== Edit Mode ===== */}
      {isEditing && (
        <Box sx={{ display: "inline-flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={statusLoadingId === e.elderlyId}
            onClick={() => patchElderlyStatus(e.elderlyId, e.isActive)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              boxShadow: "none",
              fontSize: 13,
            }}
          >
            {statusLoadingId === e.elderlyId
              ? "جارٍ التغيير..."
              : `تغيير إلى ${nextLabel}`}
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => setEditingStatusId(null)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: 13,
            }}
          >
            إلغاء
          </Button>
        </Box>
      )}
    </Box>
  );
};



  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* ===== Header Card ===== */}
      <Card sx={headerCardStyles}>
        <CardContent className={style.headerContent}>
          <Box>
            <Box className={style.titleWrapper}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
              >
                لوحة المسنين
              </Typography>


              <ElderlyIcon
                sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }}
              />
            </Box>


            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 12, md: 16 },
              }}
            >
              يمكنك عرض بيانات المسنين وحالتهم والكفلاء بسهولة
            </Typography>
          </Box>


          <Box
            sx={{ width: { xs: 50, md: 70 }, height: { xs: 50, md: 70 } }}
            className={style.iconCircle}
          >
            <TrendingUpIcon
              sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }}
            />
          </Box>
        </CardContent>
      </Card>


      {/* ===== Filters ===== */}
      <Grid container spacing={2} className={style.filtersGrid}>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#6a6a57", fontWeight: 500 }}>
              الحالة
            </InputLabel>
            <Select
              value={filterStatus}
              label="الحالة"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ borderRadius: 3, backgroundColor: "#fefefe" }}
            >
              <MenuItem value="Active">نشط</MenuItem>
              <MenuItem value="InActive">غير نشط</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>


      {/* ===== Content ===== */}
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
                          الاسم
                        </TableCell>
                       
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الحالة
                        </TableCell>
                       
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          التفاصيل
                        </TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {normalized.length > 0 ? (
                        normalized.map((e) => (
                          <TableRow key={e.elderlyId}>
                            <TableCell align="center">
                              {e.elderlyName}
                            </TableCell>

                        
                            <TableCell align="center">
                              <StatusInlineWithEdit e={e} />
                            </TableCell>

                         
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                component={Link}
                                to={`/admin/elderly/${e.elderlyId}`}
                                sx={detailsBtnSx}
                              >
                                تفاصيل المسن
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
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
  {normalized.length > 0 ? (
    normalized.map((e) => {
      const isEditing = editingStatusId === e.elderlyId;
      const nextLabel = e.isActive ? "غير نشط" : "نشط";

      return (
        <Card key={e.elderlyId} sx={cardStyles}>
          <CardContent sx={{ p: 2 }}>
            {/* الاسم */}
            <Typography sx={{ fontWeight: 900, fontSize: 14, mb: 1 }} noWrap>
              الاسم: {e.elderlyName}
            </Typography>

 {/* صف الحالة + زر تعديل الحالة */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
    width: "100%",
  }}
>
  {!isEditing && (
    <>
      {/* ===== الحالة (نص السطر) ===== */}
      <Box
        sx={{
          flex: 1,
          px: 2,
          py: 0.9,
          borderRadius: 2,
          fontSize: 15,
          fontWeight: 800,
          backgroundColor: e.isActive ? "#E8F5E9" : "#FFEBEE",
          color: e.isActive ? "#2E7D32" : "#C62828",
          textAlign: "center",
        }}
      >
        {e.isActive ? "نشط" : "غير نشط"}
      </Box>

      {/* ===== زر تعديل الحالة (نص السطر) ===== */}
      <Button
        onClick={() => setEditingStatusId(e.elderlyId)}
        disabled={statusLoadingId === e.elderlyId}
        sx={{
          flex: 1,
          borderRadius: 2,
          textTransform: "none",
          fontSize: 12,
          fontWeight: 800,
          backgroundColor: "#f0f4f0",
          color: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          height: 36,
          "&:hover": {
            backgroundColor: "#dce3dc",
          },
        }}
      >
        تعديل الحالة
        <EditIcon fontSize="small" />
      </Button>
    </>
  )}

  {/* ===== وضع التعديل ===== */}
  {isEditing && (
    <Button
      fullWidth
      size="small"
      variant="outlined"
      color="error"
      onClick={() => setEditingStatusId(null)}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontSize: 12,
        height: 36,
      }}
    >
      إلغاء
    </Button>
  )}
</Box>


            {/* زر تغيير الحالة يظهر فقط عند التعديل */}
            {isEditing && (
              <Button
                fullWidth
                size="small"
                variant="outlined"
                onClick={() => patchElderlyStatus(e.elderlyId, e.isActive)}
                disabled={statusLoadingId === e.elderlyId}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                {statusLoadingId === e.elderlyId
                  ? "جارٍ التغيير..."
                  : `تغيير الحالة إلى ${nextLabel}`}
              </Button>
            )}

            {/* زر تفاصيل المسن يظهر فقط إذا ليس في وضع التعديل */}
            {!isEditing && (
              <Button
                fullWidth
                variant="contained"
                component={Link}             
                to={`/admin/elderly/${e.elderlyId}`}
                sx={{ ...detailsBtnSx }}
              >
                تفاصيل المسن
              </Button>
            )}
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
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}



