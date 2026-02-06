import { Box, Button, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import style from './Login.module.css'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm();

  const handleLogin = loginForm.handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://localhost:7160/api/Identity/Account/login",
        data
      );

      if (response.status === 200) {
        alert("تم تسجيل الدخول بنجاح");
        loginForm.reset();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  });
  return (
    <Box
      className={`${style.loginWrapper}`}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: { xs: "100%", sm: 500 }, // ✅ عرض متجاوب
          borderRadius: "20px",
          background: "rgba(240, 240, 234, 0.25)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(106, 106, 87, 0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          تسجيل الدخول
        </Typography>

        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12}}>
              <TextField
                id="email"
                label="البريد الإلكتروني"
                fullWidth
                autoComplete="email"
                {...loginForm.register("email")}
                className={style.glassInput}
                sx={{ input: { textAlign: "left", direction: "ltr" } }}
              />
            </Grid>

            <Grid size={{ xs: 12}}>
              <TextField
                id="password"
                label="كلمة المرور"
                fullWidth
                type="password"
                autoComplete="current-password"
                {...loginForm.register("password")}
                className={style.glassInput}
                sx={{ input: { textAlign: "left", direction: "ltr" } }}
              />
            </Grid>

            <Grid size={{ xs: 12}}>
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
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
                  },
                }}
              >
                {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}
