
import { useEffect, useState } from "react";
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
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from "@mui/material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";


const API_BASE = "/Doctor/doctor-change-requests";
// إذا كان الـ baseURL عندك يحتوي المسار بشكل مختلف، غيّر هذا السطر فقط.


const addRequestsCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const mobileUserCardStyles = {
  mb: 2,
  borderRadius: 3,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};


const buttonStyles = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 900,
};


const previewBtnSx = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 900,
  backgroundColor: "#FFF8E1",
  color: "#8D6E63",
  border: "1px solid rgba(141,110,99,0.35)",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#FFECB3",
    boxShadow: "none",
  },
};


const cardContentSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 2,
};


const titleWrapperSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  flexWrap: "wrap",
};


const iconCircleSx = {
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};


const actionsBoxSx = {
  display: "flex",
  justifyContent: "center",
  gap: 1,
  flexWrap: "wrap",
};


const getStatusLabel = (status) => {
  switch (status) {
    case "Pending":
      return "قيد المراجعة";
    case "Active":
      return "مقبول";
    case "InActive":
      return "مرفوض";
    default:
      return status || "-";
  }
};


const getStatusChipSx = (status) => {
  if (status === "Active") {
    return {
      fontWeight: 900,
      color: "#fff",
      backgroundColor: "#2E7D32",
    };
  }


  if (status === "InActive") {
    return {
      fontWeight: 900,
      color: "#fff",
      backgroundColor: "#C62828",
    };
  }


  return {
    fontWeight: 900,
    color: "#fff",
    backgroundColor: "#9E7B00",
  };
};


export default function ElderlyRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");


  const isPdf = (url = "") => url.toLowerCase().includes(".pdf");


  const isImage = (url = "") => {
    const lower = url.toLowerCase();
    return (
      lower.includes(".png") ||
      lower.includes(".jpg") ||
      lower.includes(".jpeg") ||
      lower.includes(".webp") ||
      lower.includes(".gif")
    );
  };


  const openFilePreview = (url, title) => {
    if (!url) return;
    setPreviewUrl(url);
    setPreviewTitle(title || "عرض الملف");
    setOpenPreview(true);
  };


  const closeFilePreview = () => {
    setOpenPreview(false);
    setPreviewUrl("");
    setPreviewTitle("");
  };


  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get(`${API_BASE}/pending`);
      setRequests(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل جلب الطلبات",
        severity: "error",
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

const navigate = useNavigate();
  useEffect(() => {
    fetchRequests();
  }, []);


  const handleStatusChange = async (requestId, type) => {
    setActionLoadingId(requestId);


    try {
      const endpoint =
        type === "approve"
          ? `${API_BASE}/${requestId}/approve`
          : `${API_BASE}/${requestId}/reject`;


      await AxiosUserInstance.put(endpoint);


      setSnackbar({
        open: true,
        message: type === "approve" ? "تم قبول الطلب بنجاح" : "تم رفض الطلب بنجاح",
        severity: "success",
      });


      await fetchRequests();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل تعديل الحالة",
        severity: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 3 },
      }}
    >
      <Card sx={addRequestsCardStyles}>
        <CardContent sx={cardContentSx}>
          <Box>
            <Box sx={titleWrapperSx}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
              >
                طلبات تغيير الطبيب
              </Typography>


              <ElderlyWomanIcon
                sx={{ fontSize: { xs: 26, md: 34 }, color: "#fff" }}
              />
            </Box>


            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 12, md: 16 },
              }}
            >
              راجع الطلبات المعلقة، اعرض الفحص الشامل، ثم اقبل أو ارفض الطلب
            </Typography>
          </Box>


          <Box
            sx={{
              width: { xs: 50, md: 70 },
              height: { xs: 50, md: 70 },
              ...iconCircleSx,
            }}
          >
            <PendingActionsIcon
              sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }}
            />
          </Box>
        </CardContent>
      </Card>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Card component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 800, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          اسم المسن
                        </TableCell>

                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          تفاصيل المسنة
                      </TableCell>

                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الإجراءات
                        </TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {requests.length > 0 ? (
                        requests.map((item) => (
                          <TableRow key={item.requestId}>
                            <TableCell align="center">
                              <Typography sx={{ fontWeight: 800 }}>
                                {item.elderlyName}
                              </Typography>
                            </TableCell>


                           

<TableCell align="center">

                              <Button
  size="small"
  variant="contained"
  sx={{ ...previewBtnSx, gap: 1 }}
  onClick={() =>
    navigate(`/Doctor/Elderly-Details/${item.elderlyId}`)
  }
>
  عرض التفاصيل
</Button></TableCell>



                            <TableCell align="center">
                              <Box sx={actionsBoxSx}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={
                                    actionLoadingId === item.requestId ? null : (
                                      <CheckCircleRoundedIcon />
                                    )
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: { xs: 11, md: 13 },
                                    fontWeight: 900,
                                    gap:1,
                                    backgroundColor: "#417d44",
                                    boxShadow: "none",
                                    "&:hover": { backgroundColor: "#256427" },
                                  }}
                                  disabled={actionLoadingId === item.requestId}
                                  onClick={() =>
                                    handleStatusChange(item.requestId, "approve")
                                  }
                                >
                                  {actionLoadingId === item.requestId
                                    ? "جارٍ التنفيذ..."
                                    : "قبول"}
                                </Button>


                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={
                                    actionLoadingId === item.requestId ? null : (
                                      <CancelRoundedIcon />
                                    )
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: { xs: 11, md: 13 },
                                    gap:1,
                                    fontWeight: 900,
                                    backgroundColor: "#C62828",
                                    boxShadow: "none",
                                    "&:hover": { backgroundColor: "#B71C1C" },
                                  }}
                                  disabled={actionLoadingId === item.requestId}
                                  onClick={() =>
                                    handleStatusChange(item.requestId, "reject")
                                  }
                                >
                                  {actionLoadingId === item.requestId
                                    ? "جارٍ التنفيذ..."
                                    : "رفض"}
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            لا توجد طلبات معلقة
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>


          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {requests.length > 0 ? (
              requests.map((item) => (
                <Card key={item.requestId} sx={mobileUserCardStyles}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: 15 }}>
                      الاسم: {item.elderlyName}
                    </Typography>




                    <Box sx={{ mt: 1.5 }}>
                     <Button
  fullWidth
  variant="contained"
  sx={{ ...previewBtnSx, gap: 1 }}
  onClick={() =>
    navigate(`/Doctor/Elderly-Details/${item.elderlyId}`)
  }
>
  عرض التفاصيل
</Button>
                    </Box>


                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            ...buttonStyles,
                            backgroundColor: "#417d44",
                            "&:hover": { backgroundColor: "#256427" },
                          }}
                          disabled={actionLoadingId === item.requestId}
                          onClick={() =>
                            handleStatusChange(item.requestId, "approve")
                          }
                        >
                          {actionLoadingId === item.requestId
                            ? "جارٍ التنفيذ..."
                            : "قبول"}
                        </Button>


                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            ...buttonStyles,
                            backgroundColor: "#C62828",
                            "&:hover": { backgroundColor: "#B71C1C" },
                          }}
                          disabled={actionLoadingId === item.requestId}
                          onClick={() =>
                            handleStatusChange(item.requestId, "reject")
                          }
                        >
                          {actionLoadingId === item.requestId
                            ? "جارٍ التنفيذ..."
                            : "رفض"}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography align="center" sx={{ fontWeight: 800, color: "#666" }}>
                لا توجد طلبات معلقة
              </Typography>
            )}
          </Box>
        </>
      )}


      <Dialog
        open={openPreview}
        onClose={closeFilePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
            border: "1px solid rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #ffffff 0%, #f6f6ef 100%)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1.6,
            px: 2.2,
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            color: "#4a4a3d",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6a6a57, #417d44)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
              }}
            >
              <PhotoLibraryOutlinedIcon fontSize="small" />
            </Box>


            <Typography sx={{ fontWeight: 1000, fontSize: 16 }}>
              {previewTitle}
            </Typography>
          </Box>


          <IconButton
            onClick={closeFilePreview}
            sx={{
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f2f2ea" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>


        <DialogContent sx={{ p: 2.2, background: "transparent" }}>
          {isPdf(previewUrl) ? (
            <Box
              component="iframe"
              src={previewUrl}
              title="preview"
              sx={{
                width: "100%",
                height: "70vh",
                border: 0,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
              }}
            />
          ) : isImage(previewUrl) ? (
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="preview"
                sx={{
                  width: { xs: "100%", sm: "85%", md: "75%" },
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
                  p: 1.2,
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                minHeight: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography sx={{ fontWeight: 900, color: "#666" }}>
                لا يمكن عرض هذا النوع مباشرة داخل الصفحة
              </Typography>


              <Button
                component="a"
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                sx={{
                  ...buttonStyles,
                  backgroundColor: "#417d44",
                  "&:hover": { backgroundColor: "#256427" },
                }}
              >
                فتح الملف
              </Button>
            </Box>
          )}
        </DialogContent>
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
