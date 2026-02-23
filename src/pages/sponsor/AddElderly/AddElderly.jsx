import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router";
import AxiosUserInstance from "../../../api/AxiosUserInstance.jsx";
import { useLocation } from "react-router";

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


export default function AddElderly() {
    const location = useLocation();
const elderlyIdFromPrev = location.state?.elderlyNationalId || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState({
    open: false,
    message: "حدث خطأ أثناء الإرسال",
  });


  const [formData, setFormData] = useState({
    Name: "",
    NationalId: elderlyIdFromPrev,
    Doctrine: "",
    City: "",
    Street: "",
    HealthStatus: "",
    ReasonRegister: "",
    BDate: "",
    MaritalStatus: "", // ✅ مهم يكون default ""
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


  // ✅ previews for images
  const [previews, setPreviews] = useState({
    NationalIdImage: "",
    HealthInsurance: "",
    DiagnosisFile: "",
  });


  // ✅ cleanup previews to avoid memory leak
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // ===== Diseases handlers =====
  const handleDiseaseChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.Diseases];
      updated[index] = value;
      return { ...prev, Diseases: updated };
    });
  };


  const addDisease = () => {
    setFormData((prev) => ({
      ...prev,
      Diseases: [...prev.Diseases, ""],
    }));
  };


  const removeDisease = (index) => {
    setFormData((prev) => {
      const updated = prev.Diseases.filter((_, i) => i !== index);
      return { ...prev, Diseases: updated.length ? updated : [""] };
    });
  };


  // ✅ show selected file name + preview if image
  const handleFileChange = (e) => {
    const inputName = e.target.name;
    const file = e.target.files?.[0] || null;


    // ✅ Debug
    // console.log("file change", inputName, file);


    setFiles((prev) => ({ ...prev, [inputName]: file }));


    if (file && file.type?.startsWith("image/")) {
      setPreviews((prev) => {
        if (prev[inputName]) URL.revokeObjectURL(prev[inputName]);
        return { ...prev, [inputName]: URL.createObjectURL(file) };
      });
    } else {
      setPreviews((prev) => {
        if (prev[inputName]) URL.revokeObjectURL(prev[inputName]);
        return { ...prev, [inputName]: "" };
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    const data = new FormData();


    // Append normal fields
    Object.keys(formData).forEach((key) => {
      if (key !== "Diseases") {
        data.append(key, formData[key] ?? "");
      }
    });


    // Append diseases as List<string>
    formData.Diseases.filter((d) => d.trim() !== "").forEach((d) => {
      data.append("Diseases", d);
    });


    // Append files
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });


    try {
      const response = await AxiosUserInstance.post(
        "/Sponsor/Elderly/add-with-doctor",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );


      if (response.status === 200) {
        console.log(response);
        setSnackbarOpen(true);
        const newToken = response.data.data.token;
        localStorage.setItem("token", newToken);
        setTimeout(() => navigate("/Sponsor"), 1200);
      }
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "فشل الإرسال، تأكد من الحقول والملفات";
      setSnackbarError({ open: true, message: String(msg) });
    } finally {
      setLoading(false);
    }
  };


  const FileInput = ({ name, label, accept = "*" }) => {
    const file = files[name];
    const preview = previews[name];


    return (
      <Box>
        <Button
          component="label"
          variant="outlined"
          sx={{
            borderRadius: "14px",
            borderColor: "rgba(106,106,87,0.35)",
            color: "#3e3e33",
            background: "rgba(255,255,255,0.18)",
            "&:hover": { background: "rgba(255,255,255,0.28)" },
          }}
        >
          {label}
          <input
            type="file"
            hidden
            name={name}
            accept={accept}
            onChange={(e) => {
              handleFileChange(e);
              // ✅ allow choosing same file again safely
              setTimeout(() => {
                e.target.value = "";
              }, 0);
            }}
          />
        </Button>


        {file && (
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            ✅ تم اختيار: <b>{file.name}</b>
          </Typography>
        )}


        {preview && (
          <Box
            sx={{
              mt: 1,
              width: "100%",
              maxWidth: 360,
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(106, 106, 87, 0.25)",
              background: "rgba(255,255,255,0.25)",
            }}
          >
            <img
              src={preview}
              alt={label}
              style={{ width: "100%", display: "block" }}
            />
          </Box>
        )}
      </Box>
    );
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
              <TextField
                label="الاسم الكامل"
                name="Name"
                fullWidth
                value={formData.Name}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
  label="رقم الهوية"
  name="NationalId"
  fullWidth
  value={formData.NationalId}
  onChange={handleChange}
  sx={inputStyle}
  slotProps={{
    input: {
      readOnly: true,
    },
  }}
/>
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="الديانة"
                name="Doctrine"
                fullWidth
                value={formData.Doctrine}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="الحالة الاجتماعية"
                name="MaritalStatus"
                select
                fullWidth
                value={formData.MaritalStatus || ""} // ✅ حل warning
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
              <TextField
                label="المدينة"
                name="City"
                fullWidth
                value={formData.City}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="الشارع"
                name="Street"
                fullWidth
                value={formData.Street}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="الحالة الصحية"
                name="HealthStatus"
                fullWidth
                value={formData.HealthStatus}
                onChange={handleChange}
                sx={inputStyle}
              />
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
                value={formData.BDate}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                sx={inputStyle}
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


            <Grid size={{ xs: 12 }}>
              <TextField
                label="سبب التسجيل"
                name="ReasonRegister"
                fullWidth
                value={formData.ReasonRegister}
                onChange={handleChange}
                sx={inputStyle}
              />
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
                      onChange={(e) =>
                        handleDiseaseChange(index, e.target.value)
                      }
                      sx={inputStyle}
                    />
                  </Grid>


                  <Grid size={{ xs: 12 }} display="flex" alignItems="center">
                    {formData.Diseases.length > 1 && (
                      <Button
                        color="error"
                        onClick={() => removeDisease(index)}
                      >
                        حذف
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}


            <Grid size={{ xs: 12 }}>
              <Button onClick={addDisease}>+ إضافة مرض</Button>
            </Grid>


            {/* Doctor Info */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" mt={3}>
                بيانات الطبيب
              </Typography>
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="اسم الطبيب"
                name="DoctorName"
                fullWidth
                value={formData.DoctorName}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="مكان العمل"
                name="WorkPlace"
                fullWidth
                value={formData.WorkPlace}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="رقم الهاتف"
                name="DoctorPhone"
                fullWidth
                value={formData.DoctorPhone}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="date"
                label="تاريخ التقرير"
                name="ReportDate"
                fullWidth
                value={formData.ReportDate}
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
              <FileInput
                name="NationalIdImage"
                label="صورة الهوية"
                accept="image/*"
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <FileInput
                name="HealthInsurance"
                label="التأمين الصحي"
                accept="image/*"
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <FileInput
                name="DiagnosisFile"
                label="ملف التشخيص (صورة أو PDF)"
                accept="image/*,.pdf"
              />
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
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" variant="filled">
          تم حفظ البيانات بنجاح!
        </Alert>
      </Snackbar>


      <Snackbar
        open={snackbarError.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbarError((p) => ({ ...p, open: false }))}
      >
        <Alert severity="error" variant="filled">
          {snackbarError.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}





