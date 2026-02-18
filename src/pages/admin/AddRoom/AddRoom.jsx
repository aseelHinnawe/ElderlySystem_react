import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddRoomSchema from "../../../validations/AddRoomSchema";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";


import style from "./AddRoom.module.css";


import BedIcon from "@mui/icons-material/Bed";
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
  "& input": {
    textAlign: "left",
    direction: "ltr",
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


const addRequestsCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


export default function AddRoom() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const form = useForm({
    resolver: yupResolver(AddRoomSchema),
    defaultValues: {
      roomNumber: "",
      roomType: "",
      capacity: "",
      price: "",
      description: "",
      images: [],
    },
  });


  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = form;


  const roomType = watch("roomType");


  useEffect(() => {
    if (roomType === "FirstClass") {
      setValue("capacity", 1, { shouldValidate: true, shouldDirty: true });
      setValue("price", 2500, { shouldValidate: true, shouldDirty: true });
    } else if (roomType === "SecondClass") {
      setValue("capacity", 2, { shouldValidate: true, shouldDirty: true });
      setValue("price", 2000, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue("capacity", "", { shouldValidate: false, shouldDirty: false });
      setValue("price", "", { shouldValidate: false, shouldDirty: false });
    }
  }, [roomType, setValue]);


  const previews = useMemo(() => {
    if (!selectedImages || selectedImages.length === 0) return [];
    return selectedImages.map((file, idx) => ({
      key: `${file.name}-${file.size}-${idx}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [selectedImages]);


  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const onSubmit = async (data) => {
    setLoading(true);


    try {
      const formData = new FormData();
      formData.append("RoomNumber", data.roomNumber);
      formData.append("RoomType", data.roomType);
      formData.append("Capacity", String(data.capacity));
      formData.append("Price", String(data.price));
      formData.append("Description", data.description);


      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((file) => formData.append("Images", file));
      }


      await AxiosUserInstance.post("/Admin/Room", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      setSnackbar({
        open: true,
        severity: "success",
        message: "تمت إضافة الغرفة بنجاح",
      });


      reset();
      setSelectedImages([]);
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء إضافة الغرفة",
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
        <Card sx={{ ...addRequestsCardStyles, width: "100%" }}>
          <CardContent className={style.headerContent}>
            <Box>
              <Box className={style.titleWrapper}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
                >
                  إضافة غرفة
                </Typography>


                <BedIcon sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }} />
              </Box>


              <Typography
                sx={{
                  opacity: 0.9,
                  mt: { xs: 1, md: 2 },
                  fontSize: { xs: 12, md: 16 },
                }}
              >
                يمكنك إضافة غرفة جديدة وتحديد تفاصيلها ورفع أكثر من صورة
              </Typography>
            </Box>


            <Box
              sx={{
                width: { xs: 50, md: 70 },
                height: { xs: 50, md: 70 },
              }}
              className={style.iconCircle}
            >
              <AddPhotoAlternateIcon
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
            بيانات الغرفة
          </Typography>


          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            أدخل بيانات الغرفة وارفع الصور
          </Typography>


          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="رقم الغرفة"
                  {...register("roomNumber")}
                  error={!!errors.roomNumber}
                  helperText={errors.roomNumber?.message}
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
                <FormControl
                  fullWidth
                  error={!!errors.roomType}
                  sx={inputStyle}
                >
                  <InputLabel>نوع الغرفة</InputLabel>


                  <Controller
                    name="roomType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="نوع الغرفة"
                        {...field}
                        sx={{
                          borderRadius: "14px",
                          "& .MuiSelect-select": {
                            direction: "rtl",
                            textAlign: "right",
                          },
                        }}
                      >
                        <MenuItem value="FirstClass">درجة أولى</MenuItem>
                        <MenuItem value="SecondClass">درجة ثانية</MenuItem>
                      </Select>
                    )}
                  />


                  {errors.roomType && (
                    <FormHelperText>{errors.roomType.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="السعة"
                  {...register("capacity")}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: true }}
                  helperText={
                    roomType === "FirstClass"
                      ? "السعة ثابتة (1) للدرجة الأولى"
                      : roomType === "SecondClass"
                        ? "السعة ثابتة (2) للدرجة الثانية"
                        : ""
                  }
                  sx={inputStyle}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="السعر"
                  {...register("price")}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: true }}
                  helperText={
                    roomType === "FirstClass"
                      ? "السعر ثابت (2500) للدرجة الأولى"
                      : roomType === "SecondClass"
                        ? "السعر ثابت (2000) للدرجة الثانية"
                        : ""
                  }
                  sx={inputStyle}
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


              <Grid size={{ xs: 12 }}>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                          py: 1.5,
                          color: "#35352f",
                          borderColor: "rgba(76, 76, 64, 0.5)",
                          "&:hover": {
                            borderColor: "rgba(106, 106, 87, 0.8)",
                            backgroundColor: "rgba(240, 240, 234, 0.15)",
                          },
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 3,
                        }}
                      >
                        رفع صور الغرفة (يمكن اختيار أكثر من صورة)
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => {
                            const newFiles = Array.from(e.target.files || []);


                            setSelectedImages((prev) => {
                              const merged = [...prev, ...newFiles];
                              const unique = merged.filter(
                                (file, index, arr) =>
                                  index ===
                                  arr.findIndex(
                                    (f) =>
                                      f.name === file.name &&
                                      f.size === file.size,
                                  ),
                              );


                              field.onChange(unique);
                              return unique;
                            });


                            e.target.value = "";
                          }}
                        />
                      </Button>


                      {errors.images && (
                        <FormHelperText error sx={{ mt: 1 }}>
                          {errors.images.message}
                        </FormHelperText>
                      )}


                      {previews.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            sx={{ fontWeight: 800, mb: 1, color: "#555" }}
                          >
                            الصور المختارة:
                          </Typography>


                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}
                          >
                            {previews.map((p) => (
                              <Box
                                key={p.key}
                                sx={{
                                  width: 110,
                                  borderRadius: 3,
                                  overflow: "hidden",
                                  border: "1px solid rgba(106,106,87,0.25)",
                                  background: "#fff",
                                }}
                              >
                                <Box
                                  component="img"
                                  src={p.url}
                                  alt={p.name}
                                  sx={{
                                    width: "100%",
                                    height: 80,
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    p: 1,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "#555",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  title={p.name}
                                >
                                  {p.name}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                />
              </Grid>
            </Grid>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={buttonStyle}
            >
              {loading ? "جارٍ الإضافة..." : "إضافة الغرفة"}
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





