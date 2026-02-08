import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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

export default function ForgetPassword() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      await axios.post(
        "https://localhost:7160/api/Identity/Account/send-reset-code",
        data,
      );

      navigate("/reset-password", {
        state: { email: data.email },
      });
    } catch (err) {
      console.error(err);
      setError("فشل إرسال الكود. يرجى التأكد من البريد الإلكتروني.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box className={style.authWrapper}>
      <Paper elevation={0} sx={paperStyle}>
        <Typography variant="h5" textAlign="center" mb={2}>
          نسيت كلمة المرور
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          أدخل بريدك الإلكتروني ، وسنرسل لك كود تحقق على هذا البريد لاستخدامه في
          إعادة تعيين كلمة المرور الخاصة بك.{" "}
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
          />

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
            {isLoading ? <CircularProgress size={24} /> : "إرسال الكود"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
