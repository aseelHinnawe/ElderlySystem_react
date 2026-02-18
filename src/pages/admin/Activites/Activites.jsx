import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Button,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { Link } from "react-router-dom";


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const pageWrapperSx = {
  p: "16px",
  minHeight: "100vh",
  background: "#f0f0ea",
};


const activityCardSx = {
  mb: "16px",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(8px)",
};


const flexSpaceBetweenSx = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "10px",
};


const titleSx = {
  fontWeight: 900,
  fontSize: { xs: 16, "@media (max-width:380px)": 17 },
  color: "#2f2f27",
};


const badgeSx = {
  px: { xs: "12px", "@media (max-width:380px)": "12px" },
  py: { xs: "7px", "@media (max-width:380px)": "7px" },
  borderRadius: "999px",
  fontWeight: 900,
  fontSize: { xs: 13, "@media (max-width:380px)": 14 },
  lineHeight: 1,
  whiteSpace: "nowrap",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  backgroundColor: "rgba(106, 106, 87, 0.12)",
  color: "#6a6a57",
};


const infoPillSx = {
  border: "1px solid rgba(106, 106, 87, 0.18)",
  background: "rgba(240, 240, 234, 0.55)",
  borderRadius: "16px",
  px: "10px",
  py: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "6px",
  minHeight: "68px",
};


const infoLabelSx = {
  fontSize: { xs: 13, "@media (max-width:380px)": 13 },
  fontWeight: 900,
  color: "#6a6a57",
};


const infoValueSx = {
  fontSize: { xs: 15, "@media (max-width:380px)": 16 },
  fontWeight: 900,
  color: "#2f2f27",
};


const detailsButtonStyles = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
};


export default function Activites() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get("/Admin/Activity");
      setActivities(res.data?.data || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب الأنشطة",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchActivities();
  }, []);


  return (
    <Box sx={pageWrapperSx}>
      {/* Header */}
      <Card sx={headerCardStyles}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 20, lg: 28 } }}
              >
                إدارة الأنشطة
              </Typography>
              <EventNoteIcon
                sx={{ fontSize: { xs: 26, lg: 34 }, color: "#fff" }}
              />
            </Box>


            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 13, md: 16 },
              }}
            >
              يمكنك عرض جميع الأنشطة مع الاسم والموقع والتاريخ ووقت البداية
            </Typography>
          </Box>


          <Box
            sx={{
              width: { xs: 52, lg: 70 },
              height: { xs: 52, lg: 70 },
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: { xs: 28, lg: 40 }, color: "#fff" }} />
          </Box>
        </CardContent>
      </Card>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* ===== Desktop Table ===== */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Card
              component={Paper}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 750, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          اسم النشاط
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الموقع
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          التاريخ
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          وقت البداية
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          التفاصيل
                        </TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {activities.length > 0 ? (
                        activities.map((a, idx) => (
                          <TableRow key={a.id ?? idx}>
                            <TableCell align="center">
                              {a.activityName}
                            </TableCell>
                            <TableCell align="center">{a.location}</TableCell>
                            <TableCell align="center">{a.date}</TableCell>
                            <TableCell align="center">{a.startTime}</TableCell>


                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                component={Link}
                                to={a?.id ? `/Admin/activity/${a.id}` : "#"}
                                disabled={!a?.id}
                                sx={{
                                  ...detailsButtonStyles,
                                  fontSize: 13,
                                  backgroundColor: "#FFF8E1",
                                  color: "#8D6E63",
                                  border: "1px solid rgba(141,110,99,0.35)",
                                  boxShadow: "none",
                                  "&:hover": {
                                    backgroundColor: "#FFECB3",
                                    boxShadow: "none",
                                  },
                                }}
                              >
                                تفاصيل النشاط
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            لا توجد بيانات
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>


          {/* ===== Mobile Cards ===== */}
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            {activities.length > 0 ? (
              activities.map((a, idx) => (
                <Card key={a.id ?? idx} sx={activityCardSx}>
                  <CardContent sx={{ p: 2.2 }}>
                    <Box sx={flexSpaceBetweenSx}>
                      <Typography sx={titleSx} noWrap>
                        {a.activityName}
                      </Typography>


                      <Box sx={badgeSx}>{a.startTime}</Box>
                    </Box>


                    <Box sx={{ mt: 1.2 }}>
                      <Typography
                        sx={{ fontWeight: 800, color: "#6a6a57", mb: 1 }}
                      >
                        التفاصيل
                      </Typography>


                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 1.2,
                        }}
                      >
                        <Box sx={infoPillSx}>
                          <Box component="span" sx={infoLabelSx}>
                            الموقع
                          </Box>
                          <Box component="span" sx={infoValueSx}>
                            {a.location}
                          </Box>
                        </Box>


                        <Box sx={infoPillSx}>
                          <Box component="span" sx={infoLabelSx}>
                            التاريخ
                          </Box>
                          <Box component="span" sx={infoValueSx}>
                            {a.date}
                          </Box>
                        </Box>
                      </Box>


                      <Box sx={{ mt: 1.6 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          component={Link}
                          to={a?.id ? `/Admin/activity/${a.id}` : "#"}
                          disabled={!a?.id}
                          sx={{
                            ...detailsButtonStyles,
                            backgroundColor: "#FFF8E1",
                            color: "#8D6E63",
                            border: "1px solid rgba(141,110,99,0.35)",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#FFECB3",
                              boxShadow: "none",
                            },
                          }}
                        >
                          تفاصيل النشاط
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography align="center">لا توجد بيانات</Typography>
            )}
          </Box>
        </>
      )}


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}



