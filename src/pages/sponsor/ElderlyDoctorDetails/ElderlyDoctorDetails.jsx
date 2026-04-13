import { useEffect, useMemo, useState } from "react";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";


const DOCTOR_ROW_HEIGHT = 78;
const DOCTOR_LIST_GAP = 8;
const DOCTOR_LIST_PADDING = 8;
const VISIBLE_DOCTORS_COUNT = 2;


const headerCardStyles = {
  mb: 3,
  borderRadius: 5,
  background: "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};


const shellCardSx = {
  borderRadius: 4,
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f8f2 100%)",
  border: "1px solid rgba(0,0,0,0.06)",
  height: "100%",
};


const infoRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  p: 1.3,
  borderRadius: 3,
  background: "rgba(106,106,87,0.06)",
  border: "1px solid rgba(106,106,87,0.12)",
};


const compactDoctorRowSx = (selected) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.2,
  p: 1.4,
  minHeight: `${DOCTOR_ROW_HEIGHT}px`,
  height: `${DOCTOR_ROW_HEIGHT}px`,
  boxSizing: "border-box",
  borderRadius: 3,
  cursor: "pointer",
  border: selected
    ? "1px solid rgba(106,106,87,0.32)"
    : "1px solid rgba(0,0,0,0.06)",
  background: selected
    ? "linear-gradient(135deg, rgba(106,106,87,0.09), rgba(160,160,120,0.08))"
    : "#fff",
  boxShadow: selected
    ? "0 8px 18px rgba(106,106,87,0.10)"
    : "0 2px 8px rgba(0,0,0,0.03)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 18px rgba(0,0,0,0.07)",
    borderColor: "rgba(106,106,87,0.24)",
  },
});


const radioLikeSx = (selected) => ({
  width: 22,
  height: 22,
  minWidth: 22,
  borderRadius: "50%",
  border: selected
    ? "6px solid rgb(106,106,87)"
    : "2px solid rgba(106,106,87,0.38)",
  backgroundColor: "#fff",
  transition: "all 0.2s ease",
});


export default function ElderlyDoctorDetails() {
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };


  const fetchData = async () => {
    setLoading(true);


    try {
      const currentRes = await AxiosUserInstance.get("/Sponsor/Elderly/current-doctor");
      setCurrentDoctor(currentRes?.data?.data ?? null);
    } catch (error) {
      setCurrentDoctor(null);
    }


    try {
      const doctorsRes = await AxiosUserInstance.get("/Sponsor/Elderly/available-doctors");
      setAvailableDoctors(
        Array.isArray(doctorsRes?.data?.data) ? doctorsRes.data.data : []
      );
    } catch (error) {
      setAvailableDoctors([]);
      showSnackbar("فشل تحميل قائمة الأطباء المتاحين");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const handleSubmitRequest = async () => {
    if (!selectedDoctorId) {
      showSnackbar("يرجى اختيار دكتور أولاً");
      return;
    }


    setSubmitLoading(true);
    try {
      const res = await AxiosUserInstance.post(
        "/Sponsor/Elderly/doctor-change-request",
        { requestedDoctorId: selectedDoctorId }
      );


      showSnackbar(
        res?.data?.message || "تم إرسال طلب التغيير بنجاح",
        "success"
      );
      setSelectedDoctorId("");
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "فشل إرسال طلب التغيير"
      );
    } finally {
      setSubmitLoading(false);
    }
  };


  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return availableDoctors;


    return availableDoctors.filter((doctor) =>
      (doctor.name || "").toLowerCase().includes(q)
    );
  }, [availableDoctors, searchTerm]);


  const selectedDoctor =
    availableDoctors.find((doctor) => doctor.doctorId === selectedDoctorId) || null;


  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Card sx={headerCardStyles}>
        <CardContent
          sx={{
            p: { xs: 2.5, md: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 58,
                height: 58,
                bgcolor: "rgba(255,255,255,0.18)",
                color: "#fff",
              }}
            >
              <MedicalServicesRoundedIcon />
            </Avatar>


            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 22, md: 28 } }}
              >
                اختيار الأطباء
              </Typography>
              <Typography sx={{ opacity: 0.92, mt: 0.7, fontSize: 14 }}>
                عرض الدكتور الحالي واختيار دكتور آخر لتقديم طلب التغيير
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "390px minmax(0, 1fr)" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Card sx={shellCardSx}>
  <CardContent
    sx={{
      p: { xs: 2, md: 2.5 },
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "100%",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
      <Avatar
        sx={{
          width: 48,
          height: 48,
          bgcolor: "rgba(106,106,87,0.12)",
          color: "#4a4a3d",
        }}
      >
        <LocalHospitalRoundedIcon />
      </Avatar>


      <Box>
        <Typography sx={{ fontWeight: 800, color: "#1f1f1a", fontSize: 18 }}>
          الدكتور الحالي
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 900,
            color: "#6a6a57",
          }}
        >
          معلومات الطبيب المرتبط حاليًا
        </Typography>
      </Box>
    </Box>


    <Divider />


    {!currentDoctor ? (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          p: 3,
          textAlign: "center",
          background: "rgba(106,106,87,0.06)",
          border: "1px dashed rgba(106,106,87,0.22)",
        }}
      >
        <Box>
          <Avatar
            sx={{
              mx: "auto",
              mb: 1.5,
              width: 60,
              height: 60,
              bgcolor: "rgba(106,106,87,0.12)",
              color: "#6a6a57",
            }}
          >
            <PersonRoundedIcon />
          </Avatar>
          <Typography sx={{ fontWeight: 800, color: "#4a4a3d" }}>
            لا يوجد دكتور حالي للمسنة
          </Typography>
        </Box>
      </Box>
    ) : (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 5,
            p: 2.2,
            background:
              "linear-gradient(135deg, rgba(106,106,87,0.12), rgba(160,160,120,0.08))",
            border: "1px solid rgba(106,106,87,0.16)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
            }}
          />


          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: "#fff",
                color: "#6a6a57",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: 34 }} />
            </Avatar>


            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: 20,
                  color: "#1f1f1a",
                  lineHeight: 1.2,
                }}
              >
                {currentDoctor.name || "-"}
              </Typography>


              <Typography
                sx={{
                  mt: 0.6,
                  fontSize: 13,
                  color: "#6a6a57",
                  fontWeight: 700,
                }}
              >
                الطبيب المسؤول الحالي
              </Typography>


              <Box
                sx={{
                  mt: 1.2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 1.2,
                  py: 0.55,
                  borderRadius: 999,
                  bgcolor: "rgba(76,175,80,0.14)",
                  color: "#2e7d32",
                  border: "1px solid rgba(76,175,80,0.22)",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                مرتبط حاليًا
              </Box>
            </Box>
          </Stack>
        </Box>


        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1.4,
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              background: "#fff",
              border: "1px solid rgba(106,106,87,0.12)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            <Stack direction="row" spacing={1.1} alignItems="center">
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "rgba(33,150,243,0.12)",
                  color: "#1565c0",
                }}
              >
                <PhoneRoundedIcon />
              </Avatar>


              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                >
                  رقم الهاتف
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#1f1f1a",
                    mt: 0.2,
                    wordBreak: "break-word",
                  }}
                >
                  {currentDoctor.phone || "-"}
                </Typography>
              </Box>
            </Stack>
          </Box>


          <Box
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              background: "#fff",
              border: "1px solid rgba(106,106,87,0.12)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            <Stack direction="row" spacing={1.1} alignItems="center">
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "rgba(76,175,80,0.12)",
                  color: "#2e7d32",
                }}
              >
                <BusinessRoundedIcon />
              </Avatar>


              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                >
                  مكان العمل
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#1f1f1a",
                    mt: 0.2,
                    wordBreak: "break-word",
                  }}
                >
                  {currentDoctor.workPlace || "-"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    )}
  </CardContent>
</Card>


        <Card sx={shellCardSx}>
          <CardContent
            sx={{
              p: { xs: 2, md: 2.5 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "rgba(106,106,87,0.12)",
                  color: "#4a4a3d",
                }}
              >
                <GroupsRoundedIcon />
              </Avatar>


              <Box>
                <Typography sx={{ fontWeight: 700, color: "#1f1f1a" }}>
                  تقديم طلب تعيين دكتور
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#6a6a57",
                  }}
                >
                  اختر طبيبًا من القائمة بشكل سريع ومرتب
                </Typography>
              </Box>
            </Box>


            <Divider />


            {availableDoctors.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 4,
                  p: 3,
                  textAlign: "center",
                  background: "rgba(106,106,87,0.06)",
                  border: "1px dashed rgba(106,106,87,0.22)",
                }}
              >
                <Typography sx={{ fontWeight: 700, color: "#4a4a3d" }}>
                  لا يوجد دكاترة متاحون حاليًا
                </Typography>
              </Box>
            ) : (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن اسم الدكتور"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "#fff",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: "#6a6a57" }} />
                      </InputAdornment>
                    ),
                  }}
                />


                <Box
                  sx={{
                    p: 1.4,
                    borderRadius: 3,
                    background: "rgba(106,106,87,0.06)",
                    border: "1px solid rgba(106,106,87,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                    >
                      الاختيار الحالي
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: "#1f1f1a", mt: 0.3 }}>
                      {selectedDoctor ? selectedDoctor.name : "لم يتم اختيار أي دكتور"}
                    </Typography>
                  </Box>


                  {selectedDoctor && (
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.6,
                        px: 1.1,
                        py: 0.55,
                        borderRadius: 999,
                        bgcolor: "rgba(76,175,80,0.12)",
                        color: "#2e7d32",
                        border: "1px solid rgba(76,175,80,0.22)",
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                      تم الاختيار
                    </Box>
                  )}
                </Box>


                <Box
                  sx={{
                    borderRadius: 3,
                    border: "1px solid rgba(106,106,87,0.12)",
                    background: "#fcfcf8",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height:
                        DOCTOR_ROW_HEIGHT * VISIBLE_DOCTORS_COUNT +
                        DOCTOR_LIST_GAP * (VISIBLE_DOCTORS_COUNT - 1) +
                        DOCTOR_LIST_PADDING * 2,
                      overflowY: "auto",
                      p: `${DOCTOR_LIST_PADDING}px`,
                      display: "grid",
                      gap: `${DOCTOR_LIST_GAP}px`,
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "rgba(106,106,87,0.28)",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {filteredDoctors.length === 0 ? (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: "center",
                          color: "#6a6a57",
                          fontWeight: 700,
                        }}
                      >
                        لا يوجد نتائج مطابقة
                      </Box>
                    ) : (
                      filteredDoctors.map((doctor) => {
                        const isSelected = selectedDoctorId === doctor.doctorId;


                        return (
                          <Box
                            key={doctor.doctorId}
                            sx={compactDoctorRowSx(isSelected)}
                            onClick={() =>
                              setSelectedDoctorId(isSelected ? "" : doctor.doctorId)
                            }
                          >
                            <Stack
                              direction="row"
                              spacing={1.2}
                              alignItems="center"
                              sx={{ minWidth: 0, flex: 1 }}
                            >
                              <Avatar
                                sx={{
                                  width: 42,
                                  height: 42,
                                  bgcolor: isSelected
                                    ? "rgba(106,106,87,0.18)"
                                    : "rgba(106,106,87,0.12)",
                                  color: "#6a6a57",
                                }}
                              >
                                <PersonRoundedIcon />
                              </Avatar>


                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 800,
                                    color: "#1f1f1a",
                                    lineHeight: 1.3,
                                    fontSize: { xs: 14, sm: 15 },
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {doctor.name}
                                </Typography>


                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    fontWeight: 900,
                                    color: "#6a6a57",
                                    mt: 0.25,
                                  }}
                                >
                                  {isSelected ? "محدد حاليًا" : "اضغط للاختيار"}
                                </Typography>
                              </Box>
                            </Stack>


                            <Box sx={radioLikeSx(isSelected)} />
                          </Box>
                        );
                      })
                    )}
                  </Box>
                </Box>


                <Box
                  sx={{
                    pt: 1,
                    mt: "auto",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSubmitRequest}
                    disabled={!selectedDoctorId || submitLoading}
                    startIcon={
                      submitLoading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendRoundedIcon />
                      )
                    }
                    sx={{
                      borderRadius: 999,
                      px: 2.8,
                      py: 1.1,
                      fontWeight: 900,
                      gap: 1,
                      minWidth: { xs: "100%", sm: 220 },
                      background:
                        "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
                      boxShadow: "0 8px 20px rgba(106,106,87,0.22)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, rgb(96,96,80), rgb(148,148,110))",
                      },
                      "&.Mui-disabled": {
                        color: "rgba(255,255,255,0.75)",
                        background: "rgba(106,106,87,0.45)",
                      },
                    }}
                  >
                    {submitLoading ? "جارٍ إرسال الطلب..." : "تقديم طلب التغيير"}
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ fontWeight: 900 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

