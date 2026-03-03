import { useEffect, useMemo, useState } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";


import AxiosUserInstance from "../../../api/AxiosUserInstance";


import {
  LocalPharmacy as LocalPharmacyIcon,
  FactCheck as FactCheckIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";


// ============= Styles (same spirit as your component) =============
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


const normalizeText = (v) => (typeof v === "string" ? v.trim() : "");
const normalizeOptionalText = (v) => {
  const x = normalizeText(v);
  return x ? x : null;
};


const normalizeTimeToHHmmss = (t) => {
  // accepts "HH:mm" or "HH:mm:ss"
  const v = normalizeText(t);
  if (!v) return "";
  if (v.length === 5) return `${v}:00`;
  return v;
};


// عدّل القيم حسب Enum عندك (مثال بسيط)
const MEDICINE_TYPES = [
  { value: 1, label: "حبوب" },
  { value: 2, label: "سائل" },
];


export default function AddMedicine() {
  const queryClient = useQueryClient();
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
      medicineMode: "existing", // existing | new
      medicineId: "",
      newMedicineName: "",
      newMedicineType: "",
      startDate: "",
      endDate: "",
      dailyIntake: 1,
      times: [""], // dynamic length
      notes: "",
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
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = form;


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const fetchElderlies = async () => {
    const res = await AxiosUserInstance.get("/Nurse/Elderly");
    return res?.data?.data || res?.data?.elderlies || [];
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


  const fetchMedicines = async () => {
    const res = await AxiosUserInstance.get("/Nurse/Medicine");
    return res?.data?.data || res?.data?.medicines || [];
  };


  const {
    data: medicines = [],
    isLoading: loadingMedicines,
    isError: medicinesError,
    refetch: refetchMedicines,
  } = useQuery({
    queryKey: ["medicinesList"],
    queryFn: fetchMedicines,
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
        message: "تعذر تحميل قائمة الأدوية",
      });
    },
  });


  const dailyIntakeValue = watch("dailyIntake");
  useEffect(() => {
    const n = Number(dailyIntakeValue) || 0;
    if (n < 1) return;


    const current = getValues("times") || [];
    if (current.length === n) return;


    if (current.length < n) {
      setValue("times", [...current, ...Array(n - current.length).fill("")], {
        shouldValidate: true,
      });
    } else {
      setValue("times", current.slice(0, n), { shouldValidate: true });
    }
  }, [dailyIntakeValue, getValues, setValue]);


  // Clear fields when switching mode
  const medicineMode = watch("medicineMode");
  useEffect(() => {
    if (medicineMode === "new") {
      setValue("medicineId", "");
    } else {
      setValue("newMedicineName", "");
      setValue("newMedicineType", "");
    }
    clearErrors();
  }, [medicineMode, setValue, clearErrors]);


  // For header subtitles
  const selectedElderlyId = watch("elderlyId");
  const selectedMedicineId = watch("medicineId");


  const selectedElderlyName = useMemo(() => {
    const x = elderlies.find(
      (e) => String(e.elderlyId ?? e.id) === String(selectedElderlyId),
    );
    return x?.name || "";
  }, [elderlies, selectedElderlyId]);


  const selectedMedicineLabel = useMemo(() => {
    const x = medicines.find(
      (m) => String(m.id) === String(selectedMedicineId),
    );
    if (!x) return "";
    // if your API returns TypeName already:
    const typeName = x.typeName || "";
    return typeName ? `${x.name} — (${typeName})` : x.name;
  }, [medicines, selectedMedicineId]);


  const onSubmit = async (data) => {
    // basic validations
    if (!data.elderlyId) {
      setError("elderlyId", { type: "manual", message: "يرجى اختيار المسن." });
      return;
    }


    if (!data.startDate) {
      setError("startDate", {
        type: "manual",
        message: "تاريخ البداية مطلوب.",
      });
      return;
    }


    if (!data.endDate) {
      setError("endDate", { type: "manual", message: "تاريخ النهاية مطلوب." });
      return;
    }


    // compare dates (simple)
    if (new Date(data.endDate) < new Date(data.startDate)) {
      setError("endDate", {
        type: "manual",
        message: "تاريخ النهاية يجب أن يكون بعد/يساوي تاريخ البداية.",
      });
      return;
    }


    const di = Number(data.dailyIntake);
    if (!di || di < 1 || di > 20) {
      setError("dailyIntake", {
        type: "manual",
        message: "عدد الجرعات اليومية يجب أن يكون بين 1 و 20.",
      });
      return;
    }


    const times = (data.times || []).map(normalizeText);
    if (times.length !== di) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "عدد مواعيد الجرعات يجب أن يساوي عدد الجرعات اليومية.",
      });
      return;
    }


    if (times.some((t) => !t)) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "يرجى إدخال جميع مواعيد الجرعات.",
      });
      return;
    }


    const unique = new Set(times);
    if (unique.size !== times.length) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "مواعيد الجرعات تحتوي على تكرار.",
      });
      return;
    }


    const payload = {
      elderlyId: Number(data.elderlyId),
      startDate: data.startDate,
      endDate: data.endDate,
      dailyIntake: di,
      notes: normalizeOptionalText(data.notes),
      times: times.map(normalizeTimeToHHmmss),
    };


    if (data.medicineMode === "existing") {
      if (!data.medicineId) {
        setError("medicineId", {
          type: "manual",
          message: "يرجى اختيار الدواء.",
        });
        return;
      }
      payload.medicineId = Number(data.medicineId);
    } else {
      const name = normalizeText(data.newMedicineName);
      const type = Number(data.newMedicineType);


      if (!name) {
        setError("newMedicineName", {
          type: "manual",
          message: "اسم الدواء مطلوب.",
        });
        return;
      }
      if (!type) {
        setError("newMedicineType", {
          type: "manual",
          message: "نوع الدواء مطلوب.",
        });
        return;
      }


      payload.newMedicine = {
        name,
        type,
      };
    }


    clearErrors();


    setLoading(true);
    try {
      await AxiosUserInstance.post("/Nurse/Medicine/drug-plan", payload);
      await queryClient.invalidateQueries({ queryKey: ["medicinesList"] });


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم إضافة خطة الدواء بنجاح",
      });


      reset({
        elderlyId: "",
        medicineMode: "existing",
        medicineId: "",
        newMedicineName: "",
        newMedicineType: "",
        startDate: "",
        endDate: "",
        dailyIntake: 1,
        times: [""],
        notes: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.message || "حدث خطأ أثناء إضافة خطة الدواء",
      });
    } finally {
      setLoading(false);
    }
  };


  const anyListError = elderliesError || medicinesError;
  const anyListLoading = loadingElderlies || loadingMedicines;


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
                  إضافة دواء للمسن
                </Typography>


                <LocalPharmacyIcon
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
                اختر المسن والدواء وحدد الفترة وعدد الجرعات ومواعيدها
                {selectedElderlyName ? ` — (${selectedElderlyName})` : ""}
                {medicineMode === "existing" && selectedMedicineLabel
                  ? ` — ${selectedMedicineLabel}`
                  : ""}
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
            بيانات خطة الدواء
          </Typography>


          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            سيتم حفظ الخطة مع مواعيد الجرعات بناءً على عدد الجرعات اليومية
          </Typography>


          {/* Loading states */}
          {anyListLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}


          {/* Error states */}
          {anyListError && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography color="error" sx={{ fontWeight: 800 }}>
                تعذر تحميل القوائم (المسنين/الأدوية)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => refetchElderlies()}
                  sx={{ borderRadius: 3 }}
                >
                  إعادة تحميل المسنين
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => refetchMedicines()}
                  sx={{ borderRadius: 3 }}
                >
                  إعادة تحميل الأدوية
                </Button>
              </Box>
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
                          key={elderly.elderlyId ?? elderly.id}
                          value={elderly.elderlyId ?? elderly.id}
                        >
                          {elderly.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>


              {/* Medicine Mode */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="medicineMode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="طريقة إدخال الدواء"
                      sx={{
                        ...inputStyle,
                        "& .MuiSelect-select": {
                          direction: "rtl",
                          textAlign: "right",
                        },
                      }}
                    >
                      <MenuItem value="existing">
                        اختيار دواء من القائمة
                      </MenuItem>
                      <MenuItem value="new">إضافة دواء جديد</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>


              {/* Existing medicine select */}
              {medicineMode === "existing" && (
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="medicineId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="الدواء"
                        error={!!errors.medicineId}
                        helperText={errors.medicineId?.message}
                        sx={{
                          ...inputStyle,
                          "& .MuiSelect-select": {
                            direction: "rtl",
                            textAlign: "right",
                          },
                        }}
                      >
                        <MenuItem value="">
                          {loadingMedicines
                            ? "جارٍ تحميل الأدوية..."
                            : "اختر الدواء"}
                        </MenuItem>


                        {medicines.map((m) => (
                          <MenuItem key={m.id} value={m.id}>
                            {m.typeName
                              ? `${m.name} — (${m.typeName})`
                              : m.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              )}


              {/* New medicine inputs */}
              {medicineMode === "new" && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="اسم الدواء"
                      placeholder="مثال: Panadol"
                      {...register("newMedicineName")}
                      error={!!errors.newMedicineName}
                      helperText={errors.newMedicineName?.message}
                      sx={{
                        ...inputStyle,
                        "& .MuiOutlinedInput-input": {
                          direction: "rtl",
                          textAlign: "right",
                        },
                      }}
                    />
                  </Grid>


                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="newMedicineType"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="نوع الدواء"
                          error={!!errors.newMedicineType}
                          helperText={errors.newMedicineType?.message}
                          sx={{
                            ...inputStyle,
                            "& .MuiSelect-select": {
                              direction: "rtl",
                              textAlign: "right",
                            },
                          }}
                        >
                          <MenuItem value="">اختر النوع</MenuItem>
                          {MEDICINE_TYPES.map((t) => (
                            <MenuItem key={t.value} value={t.value}>
                              {t.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </>
              )}


              {/* Dates */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="تاريخ البداية"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("startDate")}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                  sx={inputStyle}
                />
              </Grid>


              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="تاريخ النهاية"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("endDate")}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                  sx={inputStyle}
                />
              </Grid>


              {/* Daily Intake */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="dailyIntake"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="عدد الجرعات اليومية"
                      error={!!errors.dailyIntake}
                      helperText={errors.dailyIntake?.message}
                      sx={{
                        ...inputStyle,
                        "& .MuiSelect-select": {
                          direction: "rtl",
                          textAlign: "right",
                        },
                      }}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((x) => (
                        <MenuItem key={x} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>


              {/* Times */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    opacity: 0.9,
                  }}
                >
                  <ScheduleIcon />
                  <Typography sx={{ fontWeight: 900 }}>
                    مواعيد الجرعات (يجب أن تساوي عدد الجرعات اليومية)
                  </Typography>
                </Box>


                <Grid container spacing={2}>
                  {(watch("times") || []).map((_, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <Controller
                        name={`times.${idx}`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="time"
                            label={`وقت الجرعة #${idx + 1}`}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 60 }} // 1 min
                            sx={inputStyle}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>


              {/* Notes */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="ملاحظات (اختياري)"
                  placeholder="مثال: بعد الأكل"
                  {...register("notes")}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  multiline
                  minRows={2}
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
              disabled={loading || anyListLoading || anyListError}
              sx={buttonStyle}
              startIcon={<LocalPharmacyIcon />}
            >
              {loading ? "جارٍ الحفظ..." : "حفظ خطة الدواء"}
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



