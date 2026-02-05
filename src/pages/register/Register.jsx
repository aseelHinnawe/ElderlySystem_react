import { Box, Button, FormControlLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'

function EmployeeForm({ data, handleChange }) {
  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="اسم الموظف"
          name="name"
          value={data.name}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="البريد الإلكتروني"
          name="email"
          value={data.email}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="الرقم الوظيفي"
          name="jobNumber"
          value={data.jobNumber}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="القسم"
          name="department"
          value={data.department}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          type="password"
          label="كلمة المرور"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}



// =====================================================
// فورم الكفيل
// =====================================================
function SponsorForm({ data, handleChange }) {
  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="اسم الكفيل"
          name="name"
          value={data.name}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="البريد الإلكتروني"
          name="email"
          value={data.email}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="رقم الهوية"
          name="nationalId"
          value={data.nationalId}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="اسم المسن المكفول"
          name="elderName"
          value={data.elderName}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          type="password"
          label="كلمة المرور"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}

export default function Register() {
    const [userType, setUserType] = useState("");

  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    jobNumber: "",
    department: "",
    password: "",
  });

  const [sponsorData, setSponsorData] = useState({
    name: "",
    email: "",
    nationalId: "",
    elderName: "",
    password: "",
  });

  // تغيير بيانات الموظف
  const handleEmployeeChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  // تغيير بيانات الكفيل
  const handleSponsorChange = (e) => {
    setSponsorData({
      ...sponsorData,
      [e.target.name]: e.target.value,
    });
  };

  // إرسال البيانات
  const handleSubmit = () => {
    if (userType === "employee") {
      console.log("Employee Data:", employeeData);
    }

    if (userType === "sponsor") {
      console.log("Sponsor Data:", sponsorData);
    }

    alert("تم إنشاء الحساب بنجاح (تجريبي)");
  };
  return (
  <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
        }}
      >
        {/* العنوان الرئيسي */}
        <Typography variant="h5" textAlign="center" mb={2}>
          إنشاء حساب جديد
        </Typography>

        {/* النص الإضافي */}
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          سجّل حسب هويتك
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "text.secondary", mb: 3 }}
        >
          من أنت ؟ اختر نوع الحساب للمتابعة
        </Typography>

        {/* اختيار النوع */}
        <RadioGroup
          row
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          sx={{ justifyContent: "center", mb: 2 }}
        >
          <FormControlLabel
            value="employee"
            control={<Radio />}
            label="موظف"
          />

          <FormControlLabel
            value="sponsor"
            control={<Radio />}
            label="كفيل"
          />
        </RadioGroup>

        {/* عرض الفورم حسب الاختيار */}
        {userType === "employee" && (
          <EmployeeForm
            data={employeeData}
            handleChange={handleEmployeeChange}
          />
        )}

        {userType === "sponsor" && (
          <SponsorForm
            data={sponsorData}
            handleChange={handleSponsorChange}
          />
        )}

        {/* زر الإنشاء */}
        {userType && (
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.2 }}
            onClick={handleSubmit}
          >
            إنشاء الحساب
          </Button>
        )}
      </Paper>
    </Box>

  )
}
