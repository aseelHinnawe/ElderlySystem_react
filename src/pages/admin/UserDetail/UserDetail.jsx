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
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
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

  const fields = [
    { label: "البريد الإلكتروني", value: user.email },
    { label: "رقم الهاتف", value: user.phoneNumber },
    { label: "المدينة", value: user.city },
    { label: "الرقم الوطني", value: user.nationalId },
    { label: "الجنس", value: user.gender },
    { label: "المستوى التعليمي", value: user.educationLevel },
    { label: "المسمى الوظيفي", value: user.jobTitle },
    { label: "المجال الدراسي", value: user.fieldOfStudy },
    { label: "سنة التخرج", value: user.yearOfGraduation },
    { label: "الدرجة الأكاديمية", value: user.academicDegree },
    { label: "عدد سنوات الدراسة", value: user.yearsOfStudy },
    { label: "الحالة الاجتماعية", value: user.maritalStatus },
  ].filter((f) => f.value);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1100, mx: "auto" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-end" },
          gap: 3,
          mb: 5,
        }}
      >
        {/* Avatar with special design */}
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Avatar
            src={user.image}
            sx={{
              width: 120,
              height: 120,
              fontSize: 40,
              bgcolor: "#6a6a57",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              border: "4px solid #fff",
            }}
          >
            {user.fullName?.charAt(0)}
          </Avatar>

          <Box
  sx={{
    position: "absolute",
    bottom: -5,
    right: -5,
    bgcolor: user.status === "نشط" ? "#2e7d32" : "#d32f2f",
    color: "#fff",
    px: 1.5,
    py: 0.5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 700,
    boxShadow:
      user.status === "نشط"
        ? "0 4px 10px rgba(46,125,50,0.4)"
        : "0 4px 10px rgba(211,47,47,0.4)",
  }}
>
  {user.status}
</Box>

        </Box>

        {/* Name + Role */}
        <Box textAlign={{ xs: "center", md: "left" }}>
          <Typography sx={{ fontSize: 26, fontWeight: 900 }}>
            {user.fullName}
          </Typography>

          <Typography sx={{ color: "#777", fontWeight: 700 }}>
            {user.roleUser}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* ====== MAIN TWO COLUMN LAYOUT ====== */}
<Grid container spacing={4}>

  {/* RIGHT SIDE — USER INFO */}
  <Grid size={{xs:12,md:6}}>
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
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
        {fields.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 3,
              backgroundColor: "#fafafa",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "#777",
                fontSize: 14,
              }}
            >
              {item.label}
            </Typography>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 15,
                color: "#333",
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Grid>

  {/* LEFT SIDE — EXTRA INFO */}
  <Grid size={{xs:12,md:6}}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

      {/* CERTIFICATE */}
      {user.imageCertificate && (
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: 18,
              borderRight: "4px solid #417d44",
              pr: 1,
            }}
          >
            الشهادة
          </Typography>

          <Box
            component="img"
            src={user.imageCertificate}
            sx={{
              width: "100%",
              maxHeight: 300,
              objectFit: "cover",
              borderRadius: 3,
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          />
        </Box>
      )}

      {/* ELDERLY */}
      {user.roleUser === "كفيل" && (
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: 18,
              borderRight: "4px solid #6a6a57",
              pr: 1,
            }}
          >
            المسنين
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {user.elderlyNames?.length > 0 ? (
              user.elderlyNames.map((name, i) => (
                <Box
                  key={i}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 5,
                    backgroundColor: "#f1f8f4",
                    fontWeight: 700,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 18 }} />
                  {name}
                </Box>
              ))
            ) : (
              <Typography color="#888">لا يوجد</Typography>
            )}
          </Box>
        </Box>
      )}

      {/* WORK EXPERIENCES */}
      {user.workExperiences?.length > 0 && (
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: 18,
              borderRight: "4px solid #6a6a57",
              pr: 1,
            }}
          >
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
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
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
        </Box>
      )}

    </Box>
  </Grid>
</Grid>

      {/* Snackbar */}
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