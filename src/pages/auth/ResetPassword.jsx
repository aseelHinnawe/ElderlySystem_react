import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import style from "./Auth.module.css";
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
  direction: "ltr", // النص من الشمال
  "& input": {
    textAlign: "left",
    paddingRight: "48px", // مساحة للأيقونة
  },
  "& .MuiInputAdornment-root": {
    position: "absolute",
    right: 8, // العين دايمًا عاليمين
  },
};

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: state?.email || "", // البريد من صفحة Forget Password
      code: "",
      newPassword: "",
    },
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      await axios.post(
        "https://localhost:7160/api/Identity/Account/reset-password",
        data,
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        "فشل إعادة تعيين كلمة المرور. يرجى التأكد من الكود والبريد الإلكتروني.",
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

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          أدخل كود التحقق، وكلمة المرور الجديدة لإعادة تعيين كلمة المرور الخاصة
          بك.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className={`${style.formBox}`}
        >
          <TextField
            {...register("email", { required: true })}
            label="البريد الإلكتروني"
            fullWidth
            autoComplete="email"
            className={style.glassInput}
            sx={{ input: { textAlign: "left", direction: "ltr" } }}
            disabled 
          />

          <TextField
            {...register("code", { required: true })}
            label="كود التحقق"
            fullWidth
            className={style.glassInput}
            sx={{ input: { textAlign: "left", direction: "ltr" } }}
          />

          <FormControl fullWidth variant="outlined" className={style.glassInput}>
    <InputLabel htmlFor="newPassword">كلمة المرور الجديدة</InputLabel>

    <OutlinedInput
      id="newPassword"
      type={showNewPassword ? "text" : "password"}
      label="كلمة المرور الجديدة"
      {...register("newPassword", { required: true })}
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
    />
  </FormControl>


          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={buttonStyle}
          >
            {isLoading ? <CircularProgress size={24} /> : "إعادة التعيين"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
