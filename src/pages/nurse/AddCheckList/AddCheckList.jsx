import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


import AxiosUserInstance from "../../../api/AxiosUserInstance";
import AddChecklistSchema from "../../../validations/AddChecklistSchema";

import {
  MonitorHeart as MonitorHeartIcon,
  Assignment as AssignmentIcon,
  FactCheck as FactCheckIcon,
} from "@mui/icons-material";



const paperStyle = {
  p: { xs: 2.5, sm: 4 },
  maxWidth: 700,
  width: "100%",
  borderRadius: "20px",
  background: "#f0f0ea",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(6px)",
  },
};


export const buttonStyle = {
  mt: 3,
  py: 1.2,
  borderRadius: "14px",
  gap:1,
  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
  },
};


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const normalizeOptionalField = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};


export default function AddCheckList() {
  const [loading, setLoading] = useState(false);
  const [elderlies, setElderlies] = useState([]);
  const [loadingElderlies, setLoadingElderlies] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const form = useForm({
    resolver: yupResolver(AddChecklistSchema),
    defaultValues: {
      elderlyId: "",
      notes: "",
      temperature: "",
      pulse: "",
      bloodSugar: "",
      bloodPressure: "",
      intake: "",
      output: "",
    },
    mode: "onTouched",
  });


  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;


  useEffect(() => {
    const fetchElderlies = async () => {
      setLoadingElderlies(true);
      try {
        const res = await AxiosUserInstance.get("/Nurse/Elderly");
        setElderlies(res?.data?.elderlies || []);
      } catch (err) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "تعذر تحميل قائمة المسنين",
        });
      } finally {
        setLoadingElderlies(false);
      }
    };


    fetchElderlies();
  }, []);


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const onSubmit = async (data) => {
    setLoading(true);


    const payload = {
      elderlyId: Number(data.elderlyId),
      notes: normalizeOptionalField(data.notes),
      temperature: normalizeOptionalField(data.temperature),
      pulse: normalizeOptionalField(data.pulse),
      bloodSugar: normalizeOptionalField(data.bloodSugar),
      bloodPressure: normalizeOptionalField(data.bloodPressure),
      intake: normalizeOptionalField(data.intake),
      output: normalizeOptionalField(data.output),
    };


    try {
      await AxiosUserInstance.post("/Nurse/ElderlyDailyCheck", payload);


      setSnackbar({
        open: true,
        severity: "success",
        message: "تمت إضافة الفحص بنجاح",
      });


      reset({
        elderlyId: "",
        notes: "",
        temperature: "",
        pulse: "",
        bloodSugar: "",
        bloodPressure: "",
        intake: "",
        output: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء إضافة الفحص",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 2, md: 3 },
        background: "#f0f0ea",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ ...headerCardStyles, width: "100%" }}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
                >
                  إضافة فحص يومي
                </Typography>


                <AssignmentIcon
                  sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }}
                />
              </Box>


              <Typography
                sx={{
                  opacity: 0.9,
                  mt: { xs: 1, md: 2 },
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                قم بتعبئة بيانات الفحص اليومية للمسن
              </Typography>
            </Box>


            <Box
              sx={{
                width: { xs: 50, md: 70 },
                height: { xs: 50, md: 70 },
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FactCheckIcon
                sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }}
              />
            </Box>
          </CardContent>
        </Card>


        <Paper elevation={0} sx={{ ...paperStyle, mx: "auto" }}>
          <Typography
            variant="h5"
            textAlign="center"
            mb={1}
            sx={{ fontWeight: 900 }}
          >
            بيانات الفحص
          </Typography>


          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            أدخل القراءات والملاحظات الخاصة بالفحص
          </Typography>


          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="elderlyId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="اسم المسن"
                      error={!!errors.elderlyId}
                      helperText={errors.elderlyId?.message}
                      sx={{
                        ...inputStyle,
                        "& .MuiSelect-select": {
                          direction: "rtl",
                          textAlign: "right",
                        },
                      }}
                    >
                      <MenuItem value="">
                        {loadingElderlies
                          ? "جارٍ تحميل المسنين..."
                          : "اختر المسن"}
                      </MenuItem>


                      {elderlies.map((elderly) => (
                        <MenuItem
                          key={elderly.elderlyId}
                          value={elderly.elderlyId}
                        >
                          {elderly.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>


              


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="درجة الحرارة"
                  {...register("temperature")}
                  error={!!errors.temperature}
                  helperText={errors.temperature?.message}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="النبض"
                  {...register("pulse")}
                  error={!!errors.pulse}
                  helperText={errors.pulse?.message}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="سكر الدم"
                  {...register("bloodSugar")}
                  error={!!errors.bloodSugar}
                  helperText={errors.bloodSugar?.message}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="ضغط الدم"
                  {...register("bloodPressure")}
                  error={!!errors.bloodPressure}
                  helperText={errors.bloodPressure?.message}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="المدخول"
                  {...register("intake")}
                  error={!!errors.intake}
                  helperText={errors.intake?.message}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="الإخراج"
                  {...register("output")}
                  error={!!errors.output}
                  helperText={errors.output?.message}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
    fullWidth
    label="الملاحظات"
    placeholder="أدخل الملاحظات إن وُجدت."
    {...register("notes")}
    error={!!errors.notes}
    helperText={errors.notes?.message}
    multiline
    minRows={3}
    InputLabelProps={{
      shrink: true, // يجعل اللابل فوق دائمًا
    }}
    sx={{
      ...inputStyle,
      mt: 2,
      "& .MuiOutlinedInput-input": {
        direction: "rtl",
        textAlign: "right",
      },
      "& .MuiInputLabel-root": {
        color: "#2f2f27", // لون اللابل
        fontWeight: 700,
      },
    }}
  />
              </Grid>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={buttonStyle}
              
              startIcon={<MonitorHeartIcon  />}
            >
              {loading ? "جارٍ الإضافة..." : "إضافة الفحص"}
            </Button>
          </Box>
        </Paper>


        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%", fontWeight: 700 }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}



