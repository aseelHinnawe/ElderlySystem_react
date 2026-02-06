import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import style from "./Register.module.css";
import { useForm } from "react-hook-form";
import axios from "axios";

function EmployeeForm({ register }) {
  return (
    <Grid container spacing={2} mt={1}>
      <Grid size={{ xs: 12}}>
        <TextField fullWidth label="اسم الموظف" {...register("name")} className={style.glassInput} />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField fullWidth label="البريد الإلكتروني" {...register("email")} className={style.glassInput} />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField fullWidth label="الرقم الوظيفي" {...register("jobNumber")} className={style.glassInput} />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField fullWidth label="القسم" {...register("department")} className={style.glassInput} />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField fullWidth type="password" label="كلمة المرور" {...register("password")} className={style.glassInput} />
      </Grid>
    </Grid>
  );
}

// =====================
// Sponsor Form
// =====================
function SponsorForm({ register }) {
  return (
    <Grid container spacing={2.5} mt={1}>
      <Grid size={{ xs: 12}}>
        <TextField  id="fullName" fullWidth label="الاسم الكامل" {...register("fullName")} autoComplete="name" className={style.glassInput} />
      </Grid>

      <Grid size={{ xs: 12}}> 
        <TextField id="userName" fullWidth label="اسم المستخدم" {...register("userName")} autoComplete="username" className={style.glassInput} />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField id="email" fullWidth label="البريد الإلكتروني" {...register("email")} autoComplete="email" className={style.glassInput} sx={{ input: { textAlign: "left", direction: "ltr" } }}/>
      </Grid>

      <Grid size={{ xs: 12, sm: 6}}>
        <TextField id="phoneNumber" fullWidth label="رقم الهاتف" {...register("phoneNumber")} autoComplete="tel" className={style.glassInput} sx={{ input: { textAlign: "left", direction: "ltr" } }} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6}}>
        <TextField id="nationalId" fullWidth label="رقم الهوية" {...register("nationalId")} className={style.glassInput} sx={{ input: { textAlign: "left", direction: "ltr" } }} />
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField id="city" fullWidth label="المدينة" {...register("city")} className={style.glassInput}  />
      </Grid>

      <Grid size={{ xs: 12}}>
        <Typography sx={{ mb: 1, fontWeight: 500 }}>الجنس</Typography>
        <RadioGroup row {...register("gender")}>
          <FormControlLabel value="Female" control={<Radio />} label="أنثى" />
          <FormControlLabel value="Male" control={<Radio />} label="ذكر" />
        </RadioGroup>
      </Grid>

      <Grid size={{ xs: 12}}>
        <TextField id="password" fullWidth  label="كلمة المرور" {...register("password")} autoComplete="new-password" className={style.glassInput} sx={{ input: { textAlign: "left", direction: "ltr" } }} />
      </Grid>
    </Grid>
  );
}

export default function Register() {
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);

  const employeeForm = useForm();
  const sponsorForm = useForm();

  // Handle Employee Submit
  const handleSubmitEmployee = employeeForm.handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("", data);
      alert("تم إنشاء حساب الموظف بنجاح");
      employeeForm.reset();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  });

  // Handle Sponsor Submit
  const handleSubmitSponsor = sponsorForm.handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("https://localhost:7160/api/Identity/Account/register", data);
      console.log(response)
      if (response.status === 200 || response.status === 201) {
        alert("تم إنشاء حساب الكفيل بنجاح");
      }
      sponsorForm.reset();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  });

  return (
    <Box className={style.registerWrapper}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 600,
          width: "100%",
          borderRadius: "20px",
          background: "rgba(240, 240, 234, 0.25)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(106, 106, 87, 0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          إنشاء حساب جديد
        </Typography>

        <Typography variant="h6" textAlign="center" sx={{ fontWeight: 600, mb: 1 }}>
          سجّل حسب هويتك
        </Typography>

        <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mb: 3 }}>
          من أنت ؟ اختر نوع الحساب للمتابعة
        </Typography>

        <RadioGroup row value={userType} onChange={(e) => setUserType(e.target.value)} sx={{ justifyContent: "center", mb: 2 }}>
          <FormControlLabel value="employee" control={<Radio />} label="موظف" />
          <FormControlLabel value="sponsor" control={<Radio />} label="كفيل" />
        </RadioGroup>

        {userType === "employee" && (
          <form onSubmit={handleSubmitEmployee}>
            <EmployeeForm register={employeeForm.register} />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
                },
              }}
            >
              {loading ? "جارٍ الإرسال..." : "إنشاء الحساب"}
            </Button>
          </form>
        )}

        {userType === "sponsor" && (
          <form onSubmit={handleSubmitSponsor}>
            <SponsorForm register={sponsorForm.register} />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
                },
              }}
            >
              {loading ? "جارٍ الإرسال..." : "إنشاء الحساب"}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
