import { useEffect, useState, useMemo } from "react";
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
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";


import { TrendingUp } from "@mui/icons-material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
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


const donationCardSx = {
  mb: "16px",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(8px)",
};

const titleSx = {
  fontWeight: 900,
  fontSize: {
    xs: 15,
    sm: 17,
    md: 18,
  },
  color: "#2f2f27",
};

const detailsButtonStyles = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
};



export default function Elderlies() {
      const [elderlies, setElderlies] = useState([]);
      const [loading, setLoading] = useState(true);
      const [searchName, setSearchName] = useState("");
    
    
      const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
      });
    
    
      const fetchElderlies = async () => {
        setLoading(true);
        try {
          const res = await AxiosUserInstance.get("/Nurse/Elderly");
          console.log(res)
          setElderlies(res.data?.elderlies || []);
        } catch (err) {
          setSnackbar({
            open: true,
            message: "فشل جلب المسنين",
            severity: "error",
          });
        } finally {
          setLoading(false);
        }
      };
      const filteredElderlies = useMemo(() => {
        const q = searchName.trim().toLowerCase();
        if (!q) return elderlies;
    
    
        return elderlies.filter((d) =>
          (d?.name || "").toLowerCase().includes(q),
        );
      }, [elderlies, searchName]);
    
    
      useEffect(() => {
        fetchElderlies();
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
                    إدارة المسنين
                  </Typography>
    
    
                  <ElderlyWomanIcon
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
متابعة دقيقة للحالة الصحية للمسنين لضمان راحتهم وسلامتهم وجودة الرعاية المقدمة لهم.                </Typography>
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
         <Box sx={{ mb: 3, width: { xs: "100%", md: "25%" } }}>
      <TextField
        fullWidth
        label="اسم المسنة"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="ابحث عن اسم المسنة..."
        sx={{ backgroundColor: "#fefefe", borderRadius: 3 }}
        InputProps={{
          sx: { borderRadius: 3 },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#6a6a57" }} />
            </InputAdornment>
          ),
          endAdornment: searchName ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchName("")}
                sx={{
                  color: "#6a6a57",
                  "&:hover": { backgroundColor: "rgba(106,106,87,0.08)" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
    
    
    
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
                              اسم المسنة
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                              رقم الغرفة
                            </TableCell>
                           
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                              التفاصيل
                            </TableCell>
                          </TableRow>
                        </TableHead>
    
    
                        <TableBody>
                          {filteredElderlies.length > 0 ? (
                            filteredElderlies.map((d, idx) => (
                              <TableRow key={d.id ?? idx}>
                                <TableCell align="center">{d.name}</TableCell>
                                <TableCell align="center">
                                  {d.roomNumber}
                                </TableCell>
                               
    
    
                                <TableCell align="center">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    component={Link}
                                    to={d?.id ? `/Nurse/elderly/${d.elderlyId}` : "#"}
                                    sx={{
                                      ...detailsButtonStyles,
                                      fontSize: 13,
                                      backgroundColor: "#FFF8E1",
                                      color: "#8D6E63",
                                      border: "1px solid rgba(141,110,99,0.35)",
                                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",                                   
                                    }}
                                  >
                                    تفاصيل المسنة
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
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
              {/* ===== Mobile Cards ===== */}
<Box sx={{ display: { xs: "block", lg: "none" } }}>
  {filteredElderlies.length > 0 ? (
    filteredElderlies.map((d, idx) => (
      <Card key={d.elderlyId ?? idx} sx={donationCardSx}>
        <CardContent sx={{ p: 2.2 }}>
          
          {/* Top Row: Name + Room */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography sx={{
    ...titleSx,
    flex: 1,
    minWidth: 0,
    whiteSpace: "normal",        // يسمح بالنزول
    wordBreak: "break-word",     // يكسر الكلمات الطويلة
    overflowWrap: "anywhere",    // أقوى حل للكلمات الطويلة جداً
    lineHeight: 1.4
  }}
         >
              {d.name}
            </Typography>

            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 3,
                backgroundColor: "#F0F0EA",
                border: "1px solid rgba(106,106,87,0.25)",
                fontSize: 13,
                fontWeight: 700,
                color: "#6a6a57",
                minWidth: 70,
                textAlign: "center",
              }}
            >
              غرفة {d.roomNumber ?? "-"}
            </Box>
          </Box>

          {/* Button */}
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to={d?.elderlyId ? `/Nurse/elderly/${d.elderlyId}` : "#"}
            sx={{
              ...detailsButtonStyles,
              backgroundColor: "#FFF8E1",
              color: "#8D6E63",
              border: "1px solid rgba(141,110,99,0.35)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",           
            }}
          >
            تفاصيل المسنة
          </Button>
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
  )
}
