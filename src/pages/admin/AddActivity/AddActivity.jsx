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
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


import AxiosUserInstance from "../../../api/AxiosUserInstance";
import AddActivitySchema from "../../../validations/AddActivitySchema.js";


import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { TrendingUp } from "@mui/icons-material";


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


export default function AddActivity() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const form = useForm({
    resolver: yupResolver(AddActivitySchema),
    defaultValues: {
      activityName: "",
      description: "",
      location: "",
      date: "",
      startTime: "",
      activityOrganizations: [{ organizationName: "" }],
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


  const { fields, append, remove } = useFieldArray({
    control,
    name: "activityOrganizations",
  });


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const orgErrorMessage = useMemo(() => {
    // في حال yup رجع message على مستوى array (min(1))
    return typeof errors?.activityOrganizations?.message === "string"
      ? errors.activityOrganizations.message
      : "";
  }, [errors]);


  const onSubmit = async (data) => {
    setLoading(true);


    try {
      // API expects: { activityName, description, location, date, startTime, activityOrganizations:[{organizationName}] }
      await AxiosUserInstance.post("/Admin/Activity", data);


      setSnackbar({
        open: true,
        severity: "success",
        message: "تمت إضافة النشاط بنجاح",
      });


      reset({
        activityName: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        activityOrganizations: [{ organizationName: "" }],
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء إضافة النشاط",
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
                  إضافة نشاط
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
                قم بتعبئة بيانات النشاط وإضافة الجهات المشاركة
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
              <TrendingUp
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
            بيانات النشاط
          </Typography>


          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            أدخل البيانات الأساسية ثم أضف الجهات المشاركة
          </Typography>


          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="اسم النشاط"
                  {...register("activityName")}
                  error={!!errors.activityName}
                  helperText={errors.activityName?.message}
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
                  label="الموقع"
                  {...register("location")}
                  error={!!errors.location}
                  helperText={errors.location?.message}
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
                <TextField
                  fullWidth
                  label="الوصف"
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  multiline
                  minRows={3}
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
                  label="التاريخ"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("date")}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  sx={inputStyle}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="وقت البداية"
                  placeholder="مثال: 10 صباحا"
                  {...register("startTime")}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                  sx={{
                    ...inputStyle,
                    "& .MuiOutlinedInput-input": {
                      direction: "rtl",
                      textAlign: "right",
                    },
                  }}
                />
              </Grid>


              {/* Organizations */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1.5, opacity: 0.6 }} />


                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    
                    gap: 2,
                    mb: 1.2,
                  }}
                >
                  <Typography sx={{ fontWeight: 900 }}>
                    الجهات المشاركة
                  </Typography>


                  <Button
                    type="button"
                    onClick={() => append({ organizationName: "" })}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 3,
                      gap: 1,
                      fontWeight: 800,
                      color: "#35352f",
                      borderColor: "rgba(76, 76, 64, 0.5)",
                      "&:hover": {
                        borderColor: "rgba(106, 106, 87, 0.8)",
                        backgroundColor: "rgba(240, 240, 234, 0.15)",
                      },
                    }}
                  >
                    إضافة جهة
                  </Button>
                </Box>


                {orgErrorMessage && (
                  <Typography
                    color="error"
                    sx={{ mb: 1, fontWeight: 700, fontSize: 13 }}
                  >
                    {orgErrorMessage}
                  </Typography>
                )}


                {fields.map((f, index) => {
                  const fieldErr =
                    errors?.activityOrganizations?.[index]?.organizationName;


                  return (
                    <Box
                      key={f.id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                        mb: 1.2,
                      }}
                    >
                      <Controller
                        name={`activityOrganizations.${index}.organizationName`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            label={`اسم الجهة ${index + 1}`}
                            {...field}
                            error={!!fieldErr}
                            helperText={fieldErr?.message}
                            sx={{
                              ...inputStyle,
                              "& .MuiOutlinedInput-input": {
                                direction: "rtl",
                                textAlign: "right",
                              },
                            }}
                          />
                        )}
                      />


                      <IconButton
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        sx={{
                          mt: 0.6,
                          borderRadius: 3,                   
                          border: "1px solid rgba(106, 106, 87, 0.25)",
                          background: "rgba(255,255,255,0.25)",
                          "&:hover": { background: "rgba(255,255,255,0.4)" },
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  );
                })}
              </Grid>
            </Grid>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={buttonStyle}
            >
              {loading ? "جارٍ الإضافة..." : "إضافة النشاط"}
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



