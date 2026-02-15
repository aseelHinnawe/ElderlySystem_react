import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import BedIcon from "@mui/icons-material/Bed";
import { Link } from "react-router-dom";
import style from "./AdminRooms.module.css";


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const detailsButtonStyles = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 800,
};
const filterInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(106,106,87,0.45)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(106,106,87,0.75)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(106,106,87,0.9)",
  },
  "& .MuiInputLabel-root": {
    color: "#6a6a57",
    fontWeight: 500,
  },


  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px #fff inset",
    WebkitTextFillColor: "inherit",
  },
};


export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);


  const [filterRoomNumber, setFilterRoomNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDegree, setFilterDegree] = useState("");


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get("/Admin/Room");
      setRooms(res.data.rooms || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "فشل جلب الغرف",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRooms();
  }, []);


  const filteredRooms = useMemo(() => {
    let list = [...rooms];


    const rn = (filterRoomNumber || "").trim();
    if (rn) {
      list = list.filter((r) =>
        String(r.roomNumber ?? "").toLowerCase().includes(rn.toLowerCase())
      );
    }


    if (filterStatus) {
      list = list.filter((r) => r.statusName === filterStatus);
    }


    if (filterDegree === "FirstClass") {
      list = list.filter(
        (r) =>
          r.roomTypeName === "درجة أولى" ||
          r.roomTypeName === "FirstClass" ||
          r.roomType === "FirstClass"
      );
    } else if (filterDegree === "SecondClass") {
      list = list.filter(
        (r) =>
          r.roomTypeName === "درجة ثانية" ||
          r.roomTypeName === "SecondClass" ||
          r.roomType === "SecondClass"
      );
    }


    return list;
  }, [rooms, filterRoomNumber, filterStatus, filterDegree]);


  return (
    <Box className={style.pageWrapper}>
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
                إدارة الغرف
              </Typography>
              <BedIcon sx={{ fontSize: { xs: 26, lg: 34 }, color: "#fff" }} />
            </Box>


            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 13, md: 16 },
              }}
            >
              يمكنك عرض جميع الغرف مع النوع والحالة والسعة والسعر
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


      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
          <TextField
            fullWidth
            label="رقم الغرفة"
            value={filterRoomNumber}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, "");
              setFilterRoomNumber(v);
            }}
            inputProps={{ inputMode: "numeric" }}
            sx={filterInputSx}
          />
        </Grid>


        <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
          <FormControl fullWidth sx={filterInputSx}>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={filterStatus}
              label="الحالة"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="متاحة">متاحة</MenuItem>
              <MenuItem value="غير متاحة">غير متاحة</MenuItem>
            </Select>
          </FormControl>
        </Grid>


        <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
          <FormControl fullWidth sx={filterInputSx}>
            <InputLabel>الدرجة</InputLabel>
            <Select
              value={filterDegree}
              label="الدرجة"
              onChange={(e) => setFilterDegree(e.target.value)}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="FirstClass">درجة أولى</MenuItem>
              <MenuItem value="SecondClass">درجة ثانية</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Card component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          رقم الغرفة
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          النوع
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          السعة
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          السعة الحالية
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          السعر
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الحالة
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          التفاصيل
                        </TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {filteredRooms.length > 0 ? (
                        filteredRooms.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell align="center">{r.roomNumber}</TableCell>
                            <TableCell align="center">{r.roomTypeName}</TableCell>
                            <TableCell align="center">{r.capacity}</TableCell>
                            <TableCell align="center">{r.currentCapacity}</TableCell>
                            <TableCell align="center">{r.price}</TableCell>


                            <TableCell align="center">
                              <Box
                                className={style.statusChip}
                                style={{
                                  backgroundColor:
                                    r.statusName === "متاحة" ? "#E8F5E9" : "#FFEBEE",
                                  color:
                                    r.statusName === "متاحة" ? "#2E7D32" : "#C62828",
                                  display: "inline-block",
                                }}
                              >
                                {r.statusName}
                              </Box>
                            </TableCell>


                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                component={Link}
                                to={`/Admin/room/${r.id}`}
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
                                تفاصيل الغرفة
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
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
            {filteredRooms.length > 0 ? (
              filteredRooms.map((r) => {
                const isAvailable = r.statusName === "متاحة";
                return (
                  <Card key={r.id} className={style.roomCard}>
                    <CardContent sx={{ p: 2.2 }}>
                      <Box className={style.flexSpaceBetween}>
                        <Typography className={style.roomTitle} noWrap>
                          رقم الغرفة: {r.roomNumber}
                        </Typography>


                        <Typography
                          className={style.roomStatus}
                          sx={{ color: isAvailable ? "#2E7D32" : "#C62828" }}
                        >
                          {r.statusName}
                        </Typography>
                      </Box>


                      <Grid container spacing={1.2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 6 }}>
                          <Box className={style.infoPill}>
                            <span className={style.infoLabel}>النوع</span>
                            <span className={style.infoValue}>{r.roomTypeName}</span>
                          </Box>
                        </Grid>


                        <Grid size={{ xs: 6 }}>
                          <Box className={style.infoPill}>
                            <span className={style.infoLabel}>السعر</span>
                            <span className={style.infoValue}>{r.price}</span>
                          </Box>
                        </Grid>


                        <Grid size={{ xs: 6 }}>
                          <Box className={style.infoPill}>
                            <span className={style.infoLabel}>السعة</span>
                            <span className={style.infoValue}>{r.capacity}</span>
                          </Box>
                        </Grid>


                        <Grid size={{ xs: 6 }}>
                          <Box className={style.infoPill}>
                            <span className={style.infoLabel}>السعة الحالية</span>
                            <span className={style.infoValue}>{r.currentCapacity}</span>
                          </Box>
                        </Grid>
                      </Grid>


                      <Box sx={{ mt: 1.6 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          component={Link}
                          to={`/Admin/room/${r.id}`}
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
                          تفاصيل الغرفة
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
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



