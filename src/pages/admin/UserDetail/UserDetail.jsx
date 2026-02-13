import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import GroupIcon from "@mui/icons-material/Group";

import AxiosUserInstance from "../../../api/AxiosUserInstance";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const fetchUser = async () => {
    try {
      const res = await AxiosUserInstance.get(`/Admin/User/${id}`);
      setUser(res.data.user);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب بيانات المستخدم",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

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
    { label: "الرقم الوطني", value: user.nationalId, icon: <BadgeIcon /> },
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

  const isActive = user.status === "نشط";

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
        {user.roleUser === "ممرض" && (
          <>
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
                  {/* ===== Avatar مع حالة ملتصقة ===== */}
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

                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 6,
                        right: -8,
                        fontWeight: 800,
                        backgroundColor: isActive ? "#4CAF50" : "#D32F2F",
                        color: "#fff",
                      }}
                    />
                  </Box>

                  {/* ===== الاسم والدور تحت الصورة ===== */}
                  <Typography sx={{ mt: 2, fontSize: 28, fontWeight: 900 }}>
                    {user.fullName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 18, fontWeight: 700, opacity: 0.9 }}
                  >
                    {user.roleUser}
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

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
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
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                          {item.value}
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
                {/* الأكاديمية */}
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
                            {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                {/* الشهادة */}
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

                    <Box
                      component="img"
                      src={user.imageCertificate}
                      sx={{
                        width: { xs: "100%", sm: "80%", md: "60%" },
                        maxHeight: "80vh",
                        objectFit: "contain",
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        backgroundColor: "#fff",
                        p: 1,
                      }}
                    />
                  </Paper>
                )}
              </Box>
            </Grid>
            {/* ===== الخبرات العملية تحت كامل المحتوى ===== */}
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

              <Typography sx={{ fontSize: 14, color: "#777" ,fontWeight: 700}}>
                {work.workLocation}
              </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}
          </>
        )}
        

         {/* ======= شرط الحارس + عاملة النظافة ======= */}
        {(user.roleUser === "حارس" || user.roleUser === "عاملة نظافة") && (
          <Box sx={{ mb: 4 }}>
            {/* ===== Header Gradient ===== */}
            <Paper
              elevation={6}
              sx={{
                py: 3,
                px: 3,
                mb: 3,
                borderRadius: 5,
                background: "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {/* ===== الصورة على اليمين ===== */}
                <Grid  sx={{ position: "relative" }}>
                  <Avatar
                    src={user.image}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: 50,
                      border: "4px solid #fff",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                    }}
                  >
                    {user.fullName?.charAt(0)}
                  </Avatar>

                  <Chip
                    label={user.status}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 6,
                      right: -8,
                      fontWeight: 800,
                      backgroundColor: isActive ? "#4CAF50" : "#D32F2F",
                      color: "#fff",
                    }}
                  />
                </Grid>

                {/* ===== الاسم والدور على اليسار ===== */}
                <Grid>
                  <Typography sx={{ fontSize: 28, fontWeight: 900 }}>
                    {user.fullName}
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, opacity: 0.9 }}>
                    {user.roleUser}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* ===== المربعات البيضاء أسفل Header ===== */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: "#fff",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {basicFields.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: "1 1 30%",
                    minWidth: 200,
                    p: 2,
                    borderRadius: 3,
                    background: "#f9f9f9",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 55,
                      height: 55,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#7e7e67",
                      color: "#fff",
                      mb: 1,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography sx={{ fontWeight: 800, color: "#555" }}>
                    {item.label}
                  </Typography>

                  <Typography sx={{ fontWeight: 900, fontSize: 18, color: "#222" }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        {/* ======= شرط المحاسب + سكرتيرة + مسؤولة طبخ ======= */}
{["محاسب", "سكرتيرة", "مسؤولة طبخ"].includes(user.roleUser) && (
  <Box sx={{ mb: 4 }}>
    {/* ===== Header Gradient ===== */}
    <Paper
      elevation={6}
      sx={{
        py: 3,
        px: 3,
        mb: 3,
        borderRadius: 5,
        background: "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* الصورة على اليمين */}
        <Grid sx={{ position: "relative" }}>
          <Avatar
            src={user.image}
            sx={{
              width: 120,
              height: 120,
              fontSize: 50,
              border: "4px solid #fff",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            {user.fullName?.charAt(0)}
          </Avatar>

          <Chip
            label={user.status}
            size="small"
            sx={{
              position: "absolute",
              bottom: 6,
              right: -8,
              fontWeight: 800,
              backgroundColor: isActive ? "#4CAF50" : "#D32F2F",
              color: "#fff",
            }}
          />
        </Grid>

        {/* الاسم والدور على اليسار */}
        <Grid>
          <Typography sx={{ fontSize: 28, fontWeight: 900 }}>
            {user.fullName}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, opacity: 0.9 }}>
            {user.roleUser}
          </Typography>
        </Grid>
      </Grid>
    </Paper>

    {/* ===== المربعات البيضاء أسفل Header ===== */}
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        background: "#fff",
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
      }}
    >
      {basicFields.map((item, i) => (
        <Box
          key={i}
          sx={{
            flex: "1 1 30%",
            minWidth: 200,
            p: 2,
            borderRadius: 3,
            background: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 55,
              height: 55,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#7e7e67",
              color: "#fff",
              mb: 1,
            }}
          >
            {item.icon}
          </Box>

          <Typography sx={{ fontWeight: 800, color: "#555" }}>
            {item.label}
          </Typography>

          <Typography sx={{ fontWeight: 900, fontSize: 18, color: "#222" }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Paper>

    {/* ===== المعلومات الأكاديمية ===== */}
    <Paper
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 4,
        background: "#fff",
      }}
    >
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
                background: "#f9f9f9",
              }}
            >
              <Typography sx={{ fontSize: 13, color: "#777" }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontWeight: 800 }}>{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>

    {/* ===== الخبرات العملية ===== */}
    {user.workExperiences?.length > 0 && (
      <Paper
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 4,
          background: "#fff",
        }}
      >
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
                background: "#f9f9f9",
              }}
            >
              <Typography sx={{ fontSize: 16, color: "#555", mt: 0.5 }}>
  لقد عمل/ت في{" "}
  <Box component="span" sx={{ fontWeight: 700 }}>
    {work.workName}
  </Box>{" "}
  واكتسب/ت خبرة في هذا المجال
</Typography>

              <Typography sx={{ fontSize: 14, color: "#777" ,fontWeight: 700}}>
                {work.workLocation}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    )}
  </Box>
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
