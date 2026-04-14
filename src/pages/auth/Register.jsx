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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useMemo, useState } from "react";
import style from "./Auth.module.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";

import RegisterEmpSchema from "../../validations/RegisterEmpSchema";
import registerSchema from "../../validations/RegisterSchema";
import RegisterDoctorSchema from "../../validations/RegisterDoctorSchema";
import { useNavigate } from "react-router";

const API_SPONSOR = "https://localhost:7160/api/Identity/Account/register";
const API_NURSE = "https://localhost:7160/api/Identity/Account/register-staff";
const API_DOCTOR =
  "https://localhost:7160/api/Identity/Account/register-doctor";

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
const sectionCardStyle = {
  p: 2,
  borderRadius: "16px",
  border: "1px solid rgba(106,106,87,0.15)",
  background: "rgba(255,255,255,0.18)",
};

const accordionStyle = {
  borderRadius: "16px !important",
  background: "rgba(255,255,255,0.16)",
  border: "1px solid rgba(106,106,87,0.15)",
  boxShadow: "none",
  "&:before": { display: "none" },
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
function SectionTitle({ title, subtitle = "" }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>
        {title}
      </Typography>
      {!!subtitle && (
        <Typography sx={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.55)" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
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
function ArrayTextList({
  title,
  values,
  fieldName,
  register,
  errors,
  onAdd,
  onRemove,
  itemLabel,
  optionalNote = "",
}) {
  return (
    <>
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
            {title}{" "}
            {!!optionalNote && (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  color: "rgba(0,0,0,0.5)",
                }}
              >
                {optionalNote}
              </Typography>
            )}
          </Typography>

          <Button variant="outlined" onClick={onAdd}>
            + إضافة
          </Button>
        </Box>
      </Grid>

      {values.map((_, i) => (
        <Grid key={`${fieldName}-${i}`} size={{ xs: 12 }}>
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
                  label={`${itemLabel} ${i + 1}`}
                  {...register(`${fieldName}.${i}`)}
                  className={style.glassInput}
                  error={!!errors?.[fieldName]?.[i]}
                  helperText={errors?.[fieldName]?.[i]?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <Button
                  color="error"
                  variant="outlined"
                  fullWidth
                  onClick={() => onRemove(i)}
                  disabled={values.length === 1}
                >
                  حذف
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </>
  );
}

function UniversitiesList({ values, register, errors, onAdd, onRemove }) {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>الجامعات</Typography>
          <Button variant="outlined" onClick={onAdd}>
            + إضافة جامعة
          </Button>
        </Box>
      </Grid>

      {values.map((_, i) => (
        <Grid key={`universities-${i}`} size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12, sm: 7 }}>
                <TextField
                  fullWidth
                  label="اسم الجامعة"
                  {...register(`universities.${i}.universityName`)}
                  className={style.glassInput}
                  error={!!errors?.universities?.[i]?.universityName}
                  helperText={
                    errors?.universities?.[i]?.universityName?.message
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select
                  fullWidth
                  label="الدرجة"
                  defaultValue={1}
                  {...register(`universities.${i}.degree`)}
                  className={style.glassInput}
                  error={!!errors?.universities?.[i]?.degree}
                  helperText={errors?.universities?.[i]?.degree?.message}
                >
                  <MenuItem value={1}>بكالوريوس</MenuItem>
                  <MenuItem value={2}>ماجستير</MenuItem>
                  <MenuItem value={3}>دكتوراه</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 2 }}>
                <Button
                  color="error"
                  variant="outlined"
                  fullWidth
                  onClick={() => onRemove(i)}
                  disabled={values.length === 1}
                  sx={{ height: "100%" }}
                >
                  حذف
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
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

  const navigate = useNavigate();

  const resolver = useMemo(() => {
    if (!userType) return undefined;

    const schema =
      userType === "employee"
        ? RegisterEmpSchema
        : userType === "doctor"
          ? RegisterDoctorSchema
          : registerSchema;

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

      // doctor
      genderDoctor: "",
      medicalRank: "",
      yearsOfExperience: "",
      numberOfOperations: "",
      doctorBDate: "",
      specializations: [],
      diseasesDoctor: [],
      workPlaces: [],
      operationTypes: [],
      medicalProcedures: [],
      diagnosticTests: [],
      previousWorkPlaces: [],
      universities: [],
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
  const specializations = watch("specializations") || [];
  const workPlaces = watch("workPlaces") || [];
  const operationTypes = watch("operationTypes") || [];
  const medicalProcedures = watch("medicalProcedures") || [];
  const diagnosticTests = watch("diagnosticTests") || [];
  const previousWorkPlaces = watch("previousWorkPlaces") || [];
  const universities = watch("universities") || [];

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
        : userType === "doctor"
          ? [
              "fullName",
              "email",
              "phoneNumber",
              "nationalId",
              "city",
              "genderDoctor",
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
  const addStringItem = (fieldName, current) =>
    setValue(fieldName, [...current, ""], { shouldValidate: true });

  const removeStringItem = (fieldName, current, idx) =>
    setValue(
      fieldName,
      current.filter((_, i) => i !== idx),
      { shouldValidate: true },
    );

  const addUniversity = () =>
    setValue(
      "universities",
      [...universities, { universityName: "", degree: 1 }],
      { shouldValidate: true },
    );

  const removeUniversity = (idx) =>
    setValue(
      "universities",
      universities.filter((_, i) => i !== idx),
      { shouldValidate: true },
    );

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
    }

    return fd;
  };
  const cleanArray = (arr) =>
    (arr || []).map((x) => (x || "").trim()).filter(Boolean);

  const buildDoctorPayload = (d) => ({
    fullName: d.fullName?.trim() || "",
    email: d.email?.trim() || "",
    phoneNumber: d.phoneNumber?.trim() || "",
    nationalId: d.nationalId?.trim() || "",
    city: d.city?.trim() || "",
    genderDoctor: d.genderDoctor,
    password: d.password || "",
    medicalRank: d.medicalRank?.trim() || "",
    yearsOfExperience: d.yearsOfExperience?.trim() || "",
    numberOfOperations: Number(d.numberOfOperations || 0),
    bDate: d.doctorBDate || "",
    specializations: cleanArray(d.specializations),
    diseasesDoctor: cleanArray(d.diseases),
    workPlaces: cleanArray(d.workPlaces),
    operationTypes: cleanArray(d.operationTypes),
    medicalProcedures: cleanArray(d.medicalProcedures),
    diagnosticTests: cleanArray(d.diagnosticTests),
    previousWorkPlaces: cleanArray(d.previousWorkPlaces),
    universities: (d.universities || [])
      .map((u) => ({
        universityName: u?.universityName?.trim() || "",
        degree: Number(u?.degree),
      }))
      .filter((u) => u.universityName),
  });
  const finalSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      if (userType === "employee") {
        const fd = buildNurseFD(data);
        await axios.post(API_NURSE, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (userType === "doctor") {
        const payload = buildDoctorPayload(data);
        await axios.post(API_DOCTOR, payload, {
          headers: { "Content-Type": "application/json" },
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
          <FormControlLabel value="doctor" control={<Radio />} label="طبيب" />
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
    select
    fullWidth
    label="الحالة الصحية"
    defaultValue=""
    {...register("healthStatus")}
    className={style.glassInput}
    error={!!errors.healthStatus}
    helperText={errors.healthStatus?.message}
  >
    <MenuItem value="مستقرة">مستقرة</MenuItem>
    <MenuItem value="متوسطة">متوسطة</MenuItem>
    <MenuItem value="حرجة">حرجة</MenuItem>
  </TextField>
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
            {/* ======================== DOCTOR STEP 1 ======================== */}

            {userType === "doctor" && step === 1 && (
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
                      name="genderDoctor"
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

                  {errors.genderDoctor && (
                    <FormHelperText error sx={{ mt: 0.5 }}>
                      {errors.genderDoctor.message}
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
            {/* ======================== DOCTOR STEP 2 ======================== */}
            {userType === "doctor" && step === 2 && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* المعلومات الأساسية */}
                <Grid size={{ xs: 12 }}>
                  <Paper elevation={0} sx={sectionCardStyle}>
                    <SectionTitle
                      title="المعلومات المهنية"
                      subtitle="أدخل البيانات الأساسية الخاصة بالطبيب"
                    />

                    <Grid container spacing={2}>
                      
                      <Grid size={{ xs: 12, md: 6 }}>
    <TextField
      fullWidth
      select
      label="الرتبة الطبية"
      defaultValue=""
      {...register("medicalRank")}
      className={style.glassInput}
      error={!!errors.medicalRank}
      helperText={errors.medicalRank?.message}
    >
      <MenuItem value="intern">امتياز</MenuItem>
      <MenuItem value="general">عام</MenuItem>
      <MenuItem value="resident">مقيم</MenuItem>
      <MenuItem value="specialist">أخصائي</MenuItem>
      <MenuItem value="consultant">استشاري</MenuItem>
    </TextField>
  </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="سنوات الخبرة"
                          {...register("yearsOfExperience")}
                          className={style.glassInput}
                          error={!!errors.yearsOfExperience}
                          helperText={errors.yearsOfExperience?.message}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="عدد العمليات"
                          {...register("numberOfOperations")}
                          className={style.glassInput}
                          error={!!errors.numberOfOperations}
                          helperText={errors.numberOfOperations?.message}
                          sx={{
                            input: { textAlign: "left", direction: "ltr" },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          type="date"
                          label="تاريخ الميلاد"
                          {...register("doctorBDate")}
                          className={style.glassInput}
                          error={!!errors.bDate}
                          helperText={errors.bDate?.message}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            input: { textAlign: "left", direction: "ltr" },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* المجال الطبي */}
                <Grid size={{ xs: 12 }}>
                  <Accordion defaultExpanded sx={accordionStyle}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 700 }}>
                        المجال الطبي
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Stack spacing={2}>
                        <ArrayTextList
                          title="التخصصات"
                          values={specializations}
                          fieldName="specializations"
                          register={register}
                          errors={errors}
                          onAdd={() =>
                            addStringItem("specializations", specializations)
                          }
                          onRemove={(i) =>
                            removeStringItem(
                              "specializations",
                              specializations,
                              i,
                            )
                          }
                          itemLabel="التخصص"
                        />

                        <Divider />

                        <ArrayTextList
                          title="الأمراض التي يعالجها"
                          values={diseases}
                          fieldName="diseases"
                          register={register}
                          errors={errors}
                          onAdd={() => addStringItem("diseases", diseases)}
                          onRemove={(i) =>
                            removeStringItem("diseases", diseases, i)
                          }
                          itemLabel="المرض"
                        />

                        <Divider />

                        <ArrayTextList
                          title="الإجراءات الطبية"
                          values={medicalProcedures}
                          fieldName="medicalProcedures"
                          register={register}
                          errors={errors}
                          onAdd={() =>
                            addStringItem(
                              "medicalProcedures",
                              medicalProcedures,
                            )
                          }
                          onRemove={(i) =>
                            removeStringItem(
                              "medicalProcedures",
                              medicalProcedures,
                              i,
                            )
                          }
                          itemLabel="الإجراء الطبي"
                        />

                        <Divider />

                        <ArrayTextList
                          title="الفحوصات الطبية"
                          values={diagnosticTests}
                          fieldName="diagnosticTests"
                          register={register}
                          errors={errors}
                          onAdd={() =>
                            addStringItem("diagnosticTests", diagnosticTests)
                          }
                          onRemove={(i) =>
                            removeStringItem(
                              "diagnosticTests",
                              diagnosticTests,
                              i,
                            )
                          }
                          itemLabel="الفحص"
                        />

                        <Divider />

                        <ArrayTextList
                          title="أنواع العمليات"
                          values={operationTypes}
                          fieldName="operationTypes"
                          register={register}
                          errors={errors}
                          onAdd={() =>
                            addStringItem("operationTypes", operationTypes)
                          }
                          onRemove={(i) =>
                            removeStringItem(
                              "operationTypes",
                              operationTypes,
                              i,
                            )
                          }
                          itemLabel="نوع العملية"
                          optionalNote="(اختياري)"
                        />
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* العمل والتعليم */}
                <Grid size={{ xs: 12 }}>
                  <Accordion sx={accordionStyle}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 700 }}>
                        الخبرة والتعليم
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Stack spacing={2}>
                        <ArrayTextList
                          title="أماكن العمل الحالية"
                          values={workPlaces}
                          fieldName="workPlaces"
                          register={register}
                          errors={errors}
                          onAdd={() => addStringItem("workPlaces", workPlaces)}
                          onRemove={(i) =>
                            removeStringItem("workPlaces", workPlaces, i)
                          }
                          itemLabel="مكان العمل"
                        />

                        <Divider />

                        <UniversitiesList
                          values={universities}
                          register={register}
                          errors={errors}
                          onAdd={addUniversity}
                          onRemove={removeUniversity}
                        />

                        <Divider />

                        <ArrayTextList
                          title="أماكن العمل السابقة"
                          values={previousWorkPlaces}
                          fieldName="previousWorkPlaces"
                          register={register}
                          errors={errors}
                          onAdd={() =>
                            addStringItem(
                              "previousWorkPlaces",
                              previousWorkPlaces,
                            )
                          }
                          onRemove={(i) =>
                            removeStringItem(
                              "previousWorkPlaces",
                              previousWorkPlaces,
                              i,
                            )
                          }
                          itemLabel="مكان العمل السابق"
                          optionalNote="(اختياري)"
                        />
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

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


