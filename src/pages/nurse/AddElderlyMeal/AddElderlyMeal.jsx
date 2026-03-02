import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


import AxiosUserInstance from "../../../api/AxiosUserInstance";


import {
  Restaurant as RestaurantIcon,
  FactCheck as FactCheckIcon,
} from "@mui/icons-material";


const paperStyle = {
  p: { xs: 2.5, sm: 4 },
  maxWidth: 800,
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
  gap: 1,
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


const normalizeRequiredText = (v) => (typeof v === "string" ? v.trim() : "");


export default function AddElderlyMeal() {
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const form = useForm({
    defaultValues: {
      elderlyId: "",
      date: "",
      breakfast: "",
      lunch: "",
      dinner: "",
    },
    mode: "onTouched",
  });


  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = form;


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  // =========================
  // ✅ Fetch Elderlies with React Query (same style you requested)
  // =========================
  const fetchElderlies = async () => {
    const res = await AxiosUserInstance.get("/Nurse/Elderly");
    return res?.data?.elderlies || [];
  };


  const {
    data: elderlies = [],
    isLoading: loadingElderlies,
    isError: elderliesError,
    refetch: refetchElderlies,
  } = useQuery({
    queryKey: ["elderliesList"],
    queryFn: fetchElderlies,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    onError: (err) => {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setSnackbar({
        open: true,
        severity: "error",
        message: "تعذر تحميل قائمة المسنين",
      });
    },
  });


  const selectedElderlyId = watch("elderlyId");
  const selectedElderlyName = useMemo(() => {
    const x = elderlies.find(
      (e) => String(e.elderlyId) === String(selectedElderlyId),
    );
    return x?.name || "";
  }, [elderlies, selectedElderlyId]);


  const onSubmit = async (data) => {
    // basic front validations (simple & friendly)
    if (!data.elderlyId) {
      setError("elderlyId", { type: "manual", message: "يرجى اختيار المسن." });
      return;
    }
    if (!data.date) {
      setError("date", { type: "manual", message: "التاريخ مطلوب." });
      return;
    }


    const payload = {
      elderlyId: Number(data.elderlyId),
      date: data.date,
      breakfast: normalizeRequiredText(data.breakfast),
      lunch: normalizeRequiredText(data.lunch),
      dinner: normalizeRequiredText(data.dinner),
    };


    if (!payload.breakfast) {
      setError("breakfast", {
        type: "manual",
        message: "تفاصيل الفطور مطلوبة.",
      });
      return;
    }
    if (!payload.lunch) {
      setError("lunch", { type: "manual", message: "تفاصيل الغداء مطلوبة." });
      return;
    }
    if (!payload.dinner) {
      setError("dinner", { type: "manual", message: "تفاصيل العشاء مطلوبة." });
      return;
    }


    clearErrors();


    setLoading(true);
    try {
      await AxiosUserInstance.post("/Nurse/ElderMeal/daily", payload);


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم حفظ وجبات اليوم بنجاح",
      });


      reset({
        elderlyId: "",
        date: "",
        breakfast: "",
        lunch: "",
        dinner: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء حفظ الوجبات",
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
        {/* Header */}
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
                  إضافة وجبات اليوم
                </Typography>


                <RestaurantIcon
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
                اختر المسن والتاريخ ثم أدخل تفاصيل الفطور والغداء والعشاء
                {selectedElderlyName ? ` — (${selectedElderlyName})` : ""}
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


        {/* Form */}
        <Paper elevation={0} sx={{ ...paperStyle, mx: "auto" }}>
          <Typography
            variant="h5"
            textAlign="center"
            mb={1}
            sx={{ fontWeight: 900 }}
          >
            بيانات الوجبات
          </Typography>


          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            سيتم حفظ (فطور / غداء / عشاء) مرة واحدة لنفس اليوم
          </Typography>


          {/* Elderlies load states */}
          {loadingElderlies && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}


          {elderliesError && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography color="error" sx={{ fontWeight: 800 }}>
                تعذر تحميل قائمة المسنين
              </Typography>
              <Button
                type="button"
                variant="outlined"
                onClick={() => refetchElderlies()}
                sx={{ mt: 1, borderRadius: 3 }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}


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


              {/* Date */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="التاريخ"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("date")}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  sx={inputStyle}
                />
              </Grid>


              {/* Breakfast */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="تفاصيل الفطور"
                  placeholder="مثال: عجة + جبنة "
                  {...register("breakfast")}
                  error={!!errors.breakfast}
                  helperText={errors.breakfast?.message}
                  multiline
                  minRows={2}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          pr: 1,
                          display: "flex",
                          alignItems: "center",
                          opacity: 0.8,
                        }}
                      ></Box>
                    ),
                  }}
                />
              </Grid>


              {/* Lunch */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="تفاصيل الغداء"
                  placeholder="مثال: أوزي"
                  {...register("lunch")}
                  error={!!errors.lunch}
                  helperText={errors.lunch?.message}
                  multiline
                  minRows={2}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          pr: 1,
                          display: "flex",
                          alignItems: "center",
                          opacity: 0.8,
                        }}
                      ></Box>
                    ),
                  }}
                />
              </Grid>


              {/* Dinner */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="تفاصيل العشاء"
                  placeholder="مثال: حمص"
                  {...register("dinner")}
                  error={!!errors.dinner}
                  helperText={errors.dinner?.message}
                  multiline
                  minRows={2}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          pr: 1,
                          display: "flex",
                          alignItems: "center",
                          opacity: 0.8,
                        }}
                      ></Box>
                    ),
                  }}
                />
              </Grid>
            </Grid>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || loadingElderlies || elderliesError}
              sx={buttonStyle}
              startIcon={<RestaurantIcon />}
            >
              {loading ? "جارٍ الحفظ..." : "حفظ وجبات اليوم"}
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



