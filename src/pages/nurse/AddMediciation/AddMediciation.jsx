import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


import AxiosUserInstance from "../../../api/AxiosUserInstance.jsx";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import FactCheckIcon from "@mui/icons-material/FactCheck";


// ===== styles (نفس الروح) =====
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


const buttonStyle = {
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


const normalizeText = (v) => (typeof v === "string" ? v.trim() : "");
const toHHmmss = (t) => {
  const v = normalizeText(t);
  if (!v) return "";
  return v.length === 5 ? `${v}:00` : v;
};


export default function AddMediciation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const form = useForm({
    defaultValues: {
      elderlyId: "",
      drugPlanId: "",
      dateTime: "",
      dose: "",
    },
    mode: "onTouched",
  });


  const {
    handleSubmit,
    control,
    register,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = form;


  const selectedElderlyId = watch("elderlyId");


  // =========================
  // ✅ GET Elderlies: /Nurse/Elderly
  // shape: { elderlies: [{ elderlyId, name }] }
  // =========================
  const fetchElderlies = async () => {
    const res = await AxiosUserInstance.get("/Nurse/Elderly");
    return Array.isArray(res?.data?.elderlies) ? res.data.elderlies : [];
  };


  const elderliesQuery = useQuery({
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


  const elderlies = useMemo(() => {
    return (elderliesQuery.data || []).map((e) => ({
      id: e.elderlyId,
      name: e.name || `مسن #${e.elderlyId}`,
    }));
  }, [elderliesQuery.data]);


  const selectedElderlyName = useMemo(() => {
    const x = elderlies.find((e) => String(e.id) === String(selectedElderlyId));
    return x?.name || "";
  }, [elderlies, selectedElderlyId]);


  // =========================
  // ✅ GET Active medicines for elderly (menu item 2)
  // /Nurse/Medicine/elderly/{elderlyId}/Medicine
  // expected: { data: [{ drugPlanId, medicineName, medicineTypeName, times, dailyIntake }] }
  // =========================
  const fetchElderlyMedicines = async ({ queryKey }) => {
    const [, elderlyId] = queryKey;
    if (!elderlyId) return [];


    const res = await AxiosUserInstance.get(
      `/Nurse/Medicine/elderly/${elderlyId}/Medicine`,
    );


    // support: { data: [...] } OR { medicines: [...] }
    return Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.medicines)
        ? res.data.medicines
        : [];
  };


  const medicinesQuery = useQuery({
    queryKey: ["elderlyMedicines", selectedElderlyId],
    queryFn: fetchElderlyMedicines,
    enabled: !!selectedElderlyId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
    onError: (err) => {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setSnackbar({
        open: true,
        severity: "error",
        message: "تعذر تحميل قائمة أدوية المسنة",
      });
    },
  });


  const medicineOptions = useMemo(() => {
    const list = medicinesQuery.data || [];
    return list.map((m) => ({
      drugPlanId: m.drugPlanId ?? m.id, // احتياط
      title: m.medicineTypeName
        ? `${m.medicineName} — (${m.medicineTypeName})`
        : m.medicineName || `خطة #${m.drugPlanId}`,
      dailyIntake: m.dailyIntake,
      times: Array.isArray(m.times) ? m.times : [],
    }));
  }, [medicinesQuery.data]);


  useEffect(() => {
    reset((prev) => ({
      ...prev,
      drugPlanId: "",
    }));
    clearErrors(["drugPlanId"]);
   
  }, [selectedElderlyId]);


 
  const addMedicationMutation = useMutation({
    mutationFn: async (payload) => {
      await AxiosUserInstance.post("/Nurse/Medicine/Medication", payload);
    },
    onSuccess: async () => {
      setSnackbar({
        open: true,
        severity: "success",
        message: "تم تسجيل الجرعة بنجاح",
      });


      // تحديث أي بيانات مرتبطة إذا عندك صفحة عرض
      await queryClient.invalidateQueries({ queryKey: ["elderlyMedicines"] });


      reset({
        elderlyId: "",
        drugPlanId: "",
        dateTime: "",
        dose: "",
      });
    },
    onError: (err) => {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء تسجيل الجرعة",
      });
    },
  });


  const onSubmit = async (data) => {
    // validations بسيطة قبل الإرسال
    if (!data.elderlyId) {
      setError("elderlyId", { type: "manual", message: "يرجى اختيار المسنة." });
      return;
    }


    if (!data.drugPlanId) {
      setError("drugPlanId", {
        type: "manual",
        message: "يرجى اختيار الدواء.",
      });
      return;
    }
    const dose = normalizeText(data.dose);
    if (!dose) {
      setError("dose", { type: "manual", message: "الجرعة مطلوبة." });
      return;
    }


    clearErrors();


    const payload = {
      elderlyId: Number(data.elderlyId),
      drugPlanId: Number(data.drugPlanId),
      dose,
    };


    addMedicationMutation.mutate(payload);
  };


  const loadingElderlies = elderliesQuery.isLoading;
  const elderliesError = elderliesQuery.isError;


  const loadingMedicines = medicinesQuery.isLoading;
  const medicinesError = medicinesQuery.isError;


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
                  تسجيل جرعة دواء
                </Typography>


                <MedicationOutlinedIcon
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
                اختر المسنة ثم اختر الدواء، الجرعة
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
            بيانات الجرعة
          </Typography>


          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            سيتم تسجيل جرعة واحدة للخطة المختارة
          </Typography>


          {/* Loading states */}
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
                onClick={() => elderliesQuery.refetch()}
                sx={{ mt: 1, borderRadius: 3 }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}


          {/* Medicines errors */}
          {selectedElderlyId && medicinesError && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography color="error" sx={{ fontWeight: 800 }}>
                تعذر تحميل أدوية المسنة
              </Typography>
              <Button
                type="button"
                variant="outlined"
                onClick={() => medicinesQuery.refetch()}
                sx={{ mt: 1, borderRadius: 3 }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}


          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              {/* Elderly */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="elderlyId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="اسم المسنة"
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
                          : "اختر المسنة"}
                      </MenuItem>


                      {elderlies.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>


              {/* Medicine for selected elderly */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="drugPlanId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="الدواء"
                      disabled={!selectedElderlyId || loadingMedicines}
                      error={!!errors.drugPlanId}
                      helperText={
                        errors.drugPlanId?.message ||
                        (!selectedElderlyId
                          ? "اختر المسنة أولاً"
                          : loadingMedicines
                            ? "جارٍ تحميل الأدوية..."
                            : "")
                      }
                      sx={{
                        ...inputStyle,
                        "& .MuiSelect-select": {
                          direction: "rtl",
                          textAlign: "right",
                        },
                      }}
                    >
                      <MenuItem value="">
                        {!selectedElderlyId
                          ? "اختر المسنة أولاً"
                          : loadingMedicines
                            ? "جارٍ تحميل الأدوية..."
                            : "اختر الدواء"}
                      </MenuItem>


                      {medicineOptions.map((m) => (
                        <MenuItem key={m.drugPlanId} value={m.drugPlanId}>
                          {m.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              {/* Dose */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="الجرعة"
                  placeholder="مثال: 1 حبة"
                  {...register("dose")}
                  error={!!errors.dose}
                  helperText={errors.dose?.message}
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


            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={
                addMedicationMutation.isPending ||
                loadingElderlies ||
                elderliesError ||
                (selectedElderlyId && medicinesError)
              }
              sx={buttonStyle}
              startIcon={<MedicationOutlinedIcon />}
            >
              {addMedicationMutation.isPending
                ? "جارٍ الحفظ..."
                : "تسجيل الجرعة"}
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



