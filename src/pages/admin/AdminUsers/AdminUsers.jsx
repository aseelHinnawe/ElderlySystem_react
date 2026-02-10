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
import { Edit } from "@mui/icons-material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#6a6a57" }}>
        لوحة المستخدمين
      </Typography>

      {/* فلاتر */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{xs:12 , md:3}}>
          <FormControl fullWidth>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={filterStatus}
              label="الحالة"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="Active">نشط</MenuItem>
              <MenuItem value="InActive">غير نشط</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{xs:12 , md:3}}>
          <FormControl fullWidth>
            <InputLabel>الدور</InputLabel>
            <Select
              value={filterRole}
              label="الدور"
              onChange={(e) => setFilterRole(e.target.value)}
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
            <Table sx={{ direction: "rtl", minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    الاسم
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    الدور
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    الحالة
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      
                    >
                      <TableCell align="right">{user.fullName}</TableCell>
                      <TableCell align="right">{user.roleUser}</TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography component="span" sx={{ fontWeight: 500 }}>
                            {user.statusUser === "نشط" ? "نشط" : "غير نشط"}
                          </Typography>

                          <Box sx={{ minWidth: 130, display: "flex", gap: 0.5 }}>
                            {editingUserId === user.id ? (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() =>
                                    handleStatusChange(
                                      user.id,
                                      user.statusUser === "نشط" ? "InActive" : "Active"
                                    )
                                  }
                                  sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {user.statusUser === "نشط" ? "تغيير إلى غير نشط" : "تغيير إلى نشط"}
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => setEditingUserId(null)}
                                  sx={{ textTransform: "none", fontWeight: "bold" }}
                                >
                                  إلغاء
                                </Button>
                              </>
                            ) : (
                              <IconButton
                                size="small"
                                onClick={() => setEditingUserId(user.id)}
                                sx={{
                                  padding: 0,
                                  margin: 0,
                                  color: "#6a6a57",
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      لا توجد بيانات
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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
