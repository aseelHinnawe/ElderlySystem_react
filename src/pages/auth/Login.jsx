import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router";
import style from "./Auth.module.css";
import LoginSchema from "../../validations/LoginSchema.js";
import { yupResolver } from "@hookform/resolvers/yup";
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
  const navigate = useNavigate();

  const loginForm = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = loginForm;
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [error, setError] = useState("");
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://localhost:7160/api/Identity/Account/login",
        data
      );

      if (response.status === 200) {
        reset();
        setSnackbarMessage("تم تسجيل الدخول بنجاح");
        localStorage.setItem("token", response.data.token);
        setSnackbarOpen(true);
        const decodedToken = jwtDecode(response.data.token);
        const roleClaim =
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const role = decodedToken[roleClaim];
        if (role === "Admin") {
          navigate("/Admin");
        } else if (role === "Sponsor") {
          navigate("/Sponsor");
        } else if (role === "Nurse") {
          navigate("/Nurse");
        }
      }
    } catch (err) {
  setError(err.response?.data?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
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
                fullWidth
                label="البريد الإلكتروني"
                {...register("email")}
                autoComplete="email"
                className={style.glassInput}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ input: { textAlign: "left", direction: "ltr" } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                variant="outlined"
                className={style.glassInput}
              >
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
                {errors.password && (
                  <FormHelperText error>
                    {errors.password.message}
                  </FormHelperText>
                )}
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