import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
  Grid,
} from "@mui/material";


import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useMemo, useState } from "react";
import style from "./Auth.module.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";


import RegisterEmpSchema from "../../validations/RegisterEmpSchema";
import registerSchema from "../../validations/RegisterSchema";
import { useNavigate } from "react-router";


const API_SPONSOR = "https://localhost:7160/api/Identity/Account/register";
const API_NURSE = "https://localhost:7160/api/Identity/Account/register-staff";


const paperStyle = {
  p: 4,
  maxWidth: 650,
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
  mt: 2,
  py: 1.2,
  borderRadius: "14px",
  background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a5a4a, #7a7a66)",
  },
};
export const backButtonStyle = {
  mt: 2,
  py: 1.2,
  borderRadius: "14px",
  borderColor: "rgba(106, 106, 87, 0.4)",
  color: "#5a5a4a",
  backgroundColor: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(10px)",
  "&:hover": {
    backgroundColor: "rgba(240,240,234,0.6)",
    borderColor: "#6a6a57",
  },
};


function PasswordField({
  label = "كلمة المرور",
  register,
  error,
  name = "password",
}) {
  const [show, setShow] = useState(false);
  return (
    <FormControl fullWidth variant="outlined" className={style.glassInput}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        id={name}
        type={show ? "text" : "password"}
        label={label}
        {...register(name)}
        sx={passwordInputStyles}
        autoComplete="new-password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((p) => !p)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
}


function FileButton({ control, name, label, error, onName }) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
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
            {label}
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              hidden
              onChange={(e) => {
                const files = e.target.files;
                field.onChange(files);
                if (files && files[0]) onName?.(files[0].name);
              }}
            />
          </Button>
        )}
      />
      {error && (
        <FormHelperText error sx={{ mt: 0.5 }}>
          {error}
        </FormHelperText>
      )}
    </>
  );
}


export default function Register() {
  const [userType, setUserType] = useState(""); // employee | sponsor
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);


  const [error, setError] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");


  const [certName, setCertName] = useState("");
  const [nidImgName, setNidImgName] = useState("");
  const [insName, setInsName] = useState("");
  const [diagName, setDiagName] = useState("");


  const navigate = useNavigate();


  const resolver = useMemo(() => {
    if (!userType) return undefined;
    const schema = userType === "employee" ? RegisterEmpSchema : registerSchema;
    return yupResolver(schema);
  }, [userType]);


  const form = useForm({
    resolver,
    mode: "onTouched",
    context: { step },
    defaultValues: {
      // ===== common =====
      fullName: "",
      email: "",
      phoneNumber: "",
      nationalId: "",
      city: "",
      password: "",


      // employee
      gender: "",


      // sponsor
      genderSponsor: "",
      sponsorDegree: "",


      // ===== nurse page 2 =====
      certificate: null,
      educationLevel: "",
      nurseMaritalStatus: "", // ✅ منفصلة عن maritalStatus تبع المسن
      fieldOfStudy: "",
      yearsOfStudy: "",
      yearOfGraduation: "",
      workExperiences: [],


      // ===== sponsor page2 common =====
      nationalIdElderly: "",
      kinShip: "",
      degree: "",


      // ===== sponsor FIRST only =====
      name: "",
      doctrine: "",
      maritalStatus: "", // ✅ للمسن
      cityElderly: "",
      street: "",
      healthStatus: "",
      bDate: "",
      reasonRegister: "",
      diseases: [""],
      nationalIdImage: null,
      healthInsurance: null,
      doctorName: "",
      workPlace: "",
      doctorPhone: "",
      reportDate: "",
      diagnosisFile: null,
    },
  });


  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = form;


  const sponsorDegree = watch("sponsorDegree");
  const workExperiences = watch("workExperiences") || [];
  const diseases = watch("diseases") || [];


  // ✅ تعبئة degree تلقائياً حسب sponsorDegree
  useEffect(() => {
    const val =
      sponsorDegree === "First"
        ? "كفيل أول (أساسي)"
        : sponsorDegree === "Second"
          ? "كفيل ثاني (ثانوي)"
          : "";
    setValue("degree", val, { shouldValidate: true, shouldDirty: true });
  }, [sponsorDegree, setValue]);


  const addDisease = () =>
    setValue("diseases", [...diseases, ""], { shouldValidate: true });


  const removeDisease = (idx) =>
    setValue(
      "diseases",
      diseases.filter((_, i) => i !== idx),
      { shouldValidate: true },
    );


  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setStep(1);
    setError("");
    setCertName("");
    setNidImgName("");
    setInsName("");
    setDiagName("");
    reset();
  };


  const goStep2 = async () => {
    setError("");


    const page1Fields =
      userType === "employee"
        ? [
            "fullName",
            "email",
            "phoneNumber",
            "nationalId",
            "city",
            "gender",
            "password",
          ]
        : [
            "fullName",
            "email",
            "phoneNumber",
            "nationalId",
            "city",
            "genderSponsor",
            "sponsorDegree",
            "password",
          ];


    const ok = await trigger(page1Fields);
    if (!ok) return;


    setStep(2);
  };


  const backStep1 = () => setStep(1);


  const addWorkExp = () => {
    const current = getValues("workExperiences") || [];
    setValue(
      "workExperiences",
      [...current, { workName: "", workLocation: "", jobTitle: "" }],
      { shouldValidate: true },
    );
  };


  const removeWorkExp = (idx) => {
    const current = getValues("workExperiences") || [];
    setValue(
      "workExperiences",
      current.filter((_, i) => i !== idx),
      { shouldValidate: true },
    );
  };


  const buildNurseFD = (d) => {
    const fd = new FormData();
    fd.append("FullName", d.fullName || "");
    fd.append("Email", d.email || "");
    fd.append("PhoneNumber", d.phoneNumber || "");
    fd.append("City", d.city || "");
    fd.append("NationalId", d.nationalId || "");
    fd.append("Gender", d.gender || "");
    fd.append("Password", d.password || "");


    if (d.certificate?.[0]) fd.append("Certificate", d.certificate[0]);


    fd.append("EducationLevel", d.educationLevel || "");
    fd.append("MaritalStatus", d.nurseMaritalStatus || ""); // ✅ هنا
    fd.append("FieldOfStudy", d.fieldOfStudy || "");
    fd.append("YearsOfStudy", String(d.yearsOfStudy ?? ""));
    fd.append("YearOfGraduation", d.yearOfGraduation || "");


    if (Array.isArray(d.workExperiences)) {
      d.workExperiences.forEach((we, i) => {
        fd.append(`WorkExperiences[${i}].WorkName`, we.workName || "");
        fd.append(`WorkExperiences[${i}].WorkLocation`, we.workLocation || "");
        fd.append(`WorkExperiences[${i}].JobTitle`, we.jobTitle || "");
      });
    }


    return fd;
  };


  const buildSponsorFD = (d) => {
    const fd = new FormData();


    fd.append("FullName", d.fullName || "");
    fd.append("Email", d.email || "");
    fd.append("PhoneNumber", d.phoneNumber || "");
    fd.append("City", d.city || "");
    fd.append("NationalId", d.nationalId || "");
    fd.append("Password", d.password || "");


    fd.append("GenderSponsor", d.genderSponsor || "");
    fd.append("SponsorDegree", d.sponsorDegree || "");


    fd.append("NationalIdElderly", d.nationalIdElderly || "");
    fd.append("KinShip", d.kinShip || "");
    fd.append("Degree", d.degree || "");


    if (d.sponsorDegree === "First") {
      fd.append("Name", d.name || "");
      fd.append("Doctrine", d.doctrine || "");
      fd.append("MaritalStatus", d.maritalStatus || "");
      fd.append("CityElderly", d.cityElderly || "");
      fd.append("Street", d.street || "");
      fd.append("HealthStatus", d.healthStatus || "");
      fd.append("BDate", d.bDate || "");
      fd.append("ReasonRegister", d.reasonRegister || "");


      (d.diseases || [])
        .map((x) => (x || "").trim())
        .filter(Boolean)
        .forEach((x) => fd.append("Diseases", x));


      if (d.nationalIdImage?.[0])
        fd.append("NationalIdImage", d.nationalIdImage[0]);
      if (d.healthInsurance?.[0])
        fd.append("HealthInsurance", d.healthInsurance[0]);


      fd.append("DoctorName", d.doctorName || "");
      fd.append("WorkPlace", d.workPlace || "");
      fd.append("DoctorPhone", d.doctorPhone || "");
      fd.append("ReportDate", d.reportDate || "");


      if (d.diagnosisFile?.[0]) fd.append("DiagnosisFile", d.diagnosisFile[0]);
    }


    return fd;
  };


  const finalSubmit = async (data) => {
    setLoading(true);
    setError("");


    try {
      if (userType === "employee") {
        const fd = buildNurseFD(data);
        await axios.post(API_NURSE, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const fd = buildSponsorFD(data);
        await axios.post(API_SPONSOR, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }


      setSnackMsg("تم إنشاء الحساب بنجاح");
      setSnackOpen(true);
      setTimeout(() => navigate("/login"), 1200);


      reset();
      setUserType("");
      setStep(1);
      setCertName("");
      setNidImgName("");
      setInsName("");
      setDiagName("");
    } catch (err) {
      const resp = err?.response?.data;
      const msg =
        resp?.message ||
        (resp?.errors ? Object.values(resp.errors).flat().join(" | ") : null) ||
        "حدث خطأ";
      setError(msg);


      console.log("API ERROR:", err?.response?.status, resp, err);
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


        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "text.secondary", mb: 2 }}
        >
          اختر نوع الحساب للمتابعة
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
          <Box
            component="form"
            onSubmit={handleSubmit(step === 1 ? goStep2 : finalSubmit)}
          >
            <Typography textAlign="center" sx={{ mb: 1, fontWeight: 700 }}>
              الخطوة {step} من 2
            </Typography>


            {/* ======================== NURSE STEP 1 ======================== */}
            {userType === "employee" && step === 1 && (
              <Grid container spacing={2.5} sx={{ mt: 1 }}>
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
                <Grid size={{ xs: 12 }}>
                  <PasswordField
                    register={register}
                    error={errors.password?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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


                <Grid size={{ xs: 12, sm: 6 }}>
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


                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="المدينة"
                    {...register("city")}
                    className={style.glassInput}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                </Grid>


                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      الجنس:
                    </Typography>


                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value="Female"
                            control={<Radio />}
                            label="أنثى"
                          />
                          <FormControlLabel
                            value="Male"
                            control={<Radio />}
                            label="ذكر"
                          />
                        </RadioGroup>
                      )}
                    />
                  </Box>


                  {errors.gender && (
                    <FormHelperText error sx={{ mt: 0.5 }}>
                      {errors.gender.message}
                    </FormHelperText>
                  )}
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
                    variant="contained"
                    fullWidth
                    sx={buttonStyle}
                  >
                    استكمال البيانات
                  </Button>
                </Grid>
              </Grid>
            )}


            {/* ======================== NURSE STEP 2 ======================== */}
            {userType === "employee" && step === 2 && (
              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="المستوى التعليمي"
                    fullWidth
                    defaultValue=""
                    {...register("educationLevel")}
                    error={!!errors.educationLevel}
                    helperText={errors.educationLevel?.message}
                    className={style.glassInput} // ✅ أضفنا نفس ستايل الزجاج
                    InputProps={{
                      sx: { textAlign: "left", direction: "ltr" }, // للحفاظ على محاذاة النص
                    }}
                  >
                    <MenuItem value="Secondary">ثانوية (قبل التوجيهي)</MenuItem>
                    <MenuItem value="Tawjihi">توجيهي</MenuItem>
                    <MenuItem value="Institute">معهد</MenuItem>
                    <MenuItem value="University">جامعة</MenuItem>
                  </TextField>
                </Grid>


                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="الحالة الاجتماعية"
                    defaultValue=""
                    {...register("nurseMaritalStatus")}
                    className={style.glassInput}
                    error={!!errors.nurseMaritalStatus}
                    helperText={errors.nurseMaritalStatus?.message}
                  >
                    <MenuItem value="Single">أعزب</MenuItem>
                    <MenuItem value="Married">متزوج</MenuItem>
                    <MenuItem value="Divorced">مطلق</MenuItem>
                    <MenuItem value="Widowed">أرمل</MenuItem>
                  </TextField>
                </Grid>


                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="مجال الدراسة (التخصص)"
                    {...register("fieldOfStudy")}
                    className={style.glassInput}
                    error={!!errors.fieldOfStudy}
                    helperText={errors.fieldOfStudy?.message}
                  />
                </Grid>


                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="سنوات الدراسة"
                    {...register("yearsOfStudy")}
                    className={style.glassInput}
                    error={!!errors.yearsOfStudy}
                    helperText={errors.yearsOfStudy?.message}
                    sx={{ input: { textAlign: "left", direction: "ltr" } }}
                  />
                </Grid>


                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="سنة التخرج (مثال 2023)"
                    {...register("yearOfGraduation")}
                    className={style.glassInput}
                    error={!!errors.yearOfGraduation}
                    helperText={errors.yearOfGraduation?.message}
                    sx={{ input: { textAlign: "left", direction: "ltr" } }}
                  />
                </Grid>


                <Grid size={{ xs: 12 }}>
                  <FileButton
                    control={control}
                    name="certificate"
                    label="رفع شهادة المزاولة (JPG/PNG/PDF)"
                    error={errors.certificate?.message}
                    onName={setCertName}
                  />
                  {!!certName && (
                    <Typography
                      sx={{ mt: 1, fontSize: "0.9rem", color: "#555" }}
                    >
                      {certName}
                    </Typography>
                  )}
                </Grid>


                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      الخبرات العملية{" "}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.75rem", // حجم أصغر
                          fontWeight: 300, // خط رقيق
                          color: "rgba(0,0,0,0.5)", // لون رمادي خفيف
                        }}
                      >
                        ( في حال عدم وجود خبرة، يمكنك تجاهل هذا القسم )
                      </Typography>
                    </Typography>
                    <Button variant="outlined" onClick={addWorkExp}>
                      + إضافة خبرة
                    </Button>
                  </Box>
                </Grid>


                {workExperiences.map((_, i) => (
                  <Grid key={i} size={{ xs: 12 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "14px",
                        border: "1px solid rgba(106,106,87,0.15)",
                        background: "rgba(255,255,255,0.15)",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            label="مكان العمل"
                            {...register(`workExperiences.${i}.workName`)}
                            className={style.glassInput}
                            error={!!errors?.workExperiences?.[i]?.workName}
                            helperText={
                              errors?.workExperiences?.[i]?.workName?.message
                            }
                          />
                        </Grid>


                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            label="الموقع"
                            {...register(`workExperiences.${i}.workLocation`)}
                            className={style.glassInput}
                            error={!!errors?.workExperiences?.[i]?.workLocation}
                            helperText={
                              errors?.workExperiences?.[i]?.workLocation
                                ?.message
                            }
                          />
                        </Grid>


                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            label="المسمى الوظيفي"
                            {...register(`workExperiences.${i}.jobTitle`)}
                            className={style.glassInput}
                            error={!!errors?.workExperiences?.[i]?.jobTitle}
                            helperText={
                              errors?.workExperiences?.[i]?.jobTitle?.message
                            }
                          />
                        </Grid>


                        <Grid size={{ xs: 12 }}>
                          <Button
                            color="error"
                            variant="text"
                            onClick={() => removeWorkExp(i)}
                          >
                            حذف الخبرة
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}


                {error && (
                  <Grid size={{ xs: 12 }}>
                    <Typography color="error" textAlign="center">
                      {error}
                    </Typography>
                  </Grid>
                )}


                <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={backStep1}
                    sx={backButtonStyle}
                  >
                    رجوع
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={buttonStyle}
                  >
                    {loading ? "جارٍ الإرسال..." : "إنشاء الحساب"}
                  </Button>
                </Grid>
              </Grid>
            )}


            {/* ======================== SPONSOR STEP 1 ======================== */}
            {userType === "sponsor" && step === 1 && (
              <Grid container spacing={2.5} sx={{ mt: 1 }}>
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
                <Grid size={{ xs: 12 }}>
                  <PasswordField
                    register={register}
                    error={errors.password?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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


                <Grid size={{ xs: 12, sm: 6 }}>
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


                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="المدينة"
                    {...register("city")}
                    className={style.glassInput}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="درجة الكفيل"
                    defaultValue=""
                    {...register("sponsorDegree")}
                    className={style.glassInput}
                    error={!!errors.sponsorDegree}
                    helperText={errors.sponsorDegree?.message}
                  >
                    <MenuItem value="First">كفيل أول (الأساسي)</MenuItem>
                    <MenuItem value="Second">كفيل ثاني (الاحتياطي)</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      الجنس:
                    </Typography>


                    <Controller
                      name="genderSponsor"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value="Female"
                            control={<Radio />}
                            label="أنثى"
                          />
                          <FormControlLabel
                            value="Male"
                            control={<Radio />}
                            label="ذكر"
                          />
                        </RadioGroup>
                      )}
                    />
                  </Box>


                  {errors.genderSponsor && (
                    <FormHelperText error sx={{ mt: 0.5 }}>
                      {errors.genderSponsor.message}
                    </FormHelperText>
                  )}
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
                    variant="contained"
                    fullWidth
                    sx={buttonStyle}
                  >
                    استكمال البيانات
                  </Button>
                </Grid>
              </Grid>
            )}


            {/* ======================== SPONSOR STEP 2 ======================== */}
            {userType === "sponsor" && step === 2 && (
              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                {sponsorDegree === "Second" && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={{ fontWeight: 800, mt: 1 }}>
                        بيانات المسن
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="صلة القرابة"
                        {...register("kinShip")}
                        className={style.glassInput}
                        error={!!errors.kinShip}
                        helperText={errors.kinShip?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="الدرجة"
                        value={
                          sponsorDegree === "First"
                            ? "كفيل أول (أساسي)"
                            : sponsorDegree === "Second"
                              ? "كفيل ثاني (ثانوي)"
                              : ""
                        }
                        className={style.glassInput}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="رقم هوية المسن"
                        {...register("nationalIdElderly")}
                        className={style.glassInput}
                        error={!!errors.nationalIdElderly}
                        helperText={errors.nationalIdElderly?.message}
                        sx={{ input: { textAlign: "left", direction: "ltr" } }}
                      />
                    </Grid>
                  </>
                )}
                {sponsorDegree === "First" && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={{ fontWeight: 800, mt: 1 }}>
                        بيانات المسن
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="اسم المسن"
                        {...register("name")}
                        className={style.glassInput}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="صلة القرابة"
                        {...register("kinShip")}
                        className={style.glassInput}
                        error={!!errors.kinShip}
                        helperText={errors.kinShip?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="الدرجة"
                        value={
                          sponsorDegree === "First"
                            ? "كفيل أول (أساسي)"
                            : sponsorDegree === "Second"
                              ? "كفيل ثاني (ثانوي)"
                              : ""
                        }
                        className={style.glassInput}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="رقم هوية المسن"
                        {...register("nationalIdElderly")}
                        className={style.glassInput}
                        error={!!errors.nationalIdElderly}
                        helperText={errors.nationalIdElderly?.message}
                        sx={{ input: { textAlign: "left", direction: "ltr" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="الديانة/العقيدة"
                        {...register("doctrine")}
                        className={style.glassInput}
                        error={!!errors.doctrine}
                        helperText={errors.doctrine?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        defaultValue=""
                        label="الحالة الاجتماعية"
                        {...register("maritalStatus")}
                        className={style.glassInput}
                        error={!!errors.maritalStatus}
                        helperText={errors.maritalStatus?.message}
                      >
                        <MenuItem value="Single">أعزب</MenuItem>
                        <MenuItem value="Married">متزوج</MenuItem>
                        <MenuItem value="Divorced">مطلق</MenuItem>
                        <MenuItem value="Widowed">أرمل</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="مدينة المسن"
                        {...register("cityElderly")}
                        className={style.glassInput}
                        error={!!errors.cityElderly}
                        helperText={errors.cityElderly?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="الشارع"
                        {...register("street")}
                        className={style.glassInput}
                        error={!!errors.street}
                        helperText={errors.street?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="الحالة الصحية"
                        {...register("healthStatus")}
                        className={style.glassInput}
                        error={!!errors.healthStatus}
                        helperText={errors.healthStatus?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="تاريخ الميلاد"
                        {...register("bDate")}
                        className={style.glassInput}
                        error={!!errors.bDate}
                        helperText={errors.bDate?.message}
                        InputLabelProps={{ shrink: true }}
                        sx={{ input: { textAlign: "left", direction: "ltr" } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="سبب التسجيل"
                        {...register("reasonRegister")}
                        className={style.glassInput}
                        error={!!errors.reasonRegister}
                        helperText={errors.reasonRegister?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FileButton
                        control={control}
                        name="nationalIdImage"
                        label="رفع هوية المسن (JPG/PNG/PDF)"
                        error={errors.nationalIdImage?.message}
                        onName={setNidImgName}
                      />
                      {!!nidImgName && (
                        <Typography
                          sx={{ mt: 1, fontSize: "0.9rem", color: "#555" }}
                        >
                          {nidImgName}
                        </Typography>
                      )}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FileButton
                        control={control}
                        name="healthInsurance"
                        label="رفع التأمين الصحي (JPG/PNG/PDF)"
                        error={errors.healthInsurance?.message}
                        onName={setInsName}
                      />
                      {!!insName && (
                        <Typography
                          sx={{ mt: 1, fontSize: "0.9rem", color: "#555" }}
                        >
                          {insName}
                        </Typography>
                      )}
                    </Grid>

                    {/* ✅ الأمراض كحقول متعددة */}
                    <Grid size={{ xs: 12 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          الأمراض{" "}
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: 300,
                              color: "rgba(0,0,0,0.5)",
                            }}
                          >
                            ( في حال عدم وجود أمراض، يمكن ترك هذا الحقل فارغًا )
                          </Typography>
                        </Typography>
                        <Button variant="outlined" onClick={addDisease}>
                          + إضافة مرض
                        </Button>
                      </Box>
                    </Grid>

                    {diseases.map((_, i) => (
                      <Grid key={i} size={{ xs: 12 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "14px",
                            border: "1px solid rgba(106,106,87,0.15)",
                            background: "rgba(255,255,255,0.15)",
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, sm: 9 }}>
                              <TextField
                                fullWidth
                                label={`مرض رقم ${i + 1}`}
                                {...register(`diseases.${i}`)}
                                className={style.glassInput}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 3 }}>
                              <Button
                                color="error"
                                variant="outlined"
                                fullWidth
                                onClick={() => removeDisease(i)}
                                disabled={diseases.length === 1}
                              >
                                حذف
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}

                    <Grid size={{ xs: 12 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography sx={{ fontWeight: 800 }}>
                          بيانات الطبيب
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "0.85rem",
                            color: "#555",
                          }}
                        >
                          ( المتعلقة بآخر زيارة لطبيب المسنّة )
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="اسم الطبيب"
                        {...register("doctorName")}
                        className={style.glassInput}
                        error={!!errors.doctorName}
                        helperText={errors.doctorName?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="مكان العمل"
                        {...register("workPlace")}
                        className={style.glassInput}
                        error={!!errors.workPlace}
                        helperText={errors.workPlace?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="هاتف الطبيب"
                        {...register("doctorPhone")}
                        className={style.glassInput}
                        error={!!errors.doctorPhone}
                        helperText={errors.doctorPhone?.message}
                        sx={{ input: { textAlign: "left", direction: "ltr" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="تاريخ التشخيص"
                        {...register("reportDate")}
                        className={style.glassInput}
                        error={!!errors.reportDate}
                        helperText={errors.reportDate?.message}
                        InputLabelProps={{ shrink: true }}
                        sx={{ input: { textAlign: "left", direction: "ltr" } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <FileButton
                        control={control}
                        name="diagnosisFile"
                        label="رفع ملف التشخيص (JPG/PNG/PDF)"
                        error={errors.diagnosisFile?.message}
                        onName={setDiagName}
                      />
                      {!!diagName && (
                        <Typography
                          sx={{ mt: 1, fontSize: "0.9rem", color: "#555" }}
                        >
                          {diagName}
                        </Typography>
                      )}
                    </Grid>
                  </>
                )}

                {error && (
                  <Grid size={{ xs: 12 }}>
                    <Typography color="error" textAlign="center">
                      {error}
                    </Typography>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={backStep1}
                    sx={backButtonStyle}
                  >
                    رجوع
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={buttonStyle}
                  >
                    {loading ? "جارٍ الإرسال..." : "إنشاء الحساب"}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Paper>


      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          elevation={6}
          variant="filled"
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}



