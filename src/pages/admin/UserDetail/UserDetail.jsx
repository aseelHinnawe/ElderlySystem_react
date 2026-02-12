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
    { label: "الحالة الاجتماعية", value: user.maritalStatus, icon: <GroupIcon /> },
  ];

  const nurseAcademicFields = [
{ label: "المستوى التعليمي", value: user.educationLevel },
{ label: "التخصص", value: user.fieldOfStudy },
{ label: "عدد سنوات الدراسة", value: user.yearsOfStudy },
{ label: "سنة التخرج", value: user.yearOfGraduation },
];

  const isActive = user.status === "نشط";

  // ======= HEADER موحد لكل المستخدمين =======
  const Header = (
    <Paper
      elevation={6}
      sx={{
        py: 2.5,
        px: 3,
        mb: 4,
        borderRadius: 5,
        background: "linear-gradient(135deg, #929979 0%, #636850 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item sx={{ position: "relative" }}>
          <Avatar
            src={user.image}
            sx={{
              width: 120,
              height: 120,
              fontSize: 40,
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

        <Grid item xs>
          <Typography sx={{ fontSize: 28, fontWeight: 900 }}>{user.fullName}</Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, opacity: 0.9 }}>{user.roleUser}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  // ======= المحتوى الرئيسي موحد للخلفية =======
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 6 },
      }}
    >
      {Header}

      <Grid container spacing={4}>

  {/* ======= شرط الممرض ======= */}
  {user.roleUser === "ممرض" && (
    <>
      {/* العمود الأول */}
      <Grid size={{xs:12,md:6}}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

          {/* المعلومات الشخصية */}
          <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: "#fff" }}>
            <Typography
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: 18,
                borderRight: "4px solid #6a6a57",
                pr: 1,
              }}
            >
              المعلومات الشخصية
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {basicFields.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#777" }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* المعلومات الأكاديمية */}
          <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: "#fff" }}>
            <Typography
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: 18,
                borderRight: "4px solid #417d44",
                pr: 1,
              }}
            >
              المعلومات الأكاديمية
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {nurseAcademicFields.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#777" }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Grid>

      {/* العمود الثاني */}
      <Grid size={{xs:12,md:6}}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

          {/* الشهادة */}
          {user.imageCertificate && (
            <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: "#fff" }}>
              <Typography sx={{ fontWeight: 900, mb: 2, fontSize: 18 }}>
                الشهادة
              </Typography>

              <Box
                component="img"
                src={user.imageCertificate}
                sx={{ width: "100%", maxHeight: 300, borderRadius: 3 }}
              />
            </Paper>
          )}

          {/* الخبرات */}
          {user.workExperiences?.length > 0 && (
            <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: "#fff" }}>
              <Typography sx={{ fontWeight: 900, mb: 2, fontSize: 18 }}>
                الخبرات العملية
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {user.workExperiences.map((work, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800 }}>
                      {work.workName}
                    </Typography>
                    <Typography sx={{ color: "#777", fontSize: 14 }}>
                      {work.workLocation}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Grid>
    </>
  )}

  {/* ======= شرط الحارس + عاملة النظافة ======= */}
  {/* ======= شرط الحارس + عاملة النظافة ======= */}
{(user.roleUser === "حارس" || user.roleUser === "عاملة نظافة") && (
  <Paper
    sx={{
      p: 3,
      borderRadius: 4,
      background: "#fff",
      display: "flex",
      flexWrap: "wrap",
      gap: 2, // المسافة بين المربعات الصغيرة
    }}
  >
    {basicFields.map((item, i) => (
      <Box
        key={i}
        sx={{
          flex: "1 1 30%", // كل مربع ياخد تقريباً ثلث المساحة، ويتغير حسب حجم الشاشة
          minWidth: 200, // الحد الأدنى لحجم المربع
          p: 2,
          borderRadius: 3,
          background: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
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
              background: "linear-gradient(135deg,#6b705c,#636850)",
              color: "#fff",
            }}
          >
            {item.icon}
          </Box>

          <Typography sx={{ fontWeight: 800, color: "#555" }}>
            {item.label}
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 900, fontSize: 18, color: "#222" }}>
          {item.value}
        </Typography>
      </Box>
    ))}
  </Paper>
)}


</Grid>


      {/* SNACKBAR */}
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
