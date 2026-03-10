import { useEffect, useState } from "react";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import { useNavigate } from "react-router-dom";


const cardSx = {
  borderRadius: 4,
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  background: "linear-gradient(135deg, #ffffff 0%, #f6f6ef 100%)",
  border: "1px solid rgba(0,0,0,0.06)",
};


const pillSx = {
  borderRadius: 999,
  fontWeight: 1000,
};


export default function DailyFollow() {
  const navigate = useNavigate();


  const [checkLists, setCheckLists] = useState([]);
  const [loading, setLoading] = useState(true);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });


  const fetchDailyFollow = async () => {
    setLoading(true);
    try {
      const checkRes = await AxiosUserInstance.get(
        "/Sponsor/Elderly/mine/checklists/today"
      );


      const cl = checkRes?.data?.data?.[0]?.checkLists ?? [];
      setCheckLists(Array.isArray(cl) ? cl : []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "فشل تحميل بيانات المتابعة اليومية",
        severity: "error",
      });
      setCheckLists([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDailyFollow();
  }, []);


  const renderMetric = (label, value) => {
    const v = (value ?? "").toString().trim();
    if (!v) return null;


    return (
      <Chip
        size="small"
        label={`${label}: ${v}`}
        sx={{
          ...pillSx,
          bgcolor: "rgba(106,106,87,0.10)",
          color: "#4a4a3d",
        }}
      />
    );
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
        background:
          "linear-gradient(135deg, #f4f5ef 0%, #e6e7dc 50%, #d4d6c8 100%)",
        p: { xs: 2, md: 5 },
      }}
    >
      <Stack spacing={3}>
        <Card sx={cardSx}>
          <CardContent sx={{ p: 2.6 }}>
            <Box
              sx={{
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
                    bgcolor: "#6a6a57",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                  }}
                >
                  <FactCheckRoundedIcon />
                </Avatar>


                <Box>
                  <Typography
                    sx={{
                      fontWeight: 1100,
                      fontSize: 22,
                      color: "#1f1f1a",
                    }}
                  >
                    المتابعة اليومية
                  </Typography>


                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: "#6a6a57",
                    }}
                  >
                    سجلات متابعة اليوم
                  </Typography>
                </Box>
              </Box>


             
            </Box>
          </CardContent>
        </Card>


        <Card sx={cardSx}>
          <CardContent sx={{ p: 2.6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: "rgba(106,106,87,0.12)",
                  color: "#4a4a3d",
                  border: "1px solid rgba(106,106,87,0.18)",
                }}
              >
                <FactCheckRoundedIcon />
              </Avatar>


              <Box>
                <Typography sx={{ fontWeight: 1100, color: "#1f1f1a" }}>
                  متابعة اليوم
                </Typography>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 900, color: "#6a6a57" }}
                >
                  {checkLists.length} سجل
                </Typography>
              </Box>
            </Box>


            <Divider sx={{ my: 2 }} />


            {checkLists.length === 0 ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(106,106,87,0.08)",
                  border: "1px dashed rgba(106,106,87,0.28)",
                }}
              >
                <Typography sx={{ color: "#777", fontWeight: 900 }}>
                  لا يوجد سجلات متابعة لليوم.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.4}>
                {checkLists.map((c, idx) => (
                  <Box
                    key={`${c.nurseName ?? "n"}-${idx}`}
                    sx={{
                      p: 1.6,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f4f5ef 100%)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 1100,
                        color: "#1f1f1a",
                        mb: 1.2,
                      }}
                    >
                      الممرضة: {c.nurseName ?? "-"}
                    </Typography>


                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {renderMetric("حرارة", c.temperature)}
                      {renderMetric("نبض", c.pulse)}
                      {renderMetric("سكر", c.bloodSugar)}
                      {renderMetric("ضغط", c.bloodPressure)}
                      {renderMetric("الإدخال", c.intake)}
                      {renderMetric("الإخراج", c.output)}
                    </Box>


                    {c.notes ? (
                      <Typography
                        sx={{
                          mt: 1.2,
                          fontWeight: 900,
                          color: "#4a4a3d",
                          fontSize: 12,
                          background: "rgba(106,106,87,0.08)",
                          border: "1px dashed rgba(106,106,87,0.25)",
                          p: 1,
                          borderRadius: 2.5,
                        }}
                      >
                        ملاحظات: {c.notes}
                      </Typography>
                    ) : null}
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>


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

