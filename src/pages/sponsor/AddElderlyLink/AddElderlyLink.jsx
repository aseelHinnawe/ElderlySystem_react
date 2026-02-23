import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../../api/AxiosUserInstance.jsx";


const paperStyle = {
  p: 4,
  maxWidth: 800,
  width: "100%",
  borderRadius: "20px",
  background: "rgba(240, 240, 234, 0.25)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(6px)",
  },
  "& input": {
    direction: "rtl",
    textAlign: "right",
  },
};


export default function AddElderlyLink() {
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const [formData, setFormData] = useState({
    ElderlyNationalId: "",
    KinShip: "",
    Degree: "اولى (كفيل اساسي)",
  });


  const degreeOptions = useMemo(
    () => [
      { value: "اولى (كفيل اساسي)", label: "اولى (كفيل اساسي)" },
      { value: "ثانية", label: "ثانية" },
      { value: "ثالثة", label: "ثالثة" },
    ],
    [],
  );


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };


  const showSnack = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const elderlyNationalId = formData.ElderlyNationalId.trim();
    const kinShip = formData.KinShip.trim();
    const degree = formData.Degree.trim();


    if (!elderlyNationalId) {
      showSnack("error", "رقم هوية المسن مطلوب.");
      return;
    }
    if (!/^\d{9}$/.test(elderlyNationalId)) {
      showSnack("error", "رقم الهوية يجب أن يكون 9 أرقام.");
      return;
    }
    if (!kinShip) {
      showSnack("error", "صلة القرابة مطلوبة.");
      return;
    }
    if (!degree) {
      showSnack("error", "الدرجة مطلوبة.");
      return;
    }


    setLoading(true);
    try {
      const response = await AxiosUserInstance.post("/Sponsor/Elderly/link", {
        elderlyNationalId,
        kinShip,
        degree,
      });
      if (response.status == 200) {
        showSnack("success", response?.data?.message || "تم الربط بنجاح!");
        const newToken = response.data.data.token;
        localStorage.setItem("token", newToken);
        setTimeout(() => navigate("/Sponsor"), 1200);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "فشل الربط، تأكد من البيانات.";
      showSnack("error", String(msg));
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(135deg, #e4e4d6, #8e8e6f)",
      }}
    >
      <Paper sx={paperStyle} elevation={0}>
        <Typography variant="h5" textAlign="center" mb={3}>
          ربط الكفيل بالمسن
        </Typography>


        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="رقم هوية المسن"
                name="ElderlyNationalId"
                fullWidth
                value={formData.ElderlyNationalId}
                onChange={handleChange}
                sx={inputStyle}
                inputProps={{ inputMode: "numeric", maxLength: 9 }}
                helperText="أدخل 9 أرقام"
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="صلة القرابة"
                name="KinShip"
                fullWidth
                value={formData.KinShip}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="الدرجة"
                name="Degree"
                select
                fullWidth
                value={formData.Degree || ""}
                onChange={handleChange}
                sx={inputStyle}
              >
                {degreeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.2,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "تأكيد الربط"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}



