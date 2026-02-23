import React from "react";
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
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import CompleteNurseProfileSchema from "../../../validations/CompleteNurseProfileSchema";


const paperStyle = {
  p: 4,
  maxWidth: 700,
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
    textAlign: "left",
    direction: "ltr",
  },
};


export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // <-- حالة لرسالة الخطأ
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CompleteNurseProfileSchema),
    defaultValues: {
      educationLevel: "",
      maritalStatus: "",
      fieldOfStudy: "",
      yearsOfStudy: "",
      yearOfGraduation: "",
      workExperiences: [{ workName: "", workLocation: "", jobTitle: "" }],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperiences",
  });


  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");


    // إزالة أي عنصر خبرة فارغ تمامًا
    if (data.workExperiences) {
      data.workExperiences = data.workExperiences.filter(
        (w) => w.workName || w.workLocation || w.jobTitle,
      );
    }


    try {
      const response = await axios.post(
        "https://localhost:7160/api/Nurse/complete",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.status === 200) {
        setSnackbarMessage("تم حفظ البيانات بنجاح!");
        setSnackbarOpen(true);
        const newToken = response.data.data.token;
        localStorage.setItem("token", newToken);
        setTimeout(() => {
          navigate("/Nurse" , { replace: true });
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة لاحقًا.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          إكمال ملف الممرض
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
          sx={{ fontWeight: 300 }}
        >
          هذه البيانات يجب إكمالها أولاً
        </Typography>


        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Education */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="المستوى التعليمي"
                fullWidth
                defaultValue=""
                {...register("educationLevel")}
                error={!!errors.educationLevel}
                helperText={errors.educationLevel?.message}
                sx={inputStyle}
              >
                <MenuItem value="Secondary">ثانوية (قبل التوجيهي)</MenuItem>
                <MenuItem value="Tawjihi">توجيهي</MenuItem>
                <MenuItem value="Institute">معهد</MenuItem>
                <MenuItem value="University">جامعة</MenuItem>
              </TextField>
            </Grid>


            {/* Marital */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="الحالة الاجتماعية"
                fullWidth
                defaultValue=""
                {...register("maritalStatus")}
                error={!!errors.maritalStatus}
                helperText={errors.maritalStatus?.message}
                sx={inputStyle}
              >
                <MenuItem value="Single">أعزب</MenuItem>
                <MenuItem value="Married">متزوج</MenuItem>
                <MenuItem value="Divorced">مطلق</MenuItem>
                <MenuItem value="Widowed">أرمل</MenuItem>
              </TextField>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <TextField
                label="مجال الدراسة (التخصص)"
                fullWidth
                {...register("fieldOfStudy")}
                error={!!errors.fieldOfStudy}
                helperText={errors.fieldOfStudy?.message}
                sx={{
                  ...inputStyle,
                  "& .MuiOutlinedInput-input": {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="عدد سنوات الدراسة"
                type="number"
                fullWidth
                {...register("yearsOfStudy")}
                error={!!errors.yearsOfStudy}
                helperText={errors.yearsOfStudy?.message}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="سنة التخرج"
                fullWidth
                {...register("yearOfGraduation")}
                error={!!errors.yearOfGraduation}
                helperText={errors.yearOfGraduation?.message}
                sx={inputStyle}
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                mt={3}
                sx={{ fontWeight: 300 }}
              >
                إذا كان لديك خبرة سابقة، يرجى ملؤها، وإذا لم تكن لديك خبرة يمكنك
                تخطي هذا القسم
              </Typography>
            </Grid>


            {/* Work Experience */}
            {fields.map((item, index) => (
              <Grid
                size={{ xs: 12 }}
                key={item.id}
                sx={{
                  "& input": {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              >
                <Typography fontWeight={600} mb={1}>
                  خبرة عملية #{index + 1}
                </Typography>


                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="مكان العمل"
                      fullWidth
                      {...register(`workExperiences.${index}.workName`)}
                      sx={inputStyle}
                    />
                  </Grid>


                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="موقع العمل"
                      fullWidth
                      {...register(`workExperiences.${index}.workLocation`)}
                      sx={inputStyle}
                    />
                  </Grid>


                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="المسمى الوظيفي"
                      fullWidth
                      {...register(`workExperiences.${index}.jobTitle`)}
                      sx={inputStyle}
                    />
                  </Grid>
                </Grid>


                {fields.length > 1 && (
                  <Button
                    color="error"
                    size="small"
                    onClick={() => remove(index)}
                    sx={{
                      mt: 1, // margin top
                      fontSize: "1rem", // حجم الخط
                      textTransform: "none", // النص كما هو
                    }}
                  >
                    حذف الخبرة
                  </Button>
                )}
              </Grid>
            ))}


            <Grid size={{ xs: 12 }}>
              <Button
                onClick={() =>
                  append({ workName: "", workLocation: "", jobTitle: "" })
                }
                sx={{
                  fontSize: "1rem", // حجم الخط أكبر شوي
                  textTransform: "none", // يحافظ على النص كما هو
                }}
              >
                + إضافة خبرة
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
      {/* Snackbar للنجاح */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%", fontWeight: 600 }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}



