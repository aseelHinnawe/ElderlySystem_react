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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  LinearProgress,
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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

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
  const [elderlyId, setElderlyId] = useState(null);
  const [aiDoctors, setAiDoctors] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [currentDiseaseIndex, setCurrentDiseaseIndex] = useState(0);
  const [aiRequested, setAiRequested] = useState(false);


  const currentDisease = aiDoctors[currentDiseaseIndex];

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

   // ===== FETCH MAIN DATA =====
  const fetchData = async () => {
    setLoading(true);

    try {
      const currentRes = await AxiosUserInstance.get(
        "/Sponsor/Elderly/current-doctor"
      );
      setCurrentDoctor(currentRes?.data?.data ?? null);
    } catch {
      setCurrentDoctor(null);
    }

    try {
      const doctorsRes = await AxiosUserInstance.get(
        "/Sponsor/Elderly/available-doctors"
      );

      setAvailableDoctors(
        Array.isArray(doctorsRes?.data?.data)
          ? doctorsRes.data.data
          : []
      );
    } catch {
      setAvailableDoctors([]);
      showSnackbar("فشل تحميل قائمة الأطباء");
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH ELDERLY ID =====
  useEffect(() => {
    const fetchElderlyId = async () => {
      try {
        const res = await AxiosUserInstance.get(
          "/Sponsor/Elderly/elderly-id"
        );
        console.log("ELDERLY ID:", res.data.elderlyId);
        setElderlyId(res.data.elderlyId);
      } catch {
        showSnackbar("فشل جلب المسنة");
      }
    };

    fetchElderlyId();
    fetchData();
  }, []);

  // ===== SUBMIT DOCTOR REQUEST =====
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

      showSnackbar(res?.data?.message || "تم إرسال الطلب", "success");
      setSelectedDoctorId("");
    } catch {
      showSnackbar("فشل إرسال الطلب");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDoctorDetails = async (doctorId) => {
  console.log("CLICKED DOCTOR ID:", doctorId);

  setDetailsLoading(true);
  setDetailsOpen(true);

  try {
    const res = await AxiosUserInstance.get(
      `/Sponsor/Elderly/doctor/${doctorId}`
    );

    console.log("API RESPONSE:", res.data);

    setSelectedDoctorDetails(res.data); // <-- المشكلة غالبًا هون
  } catch (err) {
    console.log("ERROR:", err.response?.data || err);
    showSnackbar("فشل تحميل تفاصيل الدكتور");
  } finally {
    setDetailsLoading(false);
  }
};



  // ===== AI DOCTORS =====
  const handleGetAIDoctors = async () => {
    if (!elderlyId) {
      showSnackbar("لا يوجد مسنة مرتبطة");
      return;
    }

    setAiLoading(true);

    try {
      const res = await AxiosUserInstance.get(
        `/Sponsor/Matching/${elderlyId}`
      );

      setAiDoctors(res.data.resultsPerDisease);
    } catch {
      showSnackbar("فشل جلب توصيات الذكاء الاصطناعي");
    } finally {
      setAiLoading(false);
    }
  };

  // ===== FILTER DOCTORS =====
  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return availableDoctors;

    return availableDoctors.filter((d) =>
      (d.name || "").toLowerCase().includes(q)
    );
  }, [availableDoctors, searchTerm]);

  const selectedDoctor =
    availableDoctors.find(
      (d) => d.doctorId === selectedDoctorId
    ) || null;

 const InfoRow = ({ label, value }) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: 3,
      background: "#fff",
      border: "1px solid rgba(106,106,87,0.12)",
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Typography sx={{ fontWeight: 800, color: "#6a6a57" }}>
      {label}
    </Typography>

    <Typography sx={{ fontWeight: 700, color: "#1f1f1a" }}>
      {value || "-"}
    </Typography>
  </Box>
);

  // ===== LOADING UI =====
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          gridTemplateColumns: { xs: "1fr", lg: "390px minmax(0, 1fr) 390px" },


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
    <Card sx={shellCardSx}>
  <CardContent
  sx={{
    p: { xs: 1.5, md: 2.5 },
    display: "flex",
    flexDirection: "column",
    gap: 2,
    height: "100%",
  }}
>
  {/* Header */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
    <Avatar
      sx={{
        width: 48,
        height: 48,
        bgcolor: "rgba(255,215,0,0.18)",
        color: "#b8860b",
      }}
    >
      🏆
    </Avatar>

    <Box>
      <Typography sx={{ fontWeight: 800, color: "#1f1f1a" }}>
        أفضل الأطباء (AI)
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#6a6a57", fontWeight: 700 }}>
        توصيات الذكاء الاصطناعي حسب حالة المسنة
      </Typography>
    </Box>
  </Box>

  <Divider />

  {/* Button */}
  <Button
    variant="contained"
    onClick={() => {
      setAiRequested(true);
      handleGetAIDoctors();
    }}
    disabled={aiLoading || !elderlyId}
    sx={{
      borderRadius: 999,
      fontWeight: 900,
      background: "linear-gradient(135deg, #6a6a57, #a0a078)",
    }}
  >
    {aiLoading ? "جارٍ التحليل..." : "عرض أفضل الأطباء"}
  </Button>

  {/* RESULTS SECTION */}
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

    {/* قبل الضغط */}
    {!aiRequested ? (
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: 800,
          color: "#6a6a57",
          mt: 2,
        }}
      >
        لا توجد نتائج بعد
      </Typography>
    ) : !currentDisease ? (
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: 800,
          color: "#6a6a57",
          mt: 2,
        }}
      >
        جارٍ تحميل النتائج...
      </Typography>
    ) : (
      <>
        {/* Header + Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            disabled={currentDiseaseIndex === 0}
            onClick={() => setCurrentDiseaseIndex((p) => p - 1)}
            sx={{ fontWeight: 900 }}
          >
            ⬅ السابق
          </Button>

          <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
            مرض {currentDiseaseIndex + 1} : {currentDisease?.disease}
          </Typography>

          <Button
            disabled={currentDiseaseIndex === aiDoctors.length - 1}
            onClick={() => setCurrentDiseaseIndex((p) => p + 1)}
            sx={{ fontWeight: 900 }}
          >
            التالي ➡
          </Button>
        </Box>

        {/* Top 3 Doctors */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {currentDisease.ranking.slice(0, 3).map((doc) => (
            <Box
              key={doc.doctorId}
              sx={{
                p: 1,
                borderRadius: 4,
                background: "linear-gradient(135deg, #ffffff, #f8f8f2)",
                border: "1px solid rgba(106,106,87,0.15)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* Top row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: 15 }}>
                  {doc.doctorName}
                </Typography>

                <Button
                  size="small"
                  onClick={() => handleOpenDoctorDetails(doc.doctorId)}
                  sx={{
                    fontSize: 12,
                    px: 1,
                    py: 0.5,
                    borderRadius: 3,
                    background: "rgba(255, 217, 0, 0.16)",
                    color: "#6a6a57",
                    fontWeight: 900,
                    "&:hover": {
                      background: "rgba(255,215,0,0.35)",
                    },
                  }}
                >
                  التفاصيل
                </Button>
              </Box>

              {/* Progress */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#6a6a57",
                    mb: 0.5,
                  }}
                >
                  نسبة التوافق
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={doc.finalSuitability}
                  sx={{
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.05)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #b8860b, #ffd700)",
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: "#b8860b",
                    textAlign: "right",
                    mt: 0.3,
                  }}
                >
                  {doc.finalSuitability}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </>
    )}
  </Box>
</CardContent>


</Card>
<Dialog
  open={detailsOpen}
  onClose={() => setDetailsOpen(false)}
  disableRestoreFocus

  fullWidth
  maxWidth="sm"
>
  <DialogTitle
  sx={{
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  تفاصيل الطبيب

  <IconButton
    onClick={() => setDetailsOpen(false)}
    size="small"
    sx={{
      color: "#6a6a57",
      "&:hover": {
        background: "rgba(106,106,87,0.1)",
      },
    }}
  >
    <CloseRoundedIcon />
  </IconButton>
</DialogTitle>


  <DialogContent
  sx={{
    p: 3,
    background: "linear-gradient(135deg, #f8f8f2, #ffffff)",
  }}
>
  {detailsLoading ? (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <CircularProgress />
    </Box>
  ) : selectedDoctorDetails ? (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      
      {/* Name Card */}
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #6a6a57, #a0a078)",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(106,106,87,0.25)",
        }}
      >
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
          {selectedDoctorDetails.fullName}
        </Typography>

        <Typography sx={{ fontSize: 15, opacity: 0.9 }}>
          {selectedDoctorDetails.medicalRank}
        </Typography>
      </Box>

      {/* Info Cards */}
      <Box sx={{ display: "grid", gap: 1.5 }}>

        <InfoRow label="الإيميل" value={selectedDoctorDetails.email} />
        <InfoRow label="الهاتف" value={selectedDoctorDetails.phoneNumber} />
        <InfoRow label="المدينة" value={selectedDoctorDetails.city} />

      </Box>

{/* Specializations */}
<Box>
  <Typography sx={{ fontWeight: 900, mb: 1, color: "#6a6a57" }}>
    التخصصات
  </Typography>

  <Box
    sx={{
      p: 1.5,
      borderRadius: 3,
      background: "#fff",
      border: "1px solid rgba(106,106,87,0.12)",
    }}
  >
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {selectedDoctorDetails.specializations?.map((s, i) => (
        <Box
          key={i}
          sx={{
            px: 1.5,
            py: 0.6,
            borderRadius: 2,
            background: "rgba(106,106,87,0.08)",
            fontWeight: 700,
            fontSize: 13,
            color: "#1f1f1a",
          }}
        >
          {s}
        </Box>
      ))}
    </Box>
  </Box>
</Box>

      {/* Workplaces */}
      {/* Workplaces */}
<Box>
  <Typography sx={{ fontWeight: 900, mb: 1, color: "#6a6a57" }}>
    أماكن العمل الحالية
  </Typography>

  <Box
    sx={{
      p: 1.5,
      borderRadius: 3,
      background: "#fff",
      border: "1px solid rgba(106,106,87,0.12)",
    }}
  >
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {selectedDoctorDetails.currentWorkPlaces?.map((w, i) => (
        <Box
          key={i}
          sx={{
            px: 1.5,
            py: 0.6,
            borderRadius: 2,
             background: "rgba(106,106,87,0.08)",
            fontWeight: 700,
            fontSize: 13,
            color: "#1f1f1a",
          }}
        >
          {w}
        </Box>
      ))}
    </Box>
  </Box>
</Box>

    </Box>
  ) : (
    <Typography>لا توجد بيانات</Typography>
  )}
</DialogContent>


</Dialog>


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

