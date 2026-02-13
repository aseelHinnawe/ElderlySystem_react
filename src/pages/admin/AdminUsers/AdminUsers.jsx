import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import { Edit, TrendingUp } from "@mui/icons-material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link } from "react-router";


export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Active");
  const [filterRole, setFilterRole] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterRole) params.role = filterRole;

      const res = await AxiosUserInstance.get("/Admin/User", { params });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "فشل جلب المستخدمين",
        severity: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filterStatus, filterRole]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await AxiosUserInstance.patch(`/Admin/User/change-status/${id}`, null, {
        params: { status: newStatus },
      });
      setSnackbar({
        open: true,
        message: "تم تعديل الحالة بنجاح",
        severity: "success",
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "فشل تعديل الحالة",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* لوحة المستخدمين */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 5,
          background:
            "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
              >
                لوحة المستخدمين
              </Typography>
              <GroupsIcon
                sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }}
              />
            </Box>
            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 12, md: 16 },
              }}
            >
              يمكنك عرض المستخدمين وتعديل حالتهم بسهولة
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: 50, md: 70 },
              height: { xs: 50, md: 70 },
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }} />
          </Box>
        </CardContent>
      </Card>

      {/* الفلاتر */}
      <Grid container spacing={2} sx={{ mb: 4, alignItems: "center" }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#6a6a57", fontWeight: 500 }}>
              الحالة
            </InputLabel>
            <Select
              value={filterStatus}
              label="الحالة"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ borderRadius: 3, backgroundColor: "#fefefe" }}
            >
              <MenuItem value="Active">نشط</MenuItem>
              <MenuItem value="InActive">غير نشط</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#6a6a57", fontWeight: 500 }}>
              الدور
            </InputLabel>
            <Select
              value={filterRole}
              label="الدور"
              onChange={(e) => setFilterRole(e.target.value)}
              sx={{ borderRadius: 3, backgroundColor: "#fefefe" }}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="Nurse">ممرض</MenuItem>
              <MenuItem value="Sponsor">كفيل</MenuItem>
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
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Card
              component={Paper}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 450, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الاسم
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الدور
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
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell align="center">
                              {user.fullName}
                            </TableCell>
                            <TableCell align="center">
                              {user.roleUser}
                            </TableCell>

                            <TableCell align="center">
                              {editingUserId === user.id ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 0.5,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: "none",
                                      boxShadow: "none",                               
                                      fontSize: { xs: 10, md: 13 },                           
                                    }}
                                    onClick={() =>
                                      handleStatusChange(
                                        user.id,
                                        user.statusUser === "نشط"
                                          ? "InActive"
                                          : "Active",
                                      )
                                    }
                                  >
                                    {user.statusUser === "نشط"
                                      ? "تغيير الى غير نشط"
                                      : "تغيير الى نشط"}
                                  </Button>

                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontSize: { xs: 10, md: 13 },
                                    }}
                                    onClick={() => setEditingUserId(null)}
                                  >
                                    إلغاء
                                  </Button>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: 5,
                                      fontSize: 15,
                                      fontWeight: "bold",
                                      backgroundColor:
                                        user.statusUser === "نشط"
                                          ? "#E8F5E9"
                                          : "#FFEBEE",
                                      color:
                                        user.statusUser === "نشط"
                                          ? "#2E7D32"
                                          : "#C62828",
                                    }}
                                  >
                                    {user.statusUser === "نشط"
                                      ? "نشط"
                                      : "غير نشط"}
                                  </Box>

                                  <IconButton
                                    size="small"
                                    onClick={() => setEditingUserId(user.id)}
                                    sx={{
                                      backgroundColor: "#f0f4f0",
                                      "&:hover": { backgroundColor: "#dce3dc" },
                                      borderRadius: 2,
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </TableCell>

                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                component={Link}               
                                to={`/Admin/user/${user.id}`}       
                                sx={{
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontWeight: 800,
                                  fontSize: { xs: 10, md: 13 },
                                  backgroundColor: "#FFF8E1",
                                      color: "#8D6E63",
                                      border: "1px solid rgba(141,110,99,0.35)",
                                }}
                                onClick={() =>
                                  console.log("تفاصيل المستخدم:", user.id)
                                }
                              >
                                تفاصيل المستخدم
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

          {/* ====== Mobile (xs/sm) : Cards ====== */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {users.length > 0 ? (
              users.map((user) => {
                const isActive = user.statusUser === "نشط";

                return (
                  <Card
                    key={user.id}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      {/* Header: Name + Status chip + Edit */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{ fontWeight: 800, fontSize: 14 }}
                            noWrap
                          >
                            الاسم : {user.fullName}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: 15, // أكبر
                              fontWeight: 700, // أوضح
                              color: "#4b4b3f", // أغمق
                            }}
                          >
                            الدور : {user.roleUser}
                          </Typography>
                        </Box>

                        {editingUserId === user.id ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{
                              borderRadius: 2,
                              fontSize: 11,
                              px: 1.5,
                              py: 0.5,
                            }}
                            onClick={() => setEditingUserId(null)}
                          >
                            إلغاء
                          </Button>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                            }}
                          >
                            <Box
                              sx={{
    fontSize: { xs: 14, md: 16 },
    fontWeight: 900,
    color: isActive ? "#2E7D32" : "#C62828",
    whiteSpace: "nowrap",
  }}
>
  {isActive ? "نشط" : "غير نشط"}
                            </Box>

                            <IconButton
                              size="small"
                              onClick={() => setEditingUserId(user.id)}
                              sx={{
                                backgroundColor: "#f0f4f0",
                                "&:hover": { backgroundColor: "#dce3dc" },
                                borderRadius: 2,
                              }}
                            >
                              <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>

                      {/* Actions */}
                      <Box
                        sx={{
                          mt: 1.5,
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {editingUserId === user.id ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 700,
                            }}
                            onClick={() =>
                              handleStatusChange(
                                user.id,
                                isActive ? "InActive" : "Active",
                              )
                            }
                          >
                            {isActive ? "تغيير الى غير نشط" : "تغيير الى نشط"}
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              backgroundColor: "#FFF8E1",
                                      color: "#8D6E63",
                                      border: "1px solid rgba(141,110,99,0.35)",
                              fontWeight: 700,
                            }}
                            onClick={() =>
                              console.log("تفاصيل المستخدم:", user.id)
                            }
                          >
                            تفاصيل المستخدم
                          </Button>
                        )}
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
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}