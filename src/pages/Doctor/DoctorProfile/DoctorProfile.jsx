import { useEffect, useMemo, useState } from "react";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Avatar,
  Paper,
  Chip,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";


import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MaleIcon from "@mui/icons-material/Male";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ScienceIcon from "@mui/icons-material/Science";
import SchoolIcon from "@mui/icons-material/School";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";


const cardTitleSx = (borderColor) => ({
  fontWeight: 900,
  mb: 0.3,
  fontSize: 16,
  borderRight: `4px solid ${borderColor}`,
  pr: 1,
});


const infoRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  p: 1.5,
  borderRadius: 2.5,
  background: "#f7f7f3",
};


const iconCircleSx = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#6a6a57",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  flexShrink: 0,
};


function FieldRow({ icon, label, value }) {
  return (
    <Box sx={infoRowSx}>
      <Box sx={iconCircleSx}>{icon}</Box>


      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, color: "#777", fontWeight: 800 }}>
          {label}
        </Typography>


        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 14,
            color: "#222",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={value ?? ""}
        >
          {value ?? "-"}
        </Typography>
      </Box>
    </Box>
  );
}


function InfoTagCard({ icon, title, subtitle, chipLabel }) {
  return (
    <Box
      sx={{
        p: 1.6,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f4f5ef 100%)",
        border: "1px solid rgba(65,125,68,0.18)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        transition: "transform .18s ease, box-shadow .18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 14px 28px rgba(0,0,0,0.10)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            background: "linear-gradient(135deg, #417d44, #6a6a57)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>


        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 1000,
              color: "#1f1f1a",
              fontSize: 15,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={title}
          >
            {title}
          </Typography>


          {subtitle ? (
            <Typography
              sx={{
                fontSize: 12,
                color: "#6a6a57",
                fontWeight: 900,
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Box>


      {chipLabel ? (
        <Chip
          label={chipLabel}
          sx={{
            fontWeight: 1000,
            bgcolor: "rgba(65,125,68,0.12)",
            color: "#2f5f33",
            border: "1px solid rgba(65,125,68,0.18)",
          }}
        />
      ) : null}
    </Box>
  );
}


const createEditForm = (doctor) => ({
  medicalRank: doctor?.medicalRank || "",
  yearsOfExperience: doctor?.yearsOfExperience || "",
  numberOfOperations:
    doctor?.numberOfOperations !== null &&
    doctor?.numberOfOperations !== undefined
      ? String(doctor.numberOfOperations)
      : "",
  specializationsText: Array.isArray(doctor?.specializations)
    ? doctor.specializations.join("\n")
    : "",
  diseasesText: Array.isArray(doctor?.diseases)
    ? doctor.diseases.join("\n")
    : "",
  workPlace: Array.isArray(doctor?.workPlaces) ? doctor.workPlaces[0] || "" : "",
  operationTypesText: Array.isArray(doctor?.operationTypes)
    ? doctor.operationTypes.join("\n")
    : "",
  medicalProceduresText: Array.isArray(doctor?.medicalProcedures)
    ? doctor.medicalProcedures.join("\n")
    : "",
  diagnosticTestsText: Array.isArray(doctor?.diagnosticTests)
    ? doctor.diagnosticTests.join("\n")
    : "",
});


const splitTextToArray = (value) => {
  if (!value || !value.trim()) return [];
  return value
    .split(/[\n،,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
};


export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState(createEditForm(null));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("en-GB");
  };


  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get("/Doctor/profile");
      const data = res?.data?.data || null;
      setDoctor(data);
    } catch (err) {
      setDoctor(null);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل جلب بيانات الدكتور",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDoctorProfile();
  }, []);


  const openEditDialog = () => {
    setEditForm(createEditForm(doctor));
    setEditDialogOpen(true);
  };


  const closeEditDialog = () => {
    if (saving) return;
    setEditDialogOpen(false);
  };


  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSaveProfile = async () => {
    const parsedNumber =
      editForm.numberOfOperations === ""
        ? null
        : Number(editForm.numberOfOperations);


    if (
      editForm.numberOfOperations !== "" &&
      (Number.isNaN(parsedNumber) || parsedNumber < 0)
    ) {
      setSnackbar({
        open: true,
        message: "عدد العمليات يجب أن يكون رقمًا صحيحًا",
        severity: "error",
      });
      return;
    }


    const payload = {
      medicalRank: editForm.medicalRank.trim() || null,
      yearsOfExperience: editForm.yearsOfExperience.trim() || null,
      numberOfOperations: parsedNumber,
      specializations: splitTextToArray(editForm.specializationsText),
      diseases: splitTextToArray(editForm.diseasesText),
      workPlaces: editForm.workPlace.trim() ? [editForm.workPlace.trim()] : [],
      operationTypes: splitTextToArray(editForm.operationTypesText),
      medicalProcedures: splitTextToArray(editForm.medicalProceduresText),
      diagnosticTests: splitTextToArray(editForm.diagnosticTestsText),
    };


    try {
      setSaving(true);


      await AxiosUserInstance.patch("/Doctor/profile", payload);


      setSnackbar({
        open: true,
        message: "تم تحديث الملف الشخصي بنجاح",
        severity: "success",
      });


      setEditDialogOpen(false);
      await fetchDoctorProfile();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "فشل تحديث الملف الشخصي",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };


  const basicFields = useMemo(() => {
    if (!doctor) return [];


    return [
      { label: "الاسم الكامل", value: doctor.fullName, icon: <BadgeIcon /> },
      { label: "البريد الإلكتروني", value: doctor.email, icon: <EmailIcon /> },
      { label: "رقم الهاتف", value: doctor.phoneNumber, icon: <CallIcon /> },
      { label: "المدينة", value: doctor.city, icon: <LocationOnIcon /> },
      { label: "رقم الهوية", value: doctor.nationalId, icon: <BadgeIcon /> },
      { label: "الجنس", value: doctor.gender, icon: <MaleIcon /> },
      {
        label: "تاريخ الميلاد",
        value: formatDate(doctor.bDate),
        icon: <CalendarMonthIcon />,
      },
    ];
  }, [doctor]);


  const medicalFields = useMemo(() => {
    if (!doctor) return [];


    return [
      {
        label: "الرتبة الطبية",
        value: doctor.medicalRank,
        icon: <WorkspacePremiumIcon />,
      },
      {
        label: "سنوات الخبرة",
        value: doctor.yearsOfExperience,
        icon: <WorkHistoryIcon />,
      },
      {
        label: "عدد العمليات",
        value: doctor.numberOfOperations,
        icon: <LocalHospitalIcon />,
      },
    ];
  }, [doctor]);


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }


  if (!doctor) {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <Typography sx={{ fontWeight: 700, color: "#777" }}>
            لا توجد بيانات لعرضها
          </Typography>
        </Box>


        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </>
    );
  }


  const hasSpecializations =
    Array.isArray(doctor.specializations) && doctor.specializations.length > 0;
  const hasDiseases =
    Array.isArray(doctor.diseases) && doctor.diseases.length > 0;
  const hasWorkPlaces =
    Array.isArray(doctor.workPlaces) && doctor.workPlaces.length > 0;
  const hasPreviousWorkPlaces =
    Array.isArray(doctor.previousWorkPlaces) &&
    doctor.previousWorkPlaces.length > 0;
  const hasOperationTypes =
    Array.isArray(doctor.operationTypes) && doctor.operationTypes.length > 0;
  const hasMedicalProcedures =
    Array.isArray(doctor.medicalProcedures) &&
    doctor.medicalProcedures.length > 0;
  const hasDiagnosticTests =
    Array.isArray(doctor.diagnosticTests) && doctor.diagnosticTests.length > 0;
  const hasUniversities =
    Array.isArray(doctor.universities) && doctor.universities.length > 0;


  const currentWorkPlace =
    Array.isArray(doctor.workPlaces) && doctor.workPlaces.length > 0
      ? doctor.workPlaces[0]
      : null;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 6 },
      }}
    >
      <Grid container spacing={4} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 5 }} sx={{ display: "flex" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ textAlign: "center", position: "relative" }}>
              <Box sx={{ display: "inline-block", position: "relative" }}>
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    bgcolor: "#bdbdbd",
                    color: "#fff",
                    fontSize: 42,
                    fontWeight: 900,
                    border: "4px solid #fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                  }}
                >
                  {(doctor?.fullName || "").trim().charAt(0) || "د"}
                </Avatar>


                <Chip
                  label={doctor.medicalRank || "طبيب"}
                  size="small"
                  sx={{
                    position: "absolute",
                    right: -6,
                    bottom: 10,
                    height: 24,
                    fontWeight: 900,
                    fontSize: 12,
                    color: "#fff",
                    backgroundColor: "#417d44",
                    "& .MuiChip-label": { px: 1.2 },
                    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                  }}
                />
              </Box>


              <Typography sx={{ mt: 2, fontSize: 26, fontWeight: 1000 }}>
                {doctor.fullName || "-"}
              </Typography>


              <Typography
                sx={{
                  mt: 0.7,
                  color: "#6a6a57",
                  fontWeight: 900,
                  fontSize: 14,
                }}
              >
                الملف الشخصي للطبيب
              </Typography>
            </Box>


            <Box >
              <Typography sx={cardTitleSx("#6a6a57")}>
                البيانات الأساسية
              </Typography>


              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {basicFields.map((f, i) => (
                  <FieldRow
                    key={i}
                    icon={f.icon}
                    label={f.label}
                    value={f.value}
                  />
                ))}
              </Box>
            </Box>

<Box>
  <Typography sx={cardTitleSx("#6a6a57")}>
    الجامعات والدرجات
  </Typography>

  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
    {hasUniversities ? (
      doctor.universities.map((item, idx) => (
        <FieldRow
          key={idx}
          icon={<SchoolIcon />}
          label={item.degree || "درجة علمية"}
          value={item.universityName}
        />
      ))
    ) : (
      <Typography sx={{ fontWeight: 900, color: "#777", mt: 1 }}>
        لا توجد جامعات مسجلة.
      </Typography>
    )}
  </Box>
</Box>

            <Box>
              <Typography sx={cardTitleSx("#417d44")}>
                المعلومات الطبية
              </Typography>


              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {medicalFields.map((f, i) => (
                  <FieldRow
                    key={i}
                    icon={f.icon}
                    label={f.label}
                    value={f.value}
                  />
                ))}
              </Box>
            </Box>


            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={openEditDialog}
              sx={{
                backgroundColor: "#417d44",
                fontWeight: 900,
                gap:1,
                "&:hover": { backgroundColor: "#356737" },
              }}
            >
              تعديل الملف الشخصي
            </Button>
          </Paper>
        </Grid>


        <Grid size={{ xs: 12, lg: 7 }} sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#417d44")}>التخصصات</Typography>


              {hasSpecializations ? (
                <Grid container spacing={1.5} sx={{ mt: 0.6 }}>
                  {doctor.specializations.map((item, idx) => (
                    <Grid key={`${item}-${idx}`} size={{ xs: 12, sm: 6 }}>
                      <InfoTagCard
                        icon={<LocalHospitalIcon />}
                        title={item}
                        subtitle="تخصص طبي"
                        chipLabel={idx + 1}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(106,106,87,0.08)",
                    border: "1px dashed rgba(106,106,87,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mt: 1.5,
                  }}
                >
                  <Box sx={{ ...iconCircleSx, background: "#417d44" }}>
                    <LocalHospitalIcon />
                  </Box>
                  <Typography sx={{ fontWeight: 1000, color: "#6a6a57" }}>
                    لا توجد تخصصات مسجلة.
                  </Typography>
                </Box>
              )}
            </Paper>


            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#417d44")}>الأمراض </Typography>


              {hasDiseases ? (
                <Grid container spacing={1.5} sx={{ mt: 0.6 }}>
                  {doctor.diseases.map((item, idx) => (
                    <Grid key={`${item}-${idx}`} size={{ xs: 12, sm: 6 }}>
                      <InfoTagCard
                        icon={<VaccinesIcon />}
                        title={item}
                        subtitle="مرض ضمن خبرة الطبيب"
                        chipLabel={idx + 1}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(106,106,87,0.08)",
                    border: "1px dashed rgba(106,106,87,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mt: 1.5,
                  }}
                >
                  <Box sx={{ ...iconCircleSx, background: "#417d44" }}>
                    <VaccinesIcon />
                  </Box>
                  <Typography sx={{ fontWeight: 1000, color: "#6a6a57" }}>
                    لا توجد أمراض مسجلة.
                  </Typography>
                </Box>
              )}
            </Paper>


            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#0d0d0d")}>
                أماكن العمل الحالية
              </Typography>


              {currentWorkPlace ? (
                <Grid container spacing={1.5} sx={{ mt: 0.6 }}>
                  <Grid size={{ xs: 12 }}>
                    <InfoTagCard
                      icon={<WorkHistoryIcon />}
                      title={currentWorkPlace}
                      subtitle="مكان العمل الحالي"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ fontWeight: 900, color: "#777", mt: 1.5 }}>
                  لا توجد أماكن عمل حالية مسجلة.
                </Typography>
              )}
            </Paper>


            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#6a6a57")}>
                أماكن العمل السابقة
              </Typography>


              {hasPreviousWorkPlaces ? (
                <Grid container spacing={1.5} sx={{ mt: 0.6 }}>
                  {doctor.previousWorkPlaces.map((item, idx) => (
                    <Grid key={`${item}-${idx}`} size={{ xs: 12, sm: 6 }}>
                      <InfoTagCard
                        icon={<WorkHistoryIcon />}
                        title={item}
                        subtitle="مكان عمل سابق"
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ fontWeight: 900, color: "#777", mt: 1.5 }}>
                  لا توجد أماكن عمل سابقة مسجلة.
                </Typography>
              )}
            </Paper>


            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#417d44")}>
                العمليات والإجراءات
              </Typography>


              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "#f7f7f3",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontWeight: 1000, mb: 1.2 }}>
                      أنواع العمليات
                    </Typography>


                    {hasOperationTypes ? (
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {doctor.operationTypes.map((item, idx) => (
                          <Chip
                            key={`${item}-${idx}`}
                            label={item}
                            sx={{
                              fontWeight: 900,
                              bgcolor: "rgba(65,125,68,0.12)",
                              color: "#2f5f33",
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ fontWeight: 900, color: "#777" }}>
                        لا توجد بيانات.
                      </Typography>
                    )}
                  </Box>
                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "#f7f7f3",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontWeight: 1000, mb: 1.2 }}>
                      الإجراءات الطبية
                    </Typography>


                    {hasMedicalProcedures ? (
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {doctor.medicalProcedures.map((item, idx) => (
                          <Chip
                            key={`${item}-${idx}`}
                            label={item}
                            sx={{
                              fontWeight: 900,
                              bgcolor: "rgba(106,106,87,0.12)",
                              color: "#4a4a3d",
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ fontWeight: 900, color: "#777" }}>
                        لا توجد بيانات.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>


            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography sx={cardTitleSx("#417d44")}>
                الفحوصات التشخيصية
              </Typography>


              {hasDiagnosticTests ? (
                <Grid container spacing={1.5} sx={{ mt: 0.6 }}>
                  {doctor.diagnosticTests.map((item, idx) => (
                    <Grid key={`${item}-${idx}`} size={{ xs: 12, sm: 6 }}>
                      <InfoTagCard
                        icon={<ScienceIcon />}
                        title={item}
                        subtitle="فحص تشخيصي"
                        chipLabel={idx + 1}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ fontWeight: 900, color: "#777", mt: 1.5 }}>
                  لا توجد فحوصات تشخيصية مسجلة.
                </Typography>
              )}
            </Paper>


            
          </Box>
        </Grid>
      </Grid>


      <Dialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 1000 }}>
          تعديل الملف الشخصي للطبيب
        </DialogTitle>


        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="الرتبة الطبية"
                value={editForm.medicalRank}
                onChange={(e) => handleEditChange("medicalRank", e.target.value)}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="سنوات الخبرة"
                value={editForm.yearsOfExperience}
                onChange={(e) =>
                  handleEditChange("yearsOfExperience", e.target.value)
                }
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="عدد العمليات"
                value={editForm.numberOfOperations}
                onChange={(e) =>
                  handleEditChange("numberOfOperations", e.target.value)
                }
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="مكان العمل الحالي"
                value={editForm.workPlace}
                onChange={(e) => handleEditChange("workPlace", e.target.value)}
                helperText="سيتم إرسال عنصر واحد فقط داخل workPlaces"
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="التخصصات"
                value={editForm.specializationsText}
                onChange={(e) =>
                  handleEditChange("specializationsText", e.target.value)
                }
                helperText="كل عنصر في سطر أو مفصول بفاصلة"
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="الأمراض"
                value={editForm.diseasesText}
                onChange={(e) =>
                  handleEditChange("diseasesText", e.target.value)
                }
                helperText="كل عنصر في سطر أو مفصول بفاصلة"
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="أنواع العمليات"
                value={editForm.operationTypesText}
                onChange={(e) =>
                  handleEditChange("operationTypesText", e.target.value)
                }
                helperText="كل عنصر في سطر أو مفصول بفاصلة"
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="الإجراءات الطبية"
                value={editForm.medicalProceduresText}
                onChange={(e) =>
                  handleEditChange("medicalProceduresText", e.target.value)
                }
                helperText="كل عنصر في سطر أو مفصول بفاصلة"
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="الفحوصات التشخيصية"
                value={editForm.diagnosticTestsText}
                onChange={(e) =>
                  handleEditChange("diagnosticTestsText", e.target.value)
                }
                helperText="كل عنصر في سطر أو مفصول بفاصلة"
              />
            </Grid>
          </Grid>
        </DialogContent>


        <DialogActions sx={{ p: 2 , gap : 1 }}>
          <Button
            onClick={closeEditDialog}
            color="inherit"
            startIcon={<CloseIcon />}
            disabled={saving}
            sx={{ fontWeight: 900 , gap : 1 ,  border: "1px solid",
    borderColor: "currentColor",}}
          >
            إلغاء
          </Button>


          <Button
            onClick={handleSaveProfile}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
            sx={{
              backgroundColor: "#417d44",
              fontWeight: 900,
              gap: 1,
              "&:hover": { backgroundColor: "#356737" },
            }}
          >
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
