import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Avatar,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";


import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import GroupIcon from "@mui/icons-material/Group";
import CloseIcon from "@mui/icons-material/Close";


import AxiosUserInstance from "../../../api/AxiosUserInstance";


export default function NurseProfile() {
  const navigate = useNavigate();


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const [openCert, setOpenCert] = useState(false);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));


  const fetchNurse = async () => {
    try {
      const res = await AxiosUserInstance.get("/Nurse/Nurse");
      // حسب كلامك: res.data?.user
      setUser(res.data?.user);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setSnackbar({
        open: true,
        message: "فشل جلب بيانات الممرضة",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNurse();
  }, []);


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }


  if (!user) return null;


  const basicFields = [
    { label: "البريد الإلكتروني", value: user.email, icon: <EmailIcon /> },
    { label: "رقم الهاتف", value: user.phoneNumber, icon: <PhoneIcon /> },
    { label: "المدينة", value: user.city, icon: <LocationOnIcon /> },
    { label: "رقم الهوية", value: user.nationalId, icon: <BadgeIcon /> },
    { label: "الجنس", value: user.gender, icon: <WcIcon /> },
    {
      label: "الحالة الاجتماعية",
      value: user.maritalStatus,
      icon: <GroupIcon />,
    },
  ];


  const nurseAcademicFields = [
    { label: "المستوى التعليمي", value: user.educationLevel },
    { label: "التخصص", value: user.fieldOfStudy },
    { label: "عدد سنوات الدراسة", value: user.yearsOfStudy },
    { label: "سنة التخرج", value: user.yearOfGraduation },
  ];


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 6 },
      }}
    >
      <Grid container spacing={4} alignItems="stretch">
        {/* ===== العمود الأيسر ===== */}
        <Grid size={{ xs: 12, lg: 5 }} sx={{ display: "flex" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            {/* الصورة والمعلومات الشخصية */}
            <Box sx={{ textAlign: "center", position: "relative" }}>
              <Box sx={{ display: "inline-block", position: "relative" }}>
                <Avatar
                  src={user.image}
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 35,
                    mx: "auto",
                    border: "4px solid #6a6a57",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  {user.fullName?.charAt(0)}
                </Avatar>
              </Box>


              <Typography sx={{ mt: 2, fontSize: 28, fontWeight: 900 }}>
                {user.fullName}
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, opacity: 0.9 }}>
                ممرض
              </Typography>
            </Box>


            {/* المعلومات الشخصية */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontSize: 16,
                  borderRight: "4px solid #6a6a57",
                  pr: 1,
                }}
              >
                المعلومات الشخصية
              </Typography>


              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {basicFields.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      borderRadius: 2,
                      background: "#f7f7f3",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: 35,
                        height: 35,
                        borderRadius: "50%",
                        background: "#6a6a57",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>


                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.value ?? "-"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>


        {/* ===== العمود الأيمن ===== */}
        <Grid size={{ xs: 12, lg: 7 }} sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            {/* أكاديمي */}
            <Paper sx={{ p: 3, borderRadius: 4, flexGrow: 1 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontSize: 16,
                  borderRight: "4px solid #417d44",
                  pr: 1,
                }}
              >
                المعلومات الأكاديمية
              </Typography>


              <Grid container spacing={2}>
                {nurseAcademicFields.map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: "#f7f7f3",
                      }}
                    >
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 800 }}>
                        {item.value ?? "-"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>


           {/* الشهادة: Preview + Dialog */}
{user.imageCertificate && (
  <Paper
    sx={{
      p: 3,
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Typography
      sx={{
        fontWeight: 900,
        mb: 3,
        fontSize: 16,
        borderRight: "4px solid #6a6a57",
        pr: 1,
        alignSelf: "flex-start",
      }}
    >
      الشهادة
    </Typography>

    {/* Preview */}
    <Box
      component="img"
      src={user.imageCertificate}
      onClick={() => setOpenCert(true)}
      sx={{
        width: { xs: "100%", sm: "80%", md: "60%" },
        maxHeight: "80vh", // بدل ارتفاع ثابت
        objectFit: "contain", // بدل cover
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)", // ظل أقوى
        backgroundColor: "#fff",
        p: 1,
        cursor: "pointer",
      }}
    />


    {/* Dialog */}
    <Dialog
      open={openCert}
      onClose={() => setOpenCert(false)}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogContent sx={{ p: 2, position: "relative" }}>
        <IconButton
          onClick={() => setOpenCert(false)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "rgba(0,0,0,0.05)",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography fontWeight="bold" sx={{ mb: 2, pr: 5 }}>
          الشهادة
        </Typography>

        <Box
          component="img"
          src={user.imageCertificate}
          sx={{
            width: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: 3,
            background: "#fff",
          }}
        />
      </DialogContent>
    </Dialog>
  </Paper>
)}
          </Box>
        </Grid>


        {/* الخبرات العملية */}
        {user.workExperiences?.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontSize: 16,
                  borderRight: "4px solid #6a6a57",
                  pr: 1,
                }}
              >
                الخبرات العملية
              </Typography>


              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {user.workExperiences.map((work, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#f7f7f3",
                    }}
                  >
                    <Typography sx={{ fontSize: 16, color: "#555", mt: 0.5 }}>
                      لقد عمل/ت في{" "}
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {work.workName}
                      </Box>{" "}
                      واكتسب/ت خبرة في هذا المجال
                    </Typography>


                    <Typography
                      sx={{ fontSize: 14, color: "#777", fontWeight: 700 }}
                    >
                      {work.workLocation}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}



