import { useEffect, useRef, useState } from "react";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


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
  DialogActions,
  IconButton,
  Chip,
} from "@mui/material";


import GroupsIcon from "@mui/icons-material/Groups";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link as RouterLink } from "react-router-dom";


const topCardStyles = {
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


const uploadBtnSx = {
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


export default function ElderlyDoctor() {
  const [elderlies, setElderlies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);


  const [openUpload, setOpenUpload] = useState(false);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const fileInputRef = useRef(null);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const fetchElderlies = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get("/Doctor/mine/elderlies");
      const list = res?.data?.data || [];
      setElderlies(Array.isArray(list) ? list : []);
    } catch (err) {
      setElderlies([]);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل جلب المسنين",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchElderlies();
  }, []);


  const handleOpenUpload = (elderly) => {
    setSelectedElderly(elderly);
    setSelectedFile(null);
    setOpenUpload(true);


    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleCloseUpload = () => {
    if (uploading) return;


    setOpenUpload(false);
    setSelectedElderly(null);
    setSelectedFile(null);


    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleChooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };


  const handleSubmitUpload = async () => {
    if (!selectedElderly?.elderlyId) {
      setSnackbar({
        open: true,
        message: "لم يتم تحديد المسن",
        severity: "error",
      });
      return;
    }


    if (!selectedFile) {
      setSnackbar({
        open: true,
        message: "يرجى اختيار ملف التشخيص أولاً",
        severity: "warning",
      });
      return;
    }


    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("ElderlyId", selectedElderly.elderlyId);
      formData.append("DiagnosisFile", selectedFile);


      await AxiosUserInstance.post("/Doctor/medical-reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      setSnackbar({
        open: true,
        message: "تم رفع التشخيص بنجاح",
        severity: "success",
      });


      handleCloseUpload();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل رفع ملف التشخيص",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 3 },
      }}
    >
      <Card sx={topCardStyles}>
        <CardContent sx={cardContentSx}>
          <Box>
            <Box sx={titleWrapperSx}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
              >
                المسنون التابعون للطبيب
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
              يمكنك مراجعة المسنين التابعين لك ورفع ملف التشخيص لكل مسن
            </Typography>
          </Box>


          <Box
            sx={{
              width: { xs: 50, md: 70 },
              height: { xs: 50, md: 70 },
              ...iconCircleSx,
            }}
          >
            <GroupsIcon sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }} />
          </Box>
        </CardContent>
      </Card>


      {elderlies.length === 0 ? (
        <Typography align="center" sx={{ fontWeight: 800, color: "#666" }}>
          لا يوجد مسنون تابعون لهذا الطبيب
        </Typography>
      ) : (
        <>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Card
              component={Paper}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 700, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          اسم المسن
                        </TableCell>


                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          رفع التشخيص
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          تفاصيل المسنة
                        </TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {elderlies.map((item) => (
                        <TableRow key={item.elderlyId}>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 800 }}>
                              {item.elderlyName}
                            </Typography>
                          </TableCell>


                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<UploadFileOutlinedIcon />}
                              sx={{ ...uploadBtnSx, gap: 1 }}
                              onClick={() => handleOpenUpload(item)}
                            >
                              رفع التشخيص
                            </Button>
                          </TableCell>


                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="contained"
                              component={RouterLink}
                              to={`/Doctor/Elderly-Details/${item.elderlyId}`}
                              sx={{ ...uploadBtnSx, gap: 1 }}
                            >
                              تفاصيل المسنة
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>


          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {elderlies.map((item) => (
              <Card key={item.elderlyId} sx={mobileUserCardStyles}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: 15 }}>
                    الاسم: {item.elderlyName}
                  </Typography>


                  <Box sx={{ mt: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<UploadFileOutlinedIcon />}
                      sx={{ ...uploadBtnSx, gap: 1 }}
                      onClick={() => handleOpenUpload(item)}
                    >
                      رفع ملف التشخيص
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}


      <Dialog
        open={openUpload}
        onClose={handleCloseUpload}
        maxWidth="sm"
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
              <LocalHospitalOutlinedIcon fontSize="small" />
            </Box>


            <Typography sx={{ fontWeight: 1000, fontSize: 16 }}>
              رفع تشخيص طبي
            </Typography>
          </Box>


          <IconButton
            onClick={handleCloseUpload}
            disabled={uploading}
            sx={{
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f2f2ea" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>


        <DialogContent sx={{ p: 2.2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "#f7f7f3",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#777", fontWeight: 800 }}>
                اسم المسن
              </Typography>
              <Typography
                sx={{ fontWeight: 1000, fontSize: 16, color: "#222" }}
              >
                {selectedElderly?.elderlyName || "-"}
              </Typography>
            </Box>


            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "rgba(65,125,68,0.06)",
                border: "1px dashed rgba(65,125,68,0.35)",
                textAlign: "center",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleChooseFile}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />


              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 1.5,
                  background: "linear-gradient(135deg, #417d44, #6a6a57)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                }}
              >
                <DescriptionOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>


              <Typography
                sx={{ fontWeight: 1000, fontSize: 16, color: "#2d2d2d" }}
              >
                اختر ملف التشخيص
              </Typography>


              <Typography
                sx={{ mt: 0.8, fontSize: 13, color: "#777", fontWeight: 700 }}
              >
                يمكنك رفع PDF أو صورة أو ملف Word
              </Typography>


              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<UploadFileOutlinedIcon />}
                sx={{
                  ...buttonStyles,
                  mt: 2,
                  borderColor: "rgba(65,125,68,0.45)",
                  color: "#2f5f33",
                  "&:hover": {
                    borderColor: "rgba(65,125,68,0.75)",
                    background: "rgba(65,125,68,0.05)",
                  },
                }}
              >
                اختيار الملف
              </Button>


              {selectedFile && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    icon={<DescriptionOutlinedIcon />}
                    label={selectedFile.name}
                    sx={{
                      maxWidth: "100%",
                      fontWeight: 900,
                      background: "#fff",
                      border: "1px solid rgba(65,125,68,0.18)",
                      "& .MuiChip-label": {
                        display: "block",
                        maxWidth: 250,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>


        <DialogActions sx={{ px: 2.2, pb: 2.2, pt: 0.5 }}>
          <Button
            onClick={handleCloseUpload}
            disabled={uploading}
            sx={{
              ...buttonStyles,
              color: "#666",
            }}
          >
            إلغاء
          </Button>


          <Button
            onClick={handleSubmitUpload}
            disabled={uploading}
            variant="contained"
            startIcon={uploading ? null : <UploadFileOutlinedIcon />}
            sx={{
              ...buttonStyles,
              minWidth: 150,
              background: "linear-gradient(135deg, #417d44, #6a6a57)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #356738, #555548)",
                boxShadow: "none",
              },
            }}
          >
            {uploading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "رفع التشخيص"
            )}
          </Button>
        </DialogActions>
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



