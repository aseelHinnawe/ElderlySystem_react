import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


import AxiosUserInstance from "../../../api/AxiosUserInstance";


import EventIcon from "@mui/icons-material/Event";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupsIcon from "@mui/icons-material/Groups";


const paperStyle = {
  p: { xs: 2.5, sm: 4 },
  maxWidth: 900,
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


export default function AddShifts() {
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const form = useForm({
    defaultValues: {
      date: "",
      a1: "",
      a2: "",
      b1: "",
      b2: "",
      c1: "",
      c2: "",
    },
    mode: "onTouched",
  });


  const {
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = form;


  // ✅ react-hook-form: أفضل من watch داخل useMemo
  const watched = useWatch({
    control,
    name: ["a1", "a2", "b1", "b2", "c1", "c2"],
  });
  const selectedIds = (watched || []).filter(Boolean);


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  // =========================
  // ✅ React Query fetch nurses
  // =========================
  const fetchNurses = async () => {
    const res = await AxiosUserInstance.get("/Admin/Shift/active-nurses");
    return res?.data?.nurses || [];
  };


  const {
    data: nurses = [],
    isLoading: loadingNurses,
    isError: nursesError,
    refetch: refetchNurses,
  } = useQuery({
    queryKey: ["activeNurses"],
    queryFn: fetchNurses,
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
        message: err?.response?.data?.message || "حدث خطأ أثناء جلب الممرضات",
      });
    },
  });


  const validateNoDuplicates = (data) => {
    const all = [data.a1, data.a2, data.b1, data.b2, data.c1, data.c2].filter(
      Boolean,
    );


    if (all.length !== 6) {
      setError("root", {
        type: "manual",
        message: "يجب اختيار 6 ممرضات (ممرضتين لكل شفت).",
      });
      return false;
    }


    const unique = new Set(all);
    if (unique.size !== 6) {
      setError("root", {
        type: "manual",
        message: "ممنوع التكرار. يجب اختيار 6 ممرضات مختلفات.",
      });
      return false;
    }


    clearErrors("root");
    return true;
  };


  const onSubmit = async (data) => {
    if (!data.date) {
      setError("date", { type: "manual", message: "التاريخ مطلوب." });
      return;
    }


    if (!validateNoDuplicates(data)) return;


    const payload = {
      date: data.date, // yyyy-mm-dd
      aNurseIds: [data.a1, data.a2],
      bNurseIds: [data.b1, data.b2],
      cNurseIds: [data.c1, data.c2],
    };


    setLoading(true);
    try {
      await AxiosUserInstance.post("/Admin/Shift/assign-daily", payload);


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم تعيين الشفتات بنجاح",
      });


      reset({
        date: "",
        a1: "",
        a2: "",
        b1: "",
        b2: "",
        c1: "",
        c2: "",
      });
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }


      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء تعيين الشفتات",
      });
    } finally {
      setLoading(false);
    }
  };


  const NurseSelect = ({ name, label }) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: "مطلوب" }}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors?.[name]} sx={inputStyle}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            disabled={loadingNurses || nursesError}
            MenuProps={{
              PaperProps: { style: { maxHeight: 320 } },
            }}
          >
            {loadingNurses ? (
              <MenuItem disabled value="">
                جاري تحميل الممرضات...
              </MenuItem>
            ) : nursesError ? (
              <MenuItem
                disabled
                value=""
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                فشل تحميل الممرضات
              </MenuItem>
            ) : (
              <MenuItem value="">
                <em>اختر ممرضة</em>
              </MenuItem>
            )}


            {!loadingNurses &&
              !nursesError &&
              nurses.map((n) => {
                const isTaken =
                  selectedIds.includes(n.id) && field.value !== n.id;


                return (
                  <MenuItem key={n.id} value={n.id} disabled={isTaken}>
                    {n.fullName}
                  </MenuItem>
                );
              })}
          </Select>


          <FormHelperText>{errors?.[name]?.message || " "}</FormHelperText>
        </FormControl>
      )}
    />
  );


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
                  تعيين الشفتات (A/B/C)
                </Typography>


                <EventNoteIcon
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
                اختر تاريخ اليوم ثم اختر ممرضتين لكل شفت. ممنوع التكرار (6
                مختلفات).
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
              <EventIcon sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }} />
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
            تعيين الشفتات
          </Typography>


          {/* حالة تحميل الممرضات (اختياري) */}
          {loadingNurses && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={26} />
            </Box>
          )}


          {nursesError && (
            <Box sx={{ textAlign: "center", my: 1 }}>
              <Typography color="error" sx={{ fontWeight: 800 }}>
                فشل تحميل قائمة الممرضات
              </Typography>
              <Button
                type="button"
                onClick={() => refetchNurses()}
                variant="outlined"
                sx={{ mt: 1, borderRadius: 3 }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}


          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              {/* Date */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "التاريخ مطلوب." }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="التاريخ"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...field}
                      error={!!errors.date}
                      helperText={errors.date?.message}
                      sx={inputStyle}
                    />
                  )}
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1, opacity: 0.6 }} />
              </Grid>


              {/* Shifts title */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <GroupsIcon />
                  <Typography sx={{ fontWeight: 900 }}>
                    اختيار الممرضات لكل شفت
                  </Typography>
                </Box>
              </Grid>


              {/* A */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    background: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(106, 106, 87, 0.15)",
                  }}
                  elevation={0}
                >
                  <Typography sx={{ fontWeight: 900, mb: 1.5 }}>
                    شفت A 
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <NurseSelect name="a1" label="A - الممرضة الأولى" />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <NurseSelect name="a2" label="A - الممرضة الثانية" />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>


              {/* B */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    background: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(106, 106, 87, 0.15)",
                  }}
                  elevation={0}
                >
                  <Typography sx={{ fontWeight: 900, mb: 1.5 }}>
                    شفت B
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <NurseSelect name="b1" label="B - الممرضة الأولى" />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <NurseSelect name="b2" label="B - الممرضة الثانية" />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>


              {/* C */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    background: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(106, 106, 87, 0.15)",
                  }}
                  elevation={0}
                >
                  <Typography sx={{ fontWeight: 900, mb: 1.5 }}>
                    شفت C
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <NurseSelect name="c1" label="C - الممرضة الأولى" />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <NurseSelect name="c2" label="C - الممرضة الثانية" />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>


              {errors?.root?.message && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error" sx={{ fontWeight: 800 }}>
                    {errors.root.message}
                  </Typography>
                </Grid>
              )}
            </Grid>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || loadingNurses || nursesError}
              sx={buttonStyle}
            >
              {loading ? "جارٍ الحفظ..." : "حفظ الشفتات"}
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



