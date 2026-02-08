import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import style from "./Auth.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import ResetPasswordSchema from "../../validations/ResetPasswordSchema";

const paperStyle = {
  p: 4,
  maxWidth: 600,
  width: "100%",
  borderRadius: "20px",
  background: "rgba(240, 240, 234, 0.25)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
};

export const buttonStyle = {
  py: 1.2,
  borderRadius: "14px",
  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
  },
};

const newPasswordInputStyles = {
  direction: "ltr",
  "& input": {
    textAlign: "left",
    paddingRight: "48px",
  },
  "& .MuiInputAdornment-root": {
    position: "absolute",
    right: 8,
  },
};

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      email: state?.email || "",
      code: "",
      newPassword: "",
    },
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      await axios.patch(
        "https://localhost:7160/api/Identity/Account/reset-password",
        data
      );
      setSnackbarMessage("تم إعادة تعيين كلمة المرور بنجاح");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500); // بعد 1.5 ثانية الانتقال للصفحة الرئيسية
    } catch (err) {
      console.error(err);
      setError(
        "فشل إعادة تعيين كلمة المرور. يرجى التأكد من الكود والبريد الإلكتروني."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={style.authWrapper}>
      <Paper elevation={0} sx={paperStyle}>
        <Typography variant="h5" textAlign="center" mb={2}>
          إعادة تعيين كلمة المرور
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
          أدخل كود التحقق، وكلمة المرور الجديدة لإعادة تعيين كلمة المرور الخاصة بك.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} className={style.formBox}>
          {/* البريد الإلكتروني */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="البريد الإلكتروني"
                fullWidth
                autoComplete="email"
                className={style.glassInput}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ input: { textAlign: "left", direction: "ltr" } }}
                disabled
              />
            )}
          />

          {/* كود التحقق */}
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="كود التحقق"
                fullWidth
                className={style.glassInput}
                error={!!errors.code}
                helperText={errors.code?.message}
                sx={{ input: { textAlign: "left", direction: "ltr" } }}
              />
            )}
          />

          {/* كلمة المرور الجديدة */}
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth variant="outlined" className={style.glassInput} sx={{ mt: 2 }}>
                <InputLabel htmlFor="newPassword">كلمة المرور الجديدة</InputLabel>
                <OutlinedInput
                  {...field}
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  label="كلمة المرور الجديدة"
                  sx={newPasswordInputStyles}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  error={!!errors.newPassword}
                />
                {errors.newPassword && (
                  <Typography color="error" sx={{ mt: 0.5, fontSize: "0.8rem" }}>
                    {errors.newPassword.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {error && (
            <Typography color="error" textAlign="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth sx={{ ...buttonStyle, mt: 2 }}>
            {isLoading ? "جار التعيين..." : "إعادة التعيين"}
          </Button>
        </Box>
      </Paper>

      {/* Snackbar Alert */}
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
