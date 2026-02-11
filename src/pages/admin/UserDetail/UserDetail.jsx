import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import GroupsIcon from "@mui/icons-material/Groups";
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  // قائمة الحقول الديناميكية
  const fields = [
    { label: "البريد الإلكتروني", value: user.email },
    { label: "رقم الهاتف", value: user.phoneNumber },
    { label: "المدينة", value: user.city },
    { label: "الرقم الوطني", value: user.nationalId },
    { label: "الجنس", value: user.gender },
    { label: "الحالة", value: user.status },
    { label: "المستوى التعليمي", value: user.educationLevel },
    { label: "المسمى الوظيفي", value: user.jobTitle },
    { label: "المجال الدراسي", value: user.fieldOfStudy },
    { label: "سنة التخرج", value: user.yearOfGraduation },
    { label: "الدرجة الأكاديمية", value: user.academicDegree },
    { label: "عدد سنوات الدراسة", value: user.yearsOfStudy },
    { label: "الحالة الاجتماعية", value: user.maritalStatus },
    { label: "شهادة", value: user.imageCertificate },
  ].filter(f => f.value); // فقط اللي فيها قيمة

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Avatar sx={{ width: 70, height: 70, bgcolor: "#6a6a57", fontSize: 28 }}>
              {user.fullName?.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {user.fullName}
              </Typography>
              <Typography sx={{ color: "#6b6b6b" }}>{user.roleUser}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Details */}
          <Grid container spacing={3}>
            {fields.map((item, index) => (
              <Grid size={{xs:12 ,md:4}} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    p: 2,
                    height: "100%",
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#8a8a75", mb: 1 }}>
                    {item.label}
                  </Typography>
                  {item.label === "شهادة" && item.value ? (
                    <img src={item.value} alt="شهادة" style={{ width: "100%", borderRadius: 6 }} />
                  ) : (
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#333" }}>
                      {item.value}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}

            {/* المسنين */}
            {/* المسنين */}
{user.roleUser === "كفيل" && (
  <Grid size={{xs:12}}>
    <Card sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#6a6a57" }}>
          المسنين
        </Typography>
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "rgba(106,106,87,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#6a6a57",
          }}
        >
          <GroupsIcon />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {user.elderlyNames && user.elderlyNames.length > 0 ? (
          user.elderlyNames.map((name, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: "#f1f8f4",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <PersonIcon sx={{ fontSize: 18, color: "#417d44" }} />
              {name}
            </Box>
          ))
        ) : (
          <Typography sx={{ color: "#888", fontWeight: 600 }}>لا يوجد</Typography>
        )}
      </Box>
    </Card>
  </Grid>
)}

          </Grid>
        </CardContent>
      </Card>

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
