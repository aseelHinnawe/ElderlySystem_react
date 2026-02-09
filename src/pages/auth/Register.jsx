import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import style from "./Auth.module.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import RegisterEmpSchema from "../../validations/RegisterEmpSchema";
import registerSchema from "../../validations/RegisterSchema";
import { useNavigate } from "react-router";

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

const passwordInputStyles = {
  direction: "ltr",
  "& input": { textAlign: "left", paddingRight: "48px" },
  "& .MuiInputAdornment-root": { position: "absolute", right: 8 },
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

function EmployeeForm({ register, errors, control, fileName, setFileName }) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Grid container spacing={2.5} mt={1}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="الاسم الكامل"
          {...register("fullName")}
          className={style.glassInput}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="البريد الإلكتروني"
          {...register("email")}
          className={style.glassInput}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ input: { textAlign: "left", direction: "ltr" } }}
        />
      </Grid>

      <Grid size={{ xs: 12 ,sm:6}}>
        <TextField
          fullWidth
          label="رقم الهاتف"
          {...register("phoneNumber")}
          className={style.glassInput}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          sx={{ input: { textAlign: "left", direction: "ltr" } }}
        />
      </Grid>

      <Grid size={{ xs: 12 , sm:6}}>
        <TextField
          fullWidth
          label="رقم الهوية"
          {...register("nationalId")}
          className={style.glassInput}
          error={!!errors.nationalId}
          helperText={errors.nationalId?.message}
          sx={{ input: { textAlign: "left", direction: "ltr" } }}
        />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField
          fullWidth
          label="المدينة"
          {...register("city")}
          className={style.glassInput}
          error={!!errors.city}
          helperText={errors.city?.message}
        />
      </Grid>

      <Grid size={{ xs: 12}}>
        <Typography sx={{ mb: 1, fontWeight: 500 }}>الجنس</Typography>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <>
              <RadioGroup row {...field}>
                <FormControlLabel value="Female" control={<Radio />} label="أنثى" />
                <FormControlLabel value="Male" control={<Radio />} label="ذكر" />
              </RadioGroup>
              {errors.gender && <FormHelperText error>{errors.gender.message}</FormHelperText>}
            </>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12}}>
        <FormControl fullWidth variant="outlined" className={style.glassInput}>
          <InputLabel htmlFor="password">كلمة المرور</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="كلمة المرور"
            {...register("password")}
            sx={passwordInputStyles}
            autoComplete="new-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
        </FormControl>
      </Grid>

      {/* شهادة الموظف */}
      <Grid size={{ xs: 12}}>
        <Controller
    name="certificate"
    control={control}
    render={({ field }) => (
      <>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          className={style.glassInput}
          sx={{
            py: 1.5,
            color: "#35352f",
            borderColor: "rgba(76, 76, 64, 0.5)",
            "&:hover": {
              borderColor: "rgba(106, 106, 87, 0.8)",
              backgroundColor: "rgba(240, 240, 234, 0.15)",
            },
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          رفع صورة الشهادة
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files;
              field.onChange(file);
              if (file && file[0]) setFileName(file[0].name);
            }}
          />
        </Button>

        {fileName && (
          <Typography sx={{ mt: 1, fontSize: "0.9rem", color: "#555" }}>
            {fileName}
          </Typography>
        )}

        {errors.certificate && (
          <FormHelperText error>{errors.certificate.message}</FormHelperText>
        )}
      </>
    )}
  />
      </Grid>
    </Grid>
  );
}

function SponsorForm({ register, errors, control }) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Grid container spacing={2.5} mt={1}>
      <Grid size={{ xs: 12}}>
        <TextField
          fullWidth
          label="الاسم الكامل"
          {...register("fullName")}
          className={style.glassInput}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField
          fullWidth
          label="البريد الإلكتروني"
          {...register("email")}
          className={style.glassInput}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ input: { textAlign: "left", direction: "ltr" } }}
        />
      </Grid>

      <Grid size={{ xs: 12 , sm:6}}>
        <TextField
          fullWidth
          label="رقم الهاتف"
          {...register("phoneNumber")}
          className={style.glassInput}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          sx={{ input: { textAlign: "left", direction: "ltr" } }}
        />
      </Grid>

      <Grid size={{ xs: 12 , sm:6}}>
        <TextField
          fullWidth
          label="رقم الهوية"
          {...register("nationalId")}
          className={style.glassInput}
          error={!!errors.nationalId}
          helperText={errors.nationalId?.message}
          sx={{ input: { textAlign: "left", direction: "ltr" } }}
        />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField
          fullWidth
          label="المدينة"
          {...register("city")}
          className={style.glassInput}
          error={!!errors.city}
          helperText={errors.city?.message}
        />
      </Grid>

      <Grid size={{ xs: 12}}>
        <Typography sx={{ mb: 1, fontWeight: 500 }}>الجنس</Typography>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <>
              <RadioGroup row {...field}>
                <FormControlLabel value="Female" control={<Radio />} label="أنثى" />
                <FormControlLabel value="Male" control={<Radio />} label="ذكر" />
              </RadioGroup>
              {errors.gender && <FormHelperText error>{errors.gender.message}</FormHelperText>}
            </>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12}}>
        <FormControl fullWidth variant="outlined" className={style.glassInput}>
          <InputLabel htmlFor="password">كلمة المرور</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="كلمة المرور"
            {...register("password")}
            sx={passwordInputStyles}
            autoComplete="new-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default function Register() {
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(userType === "employee" ? RegisterEmpSchema : registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      nationalId: "",
      city: "",
      password: "",
      gender: "",
      certificate: null,
    },
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = form;

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    reset(); // مسح القيم القديمة
    setFileName("");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const url =
        userType === "employee"
          ? "https://localhost:7160/api/Identity/Account/register-staff"
          : "https://localhost:7160/api/Identity/Account/register";

      if (userType === "employee") {
        const formData = new FormData();
        formData.append("FullName", data.fullName);
        formData.append("Email", data.email);
        formData.append("PhoneNumber", data.phoneNumber);
        formData.append("City", data.city);
        formData.append("NationalId", data.nationalId);
        formData.append("Gender", data.gender);
        formData.append("Password", data.password);
        if (data.certificate && data.certificate[0]) {
          formData.append("Certificate", data.certificate[0]);
        }

        await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(url, data);
      }

      setSnackbarMessage("تم إنشاء الحساب بنجاح");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/login"), 2000);
      reset();
      setFileName("");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={style.authWrapper}>
      <Paper elevation={0} sx={paperStyle}>
        <Typography variant="h5" textAlign="center" mb={2}>
          إنشاء حساب جديد
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ fontWeight: 600, mb: 1 }}>
          سجّل حسب هويتك
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mb: 3 }}>
          من أنت ؟ اختر نوع الحساب للمتابعة
        </Typography>

        <RadioGroup
          row
          value={userType}
          onChange={handleUserTypeChange}
          sx={{ justifyContent: "center", mb: 2 }}
        >
          <FormControlLabel value="employee" control={<Radio />} label="ممرض" />
          <FormControlLabel value="sponsor" control={<Radio />} label="كفيل" />
        </RadioGroup>

        {userType && (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {userType === "employee" && (
              <EmployeeForm register={register} errors={errors} control={control} fileName={fileName} setFileName={setFileName} />
            )}
            {userType === "sponsor" && <SponsorForm register={register} errors={errors} control={control} />}
            {error && <Typography color="error" textAlign="center" sx={{ mt: 2 }}>{error}</Typography>}

            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={buttonStyle}>
              {loading ? "جارٍ الإرسال..." : "إنشاء الحساب"}
            </Button>
          </Box>
        )}
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%", fontWeight: 600 }} elevation={6} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
