import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router";
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
  mt: 1,
  py: 1.2,
  borderRadius: "14px",
  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
  },
};
const passwordInputStyles = {
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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const loginForm = useForm();
  const { register, handleSubmit, reset } = loginForm;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://localhost:7160/api/Identity/Account/login",
        data,
      );

      if (response.status === 200) {
        alert("تم تسجيل الدخول بنجاح");
        reset();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={style.authWrapper}>
      <Paper elevation={0} sx={paperStyle}>
        <Typography variant="h5" textAlign="center" mb={2}>
          تسجيل الدخول
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ input: { textAlign: "left", direction: "ltr" } }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="email"
                label="البريد الإلكتروني"
                fullWidth
                autoComplete="email"
                {...register("email", { required: true })}
                className={style.glassInput}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
        <FormControl fullWidth variant="outlined" className={style.glassInput}>
          <InputLabel htmlFor="password">كلمة المرور</InputLabel>

          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="كلمة المرور"
            {...register("password")}
            sx={passwordInputStyles}
            autoComplete="current-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
            </Grid>

            {error && (
              <Grid size={{ xs: 12 }}>
                <Typography color="error" textAlign="center">
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={buttonStyle}
              >
                {loading ? <CircularProgress size={24} /> : "تسجيل الدخول"}
              </Button>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                هل نسيت كلمة السر؟{" "}
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#6a6a57",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  اضغط هنا
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
