// src/pages/Admin/Donations/AddDonation.jsx
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
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  InputLabel,
} from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


import AxiosUserInstance from "../../../api/AxiosUserInstance";
import AddDonationSchema from "../../../validations/AddDonationSchema";


import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";


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


export default function AddDonation() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const form = useForm({
    resolver: yupResolver(AddDonationSchema),
    defaultValues: {
      donorName: "",
      donationType: "Cash", // Cash | InKind
      monetaryAmount: "",
      currency: "",
      goods: [{ nameGood: "", quantity: "" }],
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


  const donationType = useWatch({ control, name: "donationType" });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "goods",
  });


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const goodsErrorMessage = useMemo(() => {
    return typeof errors?.goods?.message === "string"
      ? errors.goods.message
      : "";
  }, [errors]);


  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // بناء الـ payload بالضبط مثل اللي بدك إياه
      const payload =
        data.donationType === "Cash"
          ? {
              donorName: data.donorName,
              donationType: "Cash",
              monetaryAmount: Number(data.monetaryAmount),
              currency: data.currency,
            }
          : {
              donorName: data.donorName,
              donationType: "InKind",
              goods: (data.goods || []).map((g) => ({
                nameGood: g.nameGood,
                quantity: Number(g.quantity),
              })),
            };


      // ✅ عدّل المسار حسب API عندك
      await AxiosUserInstance.post("/Admin/Donation", payload);


      setSnackbar({
        open: true,
        severity: "success",
        message: "تمت إضافة التبرع بنجاح",
      });


      reset({
        donorName: "",
        donationType: "Cash",
        monetaryAmount: "",
        currency: "",
        goods: [{ nameGood: "", quantity: "" }],
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء إضافة التبرع",
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
                  إضافة تبرع
                </Typography>


                <VolunteerActivismIcon
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
                اختر نوع التبرع وأدخل البيانات المطلوبة
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
              {donationType === "Cash" ? (
                <PaidOutlinedIcon
                  sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }}
                />
              ) : (
                <Inventory2OutlinedIcon
                  sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }}
                />
              )}
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
            بيانات التبرع
          </Typography>


          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="اسم المتبرع"
                  {...register("donorName")}
                  error={!!errors.donorName}
                  helperText={errors.donorName?.message}
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
                <FormControl
                  fullWidth
                  error={!!errors.donationType}
                  sx={inputStyle}
                >
                  <InputLabel id="donationType-label">نوع التبرع</InputLabel>
                  <Controller
                    name="donationType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="donationType-label"
                        label="نوع التبرع"
                      >
                        <MenuItem value="Cash">نقدي</MenuItem>
                        <MenuItem value="InKind">عيني</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {errors.donationType?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>


              {donationType === "Cash" ? (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="المبلغ"
                      type="number"
                      inputMode="decimal"
                      {...register("monetaryAmount")}
                      error={!!errors.monetaryAmount}
                      helperText={errors.monetaryAmount?.message}
                      sx={inputStyle}
                    />
                  </Grid>


                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="العملة"
                      {...register("currency")}
                      error={!!errors.currency}
                      helperText={errors.currency?.message}
                      sx={{
                        ...inputStyle,
                        "& .MuiOutlinedInput-input": {
                          direction: "ltr",
                          textAlign: "left",
                        },
                      }}
                    />
                  </Grid>
                </>
              ) : (
                <>
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
                      <Typography sx={{ fontWeight: 900 }}>المنتجات</Typography>


                      <Button
                        type="button"
                        onClick={() => append({ nameGood: "", quantity: "" })}
                        startIcon={<AddIcon />}
                        variant="outlined"
                        sx={{
                          py: 1,
                          px: 2,
                          borderRadius: 3,
                          fontWeight: 800,
                          gap: 1,
                          color: "#35352f",
                          borderColor: "rgba(76, 76, 64, 0.5)",
                          "&:hover": {
                            borderColor: "rgba(106, 106, 87, 0.8)",
                            backgroundColor: "rgba(240, 240, 234, 0.15)",
                          },
                        }}
                      >
                        إضافة منتج
                      </Button>
                    </Box>


                    {goodsErrorMessage && (
                      <Typography
                        color="error"
                        sx={{ mb: 1, fontWeight: 700, fontSize: 13 }}
                      >
                        {goodsErrorMessage}
                      </Typography>
                    )}


                    {fields.map((f, index) => {
                      const nameErr = errors?.goods?.[index]?.nameGood;
                      const qtyErr = errors?.goods?.[index]?.quantity;


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
                          <Box sx={{ flex: 1 }}>
                            <Controller
                              name={`goods.${index}.nameGood`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  fullWidth
                                  label={`اسم المنتج ${index + 1}`}
                                  {...field}
                                  error={!!nameErr}
                                  helperText={nameErr?.message}
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
                          </Box>


                          <Box sx={{ width: 140 }}>
                            <Controller
                              name={`goods.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  fullWidth
                                  label="الكمية"
                                  type="number"
                                  {...field}
                                  error={!!qtyErr}
                                  helperText={qtyErr?.message}
                                  sx={inputStyle}
                                />
                              )}
                            />
                          </Box>


                          <IconButton
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            sx={{
                              mt: 0.6,
                              borderRadius: 3,
                              border: "1px solid rgba(106, 106, 87, 0.25)",
                              background: "rgba(255,255,255,0.25)",
                              "&:hover": {
                                background: "rgba(255,255,255,0.4)",
                              },
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Grid>
                </>
              )}
            </Grid>


            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={buttonStyle}
            >
              {loading ? "جارٍ الإضافة..." : "إضافة التبرع"}
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



