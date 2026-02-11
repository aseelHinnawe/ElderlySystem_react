import React, { useEffect, useState } from "react";
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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Active");
  const [filterRole, setFilterRole] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
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
      setSnackbar({ open: true, message: "فشل جلب المستخدمين", severity: "error" });
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
      setSnackbar({ open: true, message: "تم تعديل الحالة بنجاح", severity: "success" });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "فشل تعديل الحالة", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
  {/* لوحة المستخدمين */}
  <Card
    sx={{
      mb: 4,
      borderRadius: 5,
      background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
          >
            لوحة المستخدمين
          </Typography>
          <GroupsIcon sx={{ fontSize: { xs: 24, md: 32 }, color: "#fff" }} />
        </Box>
        <Typography
          sx={{ opacity: 0.9, mt: { xs: 1, md: 2 }, fontSize: { xs: 12, md: 16 } }}
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
    <Grid size={{xs:12 , md:3}}>
      <FormControl fullWidth>
        <InputLabel sx={{ color: "#6a6a57", fontWeight: 500 }}>الحالة</InputLabel>
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

    <Grid size={{xs:12 , md:3}}>
      <FormControl fullWidth>
        <InputLabel sx={{ color: "#6a6a57", fontWeight: 500 }}>الدور</InputLabel>
        <Select
          value={filterRole}
          label="الدور"
          onChange={(e) => setFilterRole(e.target.value)}
          sx={{ borderRadius: 3, backgroundColor: "#fefefe" }}
        >
          <MenuItem value="">الكل</MenuItem>
          <MenuItem value="Nurse">ممرض</MenuItem>
          <MenuItem value="Sponsor">كفيل</MenuItem>
          <MenuItem value="Employee">موظف</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  </Grid>

  {/* جدول المستخدمين */}
  {loading ? (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <CircularProgress color="primary" />
    </Box>
  ) : (
    <Card component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 450, direction: "rtl" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>الاسم</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>الدور</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>الحالة</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>التفاصيل</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align="right">{user.fullName}</TableCell>
                    <TableCell align="right">{user.roleUser}</TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: 5,
                            fontSize: 12,
                            fontWeight: "bold",
                            backgroundColor:
                              user.statusUser === "نشط" ? "#E8F5E9" : "#FFEBEE",
                            color:
                              user.statusUser === "نشط" ? "#2E7D32" : "#C62828",
                          }}
                        >
                          {user.statusUser === "نشط" ? "نشط" : "غير نشط"}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            justifyContent: "flex-end",
                          }}
                        >
                          {editingUserId === user.id ? (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  textTransform: "none",
                                  boxShadow: "none",
                                  border: "1px solid #7c7c63",
                                  color: "#7c7c63",
                                  fontSize: { xs: 10, md: 13 },
                                  "&:hover": {
                                    backgroundColor: "rgba(124,124,99,0.08)",
                                    border: "2px solid #6e6e58",
                                    color: "#6e6e58",
                                  },
                                }}
                                onClick={() =>
                                  handleStatusChange(
                                    user.id,
                                    user.statusUser === "نشط" ? "InActive" : "Active"
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
                            </>
                          ) : (
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
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: { xs: 10, md: 13 },
                          backgroundColor: "#9d9d7a",
                          boxShadow: "none",
                          "&:hover": { backgroundColor: "#9d9d7a" },
                        }}
                        onClick={() => console.log("تفاصيل المستخدم:", user.id)}
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
