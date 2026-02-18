import React, { useState } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router";

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

export default function CompleteInfoElderly() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [formData, setFormData] = useState({
    Name: "",
    NationalId: "",
    Doctrine: "",
    City: "",
    Street: "",
    HealthStatus: "",
    ReasonRegister: "",
    BDate: "",
    MaritalStatus: "",
    KinShip: "",
    Degree: "اولى (كفيل اساسي)",
    Diseases: [""],
    DoctorName: "",
    WorkPlace: "",
    DoctorPhone: "",
    ReportDate: "",
  });

  const [files, setFiles] = useState({
    NationalIdImage: null,
    HealthInsurance: null,
    DiagnosisFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ===== Diseases handlers =====
  const handleDiseaseChange = (index, value) => {
    const updated = [...formData.Diseases];
    updated[index] = value;
    setFormData({ ...formData, Diseases: updated });
  };

  const addDisease = () => {
    setFormData({
      ...formData,
      Diseases: [...formData.Diseases, ""],
    });
  };

  const removeDisease = (index) => {
    const updated = formData.Diseases.filter((_, i) => i !== index);
    setFormData({ ...formData, Diseases: updated });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    // Append normal fields
    Object.keys(formData).forEach((key) => {
      if (key !== "Diseases") {
        data.append(key, formData[key]);
      }
    });

    // Append diseases as List<string>
    formData.Diseases
      .filter((d) => d.trim() !== "")
      .forEach((d) => {
        data.append("Diseases", d);
      });

    // Append files
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://localhost:7160/Sponsor/Elderly/add-with-doctor",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSnackbarOpen(true);
        setTimeout(() => navigate("/Sponsor"), 2000);
      }
    } catch (error) {
      console.error(error);
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
          تسجيل مسن مع بيانات الطبيب
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="الاسم الكامل" name="Name" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="رقم الهوية" name="NationalId" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="الديانة" name="Doctrine" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="الحالة الاجتماعية"
                name="MaritalStatus"
                select
                fullWidth
                onChange={handleChange}
                sx={inputStyle}
              >
                <MenuItem value="Single">أعزب</MenuItem>
                <MenuItem value="Married">متزوج</MenuItem>
                <MenuItem value="Divorced">مطلق</MenuItem>
                <MenuItem value="Widowed">أرمل</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="المدينة" name="City" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="الشارع" name="Street" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="الحالة الصحية" name="HealthStatus" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="الدرجة"
                name="Degree"
                value={formData.Degree}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="date"
                label="تاريخ الميلاد"
                name="BDate"
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="صلة القرابة" name="KinShip" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField label="سبب التسجيل" name="ReasonRegister" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            {/* Diseases */}
            <Grid size={{ xs: 12 }}>
              <Typography fontWeight={600} mt={2}>
                الأمراض
              </Typography>
            </Grid>

            {formData.Diseases.map((disease, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label={`مرض #${index + 1}`}
                      fullWidth
                      value={disease}
                      onChange={(e) => handleDiseaseChange(index, e.target.value)}
                      sx={inputStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 3 }} display="flex" alignItems="center">
                    {formData.Diseases.length > 1 && (
                      <Button color="error" onClick={() => removeDisease(index)}>
                        حذف
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Button onClick={addDisease}>
                + إضافة مرض
              </Button>
            </Grid>

            {/* Doctor Info */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" mt={3}>
                بيانات الطبيب
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="اسم الطبيب" name="DoctorName" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="مكان العمل" name="WorkPlace" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="رقم الهاتف" name="DoctorPhone" fullWidth onChange={handleChange} sx={inputStyle} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="date"
                label="تاريخ التقرير"
                name="ReportDate"
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>

            {/* Files */}
            <Grid size={{ xs: 12 }}>
              <Typography mt={3}>إرفاق الملفات</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button component="label">
                صورة الهوية
                <input type="file" hidden name="NationalIdImage" onChange={handleFileChange} />
              </Button>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button component="label">
                التأمين الصحي
                <input type="file" hidden name="HealthInsurance" onChange={handleFileChange} />
              </Button>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button component="label">
                ملف التشخيص
                <input type="file" hidden name="DiagnosisFile" onChange={handleFileChange} />
              </Button>
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
                {loading ? <CircularProgress size={24} /> : "حفظ البيانات"}
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          تم حفظ البيانات بنجاح!
        </Alert>
      </Snackbar>
    </Box>
  );
}
