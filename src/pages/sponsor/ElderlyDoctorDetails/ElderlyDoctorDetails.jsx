
import { useEffect, useState } from "react";
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
} from "@mui/material";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";


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


const doctorCardSx = (selected) => ({
  borderRadius: 3,
  border: selected
    ? "1px solid rgba(106,106,87,0.35)"
    : "1px solid rgba(0,0,0,0.07)",
  background: selected
    ? "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(244,245,239,1) 100%)"
    : "#fff",
  boxShadow: selected
    ? "0 10px 24px rgba(106,106,87,0.12)"
    : "0 6px 16px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
  },
});


export default function ElderlyDoctorDetails() {
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);


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
                ترشيحات الأطباء
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
          gridTemplateColumns: { xs: "1fr", lg: "420px minmax(0, 1fr)" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* Current Doctor */}
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
                <Typography sx={{ fontWeight: 700, color: "#1f1f1a" }}>
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
                      bgcolor: "rgba(106,106,87,0.12)",
                      color: "#6a6a57",
                    }}
                  >
                    <PersonRoundedIcon />
                  </Avatar>
                  <Typography sx={{ fontWeight: 700, color: "#4a4a3d" }}>
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
                    p: 2,
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, rgba(106,106,87,0.08), rgba(160,160,120,0.08))",
                    border: "1px solid rgba(106,106,87,0.16)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{gap:1}}>
                    <Avatar
                      sx={{
                        width: 58,
                        height: 58,
                        bgcolor: "rgba(106,106,87,0.14)",
                        color: "#6a6a57",
                      }}
                    >
                      <PersonRoundedIcon />
                    </Avatar>


                    <Box sx={{ flex: 1  }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 18,
                          color: "#1f1f1a",
                          lineHeight: 1.2,
                        }}
                      >
                        {currentDoctor.name || "-"}
                      </Typography>


                      <Box
                        sx={{
                          mt: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.6,
                          px: 1.1,
                          py: 0.5,
                          borderRadius: 999,
                          bgcolor: "rgba(76,175,80,0.12)",
                          color: "#2e7d32",
                          border: "1px solid rgba(76,175,80,0.22)",
                          fontSize: 12,
                          fontWeight: 900,
                        }}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                        الطبيب الحالي
                      </Box>
                    </Box>
                  </Stack>
                </Box>


                <Box sx={{ display: "grid", gap: 1.4 }}>
                  <Box sx={infoRowSx}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "rgba(33,150,243,0.12)",
                        color: "#1565c0",
                      }}
                    >
                      <PhoneRoundedIcon />
                    </Avatar>


                    <Box>
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                      >
                        رقم الهاتف
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: "#1f1f1a" }}>
                        {currentDoctor.phone || "-"}
                      </Typography>
                    </Box>
                  </Box>


                  <Box sx={infoRowSx}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "rgba(76,175,80,0.12)",
                        color: "#2e7d32",
                      }}
                    >
                      <BusinessRoundedIcon />
                    </Avatar>


                    <Box>
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                      >
                        مكان العمل
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: "#1f1f1a" }}>
                        {currentDoctor.workPlace || "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>


        {/* Available Doctors */}
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
                  اختر دكتورًا من القائمة لتقديم الطلب
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
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      xl: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                    maxHeight: { xs: "auto", lg: "500px" },
                    overflowY: { xs: "visible", lg: "auto" },
                    pr: { xs: 0, lg: 0.5 },
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(106,106,87,0.28)",
                      borderRadius: "10px",
                    },
                  }}
                >
                  {availableDoctors.map((doctor) => {
                    const isSelected = selectedDoctorId === doctor.doctorId;


                    return (
                      <Card key={doctor.doctorId} sx={doctorCardSx(isSelected)}>
                        <CardContent
                          sx={{
                            p: 1.6,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            height: "100%",
                          }}
                        >
                          <Stack direction="row" spacing={1.2} alignItems="center">
                            <Avatar
                              sx={{
                                width: 46,
                                height: 46,
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
                                  fontWeight: 700,
                                  color: "#1f1f1a",
                                  lineHeight: 1.4,
                                  wordBreak: "break-word",
                                }}
                              >
                                {doctor.name}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 900,
                                  color: "#6a6a57",
                                  mt: 0.3,
                                }}
                              >
                                دكتور متاح للاختيار
                              </Typography>
                            </Box>
                          </Stack>


                          <Button
                            variant={isSelected ? "contained" : "outlined"}
                            fullWidth
                            onClick={() =>
                              setSelectedDoctorId(
                                isSelected ? "" : doctor.doctorId
                              )
                            }
                            sx={{
                              borderRadius: 999,
                              fontWeight: 900,
                              py: 1,
                              ...(isSelected
                                ? {
                                    background:
                                      "linear-gradient(135deg, rgb(106,106,87), rgb(160,160,120))",
                                    boxShadow:
                                      "0 8px 18px rgba(106,106,87,0.18)",
                                  }
                                : {
                                    borderColor: "rgba(106,106,87,0.28)",
                                    color: "#6a6a57",
                                    "&:hover": {
                                      borderColor: "#6a6a57",
                                      background: "rgba(106,106,87,0.04)",
                                    },
                                  }),
                            }}
                          >
                            {isSelected ? "تم الاختيار" : "اختيار"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
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
                      gap:1,
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
