import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router";
import VerifyLinkSchema from "../../../validations/VerifyLinkSchema";
import AxiosUserInstance from "../../../api/AxiosUserInstance.jsx";


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


export default function VerfiyLink() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(VerifyLinkSchema),
    defaultValues: {
      elderlyNationalId: "",
      sponsorNationalId: "",
    },
  });


  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");


    try {
      const res = await AxiosUserInstance.post(
        "/Sponsor/Elderly/verify-link",
        data,
      );
      if (res.data.data.isLinked == false) {
  setTimeout(() =>
    navigate("/Sponsor/Add-Elderly", {
      state: { elderlyNationalId: data.elderlyNationalId },
    }), 1500);
} else {
        setTimeout(() => navigate("/Sponsor/Add-Elderly-Link"), 1500);
      }
      setSnackbarMessage(res.data?.message || "تم التحقق بنجاح");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "حدث خطأ أثناء التحقق. الرجاء المحاولة لاحقًا.";


      setErrorMessage(msg);
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };


  const handleSnackbarClose = () => setSnackbarOpen(false);


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
        <Typography variant="h5" textAlign="center" mb={1}>
          التحقق من الربط
        </Typography>


        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
          sx={{ fontWeight: 300 }}
        >
          أدخل رقم هوية المسن ورقم هوية الكفيل للتحقق
        </Typography>


        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "14px" }}>
            {errorMessage}
          </Alert>
        )}


        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="رقم هوية المسن"
                fullWidth
                {...register("elderlyNationalId")}
                error={!!errors.elderlyNationalId}
                helperText={errors.elderlyNationalId?.message}
                sx={inputStyle}
                inputProps={{ inputMode: "numeric" }}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="رقم هوية الكفيل"
                fullWidth
                {...register("sponsorNationalId")}
                error={!!errors.sponsorNationalId}
                helperText={errors.sponsorNationalId?.message}
                sx={inputStyle}
                inputProps={{ inputMode: "numeric" }}
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.2,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "تحقق"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
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



